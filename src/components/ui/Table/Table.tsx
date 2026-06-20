import { Spinner } from '../Spinner/Spinner'
import { EmptyState } from '../EmptyState/EmptyState'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  className?: string
}

export function Table<T>({
  columns,
  data = [],
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  onRowClick,
  className = '',
}: TableProps<T>) {
  return (
    <div className={['w-full overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900', className].join(' ')}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400',
                  col.headerClassName ?? '',
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                  <Spinner size="lg" className="text-blue-500" />
                  <span className="text-sm">Carregando...</span>
                </div>
              </td>
            </tr>
          ) : (data?.length ?? 0) === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={[
                  'border-b border-slate-100 last:border-0 dark:border-slate-800',
                  'transition-colors duration-100',
                  onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : '',
                ].join(' ')}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={['px-4 py-3 text-slate-700 dark:text-slate-300', col.className ?? ''].join(' ')}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}