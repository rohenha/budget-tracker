type PageMeta = {
  page: number
  isActive: boolean
}

type PaginationMeta = {
  currentPage: number
  lastPage: number
  pages: PageMeta[]
}

export function formatPaginationMeta(meta: {
  current_page: number
  last_page: number
}): PaginationMeta {
  const pages: PageMeta[] = []
  for (let i = 1; i <= meta.last_page; i++) {
    pages.push({ page: i, isActive: i === meta.current_page })
  }
  return {
    currentPage: meta.current_page,
    lastPage: meta.last_page,
    pages,
  }
}
