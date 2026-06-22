import { Outlet } from 'react-router-dom'
import { ArrowLeftRight, BookText, Wallet, TrendingUp } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Panel esquerdo — branding */}
      <div className="hidden lg:flex lg:w-[480px] lg:flex-col lg:justify-between bg-slate-900 p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-display text-base font-bold text-white">
            K
          </div>
          <span className="font-display text-lg font-semibold text-white">Kyros</span>
        </div>

        <div>
          <h2 className="font-display text-3xl font-semibold leading-tight text-white">
            Gestao financeira{' '}
            <span className="text-blue-400">completa</span>{' '}
            para sua empresa
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Controle contas, lancamentos, folha de pagamento e relatorios em um unico lugar.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: 'Contas a pagar/receber', icon: ArrowLeftRight },
              { label: 'Lancamentos contabeis',  icon: BookText },
              { label: 'Folha de pagamento',     icon: Wallet },
              { label: 'Relatorios gerenciais',  icon: TrendingUp },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2.5">
                  <Icon size={16} className="text-blue-400 shrink-0" />
                  <span className="text-xs text-slate-300">{f.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Financeiro. Todos os direitos reservados.
        </p>
      </div>

      {/* Panel direito — form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm animate-in">
          <Outlet />
        </div>
      </div>
    </div>
  )
}