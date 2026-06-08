import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card } from '../../components/ui/Card/Card'
import { ROUTES } from '../../router/routes'

const reports = [
  { title: 'Resumo Financeiro',    description: 'Receitas, despesas, resultado e saldo por periodo.', icon: '💹', path: ROUTES.REPORTS_FINANCIAL_SUMMARY },
  { title: 'Balancete de Verificacao', description: 'Saldos devedores e credores por conta contabil.',    icon: '⚖',  path: ROUTES.REPORTS_TRIAL_BALANCE },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Relatorios" subtitle="Selecione um relatorio para visualizar" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map(r => (
          <Link key={r.path} to={r.path} className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">{r.icon}</div>
                <div>
                  <p className="font-display font-semibold text-slate-900">{r.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{r.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
