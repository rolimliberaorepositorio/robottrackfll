import { RoundTelemetry, StrategyItem } from '../types';

export const MASCOT_IMAGE_URL = '/assets/aistudio/image_f3a6817e.png';
export const PROFILE_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN5e5pe2aD7ZY06wJ4kQZrdNNBEUhYi19miec0sf33NHH39flHIeuqQJBNqKcp9Ho4mGd8mGGX6-dWinNjX0oNDCOstmmfQujuwqZwRADQibGKIPs32gZA5HYI72yMuMMML5cl6-IWRythQwJXUJrH-4769CsEpxKcTAexv1Ddyiz5zeG87x7_gsLaHqo-tK20EcIFU1bZhWQhejJL2Het5yqfC8v20qhxwW99JcE';
export const MAT_CAMERA_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1PklekpC2bYAJDxZwdarXRiwGB3i5Ko6o5d7FW-Op4fy89BaMgBRC0MD4V91JKkCJXEz68rl47t6B4f-IW5IE1OPzkmiSI3c__Oa1c7gznxvG6Ofm5jvdA0ZqqMyePdKNY7hX0EuzV_-FAAsA2RRfxGOf8qk4kgUBJto_RLKSL311Ol2Bft-F5kCdBVsbfU2SoVVPIcLgtGGuZGFvCuy3PMYA3t9E1D032FNs2IE';

// Inicia limpo sem resultados falsos de exemplo para uso real pela equipe Franco Droid
export const INITIAL_ROUNDS: RoundTelemetry[] = [];

export const INITIAL_STRATEGY_ITEMS: StrategyItem[] = [
  {
    id: 'strat-1',
    title: 'Migrar Coletor de Biomassa (M01) para Saída 2',
    currentRun: 'Run 1 (Coletor Bio-A)',
    suggestedRun: 'Run 2 (Garra Traseira)',
    attachmentName: 'Garra Híbrida Bio-Glow',
    estimatedTimeGain: '+12 segundos',
    estimatedPointGain: '+30 pts',
    category: 'attachment_switch',
    description: 'A IA identificou que o trajeto da Run 2 cruza a área do reator de biomassa. Ao integrar o gatilho passivo no anexo traseiro, a equipe elimina um retorno completo à base!',
    applied: false,
  },
  {
    id: 'strat-2',
    title: 'Reforço Triangular Technic no Braço do Extrator M08',
    currentRun: 'Run 3',
    suggestedRun: 'Run 3 (Reforçada)',
    attachmentName: 'Empurrador Technic B Reforçado',
    estimatedTimeGain: '+3.0 segundos',
    estimatedPointGain: '+45 pts',
    category: 'mechanical_reinforcement',
    description: 'Adicionar duas vigas Technic 5x7 angulares com buchas de retenção axial no eixo de torque da cremalheira para evitar que as engrenagens pulem dente ao puxar o mecanismo da M08.',
    applied: true,
  },
  {
    id: 'strat-3',
    title: 'Gabarito Rígido de LEGO para Encosto na Mureta Sul',
    currentRun: 'Run 4 (Elevador C)',
    suggestedRun: 'Run 4 (POP Operador)',
    attachmentName: 'Gabarito Encosto de Precisão',
    estimatedTimeGain: 'Zera desvios angulares',
    estimatedPointGain: '+50 pts',
    category: 'human_procedure',
    description: 'Fixar o gabarito de LEGO encostado na mureta sul da base antes de apertar o botão central de largada, garantindo 100% de repetibilidade para a missão de retorno M10.',
    applied: false,
  },
  {
    id: 'strat-4',
    title: 'Troca Rápida de Anexo com Pinos Sem Fricção (Quick-Pin)',
    currentRun: 'Transições na Base',
    suggestedRun: 'Todas as saídas',
    attachmentName: 'Módulo de Engate Rápido Franco Droid',
    estimatedTimeGain: '+4.5 segundos',
    estimatedPointGain: 'Margem de Segurança',
    category: 'attachment_switch',
    description: 'Substituir os pinos de fricção pretos por pinos cinzas lisos combinados com trava por gravidade, baixando a média de troca de anexo na base de 8.4s para menos de 5 segundos.',
    applied: true,
  },
];
