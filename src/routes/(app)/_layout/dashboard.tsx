import type { RootState } from '@/redux/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Droplets,
  Gauge,
  MapPin,
  RadioTower,
  Zap,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/(app)/_layout/dashboard')({
  validateSearch: (search: Record<string, unknown>) => ({
    connected:
      search.connected === true ||
      search.connected === 'true' ||
      search.connected === 1 ||
      search.connected === '1',
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { connected } = Route.useSearch()
  const [selectedMetric, setSelectedMetric] = useState<'electricity' | 'water'>(
    'water',
  )

  const user = useSelector((state: RootState) => state.client.user)

  const metrics = {
    electricity: {
      title: 'Zones sans électricité',
      label: 'Électricité',
      value: 46,
      affected: 8,
      icon: Zap,
      tone: 'text-amber-500',
      softBg: 'bg-amber-500/10',
      ring: 'ring-amber-500/20',
      description: '8 zones affectées actuellement',
    },
    water: {
      title: 'Zones sans eau',
      label: 'Eau',
      value: 72,
      affected: 12,
      icon: Droplets,
      tone: 'text-sky-500',
      softBg: 'bg-sky-500/10',
      ring: 'ring-sky-500/20',
      description: '12 zones affectées actuellement',
    },
  }

  const activeMetric = metrics[selectedMetric]
  const ActiveIcon = activeMetric.icon

  const circumference = 2 * Math.PI * 48
  const progressOffset =
    circumference - (activeMetric.value / 100) * circumference

  const statusSummary = useMemo(
    () => [
      {
        label: 'Critical',
        value: selectedMetric === 'water' ? 5 : 3,
        className: 'bg-red-500/10 text-red-500 ring-red-500/20',
      },
      {
        label: 'Medium',
        value: selectedMetric === 'water' ? 7 : 5,
        className: 'bg-orange-500/10 text-orange-500 ring-orange-500/20',
      },
      {
        label: 'Normal',
        value: selectedMetric === 'water' ? 21 : 25,
        className: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
      },
    ],
    [selectedMetric],
  )

  const criticalZones =
    selectedMetric === 'water'
      ? [
          { zone: 'Centre-ville', state: 'Critical', value: '91%' },
          { zone: 'Kintambo', state: 'Critical', value: '84%' },
          { zone: 'Ngaliema', state: 'Medium', value: '63%' },
        ]
      : [
          { zone: 'Gombe Nord', state: 'Critical', value: '78%' },
          { zone: 'Limete', state: 'Medium', value: '56%' },
          { zone: 'Masina', state: 'Medium', value: '49%' },
        ]

  const alerts =
    selectedMetric === 'water'
      ? [
          'Pression faible détectée sur le réseau principal',
          'Réservoir secondaire sous le seuil opérationnel',
          'Intervention terrain planifiée dans 35 minutes',
        ]
      : [
          'Surcharge détectée sur le transformateur T-08',
          'Retour progressif attendu dans deux secteurs',
          'Équipe technique assignée à la ligne Est',
        ]

  const chartValues =
    selectedMetric === 'water'
      ? [42, 58, 51, 67, 72, 64, 79, 72]
      : [28, 34, 41, 37, 46, 52, 43, 46]

  useEffect(() => {
    if (!connected) return

    toast.success('Bien connecté')
    router.navigate({
      to: '/dashboard',
      replace: true,
      search: { connected: false },
    })
  }, [connected, router])

  return (
    <div className='min-h-[calc(100vh-4rem)] flex-1 space-y-6 bg-background text-foreground'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          
          <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
            Dashboard admin
          </h1>
          <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>
            Bienvenue{user?.username ? `, ${user.username}` : ''}. Surveillez en temps réel les coupures d'eau et d'électricité dans les zones prioritaires.
          </p>
        </div>
        {/* <Button className='w-full gap-2 sm:w-auto' size='lg'>
          Rapport détaillé
          <ArrowUpRight className='size-4' />
        </Button> */}
      </div>

      <section className='grid gap-4 lg:grid-cols-2'>
        <Card className='relative overflow-hidden border-border/60 bg-card shadow-lg shadow-primary/5'>
          <CardHeader className='relative gap-3 sm:grid-cols-[1fr_auto]'>
            <div>
              <div
                className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${activeMetric.softBg} ${activeMetric.tone} ring-1 ${activeMetric.ring}`}
              >
                <ActiveIcon className='size-6' />
              </div>
              <CardTitle className='text-xl font-semibold sm:text-2xl'>
                {activeMetric.title}
              </CardTitle>
              <CardDescription className='mt-2'>
                {activeMetric.description}
              </CardDescription>
            </div>

            <div className='flex items-center justify-center'>
              <div className='relative size-36'>
                <svg className='size-full -rotate-90' viewBox='0 0 120 120'>
                  <circle
                    cx='60'
                    cy='60'
                    r='48'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='11'
                    className='text-muted/60'
                  />
                  <circle
                    cx='60'
                    cy='60'
                    r='48'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeWidth='11'
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    className='text-primary transition-all duration-700 ease-out'
                  />
                </svg>
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <span className='text-3xl font-bold'>
                    {activeMetric.value}%
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    affectées
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className='relative'>
            <div className='grid gap-3 sm:grid-cols-3'>
              {statusSummary.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl px-4 py-3 ring-1 ${item.className}`}
                >
                  <p className='text-xs font-medium uppercase tracking-wide'>
                    {item.label}
                  </p>
                  <p className='mt-1 text-2xl font-semibold'>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/60 shadow-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Gauge className='size-5 text-primary' />
              État global
            </CardTitle>
            <CardDescription>
              Vue consolidée des infrastructures critiques.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between rounded-xl bg-muted/50 p-4'>
              <span className='text-sm text-muted-foreground'>
                Zones suivies
              </span>
              <span className='text-2xl font-semibold'>33</span>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span>Couverture capteurs</span>
                <span className='font-medium text-primary'>88%</span>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-muted'>
                <div className='h-full w-[88%] rounded-full bg-primary' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <Badge className='justify-center py-2'>Temps réel</Badge>
              <Badge variant='secondary' className='justify-center py-2'>
                IA active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className='flex justify-center'>
        <div className='grid w-full max-w-md grid-cols-2 rounded-full border bg-card p-1 shadow-sm'>
          {(['electricity', 'water'] as const).map((metric) => {
            const MetricIcon = metrics[metric].icon
            const isActive = selectedMetric === metric

            return (
              <button
                key={metric}
                type='button'
                onClick={() => setSelectedMetric(metric)}
                className={`flex h-12 items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={isActive}
                title={`Afficher les statistiques ${metrics[metric].label.toLowerCase()}`}
              >
                <MetricIcon className='size-4' />
                {metrics[metric].label}
              </button>
            )
          })}
        </div>
      </div>

      <section className='grid gap-4'>
        <Card className='border-border/60'>
          <CardHeader>
            <CardTitle>Zones critiques</CardTitle>
            <CardDescription>Priorité d'intervention terrain.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {criticalZones.map((zone) => (
              <div
                key={zone.zone}
                className='flex items-center justify-between rounded-xl bg-muted/40 p-3'
              >
                <div className='flex items-center gap-3'>
                  <MapPin className='size-4 text-primary' />
                  <div>
                    <p className='font-medium'>{zone.zone}</p>
                    <p className='text-xs text-muted-foreground'>
                      Impact estimé {zone.value}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    zone.state === 'Critical' ? 'destructive' : 'outline'
                  }
                  className={
                    zone.state === 'Medium'
                      ? 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20'
                      : ''
                  }
                >
                  {zone.state}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

      </section>

      <Card className='border-border/60'>
        <CardHeader className='sm:grid-cols-[1fr_auto]'>
          <div>
            <CardTitle>Coupures récentes</CardTitle>
            <CardDescription>
              Évolution des incidents détectés sur les dernières heures.
            </CardDescription>
          </div>
          <Badge variant='secondary' className='gap-1.5'>
            <Activity className='size-3.5 text-primary' />
            Analyse continue
          </Badge>
        </CardHeader>
        <CardContent>
          <div className='flex h-64 items-end gap-2 rounded-2xl bg-muted/30 p-4 sm:gap-4'>
            {chartValues.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className='flex flex-1 flex-col items-center gap-2'
              >
                <div
                  className='w-full rounded-t-xl bg-primary transition-all duration-500 hover:bg-primary/80'
                  style={{ height: `${value}%` }}
                  title={`${value}% de zones affectées`}
                />
                <span className='text-xs text-muted-foreground'>
                  H{index + 1}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
