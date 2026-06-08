import { useCrud } from './useCrud'
import {
  costCentersService,
  type UpdateCostCenterRequest,
} from '../services/costCenters.service'
import type { CostCenter, CreateCostCenterRequest } from '../types/domain.types'

export function useCostCenters() {
  const crud = useCrud<CostCenter, CreateCostCenterRequest, UpdateCostCenterRequest>(
    costCentersService,
  )

  return { ...crud, fetchCostCenters: crud.fetchAll }
}
