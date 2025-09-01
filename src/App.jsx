import { useEffect, useState, useMemo } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import StreakChart from './components/StreakChart'
import { initDB, Habits, Checkins, toDateStr } from './db'
import { seriesFromCheckins } from './streaks'
import './index.css'

export default function App() {
  const [db, setDb] = useState(null)
  const [habits, setHabits] = useState([])
  const [checkins, setCheckins] = useState([])
  const [selectedHabitId, setSelectedHabitId] = useState(null)

  const today = toDateStr(new Date())

  useEffect(()=>{
    initDB().then(d => setDb(d))
  }, [])

  useEffect(()=>{
    if (!db) return
    const load = async () => {
      const hs = await Habits.all(db)
      setHabits(hs)
      const all = []
      for (const h of hs) {
        const cs = await Checkins.forHabit(db, h.id)
        all.push(...cs)
      }
      setCheckins(all)
      if (hs[0]) setSelectedHabitId(hs[0].id)
    }
    load()
  }, [db])

  // Notification mock reminder: check every minute and fire if time matches
  useEffect(()=>{
    let interval
    (async ()=>{
      if (!('Notification' in window)) return
      if (Notification.permission === 'default') {
        try { await Notification.requestPermission() } catch {}
      }
      interval = setInterval(async () => {
        const now = new Date()
        const hh = String(now.getHours()).padStart(2,'0')
        const mm = String(now.getMinutes()).padStart(2,'0')
        const current = `${hh}:${mm}`
        for (const h of habits) {
          if (h.reminderTime === current) {
            try {
              const reg = await navigator.serviceWorker.getRegistration()
              if (reg && reg.showNotification) {
                reg.showNotification('Habit Reminder', {
                  body: `Time to: ${h.name}`,
                  tag: `habit-${h.id}`,
                  icon: '/icons/icon-192.png'
                })
              } else if (Notification.permission === 'granted') {
                new Notification('Habit Reminder', { body: `Time to: ${h.name}` })
              }
            } catch {}
          }
        }
      }, 60000)
    })()
    return ()=> interval && clearInterval(interval)
  }, [habits])

  const onAdd = async (habit) => {
    const id = await Habits.add(db, habit)
    const h = { ...habit, id }
    setHabits(prev => [...prev, h])
  }

  const onDelete = async (id) => {
    await Habits.delete(db, id)
    setHabits(prev => prev.filter(h => h.id !== id))
    setCheckins(prev => prev.filter(c => c.habitId !== id))
  }

  const onRename = async (habit) => {
    await Habits.update(db, habit)
    setHabits(prev => prev.map(h => h.id === habit.id ? habit : h))
  }

  const onToggle = async (habit, checked) => {
    const existing = await Checkins.forHabitOn(db, habit.id, today)
    if (checked && existing) {
      await Checkins.delete(db, existing.id)
      setCheckins(prev => prev.filter(c => c.id !== existing.id))
    } else if (!checked && !existing) {
      const id = await Checkins.add(db, { habitId: habit.id, date: today, createdAt: Date.now() })
      setCheckins(prev => [...prev, { id, habitId: habit.id, date: today, createdAt: Date.now() }])
    }
  }

  const selectedCheckins = useMemo(() => {
    if (!selectedHabitId) return []
    return checkins.filter(c => c.habitId === selectedHabitId)
  }, [checkins, selectedHabitId])

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Habit Tracker</h1>
        <button
          onClick={async ()=>{
            try {
              const reg = await navigator.serviceWorker.getRegistration()
              if (reg) {
                await reg.update()
                alert('App updated!')
              }
            } catch {}
          }}
          className="rounded-2xl border px-3 py-1 text-sm shadow-sm"
        >Check Updates</button>
      </header>

      <div className="grid gap-6">
        <HabitForm onAdd={onAdd} />

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Your Habits</h2>
            <select className="border rounded-xl px-3 py-2 text-sm"
              value={selectedHabitId || ''}
              onChange={e=>setSelectedHabitId(Number(e.target.value))}>
              {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <HabitList db={db} habits={habits} checkins={checkins} onToggle={onToggle} onDelete={onDelete} onRename={onRename} />
        </div>

        <StreakChart data={seriesFromCheckins(selectedCheckins, 30)} />

        <footer className="text-center text-xs text-slate-500 py-6">
          Offline-first • Installable PWA • IndexedDB storage • Mock reminders
        </footer>
      </div>
    </div>
  )
}
