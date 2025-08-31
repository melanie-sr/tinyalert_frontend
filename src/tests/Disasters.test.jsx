import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Disasters from '../components/Disasters'
import { MemoryRouter } from 'react-router-dom'

const mockT = vi.fn((key) => {
  const translations = {
    'disasters.filter': 'Rechercher une catastrophe',
    'disasters.tsunami.title': 'Tsunami',
    'disasters.tsunami.description': 'Un tsunami est une série de vagues océaniques causées par un déplacement soudain d\'eau, souvent dû à un séisme sous-marin ou à une éruption volcanique.',
    'disasters.earthquake.title': 'Séisme',
    'disasters.earthquake.description': 'Un séisme est un tremblement de terre causé par le mouvement des plaques tectoniques de la Terre, libérant une grande quantité d\'énergie.',
    'disasters.button': 'Découvrir',
    'disasters.noResults': 'Aucune catastrophe trouvée.'
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
describe('Disasters', () => {
it('Affichage des cards catastrophe', () => {
    renderWithRouter(<Disasters />)
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
      
})
it('filtre et n’affiche que le tsunami', () => {
  renderWithRouter(<Disasters />)

  const input = screen.getByPlaceholderText('Rechercher une catastrophe')
  fireEvent.change(input, { target: { value: 'tsunami' } })

  expect(screen.getByText('Tsunami')).toBeInTheDocument()
  expect(screen.queryByText('Séisme')).not.toBeInTheDocument()
})
it('filtre et n’affiche que le séisme', () => {
  renderWithRouter(<Disasters />)

  const input = screen.getByPlaceholderText('Rechercher une catastrophe')
  fireEvent.change(input, { target: { value: 'séisme' } })

  expect(screen.getByText('Séisme')).toBeInTheDocument()
  expect(screen.queryByText('Tsunami')).not.toBeInTheDocument()
})
it('Affichage du champ de recherche', () => {
    renderWithRouter(<Disasters />)
    expect(screen.getByPlaceholderText('Rechercher une catastrophe')).toBeInTheDocument()
})

it('Affichage des cards catastrophe', () => {
    renderWithRouter(<Disasters />)
    expect(screen.getByTestId('disaster-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('disaster-card-2')).toBeInTheDocument()  
      
})


})