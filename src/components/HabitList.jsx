import { useEffect, useMemo } from 'react'
import { toDateStr } from '../db'
import { computeStreak } from '../streaks'

export default function HabitList({ db, habits, checkins, onToggle, onDelete, onRename }) {
  const today = toDateStr(new Date())

  const grouped = useMemo(() => {
    const byHabit = {}
    for (const c of checkins) {
      byHabit[c.habitId] = byHabit[c.habitId] || []
      byHabit[c.habitId].push(c)
    }
    return byHabit
  }, [checkins])

  useEffect(()=>{
    // noop just to ensure render after checkins
  },[grouped])

  return (
    <div className="grid gap-3">
      {habits.length === 0 && (
        <div className="text-slate-500 text-center py-8">No habits yet. Add one above!</div>
      )}
      {habits.map(h => {
        const list = grouped[h.id] || []
        const streak = computeStreak(list)
        const checked = !!list.find(c => c.date === today)
        return (
          <div key={h.id} className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={checked} onChange={()=>onToggle(h, checked)}
                className="h-5 w-5"/>
              <div>
                <div className="font-semibold">{h.name}</div>
                <div className="text-xs text-slate-500">Streak: {streak} day{streak===1?'':'s'} • Reminder {h.reminderTime || '—'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>{
                const nn = prompt('Rename habit', h.name)
                if (nn && nn.trim()) onRename({...h, name: nn.trim()})
              }} className="text-sky-600 hover:underline text-sm">Rename</button>
              <button onClick={()=>onDelete(h.id)} className="text-rose-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
