import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function StreakChart({ data }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold mb-3">Last 30 days</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4}/>
            <YAxis allowDecimals={false} domain={[0,1]} tick={{ fontSize: 10 }}/>
            <Tooltip />
            <Area type="monotone" dataKey="value" strokeWidth={2} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
