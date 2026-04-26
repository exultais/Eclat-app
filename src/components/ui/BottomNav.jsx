import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Flame, Heart, User } from 'lucide-react'

const Nav = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  background: #12121e;
  border-top: 1.5px solid rgba(255,255,255,0.07);
  padding: 10px 0 24px;
  display: flex;
  justify-content: space-around;
  z-index: 99;
`

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 24px;
  color: ${p => p.active ? '#ff3a6e' : '#6e6b80'};
  transition: color 0.2s;
`

const NavLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
`

const ActiveDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 99px;
  background: #ff3a6e;
  margin-top: 2px;
  opacity: ${p => p.visible ? 1 : 0};
`

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const tabs = [
    { path: '/discover', icon: <Flame size={22} />, label: 'Découvrir' },
    { path: '/matches', icon: <Heart size={22} />, label: 'Matches' },
    { path: '/profile', icon: <User size={22} />, label: 'Profil' },
  ]

  return (
    <Nav>
      {tabs.map(tab => (
        <NavItem
          key={tab.path}
          active={path === tab.path}
          onClick={() => navigate(tab.path)}
        >
          {tab.icon}
          <NavLabel>{tab.label}</NavLabel>
          <ActiveDot visible={path === tab.path} />
        </NavItem>
      ))}
    </Nav>
  )
}