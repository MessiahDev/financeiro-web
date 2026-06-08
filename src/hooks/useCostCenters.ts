// useCostCenters.ts — gerado automaticamente, implemente logica especifica conforme necessario
import { useCrud } from './useCrud'
import { CostCentersService } from '../services/CostCenters.service'
export function useCostCenters() {
  // @ts-expect-error service shape may differ slightly
  const crud = useCrud(CostCentersService)
  return { ...crud }
}
