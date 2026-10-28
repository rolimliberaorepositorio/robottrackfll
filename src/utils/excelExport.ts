import * as XLSX from 'xlsx';
import { RoundTelemetry } from '../types';

export function exportRoundsToExcel(
  rounds: RoundTelemetry[],
  filename = 'Franco_Droid_BIOGLOW_2026_2027.xlsx'
) {
  try {
    const wb = XLSX.utils.book_new();

    // 1. Planilha Resumo dos Rounds
    const roundsRows: any[] = [
      ['Equipe Franco Droid - FLL Temporada BIOGLOW 2026/2027'],
      ['Número Round', 'Pontuação', 'Pontuação Máx', 'Tempo de Mesa', 'Consistência (%)', 'Proximidade (%)', 'Tempo (%)', 'Data / Horário', 'Status', 'Observações da IA / Pit'],
    ];

    if (rounds.length === 0) {
      roundsRows.push(['Nenhum round registrado ainda']);
    } else {
      rounds.forEach((r) => {
        const minutes = Math.floor(r.durationSeconds / 60);
        const seconds = r.durationSeconds % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        roundsRows.push([
          `#${r.id}`,
          r.score,
          r.maxScore,
          formattedTime,
          `${r.consistencyScore}%`,
          `${r.proximityScore}%`,
          `${r.timeScore}%`,
          r.date,
          r.statusText || 'Concluído',
          r.notes,
        ]);
      });
    }

    const wsRounds = XLSX.utils.aoa_to_sheet(roundsRows);
    XLSX.utils.book_append_sheet(wb, wsRounds, 'Rounds_Franco_Droid');

    // 2. Planilha Detalhe dos 3 Pilares & Diagnóstico
    const latestRound = rounds[0];
    if (latestRound) {
      const diagRows: any[] = [
        ['Pilar da IA Franco Droid', 'Índice Avaliado', 'Meta Oficial FLL', 'Status', 'Diagnóstico Detalhado'],
        ['1. Consistência Operacional', `${latestRound.consistencyScore}%`, '95%', latestRound.consistencyScore >= 90 ? 'Excelente' : 'Atenção', 'Repetibilidade calculada sobre os treinos da temporada BIOGLOW'],
        ['2. Precisão & Proximidade', `${latestRound.proximityScore}%`, '98%', latestRound.proximityScore >= 90 ? 'Excelente' : 'Desvio Detectado', 'Tolerância mecânica de pinos Technic e leitura dos sensores óticos e giroscópio'],
        ['3. Distribuição de Tempo', `${latestRound.timeScore}%`, '150 segundos (2m30s)', 'Buffer Restante', 'Divisão entre tempo de pista, trocas na base e margem de tolerância'],
        [],
        ['Falhas Identificadas & Causa Raiz'],
        ['Tipo de Causa', 'Missão', 'Pontos Perdidos', 'Timestamp', 'Diagnóstico da IA', 'Recomendação de Engenharia FLL'],
      ];

      if (latestRound.failures) {
        latestRound.failures.forEach((f) => {
          diagRows.push([
            f.categoryName,
            f.mission,
            f.pointsLost,
            f.timestamp,
            f.diagnosis,
            f.recommendation,
          ]);
        });
      }

      const wsDiag = XLSX.utils.aoa_to_sheet(diagRows);
      XLSX.utils.book_append_sheet(wb, wsDiag, 'Diagnostico_BIOGLOW');
    }

    // 3. Planilha Desempenho por Saída (Runs)
    const runsRows: any[] = [
      ['Round', 'Saída (Run)', 'Pontos Obtidos', 'Taxa de Sucesso (%)', 'Anexo Utilizado', 'Status'],
    ];
    rounds.forEach((r) => {
      r.runs.forEach((run) => {
        runsRows.push([
          `#${r.id}`,
          run.name,
          run.score,
          `${run.completionPercent}%`,
          run.attachment,
          run.status,
        ]);
      });
    });
    const wsRuns = XLSX.utils.aoa_to_sheet(runsRows);
    XLSX.utils.book_append_sheet(wb, wsRuns, 'Desempenho_Runs');

    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Erro ao gerar planilha Excel:', error);
    window.location.href = '/api/export-excel';
    return false;
  }
}
