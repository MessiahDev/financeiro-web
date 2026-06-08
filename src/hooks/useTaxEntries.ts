import { useCrud } from './useCrud'
import { taxEntriesService } from '../services/taxEntries.service'
import type { TaxEntry, CreateTaxEntryRequest } from '../types/domain.types'

export function useTaxEntries() {
  const crud = useCrud<TaxEntry, CreateTaxEntryRequest, Partial<CreateTaxEntryRequest>>({
    getAll:  (p)       => taxEntriesService.getAll(p),
    getById: (id)      => taxEntriesService.getById(id),
    create:  (d)       => taxEntriesService.create(d),
    update:  (_id, _d) => Promise.reject('not supported'),
    delete:  (id)      => taxEntriesService.delete(id),
  })

  return { ...crud, fetchTaxEntries: crud.fetchAll }
}
