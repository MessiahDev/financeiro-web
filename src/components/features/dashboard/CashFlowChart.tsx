import { useId } from 'react'
import { Card, CardHeader } from '../../ui/Card/Card'
import { EmptyState } from '../../ui/EmptyState/EmptyState'
import { formatCurrency } from '../../../utils/formatters'
import type { MonthlyTrend } from '../../../types/domain.types'

interface CashFlowChartProps {
  data:      MonthlyTrend[]
  isLoading?: boolean
}

const MONTH_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  if (!y || !m) return ym
  return `${MONTH_ABBR[m - 1]}/${String(y).slice(2)}`
}

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midX = (p0.x + p1.x) / 2
    d += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`
  }
  return d
}

function areaPath(points: { x: number; y: number }[], baselineY: number): string {
  if (points.length < 2) return ''
  const line = smoothPath(points)
  const first = points[0]
  const last = points[points.length - 1]
  return `${line} L ${last.x},${baselineY} L ${first.x},${baselineY} Z`
}

export function CashFlowChart({ data, isLoading = false }: CashFlowChartProps) {
  const gradId = useId()
  const creditsGradId = `credits-${gradId}`
  const debitsGradId  = `debits-${gradId}`

  if (isLoading) {
    return (
      <Card padding="none">
        <div className="px-5 pt-5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardHeader title="Fluxo de Caixa" subtitle="Últimos 6 meses" />
        </div>
        <div className="px-5 pt-4 pb-5">
          <div className="h-64 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card padding="none">
        <div className="px-5 pt-5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <CardHeader title="Fluxo de Caixa" subtitle="Últimos 6 meses" />
        </div>
        <div className="py-10">
          <EmptyState message="Ainda não há dados suficientes." description="Transações aparecerão aqui assim que forem registradas." />
        </div>
      </Card>
    )
  }

  const W = 700, H = 260
  const padLeft = 12, padRight = 12, padTop = 20, padBottom = 32
  const plotW = W - padLeft - padRight
  const plotH = H - padTop - padBottom
  const baselineY = padTop + plotH

  const maxValue = Math.max(...data.flatMap(d => [d.credits, d.debits]), 1)
  const stepX = data.length > 1 ? plotW / (data.length - 1) : 0

  const x = (i: number) => padLeft + i * stepX
  const y = (val: number) => padTop + (1 - val / maxValue) * plotH

  const creditsPoints = data.map((d, i) => ({ x: x(i), y: y(d.credits) }))
  const debitsPoints  = data.map((d, i) => ({ x: x(i), y: y(d.debits) }))

  const last = data[data.length - 1]
  const prev = data.length > 1 ? data[data.length - 2] : null
  const trendPct = prev && prev.netBalance !== 0
    ? ((last.netBalance - prev.netBalance) / Math.abs(prev.netBalance)) * 100
    : null

  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardHeader title="Fluxo de Caixa" subtitle="Últimos 6 meses" />
          {trendPct !== null && (
            <span className={[
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
              trendPct >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
            ].join(' ')}>
              {trendPct >= 0 ? '↑' : '↓'} {Math.abs(trendPct).toFixed(1)}% vs mês anterior
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 pb-5">
        <div className="mb-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />Receitas
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Despesas
          </span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet" aria-label="Gráfico de fluxo de caixa">
          <defs>
            <linearGradient id={creditsGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={debitsGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((f) => (
            <line key={f} x1={padLeft} x2={W - padRight} y1={padTop + plotH * f} y2={padTop + plotH * f} stroke="#f1f5f9" strokeWidth={1} />
          ))}

          {data.length > 1 && (
            <>
              <path d={areaPath(debitsPoints, baselineY)} fill={`url(#${debitsGradId})`} />
              <path d={areaPath(creditsPoints, baselineY)} fill={`url(#${creditsGradId})`} />
              <path d={smoothPath(debitsPoints)} fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeLinecap="round" />
              <path d={smoothPath(creditsPoints)} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" />
            </>
          )}

          {data.map((d, i) => (
            <g key={d.month}>
              <circle cx={x(i)} cy={y(d.credits)} r={3} fill="#2563eb">
                <title>{`${monthLabel(d.month)} — Receitas: ${formatCurrency(d.credits)}`}</title>
              </circle>
              <circle cx={x(i)} cy={y(d.debits)} r={3} fill="#f43f5e">
                <title>{`${monthLabel(d.month)} — Despesas: ${formatCurrency(d.debits)}`}</title>
              </circle>
              <text x={x(i)} y={H - 10} textAnchor="middle" fontSize={11} fill="#94a3b8">
                {monthLabel(d.month)}
              </text>
            </g>
          ))}

          {data.length > 0 && (
            <>
              <circle cx={x(data.length - 1)} cy={y(last.credits)} r={6} fill="none" stroke="#fff" strokeWidth={3} />
              <circle cx={x(data.length - 1)} cy={y(last.credits)} r={4.5} fill="#2563eb" />
              <circle cx={x(data.length - 1)} cy={y(last.debits)} r={6} fill="none" stroke="#fff" strokeWidth={3} />
              <circle cx={x(data.length - 1)} cy={y(last.debits)} r={4.5} fill="#f43f5e" />
            </>
          )}
        </svg>
      </div>
    </Card>
  )
}