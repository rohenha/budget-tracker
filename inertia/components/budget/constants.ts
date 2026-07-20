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

export type Categorie = {
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

export const ICONS: Record<string, LucideIcon> = {
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

export const ICON_NAMES = Object.keys(ICONS)

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Circle
}

export function formatBudget(value: number | null): string {
  if (value === null) return '\u2014'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}
