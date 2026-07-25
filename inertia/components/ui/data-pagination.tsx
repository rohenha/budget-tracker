import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'

export type PaginationSource = {
  previousPage: string | null
  nextPage: string | null
  currentPage: number
  links: Array<{ url: string; page: number; isActive: boolean }>
}

type DataPaginationProps = {
  pagination: PaginationSource
  onPageChange: (page: number) => React.MouseEventHandler
}

export default function DataPagination({ pagination, onPageChange }: DataPaginationProps) {
  if (pagination.links.length <= 1) return null

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        {pagination.previousPage && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={onPageChange(pagination.currentPage - 1)} />
          </PaginationItem>
        )}
        {pagination.links.map((item) => (
          <PaginationItem key={item.page}>
            <PaginationLink isActive={item.isActive} href="#" onClick={onPageChange(item.page)}>
              {item.page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {pagination.nextPage && (
          <PaginationItem>
            <PaginationNext href="#" onClick={onPageChange(pagination.currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
