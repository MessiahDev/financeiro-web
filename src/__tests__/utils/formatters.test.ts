import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  parseCurrency,
  formatDate,
  formatDateTime,
  formatMonthYear,
  toISODate,
  today,
  formatCPF,
  validateCPF,
  formatCNPJ,
  validateCNPJ,
  formatDocument,
  formatPhone,
  formatPercent,
  formatNumber,
  formatVariance,
} from '../../utils/formatters'

function normalize(s: string): string {
  return s.replace(/\u00A0/g, ' ')
}

describe('formatCurrency', () => {
  it('formata valores positivos em BRL', () => {
    expect(normalize(formatCurrency(1234.56))).toBe('R$ 1.234,56')
  })

  it('formata zero corretamente', () => {
    expect(normalize(formatCurrency(0))).toBe('R$ 0,00')
  })

  it('formata valores negativos com sinal', () => {
    expect(normalize(formatCurrency(-500))).toContain('-')
    expect(normalize(formatCurrency(-500))).toContain('500,00')
  })
})

describe('parseCurrency', () => {
  it('converte string formatada de volta para número', () => {
    expect(parseCurrency('1.234,56')).toBeCloseTo(1234.56)
  })

  it('retorna 0 para entrada vazia ou inválida', () => {
    expect(parseCurrency('')).toBe(0)
    expect(parseCurrency('abc')).toBe(0)
  })
})

describe('formatDate', () => {
  it('retorna "-" para valores nulos ou vazios', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('')).toBe('-')
  })

  it('formata uma data simples (apenas dia) corretamente', () => {
    expect(formatDate('2026-06-01')).toBe('01/06/2026')
  })

  it('NÃO perde um dia quando a string vem com timestamp (regressão)', () => {
    expect(formatDate('2026-06-01T00:00:00Z')).toBe('01/06/2026')
    expect(formatDate('2026-06-19T00:00:00.000Z')).toBe('19/06/2026')
  })

  it('preenche dia e mês com zero à esquerda quando necessário', () => {
    expect(formatDate('2026-01-05')).toBe('05/01/2026')
  })

  it('retorna "-" para datas malformadas', () => {
    expect(formatDate('data-invalida')).toBe('-')
  })
})

describe('formatDateTime', () => {
  it('retorna "-" para valores nulos ou vazios', () => {
    expect(formatDateTime(null)).toBe('-')
    expect(formatDateTime(undefined)).toBe('-')
  })

  it('retorna "-" para datas inválidas', () => {
    expect(formatDateTime('nao-e-uma-data')).toBe('-')
  })

  it('formata um timestamp válido sem lançar erro', () => {
    const result = formatDateTime('2026-06-19T22:35:55.691474Z')
    expect(result).not.toBe('-')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatMonthYear', () => {
  it('retorna "-" para valores nulos', () => {
    expect(formatMonthYear(null)).toBe('-')
  })

  it('retorna "-" para datas inválidas', () => {
    expect(formatMonthYear('invalido')).toBe('-')
  })

  it('formata mês/ano (sujeito ao bug de timezone para datas sem horário)', () => {
    const result = formatMonthYear('2026-06-15T12:00:00Z')
    expect(result).toMatch(/06\/2026/)
  })
})

describe('toISODate / today', () => {
  it('converte uma Date para o formato YYYY-MM-DD', () => {
    const date = new Date(Date.UTC(2026, 5, 19))
    expect(toISODate(date)).toBe('2026-06-19')
  })

  it('today() retorna uma string no formato YYYY-MM-DD', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('formatCPF', () => {
  it('formata um CPF de 11 dígitos', () => {
    expect(formatCPF('52998224725')).toBe('529.982.247-25')
  })

  it('remove caracteres não numéricos antes de formatar', () => {
    expect(formatCPF('529.982.247-25')).toBe('529.982.247-25')
  })

  it('retorna travessão para entrada vazia', () => {
    expect(formatCPF('')).toBe('—')
  })
})

describe('validateCPF', () => {
  it('aceita um CPF matematicamente válido', () => {
    expect(validateCPF('52998224725')).toBe(true)
    expect(validateCPF('529.982.247-25')).toBe(true)
  })

  it('rejeita um CPF com dígito verificador inválido', () => {
    expect(validateCPF('12345678900')).toBe(false)
  })

  it('rejeita CPFs com todos os dígitos iguais', () => {
    expect(validateCPF('11111111111')).toBe(false)
  })

  it('rejeita CPFs com tamanho incorreto', () => {
    expect(validateCPF('123')).toBe(false)
  })
})

describe('formatCNPJ', () => {
  it('formata um CNPJ de 14 dígitos', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81')
  })
})

describe('validateCNPJ', () => {
  it('aceita um CNPJ matematicamente válido', () => {
    expect(validateCNPJ('11222333000181')).toBe(true)
  })

  it('rejeita um CNPJ com dígito verificador inválido', () => {
    expect(validateCNPJ('12345678000100')).toBe(false)
  })

  it('rejeita CNPJs com todos os dígitos iguais', () => {
    expect(validateCNPJ('11111111111111')).toBe(false)
  })
})

describe('formatDocument', () => {
  it('formata como CPF quando tem 11 dígitos', () => {
    expect(formatDocument('52998224725')).toBe('529.982.247-25')
  })

  it('formata como CNPJ quando tem 14 dígitos', () => {
    expect(formatDocument('11222333000181')).toBe('11.222.333/0001-81')
  })

  it('retorna o valor original para tamanhos não reconhecidos', () => {
    expect(formatDocument('12345')).toBe('12345')
  })
})

describe('formatPhone', () => {
  it('formata celular com 11 dígitos', () => {
    expect(formatPhone('21998138903')).toBe('(21) 99813-8903')
  })

  it('formata telefone fixo com 10 dígitos', () => {
    expect(formatPhone('2133334444')).toBe('(21) 3333-4444')
  })

  it('retorna o valor original para tamanhos não reconhecidos', () => {
    expect(formatPhone('123')).toBe('123')
  })
})

describe('formatPercent', () => {
  it('formata com 2 casas decimais por padrão', () => {
    expect(formatPercent(12.3456)).toBe('12.35%')
  })

  it('aceita número customizado de casas decimais', () => {
    expect(formatPercent(12.3456, 0)).toBe('12%')
  })
})

describe('formatNumber', () => {
  it('formata número com separador de milhar pt-BR', () => {
    expect(normalize(formatNumber(1234.5))).toBe('1.234,50')
  })
})

describe('formatVariance', () => {
  it('adiciona sinal de + para valores positivos', () => {
    expect(normalize(formatVariance(100))).toContain('+')
  })

  it('não duplica sinal de negativo (já vem do formatCurrency)', () => {
    const result = normalize(formatVariance(-100))
    expect(result).not.toContain('+')
    expect(result).toContain('-')
  })
})