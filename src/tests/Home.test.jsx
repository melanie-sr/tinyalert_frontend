import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from '../components/Home.jsx'
import { MemoryRouter } from 'react-router-dom'


const mockT = vi.fn((key) => {
  const translations = {
    'home.title': 'Es-tu prêt à survivre aux catastrophes naturelles ?',
    'home.subtitle': 'Une expérience réalisete, fun et éducative.\n100% gratuite sur Roblox',
    'home.button': 'Jouer maintenant sur Roblox',
    'home.disasters.title': 'Découvrir les catastrophes',
    'home.disasters.tsunami': 'Tsunami',
    'home.disasters.earthquake': 'Seisme',
    'home.disasters.volcano': 'Volcan',
    'home.disasters.fire': 'Incendie',
    'home.disasters.tornado': 'Tornade'
  }
  return translations[key] || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}
describe('Home', () => {
  it('affiche le titre principal', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText('Es-tu prêt à survivre aux catastrophes naturelles ?')).toBeInTheDocument()
  })

  it('affiche le bouton de jeu', () => {
    renderWithRouter(<Home />)
    expect(screen.getByTestId('play-button')).toBeInTheDocument()
  })

  it('affiche le sous-titre', () => {
    renderWithRouter(<Home />)
    expect(
    screen.getByText((content) =>
      content.includes("Une expérience réalisete, fun et éducative.") &&
      content.includes("100% gratuite sur Roblox")
    )
  ).toBeInTheDocument()
  })
  it('affiche le titre des catastrophes', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText('Découvrir les catastrophes')).toBeInTheDocument()
  })


  it('affiche toutes les catastrophes', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText('Tsunami')).toBeInTheDocument()
    expect(screen.getByText('Seisme')).toBeInTheDocument()
    expect(screen.getByText('Volcan')).toBeInTheDocument()
    expect(screen.getByText('Incendie')).toBeInTheDocument()
    expect(screen.getByText('Tornade')).toBeInTheDocument()
  })

  it('affiche les images des bannieres', () => {
    renderWithRouter(<Home />)
    const bannerImages = screen.getAllByAltText('Banner')
    expect(bannerImages).toHaveLength(2)
  })

    it('affiche les images avec les text des catastrophes', () => {
        renderWithRouter(<Home />)

    expect(screen.getByTestId('disaster-1')).toBeInTheDocument()
    expect(screen.getByTestId('disaster-2')).toBeInTheDocument()  
    expect(screen.getByTestId('disaster-3')).toBeInTheDocument()
    expect(screen.getByTestId('disaster-4')).toBeInTheDocument()
    expect(screen.getByTestId('disaster-5')).toBeInTheDocument()  

})

})
