// =============================================================================
// CashFlowChart.tsx — grafico simples de barras SVG (sem dependencia externa)
// =============================================================================

import { Card, CardHeader } from '../../ui/Card/Card'
import { formatCurrency } from '../../../utils/formatters'

interface CashFlowEntry {
  month:    string   // ex: "Jan", "Fev"
  revenue:  number
  expense:  number
}

interface CashFlowChartProps {
  data: CashFlowEntry[]
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.flatMap((d) => [d.revenue, d.expense]), 1)
  const chartH   = 140
  const barW     = 18
  const gap      = 8
  const groupW   = barW * 2 + gap + 16
  const svgW     = Math.max(data.length * groupW + 32, 300)

  function barHeight(val: number) {
    return Math.max((val / maxValue) * chartH, 2)
  }

  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-2 border-b border-slate-100">
        <CardHeader title="Fluxo de Caixa" subtitle="Receitas vs Despesas" />
      </div>

      <div className="overflow-x-auto px-5 pt-4 pb-5">
        {/* Legenda */}
        <div className="mb-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />Receitas
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />Despesas
          </span>
        </div>

        <svg width={svgW} height={chartH + 28} aria-label="Grafico de fluxo de caixa">
          {data.map((entry, i) => {
            const x      = 16 + i * groupW
            const revH   = barHeight(entry.revenue)
            const expH   = barHeight(entry.expense)
            const revY   = chartH - revH
            const expY   = chartH - expH
            const labelX = x + barW + gap / 2

            return (
              <g key={entry.month}>
                {/* Receita */}
                <rect
                  x={x} y={revY} width={barW} height={revH}
                  rx={3} fill="#3b82f6" opacity={0.85}
                >
                  <title>{`Receita: ${formatCurrency(entry.revenue)}`}</title>
                </rect>

                {/* Despesa */}
                <rect
                  x={x + barW + gap} y={expY} width={barW} height={expH}
                  rx={3} fill="#f87171" opacity={0.85}
                >
                  <title>{`Despesa: ${formatCurrency(entry.expense)}`}</title>
                </rect>

                {/* Label mes */}
                <text
                  x={labelX} y={chartH + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#94a3b8"
                >
                  {entry.month}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </Card>
  )
}
