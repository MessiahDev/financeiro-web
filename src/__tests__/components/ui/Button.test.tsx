import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../../../components/ui/Button/Button'

describe('Button', () => {
  it('renderiza o texto do filho', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('chama onClick quando clicado', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique aqui</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Clique aqui' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('não chama onClick quando desabilitado', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Desabilitado</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Desabilitado' }))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('fica desabilitado quando isLoading é true', () => {
    render(<Button isLoading>Salvando...</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('não fica desabilitado por padrão', () => {
    render(<Button>Normal</Button>)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('aplica o atributo type quando informado', () => {
    render(<Button type="submit">Enviar</Button>)
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'submit')
  })

  it('renderiza o leftIcon quando não está carregando', () => {
    render(<Button leftIcon={<span data-testid="icon">★</span>}>Com ícone</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('não chama onClick quando isLoading é true', () => {
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Carregando</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })
})