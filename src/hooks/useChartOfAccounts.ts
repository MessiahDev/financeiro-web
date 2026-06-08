// useChartOfAccounts.ts — gerado automaticamente, implemente logica especifica conforme necessario
import { useCrud } from './useCrud'
import { ChartOfAccountsService } from '../services/ChartOfAccounts.service'
export function useChartOfAccounts() {
  // @ts-expect-error service shape may differ slightly
  const crud = useCrud(ChartOfAccountsService)
  return { ...crud }
}
