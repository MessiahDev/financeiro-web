import { useEffect, useState, useCallback } from 'react'
import { History } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Button } from '../../components/ui/Button/Button'
import { Badge } from '../../components/ui/Badge/Badge'
import { Modal } from '../../components/ui/Modal/Modal'
import { Select } from '../../components/ui/Select/Select'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAuthContext } from '../../contexts/AuthContext'
import { usersService } from '../../services/users.service'
import { formatDateTime } from '../../utils/formatters'
import { UserRole } from '../../types/enums'
import type { UserSummary, UserAuditLog } from '../../types/domain.types'

const roleLabel: Record<string, string> = {
  Admin: 'Administrador',
  Manager: 'Gerente',
  Employee: 'Funcionário',
}

const roleOptions = [
  { value: UserRole.Employee, label: 'Funcionário' },
  { value: UserRole.Manager,  label: 'Gerente' },
  { value: UserRole.Admin,    label: 'Administrador' },
]

const actionLabel: Record<string, string> = {
  RoleChanged: 'Nível alterado',
  Activated: 'Conta ativada',
  Deactivated: 'Conta desativada',
}

export default function UserManagementPage() {
  const { user: currentUser } = useAuthContext()
  const { success, error: notifyError } = useNotifications()

  const [users, setUsers] = useState<UserSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [roleTarget, setRoleTarget] = useState<UserSummary | null>(null)
  const [newRole, setNewRole] = useState('')

  const [toggleTarget, setToggleTarget] = useState<UserSummary | null>(null)

  const [auditOpen, setAuditOpen] = useState(false)
  const [auditLogs, setAuditLogs] = useState<UserAuditLog[]>([])
  const [isLoadingAudit, setIsLoadingAudit] = useState(false)

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await usersService.getAll()
      setUsers(data)
    } catch {
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  const openAuditLog = async () => {
    setAuditOpen(true)
    setIsLoadingAudit(true)
    try {
      const logs = await usersService.getAuditLog()
      setAuditLogs(logs)
    } catch {
      setAuditLogs([])
    } finally {
      setIsLoadingAudit(false)
    }
  }

  const handleChangeRole = async () => {
    if (!roleTarget || !newRole) return
    setIsSaving(true)
    try {
      await usersService.changeRole(roleTarget.id, newRole)
      success('Nível de acesso atualizado!')
      setRoleTarget(null)
      loadUsers()
    } catch {
      notifyError('Erro ao atualizar nível de acesso.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async () => {
    if (!toggleTarget) return
    setIsSaving(true)
    try {
      if (toggleTarget.isActive) {
        await usersService.deactivate(toggleTarget.id)
        success('Usuário desativado.')
      } else {
        await usersService.activate(toggleTarget.id)
        success('Usuário ativado.')
      }
      setToggleTarget(null)
      loadUsers()
    } catch {
      notifyError('Erro ao alterar status do usuário.')
    } finally {
      setIsSaving(false)
    }
  }

  const columns: Column<UserSummary>[] = [
    { key: 'name', header: 'Nome', render: r => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-900 dark:text-slate-100">{r.name}</span>
        {r.id === currentUser?.id && <Badge variant="info">Você</Badge>}
      </div>
    )},
    { key: 'email', header: 'E-mail' },
    { key: 'role', header: 'Nível', render: r => (
      <Badge variant={r.role === 'Admin' ? 'purple' : r.role === 'Manager' ? 'info' : 'default'}>
        {roleLabel[r.role] ?? r.role}
      </Badge>
    )},
    { key: 'isActive', header: 'Status', render: r => (
      <Badge variant={r.isActive ? 'success' : 'danger'} dot>
        {r.isActive ? 'Ativo' : 'Inativo'}
      </Badge>
    )},
    { key: 'createdAt', header: 'Criado em', render: r => formatDateTime(r.createdAt) },
    { key: 'actions', header: '', headerClassName: 'w-64', render: r => (
      <div className="flex justify-end gap-1">
        <Button
          size="sm" variant="ghost"
          onClick={() => { setRoleTarget(r); setNewRole(String(roleOptions.find(o => o.value === r.role || roleLabel[r.role] === o.label)?.value ?? '')) }}
        >
          Mudar nível
        </Button>
        {r.id !== currentUser?.id && (
          <Button
            size="sm" variant="ghost"
            className={r.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
            onClick={() => setToggleTarget(r)}
          >
            {r.isActive ? 'Desativar' : 'Ativar'}
          </Button>
        )}
      </div>
    )},
  ]

  const auditColumns: Column<UserAuditLog>[] = [
    { key: 'createdAt', header: 'Data', render: r => formatDateTime(r.createdAt) },
    { key: 'targetUserName', header: 'Usuário afetado', render: r => <span className="font-medium">{r.targetUserName}</span> },
    { key: 'action', header: 'Ação', render: r => <Badge variant="default">{actionLabel[r.action] ?? r.action}</Badge> },
    { key: 'change', header: 'Mudança', render: r => (
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {r.oldValue ?? '—'} → {r.newValue ?? '—'}
      </span>
    )},
    { key: 'changedByUserName', header: 'Realizado por' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gerenciar Usuários"
        subtitle={`${users.length} usuário${users.length !== 1 ? 's' : ''} cadastrado${users.length !== 1 ? 's' : ''}`}
        actions={
          <Button variant="secondary" leftIcon={<History size={16} />} onClick={openAuditLog}>
            Log de Auditoria
          </Button>
        }
      />

      <Table columns={columns} data={users} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum usuário cadastrado." />

      <Modal
        isOpen={!!roleTarget}
        onClose={() => setRoleTarget(null)}
        title={`Alterar nível — ${roleTarget?.name}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoleTarget(null)} disabled={isSaving}>Cancelar</Button>
            <Button isLoading={isSaving} onClick={handleChangeRole}>Salvar</Button>
          </>
        }
      >
        <Select
          label="Nível de acesso"
          options={roleOptions}
          value={newRole}
          onChange={e => setNewRole(e.target.value)}
        />
      </Modal>

      <Modal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        title={toggleTarget?.isActive ? 'Desativar usuário' : 'Ativar usuário'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setToggleTarget(null)} disabled={isSaving}>Cancelar</Button>
            <Button
              variant={toggleTarget?.isActive ? 'danger' : 'success'}
              isLoading={isSaving}
              onClick={handleToggleActive}
            >
              {toggleTarget?.isActive ? 'Desativar' : 'Ativar'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {toggleTarget?.isActive
            ? `Tem certeza que deseja desativar "${toggleTarget?.name}"? O usuário perderá acesso ao sistema imediatamente.`
            : `Tem certeza que deseja reativar "${toggleTarget?.name}"? O acesso será restaurado.`}
        </p>
      </Modal>

      <Modal isOpen={auditOpen} onClose={() => setAuditOpen(false)} title="Log de Auditoria" size="xl">
        <Table
          columns={auditColumns}
          data={auditLogs}
          keyExtractor={r => r.id}
          isLoading={isLoadingAudit}
          emptyMessage="Nenhum registro de auditoria ainda."
        />
      </Modal>
    </div>
  )
}