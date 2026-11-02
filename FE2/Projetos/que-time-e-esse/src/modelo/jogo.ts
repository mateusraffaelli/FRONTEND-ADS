export interface Time {
  id: string
  nome: string
  pais: string
  liga: string
  anoFundacao: number
  estadio: string | null
  apelidos: string[]
  cores: string[]
  descricao: string | null
  urlEscudo: string | null
}

export type TipoDica =
  'paisLiga' | 'fundacao' | 'estadio' | 'apelidoCores' | 'descricao' | 'escudo'

export interface Dica {
  tipo: TipoDica
  conteudo: string
  pontos: number
}

export type StatusJogo =
  'naoIniciada' | 'emAndamento' | 'rodadaEncerrada' | 'fimDeJogo'

export type ModoResposta = 'multiplaEscolha' | 'digitacao'

export interface ConfiguracoesJogo {
  nomeLiga: string
  modoResposta: ModoResposta
  vidas: number
}

export interface RecordePartida {
  data: string
  pontuacao: number
  rodadasJogadas: number
  acertos: number
  timesAcertados: string[]
  maiorSequencia: number
  nomeLiga: string
}
