import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

export class LazyRouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() { return { failed: true } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('A route chunk could not be loaded.', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return <section className="lazy-route-error" role="alert">
      <h1>This part of Sankalpa could not load.</h1>
      <p>The application may have been updated while this page was open. Your locally saved learning data was not changed.</p>
      <button className="button primary" onClick={() => window.location.reload()}>Reload this page</button>
      <a className="button secondary" href="/learning">Open Learning dashboard</a>
    </section>
  }
}
