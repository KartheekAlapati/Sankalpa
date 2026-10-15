import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDownLeft, ArrowRight, BookOpen, CalendarDays, Check, ChevronRight, Circle, Compass, Feather, Focus, Inbox, Layers3, Leaf, Moon, Plus, Search, Settings, Sun, TrendingUp } from 'lucide-react'
import type { CaptureKind, Entity } from './domain/models'
import { repository, today } from './lib/repository'
import { Button, Card, Dialog, EmptyState, ErrorState, LoadingState } from './components/ui'

const spaces = [
  { to: '/today', label: 'Today', icon: Sun, caption: 'Make room for what matters' },
  { to: '/life', label: 'My Life', icon: Compass, caption: 'Your commitments, connected' },
  { to: '/knowledge', label: 'My Knowledge', icon: BookOpen, caption: 'A place for your thinking' },
  { to: '/growth', label: 'My Growth', icon: TrendingUp, caption: 'Notice how far you have come' },
]
const queryKey = ['entities']

export function App() {
  const client = useQueryClient()
  const data = useQuery({ queryKey, queryFn: repository.list })
  const [capture, setCapture] = useState<'inbox' | 'priority' | null>(null)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('sankalpa-theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') } catch { return 'light' }
  })
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('sankalpa-theme', theme) } catch { /* Theme preference is optional. */ } }, [theme])
  useEffect(() => { mainRef.current?.focus(); window.scrollTo(0, 0) }, [location.pathname])
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(''), 6000); return () => clearTimeout(id) }, [toast])
  const save = useMutation({
    mutationFn: ({ title, kind }: { title: string; kind: CaptureKind }) => repository.capture(title, kind, capture === 'priority' ? today() : undefined),
    onSuccess: () => { void client.invalidateQueries({ queryKey }); setCapture(null); setToast('Saved for this session.') },
  })
  const update = useMutation({ mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof repository.update>[1] }) => repository.update(id, patch), onSuccess: () => { void client.invalidateQueries({ queryKey }) }, onError: e => setToast(e.message) })
  const entries = data.data ?? []
  const count = entries.filter(e => e.kind === 'inbox').length
  const props = { entries, openCapture: () => { save.reset(); setCapture('priority') }, update: (id: string, patch: Parameters<typeof repository.update>[1]) => update.mutate({ id, patch }) }
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <aside className="sidebar">
      <Link to="/today" className="brand"><span className="brand-mark" aria-hidden="true"><Leaf size={22} /></span><span>SANKALPA<small>A life with intention</small></span></Link>
      <span className="nav-label">YOUR SPACES</span>
      <nav aria-label="Main navigation">{spaces.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={19} /><span>{label}</span><ChevronRight size={14} className="nav-chevron" /></NavLink>)}</nav>
      <div className="sidebar-line" />
      <nav aria-label="Tools"><NavLink to="/inbox"><Inbox size={18} />Inbox<span className="count">{count}</span></NavLink><NavLink to="/calendar"><CalendarDays size={18} />Calendar</NavLink><NavLink to="/focus"><Focus size={18} />Focus</NavLink></nav>
      <div className="sidebar-bottom"><div className="quiet-note"><span className="nav-label">A LITTLE REMINDER</span><p>Build a life you can return to.<br />One considered day at a time.</p></div><NavLink className="settings-link" to="/settings"><span className="avatar">K</span><span>Your personal space<small>Session preview</small></span><Settings size={17} /></NavLink></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><div className="breadcrumb">Your space <ChevronRight size={13} /><span>{spaces.find(s => location.pathname.startsWith(s.to))?.label ?? location.pathname.slice(1)}</span></div><div className="top-actions"><Link className="icon-link" to="/search" aria-label="Search"><Search size={19} /></Link><button className="icon-link" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</button><Button aria-label="Quick capture" onClick={() => { save.reset(); setCapture('inbox') }}><Plus size={17} /><span>Quick capture</span></Button></div></header>
      <main id="main-content" tabIndex={-1} ref={mainRef}>
        <div className="preview-notice"><span className="status-dot" />Private session preview · New entries clear on reload. Cloud sync is not connected.</div>
        <nav className="mobile-tools" aria-label="Mobile tools"><NavLink to="/inbox"><Inbox size={14} />Inbox</NavLink><NavLink to="/calendar"><CalendarDays size={14} />Calendar</NavLink><NavLink to="/focus"><Focus size={14} />Focus</NavLink><NavLink to="/settings"><Settings size={14} />Settings</NavLink></nav>
        {data.isPending ? <LoadingState /> : data.isError ? <ErrorState message="Your space could not be loaded." retry={() => { void data.refetch() }} /> : <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/Dashboard" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<Today {...props} />} />
          <Route path="/life" element={<Life entries={entries} />} />
          <Route path="/knowledge" element={<Knowledge entries={entries} />} />
          <Route path="/growth" element={<Growth entries={entries} />} />
          <Route path="/inbox" element={<InboxPage {...props} />} />
          <Route path="/calendar" element={<Calendar entries={entries} />} />
          <Route path="/focus" element={<FocusPage entries={entries} notify={setToast} />} />
          <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
          <Route path="/search" element={<SearchPage entries={entries} />} />
          <Route path="*" element={<><PageHeading title="This page is not here." subtitle="Your space is still here. Return to today to find your way." /><Link className="button primary" to="/today">Back to Today</Link></>} />
        </Routes>}
        <footer className="page-footer"><span>SANKALPA</span><span>Less noise. More intention.</span></footer>
      </main>
    </div>
    <nav className="mobile-nav" aria-label="Mobile navigation">{spaces.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={20} /><span>{label.replace('My ', '')}</span></NavLink>)}</nav>
    {capture && <Dialog title={capture === 'priority' ? 'Make space for one priority' : 'Get it out of your head'} onClose={() => setCapture(null)}><CaptureForm key={capture} priority={capture === 'priority'} pending={save.isPending} error={save.error?.message} onSave={(title, kind) => save.mutate({ title, kind })} /></Dialog>}
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast}</div>
  </>
}

function CaptureForm({ priority, pending, error, onSave }: { priority: boolean; pending: boolean; error?: string; onSave: (title: string, kind: CaptureKind) => void }) {
  const [kind, setKind] = useState<CaptureKind>(priority ? 'task' : 'inbox')
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = new FormData(e.currentTarget); onSave(String(form.get('title')), kind) }
  return <form onSubmit={submit}><p className="muted">{priority ? 'Choose something realistic for today. You can move it when life changes.' : 'A thought, task, link or idea. Capture now; organize when you are ready.'}</p><label htmlFor="capture-title">{priority ? 'Priority' : 'What is on your mind?'}</label><textarea id="capture-title" name="title" required maxLength={500} rows={4} autoFocus placeholder="Write it here…" /><label htmlFor="capture-kind">Save as</label><select id="capture-kind" value={kind} disabled={priority} onChange={e => setKind(e.target.value as CaptureKind)}>{['inbox', 'task', 'note', 'idea', 'link', 'reminder'].map(k => <option key={k} value={k}>{k === 'inbox' ? 'Inbox · decide later' : k}</option>)}</select>{error && <p role="alert" className="form-error">{error}</p>}<div className="form-footer"><span className="muted">Session only · no cloud sync</span><Button disabled={pending}>{pending ? 'Saving…' : 'Save capture'}<ArrowDownLeft size={16} /></Button></div></form>
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle: string; action?: React.ReactNode }) { return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="subtitle">{subtitle}</p></div>{action}</div> }
type TaskProps = { entries: Entity[]; openCapture: () => void; update: (id: string, patch: Parameters<typeof repository.update>[1]) => void }

function Today({ entries, openCapture, update }: TaskProps) {
  const date = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  const priorities = entries.filter(e => e.scheduledDate === today() && !e.completedAt)
  return <>
    <PageHeading eyebrow={date} title="A little clarity for today." subtitle="Choose what matters. Leave room for life." action={<Link className="text-link" to="/calendar"><CalendarDays size={16} /> View calendar <ArrowRight size={16} /></Link>} />
    <div className="intention-banner"><div><span className="eyebrow">YOUR DAILY SANKALP</span><h2>Begin with intention.</h2><p>One sentence to guide your day. It can be as simple as showing up.</p><Link to="/knowledge" className="text-link">Make room for reflection <ArrowRight size={15} /></Link></div><div className="intention-art" aria-hidden="true"><div className="sun-circle" /><div className="arc arc-one" /><div className="arc arc-two" /><div className="art-ground" /><Leaf size={35} /></div></div>
    <div className="dashboard-grid">
      <Card className="priorities-card"><div className="card-head"><div><p className="eyebrow">A REALISTIC DAY</p><h2>Your three priorities</h2></div><span className="pill">{priorities.length} / 3 planned</span></div><p className="muted card-description">A short list. Enough space to do it well.</p>
        {priorities.length ? <ul className="item-list">{priorities.map(e => <li key={e.id}><Button variant="ghost" aria-label={`Complete ${e.title}`} onClick={() => update(e.id, { completedAt: new Date().toISOString() })}><Circle size={19} /></Button><span>{e.title}</span><Button variant="ghost" onClick={() => update(e.id, { scheduledDate: undefined })}>Later</Button></li>)}</ul> : <EmptyState title="Start with one meaningful thing.">Your day does not need to be full to be worthwhile.</EmptyState>}
        <Button variant="secondary" className="full-width" onClick={openCapture} disabled={priorities.length >= 3}><Plus size={17} />Add a priority</Button><div className="card-foot"><Leaf size={14} /><span>Plans can change. Your progress still counts.</span></div>
      </Card>
      <Card className="focus-card"><div className="card-head"><h2>A little room to focus</h2><Focus size={20} /></div><p className="muted">One task. One quiet session.</p><div className="timer-preview">25<span>:</span>00</div><p className="timer-caption">A starting duration, not time worked</p><Link className="button primary full-width" to="/focus">Choose a task & focus <ArrowRight size={16} /></Link></Card>
      <Card><div className="card-head"><h2>A place for everything</h2><Inbox size={19} /></div><p className="muted card-description">Free up your mind. Let your inbox hold the rest.</p><div className="inbox-summary"><span className="inbox-number">{entries.filter(e => e.kind === 'inbox').length.toString().padStart(2, '0')}</span><span>unprocessed captures<small>Ready whenever you are.</small></span></div><Link className="text-link" to="/inbox">Open your inbox <ArrowRight size={16} /></Link></Card>
      <Card><div className="card-head"><h2>Life, beyond the list</h2><Compass size={19} /></div><div className="life-shortcuts">{['Learning', 'Health', 'Spirituality'].map((name, i) => <Link to="/life" key={name}><span className={`shortcut-icon shade-${i}`}><Leaf size={16} /></span><span>{name}</span><ChevronRight size={15} /></Link>)}</div></Card>
    </div>
    <div className="closing-note"><span aria-hidden="true">—</span><p>“You have the right to work, but never to the fruit of work.”<small>Bhagavad Gita 2.47 · a reflection, not a measure of productivity</small></p></div>
  </>
}

function Life({ entries }: { entries: Entity[] }) {
  return <><PageHeading eyebrow="MY LIFE" title="A life is more than a list." subtitle="Keep commitments close to the things you care about." /><div className="area-grid">{['Learning', 'Career', 'Fitness', 'Health', 'Finances', 'Spirituality'].map(area => <Card key={area}><Compass size={22} className="accent-icon" /><h2>{area}</h2><p className="muted">No projects linked yet.</p><span className="pill">Project workspace · Phase 2</span></Card>)}</div><Card><h2>Tasks & reminders</h2><EntryList entries={entries.filter(e => e.kind === 'task' || e.kind === 'reminder')} empty="No commitments captured yet." /><p className="muted">Quests, missions and the Eisenhower view are scheduled for Phase 2.</p></Card></>
}
function Knowledge({ entries }: { entries: Entity[] }) { return <><PageHeading eyebrow="MY KNOWLEDGE" title="Give your thinking a home." subtitle="Notes, ideas and references, ready to connect." /><Card><div className="card-head"><h2>Your library</h2><Feather size={21} /></div><EntryList entries={entries.filter(e => ['note', 'idea', 'link'].includes(e.kind))} empty="Your library begins with a single thought." /><p className="muted">Use Quick capture to add a note, idea or link. Documents, journal editing and relationships arrive in Phase 2.</p></Card></> }
function Growth({ entries }: { entries: Entity[] }) {
  const sessions = useQuery({ queryKey: ['focus-sessions'], queryFn: repository.focusSessions })
  const completed = entries.filter(e => e.completedAt).length
  const seconds = (sessions.data ?? []).reduce((sum, s) => sum + s.elapsedSeconds, 0)
  return <><PageHeading eyebrow="MY GROWTH" title="Progress, without the pressure." subtitle="Look for patterns. Make adjustments. Begin again." /><div className="area-grid stats"><Card><span className="eyebrow">COMPLETED IN THIS SESSION</span><strong>{completed}</strong><p className="muted">From tasks you actually completed</p></Card><Card><span className="eyebrow">RECORDED FOCUS</span><strong>{Math.floor(seconds / 60)} <small>min</small></strong><p className="muted">From sessions you explicitly saved</p></Card><Card><span className="eyebrow">CONSISTENCY</span><strong className="no-data">Not enough data</strong><p className="muted">No invented streaks, levels or XP</p></Card></div><Card><EmptyState title="Make space to look back.">Reviews, habits, milestones and reflections will live here. Their workflows are planned for Phase 2.</EmptyState></Card></>
}
function InboxPage({ entries, update }: TaskProps) { return <><PageHeading eyebrow="TODAY / INBOX" title="A lighter mind starts here." subtitle="Capture first. Give it a place when you are ready." /><Card>{!entries.filter(e => e.kind === 'inbox').length ? <EmptyState title="Nothing waiting to be sorted.">Use Quick capture whenever something needs a place.</EmptyState> : <ul className="item-list inbox-items">{entries.filter(e => e.kind === 'inbox').map(e => <li key={e.id}><Inbox size={17} /><span>{e.title}</span><label className="sr-only" htmlFor={`kind-${e.id}`}>Categorize {e.title}</label><select id={`kind-${e.id}`} value="inbox" onChange={event => update(e.id, { kind: event.target.value as CaptureKind })}><option value="inbox">Move to…</option>{['task', 'note', 'idea', 'link', 'reminder'].map(k => <option key={k}>{k}</option>)}</select></li>)}</ul>}<p className="muted">Categorizing keeps the same record. Project and subject linking is planned.</p></Card></> }
function Calendar({ entries }: { entries: Entity[] }) { return <><PageHeading eyebrow="TODAY / CALENDAR" title="See the shape of your day." subtitle="A simple agenda for your current priorities." /><Card><h2>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(new Date())}</h2><EntryList entries={entries.filter(e => e.scheduledDate === today())} empty="Your day has room. No priorities scheduled." /><p className="muted">This is a local daily agenda. Google Calendar is not connected. Date editing and a full calendar are planned.</p></Card></> }
function SearchPage({ entries }: { entries: Entity[] }) { const [term, setTerm] = useState(''); return <><PageHeading eyebrow="SEARCH" title="Find your thread." subtitle="Search captures from this preview session." /><Card><label htmlFor="search">Search your space</label><input id="search" type="search" value={term} onChange={e => setTerm(e.target.value)} placeholder="A task, idea or phrase…" /><EntryList entries={term.trim() ? entries.filter(e => e.title.toLowerCase().includes(term.trim().toLowerCase())) : []} empty={term ? 'No matching captures.' : 'Enter a phrase to begin.'} /></Card></> }
function SettingsPage({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) { return <><PageHeading eyebrow="SETTINGS" title="A space that feels like yours." subtitle="Your preferences. Your information. Your control." /><Card><h2>Appearance</h2><label htmlFor="theme">Theme</label><select id="theme" value={theme} onChange={e => setTheme(e.target.value)}><option value="light">Light · Warm Ivory</option><option value="dark">Dark · Deep Teal</option></select><h2 className="section-gap">Privacy & connections</h2><p>Personal entries exist only in memory and disappear when this page reloads. Only your theme preference is stored on this device.</p><p className="muted">Supabase authentication, storage, account management, Google Calendar and IRA are not connected. Do not use this preview as your permanent record.</p></Card></> }
function EntryList({ entries, empty }: { entries: Entity[]; empty: string }) { return entries.length ? <ul className="item-list">{entries.map(e => <li key={e.id}>{e.completedAt ? <Check size={17} /> : <Layers3 size={17} />}<span>{e.title}</span><span className="pill">{e.kind}</span></li>)}</ul> : <EmptyState title={empty}>New captures will appear here.</EmptyState> }

function FocusPage({ entries, notify }: { entries: Entity[]; notify: (message: string) => void }) {
  const client = useQueryClient()
  const [selected, setSelected] = useState('')
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [started, setStarted] = useState('')
  const [saved, setSaved] = useState(false)
  const base = useRef(0)
  const start = useRef(0)
  const timerLimit = 25 * 60
  const save = useMutation({ mutationFn: () => repository.saveFocus(selected, started, elapsed, elapsed >= timerLimit ? 'complete' : 'stopped'), onSuccess: () => { setSaved(true); void client.invalidateQueries({ queryKey: ['focus-sessions'] }); notify('Focus session recorded for this preview.') } })
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => { const next = Math.min(timerLimit, base.current + Math.floor((Date.now() - start.current) / 1000)); setElapsed(next); if (next >= timerLimit) setRunning(false) }, 250)
    return () => clearInterval(id)
  }, [running, timerLimit])
  const remaining = Math.max(0, timerLimit - elapsed)
  const options = entries.filter(e => ['task', 'note', 'reminder'].includes(e.kind) && !e.completedAt)
  function toggle() {
    if (running) { base.current += Math.floor((Date.now() - start.current) / 1000); setElapsed(Math.min(timerLimit, base.current)); setRunning(false) }
    else { if (!started) setStarted(new Date().toISOString()); start.current = Date.now(); setRunning(true) }
  }
  return <><PageHeading eyebrow="TODAY / FOCUS" title="One thing at a time." subtitle="Choose an actual task or topic. Let everything else wait." /><Card className="focus-workspace"><label htmlFor="focus-task">Task or study topic</label><select id="focus-task" value={selected} disabled={running || elapsed > 0} onChange={e => setSelected(e.target.value)}><option value="">Choose a captured task or note</option>{options.map(e => <option value={e.id} key={e.id}>{e.title}</option>)}</select>{!options.length && <p className="muted">Capture a task or note first using Quick capture.</p>}<div className="timer-display" role="timer" aria-label="Time remaining">{Math.floor(remaining / 60).toString().padStart(2, '0')}:{(remaining % 60).toString().padStart(2, '0')}</div><p className="muted">{saved ? 'Session recorded. Take a moment before beginning again.' : running ? 'You can pause whenever you need.' : '25 minutes, with room to pause.'}</p><div className="focus-controls"><Button disabled={!selected || saved || elapsed >= timerLimit} onClick={toggle}>{running ? 'Pause' : elapsed ? 'Resume' : 'Start focus'}</Button><Button variant="secondary" disabled={running || elapsed < 1 || saved || save.isPending} onClick={() => save.mutate()}>Save session</Button><Button variant="ghost" disabled={running} onClick={() => { setElapsed(0); base.current = 0; setStarted(''); setSaved(false); save.reset() }}>Reset</Button></div>{save.error && <p role="alert">{save.error.message}</p>}<p className="timer-caption">Unsaved timer progress ends when you leave this page. Paused time is excluded.</p></Card></>
}
