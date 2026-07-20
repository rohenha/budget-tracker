import { useState } from 'react'
import { Form } from '@adonisjs/inertia/react'
import {
  Circle,
  Home,
  Car,
  ShoppingBag,
  UtensilsCrossed,
  Heart,
  Zap,
  Wifi,
  Droplets,
  Flame,
  Gamepad2,
  Shirt,
  BookOpen,
  Pill,
  Dog,
  Gift,
  Plane,
  Tv,
  Phone,
  Train,
  Fuel,
  Banknote,
  GraduationCap,
  Baby,
  type LucideIcon,
} from 'lucide-react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'
import { cn } from '~/lib/utils'

type Categorie = {
  id: number
  userId: number
  label: string
  slug: string
  icon: string
  budget: number | null
  color: string
  createdAt: string
  updatedAt: string | null
}

const ICONS: Record<string, LucideIcon> = {
  Circle,
  Home,
  Car,
  ShoppingBag,
  UtensilsCrossed,
  Heart,
  Zap,
  Wifi,
  Droplets,
  Flame,
  Gamepad2,
  Shirt,
  BookOpen,
  Pill,
  Dog,
  Gift,
  Plane,
  Tv,
  Phone,
  Train,
  Fuel,
  Banknote,
  GraduationCap,
  Baby,
}

const ICON_NAMES = Object.keys(ICONS)

function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Circle
}

function formatBudget(value: number | null): string {
  if (value === null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

export default function Budget({ categories }: InertiaProps<{ categories: Categorie[] }>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Budget</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des catégories et budget prévisionnel
          </p>
        </div>
        {categories.length > 0 && <AddCategoryDialog open={addOpen} onOpenChange={setAddOpen} />}
      </div>
      <PageState
        empty={{
          title: 'Aucune catégorie',
          message: 'Configure tes premières catégories de dépenses',
          action: { label: 'Ajouter catégorie', onClick: () => setAddOpen(true) },
        }}
      >
        {categories.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Catégorie</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Budget mensuel</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => {
                const Icon = getIcon(cat.icon)
                return (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <Icon className="size-4" style={{ color: cat.color }} />
                    </TableCell>
                    <TableCell className="font-medium">{cat.label}</TableCell>
                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatBudget(cat.budget)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditCategoryDialog
                          categorie={cat}
                          open={editId === cat.id}
                          onOpenChange={(o) => setEditId(o ? cat.id : null)}
                        />
                        {cat.slug !== 'autre' && (
                          <DeleteCategoryDialog
                            categorie={cat}
                            open={deleteId === cat.id}
                            onOpenChange={(o) => setDeleteId(o ? cat.id : null)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </PageState>
    </div>
  )
}

function AddCategoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [icon, setIcon] = useState('Circle')
  const [search, setSearch] = useState('')
  const filtered = ICON_NAMES.filter((n) => n.toLowerCase().includes(search.toLowerCase()))
  return (
    <Form route="categories.store" onSubmit={() => onOpenChange(false)}>
      {({ errors }) => (
        <dialog
          open={open}
          onClose={() => onOpenChange(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 open:flex dark:bg-black/40"
        >
          <div className="w-[calc(100%-2rem)] max-w-lg rounded-xl border bg-popover p-4 shadow-lg max-h-[85vh] overflow-y-auto">
            <h2 className="text-base font-semibold">Ajouter une catégorie</h2>
            <p className="text-xs text-muted-foreground">Crée une nouvelle catégorie de dépenses</p>
            <div className="flex flex-col gap-4 mt-4">
              <Field>
                <FieldLabel>Nom</FieldLabel>
                <FieldContent>
                  <Input
                    name="label"
                    id="label"
                    placeholder="Alimentation"
                    aria-invalid={!!errors.label}
                  />
                  <FieldError errors={[{ message: errors.label }]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Icône</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7"
                  />
                  <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto mt-1">
                    {filtered.map((name) => {
                      const I = getIcon(name)
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setIcon(name)
                            setSearch('')
                          }}
                          className={cn(
                            'flex size-7 items-center justify-center rounded-md border transition-colors',
                            icon === name
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:bg-accent'
                          )}
                          title={name}
                        >
                          <I className="size-4" />
                        </button>
                      )
                    })}
                  </div>
                  <input type="hidden" name="icon" value={icon} />
                  <FieldError errors={[{ message: errors.icon }]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Budget mensuel (€)</FieldLabel>
                <FieldContent>
                  <Input type="number" name="budget" step="0.01" min="0" placeholder="500" />
                  <FieldError errors={[{ message: errors.budget }]} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Couleur</FieldLabel>
                <FieldContent>
                  <Input
                    type="color"
                    name="color"
                    defaultValue="#6366f1"
                    className="h-7 w-14 p-0.5"
                  />
                  <FieldError errors={[{ message: errors.color }]} />
                </FieldContent>
              </Field>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" size="sm">
                Ajouter
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </Form>
  )
}

function EditCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: Categorie
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const Icon = getIcon(categorie.icon)
  return (
    <Form
      route="categories.update"
      routeParams={{ id: categorie.id }}
      onSubmit={() => onOpenChange(false)}
    >
      {() => (
        <dialog
          open={open}
          onClose={() => onOpenChange(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 open:flex dark:bg-black/40"
        >
          <div className="w-[calc(100%-2rem)] max-w-lg rounded-xl border bg-popover p-4 shadow-lg max-h-[85vh] overflow-y-auto">
            <h2 className="text-base font-semibold">Modifier {categorie.label}</h2>
            <p className="text-xs text-muted-foreground">Modifie les paramètres de la catégorie</p>
            <div className="flex flex-col gap-4 mt-4">
              <Field>
                <FieldLabel>Nom</FieldLabel>
                <FieldContent>
                  <Input name="label" id="label" defaultValue={categorie.label} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Budget mensuel (€)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name="budget"
                    step="0.01"
                    min="0"
                    defaultValue={categorie.budget ?? ''}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Couleur</FieldLabel>
                <FieldContent>
                  <Input
                    type="color"
                    name="color"
                    defaultValue={categorie.color}
                    className="h-7 w-14 p-0.5"
                  />
                </FieldContent>
              </Field>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <div className="flex items-center gap-1 mr-auto">
                <Icon className="size-4" style={{ color: categorie.color }} />
                <span className="text-xs text-muted-foreground">{categorie.icon}</span>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" size="sm">
                Enregistrer
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </Form>
  )
}

function DeleteCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: Categorie
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Form
      route="categories.destroy"
      routeParams={{ id: categorie.id }}
      onSubmit={() => onOpenChange(false)}
    >
      {() => (
        <dialog
          open={open}
          onClose={() => onOpenChange(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 open:flex dark:bg-black/40"
        >
          <div className="w-[calc(100%-2rem)] max-w-sm rounded-xl border bg-popover p-4 shadow-lg">
            <h2 className="text-base font-semibold">Supprimer {categorie.label} ?</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Les dépenses liées seront réaffectées à la catégorie "Autre".
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="destructive" size="sm">
                Supprimer
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </Form>
  )
}
