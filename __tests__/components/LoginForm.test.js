import { render, screen } from '@testing-library/react'
import LoginForm from '../../src/components/forms/LoginForm'

describe('LoginForm', () => {
  it('renders the login form', () => {
    render(<LoginForm />)
    
    // Verificar que el título existe
    expect(screen.getByText('Biblioteca Arrupe')).toBeInTheDocument()
    expect(screen.getByText('El poder de gestionar el conocimiento')).toBeInTheDocument()
    
    // Verificar que los campos del formulario existen
    expect(screen.getByPlaceholderText('Ingresa tu correo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument()
    
    // Verificar que el botón de enviar existe
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    
    // Verificar que el enlace "¿Olvidaste tu contraseña?" existe
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(<LoginForm />)
    
    const logoImage = screen.getByAltText('Logo Colegio')
    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', '/images/logo_1000px.png')
  })
})
