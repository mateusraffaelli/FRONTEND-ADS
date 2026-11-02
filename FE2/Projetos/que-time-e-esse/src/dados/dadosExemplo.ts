import type { RecordePartida } from '../modelo/jogo'

export const partidasExemplo: RecordePartida[] = [
  {
    data: '26/10/2026',
    pontuacao: 540,
    rodadasJogadas: 7,
    acertos: 5,
    timesAcertados: [
      'Manchester United',
      'Liverpool',
      'Arsenal',
      'Chelsea',
      'Tottenham',
    ],
    maiorSequencia: 3,
    nomeLiga: 'Premier League',
  },
  {
    data: '25/10/2026',
    pontuacao: 320,
    rodadasJogadas: 5,
    acertos: 3,
    timesAcertados: ['Real Madrid', 'Barcelona', 'Sevilla'],
    maiorSequencia: 2,
    nomeLiga: 'La Liga',
  },
]
