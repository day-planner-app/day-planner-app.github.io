import { useState, type FormEvent } from 'react'
import { ArrowRightIcon } from '../components/Icons'

type LandingPageProps = {
  planning: boolean
  onSubmit: (intent: string) => void
}

export const LandingPage = ({ planning, onSubmit }: LandingPageProps) => {
  const [draft, setDraft] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const intent = draft.trim()
    if (!intent || planning) return
    onSubmit(intent)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-base-200 px-6">
      <div className="w-full max-w-xl text-center">
        {planning ? (
          <div className="flex flex-col items-center gap-5">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="font-display text-2xl font-medium tracking-tight text-base-content">
              Planning your day…
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
              What would you like to do for your day?
            </h1>
            <form className="relative mt-10" onSubmit={submit}>
              <input
                type="text"
                autoFocus
                className="input input-lg w-full rounded-full border-none bg-base-100 pr-14 text-base shadow-none"
                placeholder="e.g. Finish quarterly report, about 2 hours"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                aria-label="What would you like to do for your day?"
              />
              <button
                type="submit"
                className="btn btn-primary btn-circle absolute top-1/2 right-2 -translate-y-1/2"
                aria-label="Plan my day"
                disabled={!draft.trim()}
              >
                <ArrowRightIcon />
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
