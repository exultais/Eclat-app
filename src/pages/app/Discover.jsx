import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Heart, X, Star, Flame, SlidersHorizontal } from 'lucide-react'
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const IconBtn = styled.div`
  width: 40px;
  height: 40px;
  background: #1a1a2e;
  border: 1.5px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const CardArea = styled.div`
  padding: 12px 20px;
  position: relative;
  height: 500px;
`

const Card = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 24px;
  overflow: hidden;
  z-index: 2;
`

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #000000ee 0%, #00000044 50%, transparent 100%);
`

const CardInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 22px;
`

const CardName = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 34px;
  font-weight: 600;
`

const CardBio = styled.div`
  font-size: 14px;
  color: #ffffffbb;
  margin-top: 8px;
  line-height: 1.5;
`

const MatchScore = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #ff3a6e, #ff6b42);
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
`

const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
`

const ActionBtn = styled.button`
  border-radius: 99px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s;
  &:active { transform: scale(0.88); }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 16px;
  color: #6e6b80;
  font-size: 15px;
`

export default function Discover() {
  const [profiles, setProfiles] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [user, setUser] = useState(null)
  const [likes, setLikes] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { navigate('/login'); return }
      setUser(data.user)
      loadProfiles(data.user.id)
    }
    getUser()
  }, [])

  const loadProfiles = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', userId)
      .limit(20)
    if (data) setProfiles(data)
  }

  const handleSwipe = async (direction) => {
    if (!profiles[currentIdx]) return
    const swiped = profiles[currentIdx]

    await supabase.from('swipes').insert({
      swiper_id: user.id,
      swiped_id: swiped.id,
      direction
    })

    if (direction === 'right') {
      setLikes(l => l + 1)
      const { data: existing } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', swiped.id)
        .eq('swiped_id', user.id)
        .eq('direction', 'right')
        .single()

      if (existing) {
        await supabase.from('matches').insert({
          user1_id: user.id,
          user2_id: swiped.id
        })
        alert(`🎉 Match avec ${swiped.full_name} !`)
      }
    }

    setCurrentIdx(i => i + 1)
  }

  const current = profiles[currentIdx]

  return (
    <Container>
      <TopBar>
        <Logo>Éclat</Logo>
        <IconBtn><SlidersHorizontal size={16} color="#6e6b80" /></IconBtn>
      </TopBar>

      {current ? (
        <>
          <CardArea>
            <Card>
              <CardImg
                src={current.avatar_url || `https://i.pravatar.cc/600?u=${current.id}`}
                alt={current.full_name}
              />
              <CardOverlay />
              <MatchScore>⭐ Profil vérifié</MatchScore>
              <CardInfo>
                <CardName>{current.full_name}, {current.age}</CardName>
                <CardBio>{current.bio || current.city}</CardBio>
              </CardInfo>
            </Card>
          </CardArea>

          <Actions>
            <ActionBtn
              onClick={() => handleSwipe('left')}
              style={{ width: 58, height: 58, background: '#1a1a2e', border: '2px solid #ff3a6e44' }}>
              <X size={24} color="#ff3a6e" />
            </ActionBtn>
            <ActionBtn
              onClick={() => handleSwipe('right')}
              style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#ff3a6e,#ff6b42)', boxShadow: '0 0 30px #ff3a6e44' }}>
              <Heart size={30} color="#fff" fill="#fff" />
            </ActionBtn>
            <ActionBtn
              onClick={() => handleSwipe('super')}
              style={{ width: 54, height: 54, background: '#1a1a2e', border: '2px solid #f5c84244' }}>
              <Star size={22} color="#f5c842" />
            </ActionBtn>
          </Actions>

          <div style={{ textAlign: 'center', color: '#6e6b80', fontSize: 13 }}>
            ❤️ {likes} likes · 👀 {currentIdx} profils vus
          </div>
        </>
      ) : (
        <EmptyState>
          <Flame size={40} color="#ff3a6e" />
          <p>Plus de profils disponibles</p>
          <p style={{ fontSize: 13 }}>Reviens plus tard ✨</p>
        </EmptyState>
      )}

      <BottomNav />
    </Container>
  )
}