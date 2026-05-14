import type { Zone } from '@/api/zone/getAll.zone.api'
import { useGetZones} from '@/api/zone/getAll.zone.api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/(app)/_layout/zone')({
  component: RouteComponent,
})

type ZoneStatus = 'NORMAL' | 'MEDIUM' | 'CRITICAL'
type ZoneFilter = 'ALL' | ZoneStatus

type ZoneDisplay = {
  id: string
  name: string
  status: ZoneStatus
  image: string
}

const zoneImages = [
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
]

const statusStyles: Record<ZoneStatus, string> = {
  NORMAL: 'bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/25',
  MEDIUM: 'bg-orange-500/15 text-orange-500 ring-1 ring-orange-500/25',
  CRITICAL: 'bg-red-500/15 text-red-500 ring-1 ring-red-500/25',
}

const statusDots: Record<ZoneStatus, string> = {
  NORMAL: 'bg-emerald-500',
  MEDIUM: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
}

const zoneTabs: { label: string; value: ZoneFilter }[] = [
  { label: 'Toutes', value: 'ALL' },
  { label: 'Normal', value: 'NORMAL' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Critical', value: 'CRITICAL' },
]

const zonesPerPage = 8

function RouteComponent() {
  const { data: apiZones = [], isLoading, error } = useGetZones()
  const [zones, setZones] = useState<ZoneDisplay[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [zoneToDelete, setZoneToDelete] = useState<ZoneDisplay | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<ZoneFilter>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [form, setForm] = useState({ name: '' })

  // Transform API data to display format
  useEffect(() => {
    if (apiZones.length > 0) {
      const displayZones = apiZones.map((zone, index) => ({
        id: zone.id,
        name: zone.quartier,
        status: 'NORMAL' as ZoneStatus,
        image: zoneImages[index % zoneImages.length],
      }))
      setZones(displayZones)
    }
  }, [apiZones])

  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesSearch = zone.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim())
      const matchesTab = activeTab === 'ALL' || zone.status === activeTab

      return matchesSearch && matchesTab
    })
  }, [activeTab, searchQuery, zones])

  const totalPages = Math.max(1, Math.ceil(filteredZones.length / zonesPerPage))
  const page = Math.min(currentPage, totalPages)
  const paginatedZones = filteredZones.slice(
    (page - 1) * zonesPerPage,
    page * zonesPerPage,
  )

  const resetForm = () => {
    setForm({ name: '' })
  }

  const handleAddZone = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) return

    const nextZone: ZoneDisplay = {
      id: String(Math.max(0, ...zones.map((zone) => parseInt(zone.id))) + 1),
      name: form.name.trim(),
      status: 'NORMAL',
      image: zoneImages[zones.length % zoneImages.length],
    }

    setZones((currentZones) => [nextZone, ...currentZones])
    setCurrentPage(1)
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDeleteZone = (id: string) => {
    setZones((currentZones) => currentZones.filter((zone) => zone.id !== id))
    setZoneToDelete(null)
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
          <p className='text-muted-foreground'>Chargement des zones...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-[calc(100vh-4rem)] space-y-6 bg-background text-foreground'>
        <Card className='border-destructive/50'>
          <CardContent className='flex min-h-40 items-center justify-center text-center text-sm text-destructive'>
            Erreur lors du chargement des zones. Veuillez réessayer.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] space-y-6 bg-background text-foreground'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
            Zones urbaines
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Surveillance et gestion des secteurs de la ville
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            type='button'
            className='w-full gap-2 sm:w-auto'
            size='lg'
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className='size-4' />
            Ajouter une zone
          </Button>

          <DialogContent className='sm:max-w-lg'>
            <form onSubmit={handleAddZone} className='space-y-6'>
              <DialogHeader>
                <DialogTitle className='text-xl'>Ajouter une zone</DialogTitle>
                <DialogDescription>
                  Enregistrez une nouvelle zone de surveillance urbaine.
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-2'>
                <Label htmlFor='name'>Nom de la zone</Label>
                <Input
                  id='name'
                  value={form.name}
                  onChange={(event) =>
                    setForm({ name: event.target.value })
                  }
                  placeholder='Ex: Tanambao'
                  required
                />
              </div>

              <DialogFooter>
                <DialogClose>
                  <Button type='button' variant='outline' onClick={resetForm}>
                    Annuler
                  </Button>
                </DialogClose>
                <Button type='submit'>Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-2.5 shadow-sm lg:flex-row lg:items-center lg:justify-between'>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as ZoneFilter)
            setCurrentPage(1)
          }}
          className='min-w-0 gap-0'
        >
          <TabsList className='h-auto w-full justify-start overflow-x-auto rounded-full bg-muted/70 p-1 sm:w-fit'>
            {zoneTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='h-8 rounded-full px-3 text-xs sm:px-4'
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className='relative w-full lg:max-w-sm'>
          <Search className='absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            className='h-10 rounded-full pl-10'
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setCurrentPage(1)
            }}
            placeholder='Rechercher une zone...'
          />
        </div>
      </div>

      <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {paginatedZones.map((zone) => (
          <Card
            key={zone.id}
            className='group border-border/60 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10'
          >
            <div className='relative h-44 overflow-hidden rounded-t-xl'>
              <img
                src={zone.image}
                alt={zone.name}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/35' />
              <div className='absolute left-4 top-4'>
                <Badge className={statusStyles[zone.status]}>
                  <span
                    className={`size-2 rounded-full ${statusDots[zone.status]}`}
                  />
                  {zone.status}
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className='absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm ring-1 ring-border backdrop-blur transition-colors hover:bg-background'>
                  <MoreHorizontal className='size-4' />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-44'>
                  <DropdownMenuLabel>Actions zone</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Edit3 className='size-4' />
                      Modifier
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant='destructive'
                    onClick={() => setZoneToDelete(zone)}
                  >
                    <Trash2 className='size-4' />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardContent className='space-y-4 p-4'>
              <div className='min-w-0'>
                <h2 className='truncate text-base font-semibold'>
                  {zone.name}
                </h2>
                <p className='mt-1 flex items-center gap-1.5 text-sm text-muted-foreground'>
                  <MapPin className='size-4 text-primary' />
                  Zone #{zone.id.toString().padStart(3, '0')}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <Button variant='outline' size='icon-sm' aria-label='Modifier'>
                  <Edit3 className='size-4' />
                </Button>
                <Button
                  variant='outline'
                  size='icon-sm'
                  className='text-destructive hover:text-destructive'
                  onClick={() => setZoneToDelete(zone)}
                  aria-label='Supprimer'
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {filteredZones.length === 0 && (
        <Card className='border-border/60'>
          <CardContent className='flex min-h-40 items-center justify-center text-center text-sm text-muted-foreground'>
            Aucune zone ne correspond à votre recherche.
          </CardContent>
        </Card>
      )}

      {filteredZones.length > 0 && (
        <div className='flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-muted-foreground'>
            Page {page} sur {totalPages} - {filteredZones.length} zone
            {filteredZones.length > 1 ? 's' : ''}
          </p>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={page === 1}
              onClick={() => setCurrentPage((current) => current - 1)}
            >
              <ChevronLeft className='size-4' />
              Précédent
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1

              return (
                <Button
                  key={pageNumber}
                  variant={page === pageNumber ? 'default' : 'outline'}
                  size='icon-sm'
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              )
            })}
            <Button
              variant='outline'
              size='sm'
              disabled={page === totalPages}
              onClick={() => setCurrentPage((current) => current + 1)}
            >
              Suivant
              <ChevronRight className='size-4' />
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={zoneToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setZoneToDelete(null)
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer la zone{' '}
              <span className='font-medium text-foreground'>
                {zoneToDelete?.name}
              </span>
              ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setZoneToDelete(null)}
            >
              Annuler
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={() => {
                if (zoneToDelete) handleDeleteZone(zoneToDelete.id)
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
