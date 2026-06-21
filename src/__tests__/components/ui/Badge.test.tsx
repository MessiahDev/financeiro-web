import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../../../components/ui/Badge/Badge'

describe('Badge', () => {
  it('renderiza o texto do filho', () => {
    render(<Badge>Ativo</Badge>)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('usa a variante "default" quando nenhuma é informada', () => {
    render(<Badge>Padrão</Badge>)
    const badge = screen.getByText('Padrão')
    expect(badge.className).toContain('bg-slate-100')
  })

  it('aplica as classes da variante "success"', () => {
    render(<Badge variant="success">Concluído</Badge>)
    const badge = screen.getByText('Concluído')
    expect(badge.className).toContain('bg-green-100')
  })

  it('aplica as classes da variante "danger"', () => {
    render(<Badge variant="danger">Erro</Badge>)
    const badge = screen.getByText('Erro')
    expect(badge.className).toContain('bg-red-100')
  })

  it('não renderiza o ponto indicador por padrão', () => {
    const { container } = render(<Badge>Sem ponto</Badge>)
    expect(container.querySelector('.rounded-full.h-1\\.5')).not.toBeInTheDocument()
  })

  it('renderiza o ponto indicador quando dot=true', () => {
    render(<Badge dot variant="success">Com ponto</Badge>)
    const badge = screen.getByText('Com ponto')
    const dot = badge.querySelector('span')
    expect(dot).toBeInTheDocument()
    expect(dot?.className).toContain('bg-green-500')
  })

  it('aplica className adicional quando informado', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    expect(screen.getByText('Custom').className).toContain('custom-class')
  })
})