import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_layout/alerts')({
  validateSearch: (search: Record<string, unknown>) => ({
    connected:
      search.connected === true ||
      search.connected === 'true' ||
      search.connected === 1 ||
      search.connected === '1',
  }),
  component: RouteComponent,
})
type Alert = {
  id: string
  ville: string
  fokontany: string
  type: 'WATER' | 'ELECTRICITY'
  status: 'ACTIVE' | 'RESOLVED'
  message: string
  createdAt: string
}
const alerts: Alert[] = [
  {
    id: '1',
    ville: 'Fianarantsoa',
    fokontany: 'Tanambao',
    type: 'WATER',
    status: 'ACTIVE',
    message: 'Coupure d’eau',
    createdAt: '10:30',
  },
  {
    id: '2',
    ville: 'Fianarantsoa',
    fokontany: 'Tanambao',
    type: 'ELECTRICITY',
    status: 'ACTIVE',
    message: 'Panne électrique',
    createdAt: '11:00',
  },
  {
    id: '3',
    ville: 'Fianarantsoa',
    fokontany: 'Ambalapaiso',
    type: 'WATER',
    status: 'RESOLVED',
    message: 'Rétabli',
    createdAt: '09:00',
  },
  {
    id: '4',
    ville: 'Fianarantsoa',
    fokontany: 'Ambalapaiso',
    type: 'ELECTRICITY',
    status: 'ACTIVE',
    message: 'Coupure secteur',
    createdAt: '12:15',
  },
  {
    id: '5',
    ville: 'Antananarivo',
    fokontany: 'Analakely',
    type: 'WATER',
    status: 'ACTIVE',
    message: 'Coupure',
    createdAt: '08:00',
  },
]

function groupByFokontany(data: Alert[]) {
  return data.reduce((acc: Record<string, Alert[]>, alert) => {
    if (!acc[alert.fokontany]) acc[alert.fokontany] = []
    acc[alert.fokontany].push(alert)
    return acc
  }, {})
}

function RouteComponent() {
  const grouped = groupByFokontany(alerts)

  return (
    <div className='space-y-1 px-4 sm:px-6 py-6'>
      <h1 className='text-xl font-bold'> Alerts</h1>

      {Object.entries(grouped).map(([zone, zoneAlerts]) => (
        <div key={zone} className='border rounded-xl p-4 space-y-3'>
          {/* Zone header */}
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-lg'>{zone}</h2>
            <span className='text-sm text-gray-500'>
              {zoneAlerts.length} alert(s)
            </span>
          </div>

          {/* Alerts list */}
          <div className='space-y-2'>
            {zoneAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border flex justify-between items-center ${
                  alert.status === 'ACTIVE'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div>
                  <p className='font-medium'>
                    {alert.type === 'WATER' ? '💧' : '⚡'} {alert.message}
                  </p>
                  <p className='text-xs text-gray-500'>{alert.createdAt}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    alert.status === 'ACTIVE'
                      ? 'bg-red-200 text-red-700'
                      : 'bg-green-200 text-green-700'
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
