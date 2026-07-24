import { type CategorySpending } from '~/components/budget/category_pie_chart'
import DeleteDialog from '~/components/shared/delete_dialog'

export default function DeleteCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: CategorySpending
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      route="categories.destroy"
      routeParams={{ id: categorie.categorieId }}
      entityName={categorie.label}
      message="Les dépenses liées seront réaffectées à la catégorie Autre."
    />
  )
}
