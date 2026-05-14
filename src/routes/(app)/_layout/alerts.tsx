import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Plus,
  Droplets,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  Trash,
  Archive,
  Check,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

export const Route = createFileRoute('/(app)/_layout/alerts')({
  component: AlertsPage,
})

/* ---------------- TYPES ---------------- */

type Report = {
  id: number
  zone: string
  service_type: 'WATER' | 'ELECTRICITY'
  status: 'AVAILABLE' | 'NOT_AVAILABLE'
  description: string
  created_at: string
}

/* ---------------- MOCK DATA ---------------- */

const reports: Report[] = [
  {
    id: 1,
    zone: 'Analakely',
    service_type: 'WATER',
    status: 'NOT_AVAILABLE',
    description: 'Coupure d’eau généralisée dans le quartier',
    created_at: '2026-05-14 10:30',
  },
  {
    id: 2,
    zone: 'Ambalapaiso',
    service_type: 'ELECTRICITY',
    status: 'AVAILABLE',
    description: 'Panne résolue après intervention',
    created_at: '2026-05-14 09:10',
  },
  {
    id: 3,
    zone: 'Tanambao',
    service_type: 'WATER',
    status: 'NOT_AVAILABLE',
    description: 'Faible pression d’eau signalée',
    created_at: '2026-05-14 08:40',
  },
]

/* ---------------- COMPONENT ---------------- */

function AlertsPage() {
  const [selected, setSelected] = useState<Report | null>(null)
  const [search, setSearch] = useState('')

  /* ---------------- KPIs ---------------- */

  const kpis = useMemo(() => {
    return {
      total: reports.length,
      active: reports.filter(r => r.status === 'NOT_AVAILABLE').length,
      water: reports.filter(r => r.service_type === 'WATER').length,
      electricity: reports.filter(r => r.service_type === 'ELECTRICITY').length,
    }
  }, [])

  /* ---------------- FILTER ---------------- */

  const filtered = useMemo(() => {
    return reports.filter(r =>
      r.zone.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-primary" />
            Alertes & Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Suivi en temps réel des incidents signalés par les utilisateurs
          </p>
        </div>

        <Button className="gap-2">
          <Plus size={16} />
          Nouvelle alerte
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold">{kpis.total}</p>
        </Card>

        <Card className="p-4 border-red-200">
          <p className="text-sm text-muted-foreground">Alertes actives</p>
          <p className="text-xl font-bold text-red-500">{kpis.active}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm flex items-center gap-1">
            <Droplets size={14} /> Eau
          </p>
          <p className="text-xl font-bold text-blue-500">{kpis.water}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm flex items-center gap-1">
            <Zap size={14} /> Électricité
          </p>
          <p className="text-xl font-bold text-yellow-500">{kpis.electricity}</p>
        </Card>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <Input
          placeholder="Rechercher une zone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Zone</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(report => (
              <tr
                key={report.id}
                className="border-t hover:bg-muted/50 transition"
              >
                <td className="p-3">#{report.id}</td>
                <td className="p-3 font-medium">{report.zone}</td>

                <td className="p-3">
                  {report.service_type === 'WATER' ? (
                    <Badge className="bg-blue-100 text-blue-700">💧 WATER</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">⚡ ELECTRICITY</Badge>
                  )}
                </td>

                <td className="p-3">
                  {report.status === 'AVAILABLE' ? (
                    <Badge className="bg-green-100 text-green-700 flex gap-1 w-fit">
                      <CheckCircle2 size={12} /> Résolu
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 flex gap-1 w-fit">
                      <XCircle size={12} /> En cours
                    </Badge>
                  )}
                </td>

                <td className="p-3 max-w-[250px] truncate">
                  {report.description}
                </td>

                <td className="p-3 text-muted-foreground">
                  {report.created_at}
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost">•••</Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelected(report)}>
                        <Eye size={14} className="mr-2" />
                        Voir détails
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Check size={14} className="mr-2" />
                        Marquer résolu
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Archive size={14} className="mr-2" />
                        Archiver
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-red-600">
                        <Trash size={14} className="mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* DRAWER DETAILS */}
      <Drawer open={!!selected} onOpenChange={() => setSelected(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Détails de l’alerte #{selected?.id}</DrawerTitle>
          </DrawerHeader>

          {selected && (
            <div className="p-4 space-y-3 text-sm">
              <p><b>Zone :</b> {selected.zone}</p>
              <p><b>Service :</b> {selected.service_type}</p>
              <p><b>Statut :</b> {selected.status}</p>
              <p><b>Description :</b> {selected.description}</p>
              <p><b>Date :</b> {selected.created_at}</p>
            </div>
          )}
        </DrawerContent>
      </Drawer>

    </div>
  )
}