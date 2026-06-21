import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Input } from '../../components/ui/Input/Input'
import { Select } from '../../components/ui/Select/Select'
import { Button } from '../../components/ui/Button/Button'
import { useAuthContext } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { usePreferences, type ThemeMode } from '../../contexts/PreferencesContext'
import { usersService } from '../../services/users.service'
import {
  updateNameSchema,
  changePasswordSchema,
  type UpdateNameFormData,
  type ChangePasswordFormData,
} from '../../schemas/settings.schema'

const themeOptions = [
  { value: 'light', label: 'Claro' },
  { value: 'dark',  label: 'Escuro' },
]

function ProfileForm({ name, onSubmit, isSaving }: { name: string; onSubmit: (d: UpdateNameFormData) => Promise<void>; isSaving: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateNameFormData>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="Nome" required error={errors.name?.message} {...register('name')} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving}>Salvar nome</Button>
      </div>
    </form>
  )
}

function PasswordForm({ onSubmit, isSaving }: { onSubmit: (d: ChangePasswordFormData) => Promise<void>; isSaving: boolean }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const submit = handleSubmit(async d => { await onSubmit(d); reset() })

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Input label="Senha atual" type="password" required error={errors.currentPassword?.message} {...register('currentPassword')} />
      <Input label="Nova senha" type="password" required error={errors.newPassword?.message} {...register('newPassword')} />
      <Input label="Confirmar nova senha" type="password" required error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving}>Alterar senha</Button>
      </div>
    </form>
  )
}

export default function SettingsPage() {
  const { user, updateUserName } = useAuthContext()
  const { success, error: notifyError } = useNotifications()
  const { theme, setTheme } = usePreferences()

  const [isSavingName, setIsSavingName]         = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  async function handleUpdateName(data: UpdateNameFormData) {
    setIsSavingName(true)
    try {
      await usersService.updateName(data.name)
      updateUserName(data.name)
      success('Nome atualizado!')
    } catch {
      notifyError('Erro ao atualizar nome.')
    } finally {
      setIsSavingName(false)
    }
  }

  async function handleChangePassword(data: ChangePasswordFormData) {
    setIsSavingPassword(true)
    try {
      await usersService.changePassword(data.currentPassword, data.newPassword)
      success('Senha alterada com sucesso!')
    } catch {
      notifyError('Senha atual incorreta ou erro ao alterar senha.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Configurações" subtitle="Gerencie seu perfil e preferências do sistema" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Perfil" subtitle="Atualize seu nome de exibição" />
          <CardDivider />
          <div className="flex flex-col gap-4">
            <Input label="E-mail" value={user?.email ?? ''} disabled hint="O e-mail não pode ser alterado." />
            <ProfileForm name={user?.name ?? ''} onSubmit={handleUpdateName} isSaving={isSavingName} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Segurança" subtitle="Altere sua senha de acesso" />
          <CardDivider />
          <PasswordForm onSubmit={handleChangePassword} isSaving={isSavingPassword} />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Preferências do Sistema" subtitle="Personalize a aparência do sistema" />
          <CardDivider />
          <div className="max-w-xs">
            <Select
              label="Tema"
              options={themeOptions}
              value={theme}
              onChange={e => setTheme(e.target.value as ThemeMode)}
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            A preferência é salva localmente neste navegador.
          </p>
        </Card>
      </div>
    </div>
  )
}