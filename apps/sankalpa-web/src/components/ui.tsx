import { useEffect, useRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button className={`button ${variant} ${className}`} {...props} />
}
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}
export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-line" aria-hidden="true" /><h3>{title}</h3><p>{children}</p>{action}</div>
}
export function Dialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    dialog?.showModal()
    const initial = dialog?.querySelector<HTMLElement>('textarea, input, select') ?? dialog?.querySelector<HTMLElement>('button')
    initial?.focus()
    return () => { dialog?.close(); previous?.focus() }
  }, [])
  return <dialog ref={ref} aria-labelledby="dialog-title" onCancel={onClose} onKeyDown={e => {
    if (e.key !== 'Tab') return
    const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]'))
    const first = controls[0]; const last = controls.at(-1)
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
  }} onClick={e => { if (e.target === e.currentTarget) onClose() }}><div className="dialog-head"><h2 id="dialog-title">{title}</h2><Button variant="ghost" aria-label="Close dialog" onClick={onClose}><X size={20} /></Button></div>{children}</dialog>
}
export function LoadingState() { return <p className="state-message" role="status">Loading your space…</p> }
export function ErrorState({ message, retry }: { message: string; retry: () => void }) { return <div className="state-message" role="alert"><p>{message}</p><Button variant="secondary" onClick={retry}>Try again</Button></div> }
