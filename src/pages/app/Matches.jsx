import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Send } from 'lucide-react'
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

const TopBar = styled.div`
  padding: 20px 22px 10px;
`

const Logo = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff3a6e, #ff8c42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Section = styled.div`
  padding: 0 22px 16px;
`

const SectionTitle = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 14px;
`

const MatchesRow = styled.div`
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

const MatchAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
`

const AvatarImg = styled.img`
  width: 66px;
  height: 66px;
  border-radius: 99px;
  object-fit: cover;
  border: 2px solid #ff3a6e;
`

const AvatarName = styled.span`
  font-size: 12px;
  color: #6e6b80;
`

const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.07);
  margin: 0 22px 16px;
`

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  cursor: pointer;
  &:hover { background: #1a1a2e; }
`

const ChatImg = styled.img`
  width: 54px;
  height: 54px;
  border-radius: 99px;
  object-fit: cover;
  flex-shrink: 0;
`

const ChatBody = styled.div`
  flex: 1;
  min-width: 0;
`

const ChatName = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
`

const ChatPreview = styled.div`
  font-size: 13px;
  color: #6e6b80;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 12px;
  color: #6e6b80;
  font-size: 15px;
`

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { navigate('/login'); return }
      setUser(data.user)
      loadMatches(data.user.id)
    }
    getUser()
  }, [])

  const loadMatches = async (userId) => {
    const { data } = await supabase
      .from('matches')
      .select('id, user1_id, user2_id, created_at')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    if (!data) return

    const enriched = await Promise.all(data.map(async (match) => {
      const otherId = match.user1_id === userId ? match.user2_id : match.user1_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', otherId)
        .single()
      return { ...match, profile }
    }))

    setMatches(enriched)
  }

  return (
    <Container>
      <TopBar>
        <Logo>Matches</Logo>
      </TopBar>

      {matches.length > 0 ? (
        <>
          <Section>
            <SectionTitle>Nouveaux matches ✨</SectionTitle>
            <MatchesRow>
              {matches.map(m => (
                <MatchAvatar key={m.id}>
                  <AvatarImg
                    src={m.profile?.avatar_url || `https://i.pravatar.cc/150?u=${m.profile?.id}`}
                    alt={m.profile?.full_name}
                  />
                  <AvatarName>{m.profile?.full_name?.split(' ')[0]}</AvatarName>
                </MatchAvatar>
              ))}
            </MatchesRow>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>Messages</SectionTitle>
          </Section>

          {matches.map(m => (
            <ChatItem key={m.id}>
              <ChatImg
                src={m.profile?.avatar_url || `https://i.pravatar.cc/150?u=${m.profile?.id}`}
                alt={m.profile?.full_name}
              />
              <ChatBody>
                <ChatName>{m.profile?.full_name}, {m.profile?.age}</ChatName>
                <ChatPreview>Envoie le premier message 👋</ChatPreview>
              </ChatBody>
              <Send size={18} color="#ff3a6e" />
            </ChatItem>
          ))}
        </>
      ) : (
        <EmptyState>
          <p>Pas encore de matches</p>
          <p style={{ fontSize: 13 }}>Continue à swiper ✨</p>
        </EmptyState>
      )}

      <BottomNav />
    </Container>
  )
}