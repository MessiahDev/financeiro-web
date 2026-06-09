interface Props {
  startDate:       string
  endDate:         string
  onStartDate:     (v: string) => void
  onEndDate:       (v: string) => void
  onApply:         () => void
  isLoading?:      boolean
}

export function ReportFilters({ startDate, endDate, onStartDate, onEndDate, onApply, isLoading }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Data inicial</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDate(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Data final</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDate(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={onApply}
        disabled={isLoading}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white
                   hover:bg-blue-500 disabled:opacity-60 transition-colors"
      >
        {isLoading ? 'Carregando…' : 'Aplicar Filtros'}
      </button>
    </div>
  )
}