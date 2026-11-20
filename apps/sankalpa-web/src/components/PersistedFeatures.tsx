import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '../lib/supabase'
import { repository, today } from '../lib/repository'
import type { LifeTable } from '../lib/permanent-repository'
import type { LifeRow } from '../lib/database.types'
import type { Entity, CaptureKind } from '../domain/models'
import { Button, Card, Dialog, ErrorState, LoadingState } from './ui'

export function ConnectionStatus({ loaded }: { loaded: boolean }) {
  const pending = useIsMutating()
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => { const change = () => setOnline(navigator.onLine); window.addEventListener('online', change); window.addEventListener('offline', change); return () => { window.removeEventListener('online', change); window.removeEventListener('offline', change) } }, [])
  return <div className="preview-notice" role="status"><span className="status-dot" />{!online ? 'Offline. Changes cannot be saved until you reconnect.' : pending ? 'Saving to your account…' : loaded ? 'Authenticated · Account records loaded' : 'Loading account records…'}</div>
}
export function DailyIntention() {
  const cache = useQueryClient()
  const query = useQuery({ queryKey: ['intention', today()], queryFn: repository.intention })
  const save = useMutation({ mutationFn: repository.saveIntention, onSuccess: () => { void cache.invalidateQueries({ queryKey: ['intention'] }) } })
  if (query.isPending) return <LoadingState />
  if (query.error) return <ErrorState message={query.error.message} retry={() => { void query.refetch() }} />
  return <Card><h2>Your daily Sankalp</h2><form onSubmit={e => { e.preventDefault(); save.mutate(String(new FormData(e.currentTarget).get('sankalp'))) }}><label htmlFor="sankalp">One intention for {today()}</label><textarea id="sankalp" name="sankalp" defaultValue={query.data} maxLength={2000} rows={2} /><div className="editor-toolbar"><Button disabled={save.isPending}>Save intention</Button><span role="status">{save.isSuccess ? 'Saved to your account.' : ''}</span></div>{save.error && <p role="alert">{save.error.message}</p>}</form></Card>
}
export function EntityManager({ entries }: { entries: Entity[] }) {
  const [editing, setEditing] = useState<Entity | null>(null)
  const [deleting, setDeleting] = useState<Entity | null>(null)
  const cache = useQueryClient()
  const projects = useQuery({ queryKey: ['life', 'projects'], queryFn: () => repository.life('projects') })
  const save = useMutation({ mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof repository.update>[1] }) => repository.update(id, patch), onSuccess: () => { setEditing(null); void cache.invalidateQueries({ queryKey: ['entities'] }) } })
  const remove = useMutation({ mutationFn: repository.remove, onSuccess: () => { setDeleting(null); void cache.invalidateQueries({ queryKey: ['entities'] }) } })
  return <Card className="section-gap"><h2>Edit your records</h2><p className="muted">Editing and categorizing retain the same record ID.</p><ul className="item-list">{entries.map(e => <li key={e.id}><span>{e.title}</span><Button variant="secondary" onClick={() => { save.reset(); setEditing(e) }}>Edit</Button><Button variant="ghost" onClick={() => { remove.reset(); setDeleting(e) }}>Delete</Button>{!e.completedAt && <Button variant="ghost" onClick={() => save.mutate({ id: e.id, patch: { scheduling: { action: 'add', date: today() } } })}>Plan today</Button>}</li>)}</ul>{!entries.length && <p className="muted">Capture a task or note to begin.</p>}{save.error && !editing && <p role="alert">{save.error.message}</p>}
    {editing && <Dialog title="Edit record" onClose={() => setEditing(null)}><form onSubmit={event => { event.preventDefault(); const f = new FormData(event.currentTarget); save.mutate({ id: editing.id, patch: { fields: { title: String(f.get('title')), body: String(f.get('body')), kind: String(f.get('kind')) as CaptureKind, projectId: String(f.get('project')) || undefined } } }) }}><label htmlFor="entity-title">Title</label><input id="entity-title" name="title" defaultValue={editing.title} required maxLength={500} /><label htmlFor="entity-body">Content</label><textarea id="entity-body" name="body" rows={6} defaultValue={editing.body} /><label htmlFor="entity-kind">Category</label><select id="entity-kind" name="kind" defaultValue={editing.kind}>{['inbox', 'task', 'note', 'idea', 'link', 'reminder'].map(k => <option key={k}>{k}</option>)}</select><label htmlFor="entity-project">Project</label><select id="entity-project" name="project" defaultValue={editing.projectId ?? ''}><option value="">No project</option>{projects.data?.map(p => <option value={p.id} key={p.id}>{p.title}</option>)}</select>{projects.error && <p role="alert">{projects.error.message}</p>}{save.error && <p role="alert">{save.error.message}</p>}<Button className="section-gap" disabled={save.isPending || projects.isPending || !!projects.error}>Save record</Button></form></Dialog>}
    {deleting && <Dialog title="Delete this record?" onClose={() => setDeleting(null)}><p>{deleting.title}</p><p>Linked focus history and relationships will also be removed. Export first if you need a copy.</p>{remove.error && <p role="alert">{remove.error.message}</p>}<Button disabled={remove.isPending} onClick={() => remove.mutate(deleting.id)}>Confirm deletion</Button></Dialog>}
  </Card>
}
export function LifeManager() {
  const [table, setTable] = useState<LifeTable>('projects')
  const [editing, setEditing] = useState<Partial<LifeRow> | null>(null)
  const [deleting, setDeleting] = useState<LifeRow | null>(null)
  const cache = useQueryClient()
  const records = useQuery({ queryKey: ['life', table], queryFn: () => repository.life(table) })
  const projects = useQuery({ queryKey: ['life', 'projects'], queryFn: () => repository.life('projects') })
  const goals = useQuery({ queryKey: ['life', 'goals'], queryFn: () => repository.life('goals') })
  const refresh = () => { void cache.invalidateQueries({ queryKey: ['life'] }) }
  const save = useMutation({ mutationFn: (value: Partial<LifeRow>) => repository.saveLife(table, value), onSuccess: () => { setEditing(null); refresh() } })
  const remove = useMutation({ mutationFn: (id: string) => repository.removeLife(table, id), onSuccess: () => { setDeleting(null); refresh() } })
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    save.mutate({ ...(editing?.id ? { id: editing.id } : {}), title: String(form.get('title')), body: String(form.get('body')), status: String(form.get('status')) as LifeRow['status'], ...(table === 'missions' ? { project_id: String(form.get('parent')) } : table === 'projects' ? { goal_id: String(form.get('parent')) || null } : { kind: String(form.get('kind')) as 'quest' | 'goal' }) })
  }
  return <Card className="section-gap"><h2>Your commitments</h2><div className="editor-toolbar">{(['projects', 'goals', 'missions'] as const).map(t => <Button key={t} variant={t === table ? 'primary' : 'secondary'} onClick={() => { setTable(t); setEditing(null) }}>{t === 'goals' ? 'Quests & goals' : t}</Button>)}<Button onClick={() => { save.reset(); setEditing({}) }}>Add {table === 'goals' ? 'quest or goal' : table.slice(0, -1)}</Button></div>{records.isPending ? <LoadingState /> : records.error ? <ErrorState message={records.error.message} retry={() => { void records.refetch() }} /> : <ul className="item-list">{records.data.map(r => <li key={r.id}><span>{r.title} · {r.status}</span><Button variant="secondary" onClick={() => { save.reset(); setEditing(r) }}>Edit</Button><Button variant="ghost" onClick={() => { remove.reset(); setDeleting(r) }}>Delete</Button></li>)}</ul>}
    {editing && <Dialog title="Edit commitment" onClose={() => setEditing(null)}><form onSubmit={submit}><label htmlFor="life-title">Title</label><input id="life-title" name="title" required maxLength={500} defaultValue={editing.title} /><label htmlFor="life-body">Description</label><textarea id="life-body" name="body" rows={4} defaultValue={editing.body} /><label htmlFor="life-status">Status</label><select id="life-status" name="status" defaultValue={editing.status ?? 'active'}>{['active', 'paused', 'complete'].map(s => <option key={s}>{s}</option>)}</select>{table === 'goals' ? <><label htmlFor="goal-kind">Type</label><select id="goal-kind" name="kind" defaultValue={editing.kind ?? 'quest'}><option>quest</option><option>goal</option></select></> : <><label htmlFor="life-parent">{table === 'missions' ? 'Project' : 'Quest or goal'}</label><select id="life-parent" name="parent" required={table === 'missions'} defaultValue={editing.project_id ?? editing.goal_id ?? ''}><option value="">Choose a parent</option>{(table === 'missions' ? projects.data : goals.data)?.map(r => <option value={r.id} key={r.id}>{r.title}</option>)}</select></>}{save.error && <p role="alert">{save.error.message}</p>}<Button disabled={save.isPending} className="section-gap">Save commitment</Button></form></Dialog>}
    {deleting && <Dialog title="Delete this commitment?" onClose={() => setDeleting(null)}><p>{deleting.title}</p><p>Linked records must be unlinked before deleting their parent.</p>{remove.error && <p role="alert">{remove.error.message}</p>}<Button disabled={remove.isPending} onClick={() => remove.mutate(deleting.id)}>Confirm deletion</Button></Dialog>}
  </Card>
}
export function AccountControls() {
  const cache = useQueryClient()
  const [message, setMessage] = useState('')
  const profile = useQuery({ queryKey: ['profile'], queryFn: repository.profile })
  const timezone = useMutation({ mutationFn: repository.setTimezone, onSuccess: () => { void cache.invalidateQueries(); setMessage('Timezone saved.') } })
  const exportData = useMutation({ mutationFn: repository.exportAccount, onSuccess: value => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'sankalpa-export-' + today() + '.json'; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Export downloaded. Store it privately.')
  } })
  const logout = useMutation({ mutationFn: async () => { await cache.cancelQueries(); cache.clear(); const { error } = await getSupabaseClient().auth.signOut({ scope: 'local' }); if (error) throw error } })
  return <Card className="section-gap"><h2>Your account & data</h2><p>Records are saved to your authenticated account. Google Calendar and IRA remain disconnected.</p><form onSubmit={e => { e.preventDefault(); timezone.mutate(String(new FormData(e.currentTarget).get('timezone'))) }}><label htmlFor="timezone">Timezone</label><input id="timezone" name="timezone" defaultValue={profile.data?.timezone ?? 'Asia/Kolkata'} key={profile.data?.timezone} placeholder="Asia/Kolkata" /><Button className="section-gap" disabled={timezone.isPending || profile.isPending || !!profile.error}>Save timezone</Button></form><div className="editor-toolbar"><Button disabled={exportData.isPending} onClick={() => exportData.mutate()}>Export my data</Button><Button variant="secondary" disabled={logout.isPending} onClick={() => logout.mutate()}>Sign out</Button></div><p role="status">{message}</p>{[profile.error, timezone.error, exportData.error, logout.error].filter(Boolean).map((e, i) => <p key={i} role="alert">{e!.message}</p>)}</Card>
}
