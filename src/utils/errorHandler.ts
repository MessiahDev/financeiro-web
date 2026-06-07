import type { AxiosError } from 'axios'
import type { ApiError } from '../types/common.types'
 
export function parseApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response) {
    const { status, data } = error.response

    if (data && typeof data === 'object') {
      const body = data as Record<string, unknown>

      if (Array.isArray(body.notifications)) {
        const notifications = body.notifications as Array<{ key: string; message: string }>
        return {
          status,
          message: notifications.map((n) => n.message).join('. '),
          errors: Object.fromEntries(notifications.map((n) => [n.key, [n.message]])),
          correlationId: body.correlationId as string | undefined,
        }
      }

      if (typeof body.title === 'string' || typeof body.detail === 'string') {
        return {
          status,
          message: (body.detail as string) ?? (body.title as string) ?? httpMessage(status),
          correlationId: body.correlationId as string | undefined,
        }
      }

      if (body.errors && typeof body.errors === 'object') {
        const errors = body.errors as Record<string, string[]>
        const firstMessage = Object.values(errors).flat()[0] ?? httpMessage(status)
        return {
          status,
          message: firstMessage,
          errors,
        }
      }
    }
 
    return { status, message: httpMessage(status) }
  }

  if (isAxiosError(error) && error.request) {
    return {
      status: 0,
      message: 'Sem conexao com o servidor. Verifique sua internet.',
    }
  }
 
  // Erro desconhecido
  return {
    status: 500,
    message: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
  }
}
 
export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error
}
 
function httpMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Requisicao invalida.',
    401: 'Nao autorizado. Faca login novamente.',
    403: 'Voce nao tem permissao para esta acao.',
    404: 'Recurso nao encontrado.',
    409: 'Conflito: o recurso ja existe ou esta em uso.',
    422: 'Dados invalidos. Verifique os campos.',
    429: 'Muitas requisicoes. Tente novamente em instantes.',
    500: 'Erro interno do servidor.',
    502: 'Servico indisponivel.',
    503: 'Servico temporariamente indisponivel.',
  }
  return messages[status] ?? `Erro ${status}.`
}