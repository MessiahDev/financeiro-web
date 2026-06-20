import { Link } from 'react-router-dom'
import { TrendingUp, Scale } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card } from '../../components/ui/Card/Card'
import { ROUTES } from '../../router/routes'

const reports = [
  { title: 'Resumo Financeiro',        description: 'Receitas, despesas, resultado e saldo por período.', icon: TrendingUp, path: ROUTES.REPORTS_FINANCIAL_SUMMARY },
  { title: 'Balancete de Verificação', description: 'Saldos devedores e credores por conta contábil.',    icon: Scale,      path: ROUTES.REPORTS_TRIAL_BALANCE },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Relatórios" subtitle="Selecione um relatório para visualizar" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map(r => {
          const Icon = r.icon
          return (
            <Link key={r.path} to={r.path} className="block">
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-slate-900 dark:text-slate-100">{r.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{r.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}