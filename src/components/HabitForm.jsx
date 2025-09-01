import { useState } from 'react'

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState('')
  const [reminder, setReminder] = useState('20:00')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), createdAt: Date.now(), reminderTime: reminder })
    setName('')
  }

  return (
    <form onSubmit={submit} className="flex flex-col md:flex-row gap-3">
      <input
        className="flex-1 rounded-2xl border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Add a habit (e.g., Drink water)"
        value={name}
        onChange={e=>setName(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm px-2">
        Reminder
        <input type="time" value={reminder} onChange={e=>setReminder(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2"/>
      </label>
      <button className="rounded-2xl bg-sky-500 text-white px-5 py-2 shadow hover:bg-sky-600 transition">
        Add
      </button>
    </form>
  )
}
