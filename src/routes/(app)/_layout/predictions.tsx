import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  CalendarClock,
  Droplets,
  Gauge,
  MapPin,
  Zap,
} from 'lucide-react'

export const Route = createFileRoute('/(app)/_layout/predictions')({
  component: RouteComponent,
})

type ServiceType = 'WATER' | 'ELECTRICITY'
type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'

type Prediction = {
  id: number
  zoneId: number
  zoneName: string
  latitude: string
  longitude: string
  serviceType: ServiceType
  riskLevel: RiskLevel
  predictedTime: string
  createdAt: string
}

const predictions: Prediction[] = [
  {
    id: 1,
    zoneId: 1,
    zoneName: 'Tanambao',
    latitude: '-21.4559200',
    longitude: '47.0856300',
    serviceType: 'WATER',
    riskLevel: 'HIGH',
    predictedTime: '2026-05-14T15:30:00',
    createdAt: '2026-05-14T09:10:00',
  },
  {
    id: 2,
    zoneId: 2,
    zoneName: 'Ambalapaiso',
    latitude: '-21.4494100',
    longitude: '47.0892700',
    serviceType: 'ELECTRICITY',
    riskLevel: 'MEDIUM',
    predictedTime: '2026-05-14T18:00:00',
    createdAt: '2026-05-14T09:35:00',
  },
  {
    id: 3,
    zoneId: 3,
    zoneName: 'Analakely',
    latitude: '-18.9084100',
    longitude: '47.5252100',
    serviceType: 'WATER',
    riskLevel: 'LOW',
    predictedTime: '2026-05-15T07:45:00',
    createdAt: '2026-05-14T10:05:00',
  },
  {
    id: 4,
    zoneId: 4,
    zoneName: 'Centre-ville',
    latitude: '-21.4531200',
    longitude: '47.0838500',
    serviceType: 'ELECTRICITY',
    riskLevel: 'HIGH',
    predictedTime: '2026-05-14T13:20:00',
    createdAt: '2026-05-14T08:55:00',
  },
  {
    id: 5,
    zoneId: 5,
    zoneName: 'Kintambo',
    latitude: '-4.3298200',
    longitude: '15.2726400',
    serviceType: 'WATER',
    riskLevel: 'MEDIUM',
    predictedTime: '2026-05-15T11:15:00',
    createdAt: '2026-05-14T10:45:00',
  },
]

const serviceLabels: Record<ServiceType, string> = {
  WATER: 'Eau',
  ELECTRICITY: 'Electricite',
}

const riskLabels: Record<RiskLevel, string> = {
  HIGH: 'Eleve',
  MEDIUM: 'Moyen',
  LOW: 'Faible',
}

const riskStyles: Record<RiskLevel, string> = {
  HIGH: 'bg-red-500/10 text-red-600 ring-1 ring-red-500/20',
  MEDIUM: 'bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20',
  LOW: 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20',
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function ServiceBadge({ serviceType }: { serviceType: ServiceType }) {
  const Icon = serviceType === 'WATER' ? Droplets : Zap
  const className =
    serviceType === 'WATER'
      ? 'bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20'
      : 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20'

  return (
    <Badge variant='secondary' className={`gap-1.5 ${className}`}>
      <Icon className='size-3.5' />
      {serviceLabels[serviceType]}
    </Badge>
  )
}

function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  return (
    <Badge variant='secondary' className={riskStyles[riskLevel]}>
      {riskLabels[riskLevel]}
    </Badge>
  )
}

function RouteComponent() {
  const highRiskCount = predictions.filter(
    (prediction) => prediction.riskLevel === 'HIGH',
  ).length
  const waterCount = predictions.filter(
    (prediction) => prediction.serviceType === 'WATER',
  ).length
  const electricityCount = predictions.length - waterCount

  return (
    <div className='min-h-[calc(100vh-4rem)] space-y-6 bg-background text-foreground'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
            Predictions
          </h1>
          <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>
            Suivi des risques prevus par zone, service et heure estimee
            d'incident.
          </p>
        </div>
        <Badge variant='secondary' className='h-8 gap-1.5 self-start'>
          <CalendarClock className='size-3.5 text-primary' />
          Analyse predictive
        </Badge>
      </div>

      <section className='grid gap-4 md:grid-cols-3'>
        <Card size='sm' className='border-border/60'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Gauge className='size-4 text-primary' />
              Total predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-semibold'>{predictions.length}</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Enregistrements de la table predictions
            </p>
          </CardContent>
        </Card>

        <Card size='sm' className='border-border/60'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='size-4 text-red-500' />
              Risque eleve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-semibold'>{highRiskCount}</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Zones a surveiller en priorite
            </p>
          </CardContent>
        </Card>

        <Card size='sm' className='border-border/60'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Droplets className='size-4 text-sky-500' />
              Services touches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <ServiceBadge serviceType='WATER' />
              <span className='text-sm font-medium'>{waterCount}</span>
              <ServiceBadge serviceType='ELECTRICITY' />
              <span className='text-sm font-medium'>{electricityCount}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className='border-border/60'>
        <CardHeader className='sm:grid-cols-[1fr_auto]'>
          <div>
            <CardTitle>Table predictions</CardTitle>
            <CardDescription>
              Structure affichee: id, zone_id, service_type, risk_level,
              predicted_time et created_at.
            </CardDescription>
          </div>
          <Badge variant='outline'>{predictions.length} ligne(s)</Badge>
        </CardHeader>
        <CardContent>
          <div className='overflow-hidden rounded-lg border border-border/70'>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[860px] border-collapse text-left text-sm'>
                <thead className='bg-muted/60 text-xs uppercase text-muted-foreground'>
                  <tr>
                    <th className='px-4 py-3 font-medium'>ID</th>
                    <th className='px-4 py-3 font-medium'>Zone</th>
                    <th className='px-4 py-3 font-medium'>Service</th>
                    <th className='px-4 py-3 font-medium'>Risque</th>
                    <th className='px-4 py-3 font-medium'>Heure predite</th>
                    <th className='px-4 py-3 font-medium'>Creation</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/70'>
                  {predictions.map((prediction) => (
                    <tr
                      key={prediction.id}
                      className='transition-colors hover:bg-muted/40'
                    >
                      <td className='px-4 py-4 font-medium'>
                        #{prediction.id}
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex items-start gap-3'>
                          <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                            <MapPin className='size-4' />
                          </div>
                          <div>
                            <p className='font-medium'>{prediction.zoneName}</p>
                            <p className='text-xs text-muted-foreground'>
                              zone_id: {prediction.zoneId} -{' '}
                              {prediction.latitude}, {prediction.longitude}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4'>
                        <ServiceBadge serviceType={prediction.serviceType} />
                      </td>
                      <td className='px-4 py-4'>
                        <RiskBadge riskLevel={prediction.riskLevel} />
                      </td>
                      <td className='px-4 py-4 font-medium'>
                        {formatDateTime(prediction.predictedTime)}
                      </td>
                      <td className='px-4 py-4 text-muted-foreground'>
                        {formatDateTime(prediction.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
