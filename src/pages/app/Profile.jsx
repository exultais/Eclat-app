import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MapPin, Briefcase, LogOut, MessageCircle } from 'lucide-react'
import BottomNav from '../../components/ui/BottomNav'

const Container = styled.div`
  min-height: 100vh;
  background: #0a0a12;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #f0eee8;
  max-width: 430px;
  margin: 0 auto;
  padding-bottom: 100px;
`

const Banner = styled.div`
  height: 280px;
  position: relative;
`

const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #0a0a12 0%, transparent 60%);
`

const Info = styled.div`
  padding: 0 22px;
  margin-top: -40px;
  position: relative;
  z-index: 2;
`

const Name = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px;
  font-weight: 600;
`

const Meta = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 6px;
  font-size: 13px;
  color: #6e6b80;
`

const Bio = styled.div`
  font-size: 14px;
  color: #ffffffbb;
  margin-top: 14px;
  line-height: 1.6;
`

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6e6b80;
  margin: 24px 0 12px;
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`

const StatBox = styled.div`
  background: #1a1a2e;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
`

const StatNum = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff3a6e, #ff8c42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StatLabel = styled.div`
  font-size: 11px;
  color: #6e6b80;
  margin-top: 2px;
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
  margin-bottom: 12px;
  &:focus { border-color: #ff3a6e55; }
  &::placeholder { color: #6e6b80; }
`

const Textarea = styled.textarea`
  width: 100%;
  background: #1a1a2e;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 16px 18px;
  color: #f0eee8;
  font-size: 15px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  outline: none;
  resize: none;
  height: 100px;
  margin-bottom: 12px;
  &:focus { border-color: #ff3a6e55; }
  &::placeholder { color: #6e6b80; }
`

const SaveBtn = styled.button`
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
  margin-bottom: 12px;
`

const LogoutBtn = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  border: 1.5px solid rgba(255,255,255,0.07);
  background: transparent;
  color: #6e6b80;
  font-size: 15px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const SupportBtn = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  border: 1.5px solid #ff3a6e44;
  background: #ff3a6e11;
  color: #ff3a6e;
  font-size: 15px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
`

const SupportBox = styled.div`
  background: #1a1a2e;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 20px;
  margin-top: 8px;
  margin-bottom: 12px;
`

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [supportMsg, setSupportMsg] = useState('')
  const [supportSubject, setSupportSubject] = useState('')
  const [supportSent, setSupportSent] = useState(false)
  const [stats, setStats] = useState({ likes: 0, matches: 0 })
  const [form, setForm] = useState({ full_name: '', bio: '', city: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { navigate('/login'); return }
      setUser(data.user)
      loadProfile(data.user.id)
      loadStats(data.user.id)
    }
    getUser()
  }, [])

  const loadProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      setProfile(data)
      setForm({ full_name: data.full_name || '', bio: data.bio || '', city: data.city || '' })
    }
  }

  const loadStats = async (userId) => {
    const { count: likesCount } = await supabase
      .from('swipes')
      .select('*', { count: 'exact' })
      .eq('swiped_id', userId)
      .eq('direction', 'right')

    const { count: matchesCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact' })
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    setStats({ likes: likesCount || 0, matches: matchesCount || 0 })
  }

  const saveProfile = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, bio: form.bio, city: form.city })
      .eq('id', user.id)
    if (!error) { setProfile({ ...profile, ...form }); setEditing(false) }
  }

  const sendSupport = async () => {
    if (!supportMsg.trim() || !supportSubject.trim()) return
    await supabase.from('support_tickets').insert({
      user_id: user.id,
      subject: supportSubject,
      message: supportMsg,
      status: 'open'
    })
    setSupportSent(true)
    setSupportMsg('')
    setSupportSubject('')
    setTimeout(() => { setSupportSent(false); setShowSupport(false) }, 3000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (!profile) return (
    <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6e6b80' }}>Chargement...</p>
    </Container>
  )

  return (
    <Container>
      <Banner>
        <BannerImg src={profile.avatar_url || `https://i.pravatar.cc/600?u=${profile.id}`} alt="" />
        <BannerOverlay />
      </Banner>

      <Info>
        <Name>
          {profile.full_name}, {profile.age}
          <span style={{ fontSize: 13, marginLeft: 8, background: 'linear-gradient(135deg,#ff3a6e,#ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ✓ Vérifié
          </span>
        </Name>
        <Meta>
          {profile.city && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{profile.city}</span>}
          {profile.gender && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={12} />{profile.gender}</span>}
        </Meta>
        <Bio>{profile.bio || 'Aucune bio pour le moment'}</Bio>

        <SectionLabel>Statistiques</SectionLabel>
        <StatsRow>
          <StatBox><StatNum>{stats.likes}</StatNum><StatLabel>Likes reçus</StatLabel></StatBox>
          <StatBox><StatNum>{stats.matches}</StatNum><StatLabel>Matches</StatLabel></StatBox>
          <StatBox><StatNum>{profile.age}</StatNum><StatLabel>Ans</StatLabel></StatBox>
        </StatsRow>

        <SectionLabel>Mon profil</SectionLabel>
        {editing ? (
          <>
            <Input placeholder="Ton prénom" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            <Input placeholder="Ta ville" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <Textarea placeholder="Ta bio..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            <SaveBtn onClick={saveProfile}>Sauvegarder ✓</SaveBtn>
            <LogoutBtn onClick={() => setEditing(false)}>Annuler</LogoutBtn>
          </>
        ) : (
          <SaveBtn onClick={() => setEditing(true)}>Modifier mon profil</SaveBtn>
        )}

        <SectionLabel>Assistance</SectionLabel>
        <SupportBtn onClick={() => setShowSupport(!showSupport)}>
          <MessageCircle size={16} />
          Contacter le support
        </SupportBtn>

        {showSupport && (
          <SupportBox>
            {supportSent ? (
              <p style={{ color: '#22c55e', textAlign: 'center', fontSize: 14 }}>
                ✅ Message envoyé ! On te répond très vite.
              </p>
            ) : (
              <>
                <Input placeholder="Sujet de ta demande" value={supportSubject} onChange={e => setSupportSubject(e.target.value)} />
                <Textarea placeholder="Décris ton problème..." value={supportMsg} onChange={e => setSupportMsg(e.target.value)} />
                <SaveBtn onClick={sendSupport}>Envoyer au support 📩</SaveBtn>
              </>
            )}
          </SupportBox>
        )}

        <LogoutBtn onClick={handleLogout}>
          <LogOut size={16} />
          Se déconnecter
        </LogoutBtn>
      </Info>

      <BottomNav />
    </Container>
  )
}