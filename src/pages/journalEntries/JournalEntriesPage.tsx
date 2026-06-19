import { useEffect, useState, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Select } from '../../components/ui/Select/Select'
import { Button } from '../../components/ui/Button/Button'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { JournalEntryStatusBadge } from '../../components/features/journalEntries/JournalEntryStatusBadge'
import { journalEntriesService } from '../../services/journalEntries.service'
import { accountingPeriodsService } from '../../services/accountingPeriods.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import type { JournalEntry, AccountingPeriod } from '../../types/domain.types'

export default function JournalEntriesPage() {
  const { success, error: notifyError } = useNotifications()

  const [periods, setPeriods]               = useState<AccountingPeriod[]>([])
  const [selectedPeriodId, setSelectedPeriodId] = useState('')
  const [items, setItems]                   = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading]           = useState(false)
  const [isSaving, setIsSaving]             = useState(false)
  const [postTarget, setPostTarget]         = useState<JournalEntry | null>(null)
  const [reverseTarget, setReverseTarget]   = useState<JournalEntry | null>(null)

  const loadEntries = useCallback(async (periodId: string) => {
    if (!periodId) {
      setItems([])
      return
    }
    setIsLoading(true)
    try {
      const result = await journalEntriesService.getAll({ accountingPeriodId: periodId })
      setItems(result.items ?? [])
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    accountingPeriodsService.getAll().then(r => {
      const list = r.items ?? []
      setPeriods(list)
      if (list.length > 0) {
        const defaultPeriod = list.find(p => p.status === 'Open') ?? list[0]
        setSelectedPeriodId(defaultPeriod.id)
      }
    })
  }, [])

  useEffect(() => {
    if (selectedPeriodId) loadEntries(selectedPeriodId)
  }, [selectedPeriodId, loadEntries])

  const periodOptions = periods.map(p => ({ value: p.id, label: p.name }))

  const totalCount = items.length

  const columns: Column<JournalEntry>[] = [
    { key: 'entryDate',            header: 'Data',      render: r => formatDate(r.entryDate) },
    { key: 'description',          header: 'Descrição', render: r => <span className="font-medium">{r.description}</span> },
    { key: 'accountingPeriodName', header: 'Período' },
    { key: 'totalDebits',          header: 'Débito',    render: r => formatCurrency(r.totalDebits) },
    { key: 'totalCredits',         header: 'Crédito',   render: r => formatCurrency(r.totalCredits) },
    { key: 'status',               header: 'Status',    render: r => <JournalEntryStatusBadge status={r.status} /> },
    { key: 'actions',              header: '', render: r => (
      <div className="flex justify-end gap-1">
        {r.status === 'Draft'  && <Button size="sm" variant="ghost" onClick={() => setPostTarget(r)}>Lançar</Button>}
        {r.status === 'Posted' && <Button size="sm" variant="ghost" onClick={() => setReverseTarget(r)} className="text-amber-600 hover:bg-amber-50">Estornar</Button>}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Lançamentos Contábeis" subtitle={`${totalCount} lançamento${totalCount !== 1 ? 's' : ''}`} />

      <div className="max-w-xs">
        <Select
          label="Período Contábil"
          options={periodOptions}
          placeholder="Selecione um período..."
          value={selectedPeriodId}
          onChange={e => setSelectedPeriodId(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={items}
        keyExtractor={r => r.id}
        isLoading={isLoading}
        emptyMessage={selectedPeriodId ? "Nenhum lançamento neste período." : "Selecione um período contábil."}
      />

      <ConfirmModal isOpen={!!postTarget} onClose={() => setPostTarget(null)}
        onConfirm={async () => {
          setIsSaving(true)
          try {
            await journalEntriesService.postEntry(postTarget!.id)
            success('Lançado!')
            setPostTarget(null)
            loadEntries(selectedPeriodId)
          } catch { notifyError('Erro.') } finally { setIsSaving(false) }
        }}
        title="Lançar entrada" message={`Deseja lançar "${postTarget?.description}"? Esta ação não pode ser desfeita.`} confirmLabel="Lançar" variant="primary" isLoading={isSaving} />

      <ConfirmModal isOpen={!!reverseTarget} onClose={() => setReverseTarget(null)}
        onConfirm={async () => {
          setIsSaving(true)
          try {
            await journalEntriesService.reverse(reverseTarget!.id)
            success('Estornado!')
            setReverseTarget(null)
            loadEntries(selectedPeriodId)
          } catch { notifyError('Erro.') } finally { setIsSaving(false) }
        }}
        title="Estornar lançamento" message={`Estornar "${reverseTarget?.description}"?`} confirmLabel="Estornar" isLoading={isSaving} />
    </div>
  )
}