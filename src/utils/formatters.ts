import { CURRENCY } from './constants'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.currency,
  }).format(value)
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('pt-BR')
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleString('pt-BR')
}

export function formatMonthYear(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function today(): string {
  return toISODate(new Date())
}

export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(digits[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  return remainder === parseInt(digits[10])
}

export function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '')
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false

  const calc = (d: string, factor: number) => {
    let sum = 0
    for (const char of d) {
      sum += parseInt(char) * factor--
      if (factor < 2) factor = 9
    }
    const rem = sum % 11
    return rem < 2 ? 0 : 11 - rem
  }

  return (
    calc(digits.slice(0, 12), 5) === parseInt(digits[12]) &&
    calc(digits.slice(0, 13), 6) === parseInt(digits[13])
  )
}

export function formatDocument(doc: string): string {
  const digits = doc.replace(/\D/g, '')
  if (digits.length === 11) return formatCPF(digits)
  if (digits.length === 14) return formatCNPJ(digits)
  return doc
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatVariance(value: number): string {
  const prefix = value >= 0 ? '+' : ''
  return `${prefix}${formatCurrency(value)}`
}
