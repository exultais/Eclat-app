import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  background: #0a0a12;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  font-family: 'Plus Jakarta Sans', sans-serif;
`

const Logo = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: 52px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff3a6e, #ff8c42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
`

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const Input = styled.input`
  width: 100%;
  background: #1a1a2e;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 16px 18px;
  color: #f0eee8;
  font-size: 15px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none;
  &:focus { border-color: #ff3a6e55; }
  &::placeholder { color: #6e6b80; }
`

const Button = styled.button`
  width: 100%;
  padding: 17px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #ff3a6e, #ff6b42);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  margin-top: 6px;
`

const ErrorMsg = styled.p`
  color: #ff3a6e;
  font-size: 13px;
  text-align: center;
`

const LinkText = styled.p`
  color: #6e6b80;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  a { color: #ff3a6e; text-decoration: none; }
`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect')
    } else {
      navigate('/discover')
    }
    setLoading(false)
  }

  return (
    <Container>
      <Logo>Éclat</Logo>
      <Form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Ton email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Ton mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </Form>
      <LinkText>
        Pas encore de compte ? <Link to="/register">S'inscrire gratuitement</Link>
      </LinkText>
    </Container>
  )
}