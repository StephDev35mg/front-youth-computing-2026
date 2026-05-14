import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Circle,
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  OverlayView,
} from '@react-google-maps/api'

import { useGetZones } from '@/api/carte/get_zone.api'
import type { ZONE } from '@/api/carte/get_zone.api'
import { useGetZoneStatus } from '@/api/carte/get_status.api'
import type { ZONE_STATUS } from '@/api/carte/get_status.api'
export const Route = createFileRoute('/(app)/_layout/carte')({
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

  const [service, setService] = useState<ServiceType>('WATER')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const {
    data: apiZones = [],
    isLoading: isLoadingZones,
    isError: isZonesError,
    error: zonesError,
  } = useGetZones()
  const {
    data: apiZoneStatus = [],
    isLoading: isLoadingZoneStatus,
    isError: isZoneStatusError,
    error: zoneStatusError,
  } = useGetZoneStatus()

  useEffect(() => {
    if (!connected) return

    toast.success('Bien connecté')
    router.navigate({
      to: '/dashboard',
      replace: true,
      search: { connected: false },
    })
  }, [connected, router])

  useEffect(() => {
    if (isLoadingZones || isLoadingZoneStatus) {
      console.log('[Carte] Chargement des zones et statuts depuis Django...')
      return
    }

    if (isZonesError) {
      console.error('[Carte] Erreur chargement zones :', zonesError)
      return
    }

    if (isZoneStatusError) {
      console.error('[Carte] Erreur chargement statuts zones :', zoneStatusError)
      return
    }

    console.log('[Carte] Zones recues :', apiZones)
    console.log('[Carte] Statuts recues :', apiZoneStatus)
    console.log(
      `[Carte] Correspondance : ${apiZones.length} zone(s), ${apiZoneStatus.length} statut(s)`,
    )
  }, [
    apiZones,
    apiZoneStatus,
    isLoadingZones,
    isLoadingZoneStatus,
    isZonesError,
    isZoneStatusError,
    zonesError,
    zoneStatusError,
  ])

  const zones = useMemo(() => {
    return apiZones
      .map((zone) => mapApiZoneToMapZone(zone, apiZoneStatus))
      .filter((zone): zone is FokontanyZone => zone !== null)
  }, [apiZones, apiZoneStatus])

  const center = useMemo(() => {
    if (zones.length === 0) {
      return {
        lat: -21.4522,
        lng: 47.0851,
      }
    }

    return {
      lat:
        zones.reduce((sum, zone) => sum + zone.position.lat, 0) / zones.length,
      lng:
        zones.reduce((sum, zone) => sum + zone.position.lng, 0) / zones.length,
    }
  }, [zones])

  const filteredZones = zones.filter((zone) => {
    const zoneStatus = zone.zone_status[service].level

    return status === 'ALL' || zoneStatus === status
  })

  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status === 'ACTIVE' &&
      alert.type === service &&
      zones.some((zone) => zone.id === alert.zoneId),
  )

  const selectedZone =
    zones.find((zone) => zone.id === selectedZoneId) ?? null

  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute right-4 top-4 z-10 w-[min(92vw,360px)] space-y-2 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur'>
        <Tabs
          value={service}
          onValueChange={(val) => setService(val as ServiceType)}
        >
          <TabsList className='w-full'>
            <TabsTrigger value='WATER'>💧 Eau</TabsTrigger>
            <TabsTrigger value='ELECTRICITY'>⚡ Électricité</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={status}
          onValueChange={(val) => setStatus(val as StatusFilter)}
        >
          <TabsList className='grid h-auto w-full grid-cols-4'>
            <TabsTrigger value='ALL'>Tous</TabsTrigger>
            <TabsTrigger value='CRITICAL'>Rouge</TabsTrigger>
            <TabsTrigger value='MEDIUM'>Jaune</TabsTrigger>
            <TabsTrigger value='NORMAL'>Vert</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='grid grid-cols-3 gap-2 text-xs font-medium text-slate-700'>
          <LegendItem color='bg-red-500' label='CRITICAL' />
          <LegendItem color='bg-amber-400' label='MEDIUM' />
          <LegendItem color='bg-emerald-500' label='NORMAL' />
        </div>
      </div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
          }}
          center={center}
          zoom={15}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          {filteredZones.map((zone) => {
            const currentStatus = zone.zone_status[service]
            const statusStyle = statusStyles[currentStatus.level]
            const prediction = predictions.find(
              (item) =>
                item.zoneId === zone.id &&
                item.service === service &&
                item.risk_level !== 'LOW',
            )

            return (
              <div key={zone.id}>
                {prediction ? (
                  <Circle
                    center={zone.position}
                    radius={190}
                    options={{
                      clickable: false,
                      fillColor:
                        prediction.risk_level === 'HIGH'
                          ? '#a855f7'
                          : '#2563eb',
                      fillOpacity: 0.14,
                      strokeColor:
                        prediction.risk_level === 'HIGH'
                          ? '#7e22ce'
                          : '#1d4ed8',
                      strokeOpacity: 0.85,
                      strokeWeight: 2,
                    }}
                  />
                ) : null}

                <Circle
                  center={zone.position}
                  radius={125}
                  options={{
                    fillColor: statusStyle.hex,
                    fillOpacity: 0.22,
                    strokeColor: statusStyle.hex,
                    strokeOpacity: 0.95,
                    strokeWeight: 3,
                  }}
                  onClick={() => setSelectedZoneId(zone.id)}
                />

                <Marker
                  position={zone.position}
                  onClick={() => setSelectedZoneId(zone.id)}
                  icon={{
                    url: statusStyle.markerUrl,
                  }}
                  label={{
                    text: `${serviceIcons[service]} ${currentStatus.availability_score}%`,
                    color: '#111827',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}
                  title={`${zone.name} - ${currentStatus.level}`}
                />

                {prediction ? (
                  <OverlayView
                    position={zone.position}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <button
                      className='relative -translate-x-1/2 translate-y-8 rounded-full border border-white bg-purple-600 px-2 py-1 text-xs font-bold text-white shadow-lg'
                      onClick={() => setSelectedZoneId(zone.id)}
                      type='button'
                    >
                      <span className='absolute inset-0 animate-ping rounded-full bg-purple-500 opacity-40' />
                      <span className='relative'>⚠️ Risque</span>
                    </button>
                  </OverlayView>
                ) : null}
              </div>
            )
          })}

          {activeAlerts.map((alert) => (
            <OverlayView
              key={alert.id}
              position={{
                lat: alert.lat,
                lng: alert.lng,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <button
                className='relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 p-2 text-lg shadow-xl'
                onClick={() => setSelectedZoneId(alert.zoneId)}
                title={alert.title}
                type='button'
              >
                <span className='absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60' />
                <span className='relative'>{serviceIcons[alert.type]}</span>
              </button>
            </OverlayView>
          ))}

          {selectedZone ? (
            <InfoWindow
              position={selectedZone.position}
              onCloseClick={() => setSelectedZoneId(null)}
            >
              <ZonePopup zone={selectedZone} />
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

type ServiceType = 'WATER' | 'ELECTRICITY'
type StatusLevel = 'CRITICAL' | 'MEDIUM' | 'NORMAL'
type StatusFilter = StatusLevel | 'ALL'

type ZoneStatus = {
  level: StatusLevel
  availability_score: number
}

type FokontanyZone = {
  id: string
  name: string
  address: string
  created_at: string
  position: {
    lat: number
    lng: number
  }
  zone_status: Record<ServiceType, ZoneStatus>
}

const mapApiZoneToMapZone = (
  zone: ZONE,
  statuses: ZONE_STATUS[],
): FokontanyZone | null => {
  const lat = Number(zone.latitude)
  const lng = Number(zone.longitude)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    console.warn('[Carte] Zone ignoree: coordonnees invalides', zone)
    return null
  }

  return {
    id: String(zone.id),
    name: zone.quartier,
    address: zone.address,
    created_at: zone.created_at,
    position: {
      lat,
      lng,
    },
    zone_status: getZoneStatusByService(zone.id, statuses),
  }
}

const getZoneStatusByService = (
  zoneId: number,
  statuses: ZONE_STATUS[],
): Record<ServiceType, ZoneStatus> => {
  const defaultStatus: Record<ServiceType, ZoneStatus> = {
    WATER: { level: 'NORMAL', availability_score: 100 },
    ELECTRICITY: { level: 'NORMAL', availability_score: 100 },
  }

  statuses
    .filter((status) => Number(status.zone) === Number(zoneId))
    .forEach((status) => {
      defaultStatus[status.service_type] = {
        level: status.status,
        availability_score: status.availability_score,
      }
    })

  return defaultStatus
}

type Alert = {
  id: string
  zoneId: string
  title: string
  type: ServiceType
  lat: number
  lng: number
  status: 'ACTIVE' | 'RESOLVED'
  time: string
}

type Prediction = {
  id: string
  zoneId: string
  service: ServiceType
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW'
}

const serviceIcons: Record<ServiceType, string> = {
  WATER: '💧',
  ELECTRICITY: '⚡',
}

const statusStyles: Record<
  StatusLevel,
  {
    hex: string
    markerUrl: string
    textClass: string
  }
> = {
  CRITICAL: {
    hex: '#ef4444',
    markerUrl: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    textClass: 'text-red-600',
  },
  MEDIUM: {
    hex: '#f59e0b',
    markerUrl: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    textClass: 'text-amber-600',
  },
  NORMAL: {
    hex: '#22c55e',
    markerUrl: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    textClass: 'text-emerald-600',
  },
}

const alerts: Alert[] = [
  {
    id: 'alert-water-tanambao',
    zoneId: 'tanambao',
    title: 'Coupure eau',
    type: 'WATER',
    lat: -21.4524,
    lng: 47.0837,
    status: 'ACTIVE',
    time: '10:30',
  },
  {
    id: 'alert-electricity-tanambao',
    zoneId: 'tanambao',
    title: 'Panne secteur',
    type: 'ELECTRICITY',
    lat: -21.4535,
    lng: 47.085,
    status: 'ACTIVE',
    time: '11:00',
  },
  {
    id: 'alert-water-ankazondrano',
    zoneId: 'ankazondrano',
    title: 'Baisse de pression',
    type: 'WATER',
    lat: -21.4511,
    lng: 47.0794,
    status: 'ACTIVE',
    time: '09:45',
  },
  {
    id: 'alert-electricity-tsianolondroa',
    zoneId: 'tsianolondroa',
    title: 'Transformateur instable',
    type: 'ELECTRICITY',
    lat: -21.456,
    lng: 47.0881,
    status: 'ACTIVE',
    time: '12:15',
  },
  {
    id: 'alert-water-ambatomena',
    zoneId: 'ambatomena',
    title: 'Citerne en retard',
    type: 'WATER',
    lat: -21.4596,
    lng: 47.0838,
    status: 'RESOLVED',
    time: '08:10',
  },
]

const predictions: Prediction[] = [
  {
    id: 'prediction-water-tanambao',
    zoneId: 'tanambao',
    service: 'WATER',
    risk_level: 'HIGH',
  },
  {
    id: 'prediction-electricity-talatamaty',
    zoneId: 'talatamaty',
    service: 'ELECTRICITY',
    risk_level: 'HIGH',
  },
  {
    id: 'prediction-water-ambatomena',
    zoneId: 'ambatomena',
    service: 'WATER',
    risk_level: 'MEDIUM',
  },
]

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className='flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1'>
      <span className={`size-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}

function ZonePopup({ zone }: { zone: FokontanyZone }) {
  const zoneAlerts = alerts.filter(
    (alert) => alert.zoneId === zone.id && alert.status === 'ACTIVE',
  )

  return (
    <div className='min-w-60 space-y-3 p-1 text-sm text-slate-800'>
      <div>
        <p className='text-base font-bold'>📍 {zone.name}</p>
        <p className='text-xs text-slate-500'>{zone.address}</p>
        <p className='text-xs text-slate-500'>
          Position: {zone.position.lat}, {zone.position.lng}
        </p>
      </div>

      <div className='space-y-1.5'>
        <StatusRow service='WATER' status={zone.zone_status.WATER} />
        <StatusRow
          service='ELECTRICITY'
          status={zone.zone_status.ELECTRICITY}
        />
      </div>

      <div>
        <p className='mb-1 font-semibold'>🚨 Alertes :</p>
        {zoneAlerts.length > 0 ? (
          <ul className='space-y-1'>
            {zoneAlerts.map((alert) => (
              <li key={alert.id}>
                - {alert.title} ({alert.time})
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-slate-500'>Aucune alerte active</p>
        )}
      </div>
    </div>
  )
}

function StatusRow({
  service,
  status,
}: {
  service: ServiceType
  status: ZoneStatus
}) {
  const serviceLabel = service === 'WATER' ? 'Eau' : 'Électricité'

  return (
    <div className='flex items-center justify-between gap-4 rounded-md bg-slate-50 px-2 py-1.5'>
      <span>
        {serviceIcons[service]} {serviceLabel}
      </span>
      <span className={`font-bold ${statusStyles[status.level].textClass}`}>
        {status.level} ({status.availability_score}%)
      </span>
    </div>
  )
}
