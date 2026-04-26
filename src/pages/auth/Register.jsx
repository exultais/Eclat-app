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
  font-size: 48px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff3a6e, #ff8c42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  color: #6e6b80;
  font-size: 14px;
  margin-bottom: 36px;
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

const Select = styled.select`
  width: 100%;
  background: #1a1a2e;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 16px 18px;
  color: #f0eee8;
  font-size: 15px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none;
  cursor: pointer;
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

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    age: '',
    gender: '',
    city: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (form.age < 18) {
      setError('Tu dois avoir au moins 18 ans')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: form.full_name,
        age: parseInt(form.age),
        gender: form.gender,
        city: form.city
      })

    if (profileError) {
      setError('Erreur lors de la création du profil')
    } else {
      navigate('/discover')
    }

    setLoading(false)
  }

  return (
    <Container>
      <Logo>Éclat</Logo>
      <Subtitle>100% gratuit · Sans abonnement · À vie</Subtitle>
      <Form onSubmit={handleRegister}>
        <Input
          name="full_name"
          placeholder="Ton prénom"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Ton email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Mot de passe (min. 6 caractères)"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          name="age"
          type="number"
          placeholder="Ton âge"
          value={form.age}
          onChange={handleChange}
          required
        />
        <Select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Je suis...</option>
          <option value="homme">Un homme</option>
          <option value="femme">Une femme</option>
          <option value="autre">Autre</option>
        </Select>
        <Input
          name="city"
          placeholder="Ta ville"
          value={form.city}
          onChange={handleChange}
          required
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer mon compte gratuitement 🎉'}
        </Button>
      </Form>
      <LinkText>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </LinkText>
    </Container>
  )
}