import { useMemo, useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import { PlannerPage } from './pages/PlannerPage'
import { planDay } from './lib/mockPlannerAgent'
import { toDateKey } from './lib/week'
import type { DayPlan } from './types'

type Screen = 'landing' | 'planner'

const App = () => {
  const today = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  const [screen, setScreen] = useState<Screen>('landing')
  const [planning, setPlanning] = useState(false)
  const [planByDate, setPlanByDate] = useState<DayPlan>({})

  const handleSubmit = async (intent: string) => {
    setPlanning(true)
    try {
      const blocks = await planDay(intent, today)
      const key = toDateKey(today)
      setPlanByDate((current) => ({ ...current, [key]: blocks }))
      setScreen('planner')
    } finally {
      setPlanning(false)
    }
  }

  if (screen === 'landing') {
    return <LandingPage planning={planning} onSubmit={handleSubmit} />
  }

  return (
    <PlannerPage
      planByDate={planByDate}
      initialView="day"
      onBackToLanding={() => setScreen('landing')}
    />
  )
}

export default App
