import { test } from '@japa/runner'
import { formatPaginationMeta } from '../../inertia/lib/pagination.js'

test.group('formatPaginationMeta', () => {
  test('returns correct metadata for single page', ({ assert }) => {
    const result = formatPaginationMeta({ current_page: 1, last_page: 1 })
    assert.equal(result.currentPage, 1)
    assert.equal(result.lastPage, 1)
    assert.lengthOf(result.pages, 1)
    assert.isTrue(result.pages[0].isActive)
    assert.equal(result.pages[0].page, 1)
  })

  test('marks only current page as active', ({ assert }) => {
    const result = formatPaginationMeta({ current_page: 2, last_page: 5 })
    const activePage = result.pages.find((p) => p.isActive)
    assert.isDefined(activePage)
    assert.equal(activePage!.page, 2)
    const inactiveCount = result.pages.filter((p) => !p.isActive).length
    assert.equal(inactiveCount, 4)
  })

  test('generates correct pages for 5 pages', ({ assert }) => {
    const result = formatPaginationMeta({ current_page: 3, last_page: 5 })
    assert.lengthOf(result.pages, 5)
    result.pages.forEach((p, i) => assert.equal(p.page, i + 1))
  })

  test('returns correct currentPage and lastPage', ({ assert }) => {
    const result = formatPaginationMeta({ current_page: 4, last_page: 10 })
    assert.equal(result.currentPage, 4)
    assert.equal(result.lastPage, 10)
  })

  test('returns empty pages array if last_page is 0', ({ assert }) => {
    const result = formatPaginationMeta({ current_page: 0, last_page: 0 })
    assert.lengthOf(result.pages, 0)
  })

  test('page 1 is active when current_page is 1', ({ assert }) => {
    const result = formatPaginationMeta({ current_page: 1, last_page: 3 })
    assert.isTrue(result.pages[0].isActive)
    assert.isFalse(result.pages[1].isActive)
    assert.isFalse(result.pages[2].isActive)
  })
})
