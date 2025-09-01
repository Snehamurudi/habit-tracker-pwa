import { toDateStr } from './db'

const dayMs = 24*60*60*1000

export const computeStreak = (checkins) => {
  if (!checkins || checkins.length === 0) return 0
  const dates = new Set(checkins.map(c => c.date))
  let streak = 0
  let cursor = new Date()
  cursor.setHours(0,0,0,0)
  while (dates.has(toDateStr(cursor))) {
    streak += 1
    cursor = new Date(cursor.getTime() - dayMs)
  }
  return streak
}

export const seriesFromCheckins = (checkins, days=30) => {
  const set = new Set(checkins.map(c => c.date))
  const today = new Date()
  today.setHours(0,0,0,0)
  const arr = []
  for (let i = days-1; i >= 0; i--) {
    const d = new Date(today.getTime() - i*dayMs)
    const ds = toDateStr(d)
    arr.push({ date: ds, value: set.has(ds) ? 1 : 0 })
  }
  return arr
}
