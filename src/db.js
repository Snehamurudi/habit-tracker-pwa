import { openDB } from 'idb'

const DB_NAME = 'habit-tracker-db'
const DB_VERSION = 1

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('habits')) {
        const habits = db.createObjectStore('habits', { keyPath: 'id', autoIncrement: true })
        habits.createIndex('by_name', 'name')
      }
      if (!db.objectStoreNames.contains('checkins')) {
        const checkins = db.createObjectStore('checkins', { keyPath: 'id', autoIncrement: true })
        checkins.createIndex('by_habit', 'habitId')
        checkins.createIndex('by_date', 'date')
      }
    }
  })
}

export const Habits = {
  async all(db) { return (await db.getAll('habits')) },
  async add(db, habit) { return (await db.add('habits', habit)) },
  async delete(db, id) { return (await db.delete('habits', id)) },
  async update(db, habit) { return (await db.put('habits', habit)) },
}

export const Checkins = {
  async forHabitOn(db, habitId, dateStr) {
    const all = await db.getAllFromIndex('checkins','by_habit', habitId)
    return all.find(c => c.date === dateStr)
  },
  async forHabit(db, habitId) {
    return (await db.getAllFromIndex('checkins','by_habit', habitId))
  },
  async add(db, checkin) { return (await db.add('checkins', checkin)) },
  async delete(db, id) { return (await db.delete('checkins', id)) },
}

export const toDateStr = (d) => {
  const dt = new Date(d)
  dt.setHours(0,0,0,0)
  return dt.toISOString().slice(0,10)
}
