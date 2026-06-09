import { useCrud } from './useCrud'
import { costCentersService } from '../services/costCenters.service'

export function useCostCenters() {
  return useCrud(costCentersService)
}