import React from 'react';
import { MASCOT_IMAGE_URL } from '../data/mockData';
import { RoundTelemetry, TabType } from '../types';

interface TreinosTabProps {
  rounds: RoundTelemetry[];
  onStartLiveRound: () => void;
  onOpenUploadModal: () => void;
  onNavigateTab: (tab: TabType) => void;
  onSelectRound: (round: RoundTelemetry) => void;
  onExportExcel: () => void;
  syncing: boolean;
}

export const TreinosTab: React.FC<TreinosTabProps> = ({
  rounds,
  onStartLiveRound,
  onOpenUploadModal,
  onNavigateTab,
  onSelectRound,
  onExportExcel,
}) => {
  const latestRound = rounds.length > 0 ? rounds[0] : null;

  // Real calculations based on actual user rounds
  const avgScore =
    rounds.length > 0
      ? Math.round(rounds.reduce((acc, r) => acc + r.score, 0) / rounds.length)
      : 0;

  const maxScore = rounds.length > 0 ? Math.max(...rounds.map((r) => r.score)) : 0;

  const avgConsistency =
    rounds.length > 0
      ? Math.round(rounds.reduce((acc, r) => acc + r.consistencyScore, 0) / rounds.length)
      : 0;

  return (
    <div className="flex flex-col w-full px-3 sm:px-4 py-4 gap-5 max-w-4xl mx-auto pb-24">
      {/* Welcome & Team Mascot Header Strip */}
      <section className="bg-gradient-to-r from-[#1b293d] via-[#132133] to-[#0d1724] border border-[#3897f0]/25 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#3897f0]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-3 top-2 opacity-15 pointer-events-none">
          <img
            src={MASCOT_IMAGE_URL}
            alt="Mascote Franco Droid Watermark"
            className="w-24 h-24 object-contain"
          />
        </div>

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-13 h-13 rounded-xl bg-[#005a9c]/25 border border-[#3897f0]/40 flex items-center justify-center p-1.5 shadow-inner">
                <img
                  src={MASCOT_IMAGE_URL}
                  alt="Mascote Franco Droid"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#e51a24] border-2 border-[#132133] rounded-full"></span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="font-headline text-[10px] uppercase tracking-wider text-[#e51a24] font-bold">
                  Franco Droid Pit Telemetria
                </span>
              </div>
              <h2 className="font-headline text-[19px] sm:text-[22px] text-white truncate font-bold">
                Equipe Franco Droid
              </h2>
              <span className="text-[12px] text-[#a7b5c7] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#3897f0]">smart_toy</span>
                Mascote Franco Droid Online • BIOGLOW 2026/2027
              </span>
            </div>
          </div>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#24354c] border border-[#3897f0]/30 text-white font-headline text-[12px] font-bold active:scale-95 transition-all shadow-sm flex-shrink-0 hover:bg-[#2e4566]"
            title="Exportar para Excel"
          >
            <span className="material-symbols-outlined text-[#3897f0] text-[18px]">table_view</span>
            <span>Exportar .xlsx</span>
          </button>
        </div>

        {/* Quick Excel Status indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-[#233347]/80 text-[#a7b5c7] text-[11px] font-headline relative z-10">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#3897f0]">cloud_done</span>
            Autosync ativo (Planilha Oficial Franco Droid)
          </span>
          <span className="font-telemetry text-[#3897f0] font-bold bg-[#3897f0]/10 px-2 py-0.5 rounded border border-[#3897f0]/20">
            {rounds.length} {rounds.length === 1 ? 'Round Gravado' : 'Rounds Gravados'}
          </span>
        </div>
      </section>

      {/* Quick Action Triggers */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-[11px] uppercase tracking-wider text-[#a7b5c7] font-semibold">
            Execução no Tapete (BIOGLOW 2026/2027)
          </span>
          <span className="font-headline text-[11px] text-[#3897f0] flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">sensors</span> Sensores Ativos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Primary Live Round CTA */}
          <button
            onClick={onStartLiveRound}
            className="group relative overflow-hidden bg-gradient-to-r from-[#005a9c] to-[#0077c8] hover:brightness-105 border border-[#3897f0]/40 text-white p-4 rounded-xl flex items-center justify-between shadow-lg shadow-[#005a9c]/25 active:scale-[0.98] transition-all text-left"
          >
            <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-[#e51a24]/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-3 z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-white text-[28px] animate-pulse">timer</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-[16px] font-bold tracking-tight text-white">
                    Iniciar Round Ao Vivo
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#e51a24] text-white font-headline text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    150s
                  </span>
                </div>
                <p className="text-[12px] text-white/80 line-clamp-1">
                  Cronômetro Oficial + IA ou Contagem Manual
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center z-10 group-hover:scale-105 transition-transform shadow-md">
              <span className="material-symbols-outlined text-[22px] text-white">play_arrow</span>
            </div>
          </button>

          {/* Secondary Video Upload CTA */}
          <button
            onClick={onOpenUploadModal}
            className="bg-[#1b293d] border border-[#233347] hover:bg-[#24354c] text-white p-4 rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#132133] border border-[#3897f0]/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#e51a24] text-[24px]">video_file</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[14px] font-bold text-white">
                  Filmar ou Enviar Vídeo
                </span>
                <p className="text-[12px] text-[#a7b5c7] line-clamp-1">
                  Diagnóstico IA de Consistência, Proximidade e Tempo
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#3897f0] text-[22px]">upload</span>
          </button>
        </div>
      </section>

      {/* Featured Last Round Card (or Clean Empty State) */}
      {latestRound ? (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#e51a24]">flag_circle</span>
              <span className="font-headline text-[11px] uppercase tracking-wider text-[#a7b5c7] font-semibold">
                Último Round Gravado
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1b293d] border border-[#3897f0]/30 text-[#3897f0] font-telemetry text-[12px] font-bold">
              #{latestRound.id}
            </span>
          </div>

          <div className="bg-[#132133] border border-[#233347] rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-md">
            {/* Top Metrics: Score + Match Clock + Consistency */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-headline text-[10px] text-[#a7b5c7] uppercase font-semibold">
                    Pontuação Conquistada
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#e51a24]/15 text-[#e51a24] border border-[#e51a24]/30 font-headline text-[9px] font-bold">
                    FRANCO DROID TELEMETRIA
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-headline text-[32px] sm:text-[36px] font-extrabold text-[#3897f0] leading-none">
                    {latestRound.score}
                  </span>
                  <span className="text-[13px] text-[#a7b5c7]">/ {latestRound.maxScore} pts</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[#3897f0] font-headline text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">insights</span>
                  <span>{latestRound.notes}</span>
                </div>
              </div>

              {/* Radial Consistência Chart */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#1c2b3d]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-[#3897f0] stroke-current"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeDasharray={`${latestRound.consistencyScore}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-headline text-[15px] font-bold text-white leading-none">
                      {latestRound.consistencyScore}%
                    </span>
                  </div>
                </div>
                <span className="font-headline text-[10px] text-[#a7b5c7] mt-1 font-semibold uppercase">
                  Consistência
                </span>
              </div>
            </div>

            {/* Time and Margin Gauge */}
            <div className="bg-[#0d1724] border border-[#233347] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#132133] border border-[#3897f0]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-[#3897f0]">schedule</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-headline text-[#a7b5c7] uppercase">Tempo de Mesa</span>
                  <span className="font-telemetry font-bold text-white text-[15px]">
                    {Math.floor(latestRound.durationSeconds / 60).toString().padStart(2, '0')}:
                    {(latestRound.durationSeconds % 60).toString().padStart(2, '0')}{' '}
                    <span className="text-[#a7b5c7] text-[12px] font-normal">/ 02:30</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e51a24]/15 text-[#e51a24] border border-[#e51a24]/30 font-headline text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Margem: {Math.max(0, 150 - latestRound.durationSeconds).toFixed(1)}s</span>
              </div>
            </div>

            {/* Runs Mini Tracker (4 Saídas) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[#a7b5c7] font-headline text-[10px]">
                <span className="font-semibold uppercase tracking-wider">Desempenho por Saída (Runs)</span>
                <span className="text-[#3897f0] font-bold">
                  {latestRound.runs.filter((r) => r.status === 'completed').length} de {latestRound.runs.length} executadas
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {latestRound.runs.map((r, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1b293d] border border-[#233347] rounded-xl p-2 flex flex-col items-center justify-center text-center"
                  >
                    <span className="font-headline text-[10px] text-[#a7b5c7]">{r.name}</span>
                    <span
                      className={`font-headline text-[13px] font-bold ${
                        r.completionPercent < 80 ? 'text-[#e51a24]' : 'text-[#3897f0]'
                      }`}
                    >
                      {r.completionPercent}%
                    </span>
                    <div className="w-full h-1 bg-[#1c2b3d] rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          r.completionPercent < 80 ? 'bg-[#e51a24]' : 'bg-[#3897f0]'
                        }`}
                        style={{ width: `${r.completionPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#233347]/60">
              <button
                onClick={() => {
                  onSelectRound(latestRound);
                  onNavigateTab('diagnostico');
                }}
                className="flex items-center gap-1.5 text-[#a7b5c7] hover:text-[#3897f0] font-headline text-[12px] font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3897f0]">analytics</span>
                <span>Ver Diagnóstico dos 3 Pilares</span>
              </button>
              <button
                onClick={() => {
                  onSelectRound(latestRound);
                  onNavigateTab('diagnostico');
                }}
                className="flex items-center gap-1 text-[#e51a24] hover:text-red-400 font-headline text-[12px] font-bold transition-colors"
              >
                <span>Causa Raiz &amp; IA</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Empty State ready for genuine training */
        <section className="bg-[#132133] border border-[#233347] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-[#005a9c]/20 border border-[#3897f0]/40 flex items-center justify-center text-[#3897f0] shadow-inner">
            <span className="material-symbols-outlined text-[36px] animate-pulse">
              play_circle
            </span>
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="font-headline text-[18px] sm:text-[20px] text-white font-bold">
              Nenhum round gravado hoje ainda
            </h3>
            <p className="text-[13px] text-[#a7b5c7] leading-relaxed">
              Pronto para os treinos da temporada <strong>BIOGLOW 2026/2027</strong>! Inicie um
              round ao vivo no cronômetro oficial de 150 segundos ou envie um vídeo gravado para
              que a IA calcule a Consistência, Proximidade e Tempo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartLiveRound}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#005a9c] to-[#0077c8] hover:brightness-110 text-white font-headline text-[13px] font-bold flex items-center gap-2 shadow-lg shadow-[#005a9c]/30"
            >
              <span className="material-symbols-outlined text-[18px]">timer</span>
              <span>Iniciar 1º Round Ao Vivo</span>
            </button>
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2.5 rounded-xl bg-[#1b293d] hover:bg-[#24354c] text-white font-headline text-[13px] font-bold flex items-center gap-2 border border-[#233347]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#e51a24]">videocam</span>
              <span>Filmar / Enviar Vídeo</span>
            </button>
          </div>
        </section>
      )}

      {/* Key Team KPIs of the Day */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-[11px] uppercase tracking-wider text-[#a7b5c7] font-semibold">
            Métricas Reais de Hoje (BIOGLOW)
          </span>
          <span className="font-headline text-[11px] text-[#3897f0] flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">tune</span> Sessão Ativa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Metric 1 */}
          <div className="bg-[#132133] border border-[#233347] rounded-xl p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#005a9c]/25 border border-[#3897f0]/30 flex items-center justify-center text-[#3897f0]">
                <span className="material-symbols-outlined text-[22px]">leaderboard</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[10px] text-[#a7b5c7] uppercase font-semibold">
                  Média Hoje
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-[22px] font-bold text-white">
                    {rounds.length > 0 ? avgScore : '—'}
                  </span>
                  <span className="text-[11px] text-[#a7b5c7]">pts</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-telemetry text-[11px] text-[#3897f0] font-semibold">
                {rounds.length} rounds
              </span>
              <span className="font-headline text-[10px] text-[#e51a24] font-bold">
                Max: {rounds.length > 0 ? `${maxScore} pts` : '—'}
              </span>
            </div>
          </div>

          {/* Metric 2: Consistency */}
          <div className="bg-[#132133] border border-[#233347] rounded-xl p-3.5 flex flex-col justify-between gap-1 shadow-sm sm:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3897f0]/20 border border-[#3897f0]/40 flex items-center justify-center text-[#3897f0]">
                  <span className="material-symbols-outlined text-[18px]">repeat</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] text-[#a7b5c7] uppercase font-semibold">
                    Consistência Média
                  </span>
                  <span className="font-headline text-[12px] font-bold text-white truncate">
                    {rounds.length > 0 ? `${avgConsistency}% repetibilidade` : 'Aguardando 1º match'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#3897f0]/25 border border-[#3897f0]/40 text-[#3897f0] font-telemetry text-[11px] font-bold">
                {rounds.length > 0 ? `${avgConsistency}%` : '—'}
              </span>
            </div>
            <div className="w-full bg-[#1c2b3d] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#3897f0] h-full rounded-full"
                style={{ width: `${rounds.length > 0 ? avgConsistency : 0}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#a7b5c7] font-headline">
              <span>Meta FLL: &gt; 90%</span>
              <span className="text-[#3897f0] font-semibold">Temporada BIOGLOW</span>
            </div>
          </div>

          {/* Metric 3: Base Attachment Swap */}
          <div className="bg-[#132133] border border-[#233347] rounded-xl p-3.5 flex flex-col justify-between gap-1 shadow-sm sm:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#005a9c]/25 border border-[#3897f0]/30 flex items-center justify-center text-[#3897f0]">
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[10px] text-[#a7b5c7] uppercase font-semibold">
                    Tempo de Troca
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline text-[16px] font-bold text-white">5.8s</span>
                    <span className="text-[10px] text-[#a7b5c7]">na Base</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-headline text-[9px] text-[#a7b5c7] font-semibold">META</span>
                <span className="font-telemetry text-[11px] text-[#3897f0] font-bold">&lt; 6.0s</span>
              </div>
            </div>
            <div className="w-full bg-[#1c2b3d] h-1.5 rounded-full overflow-hidden mt-1 relative">
              <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-[#3897f0] z-10"></div>
              <div className="bg-emerald-500 h-full rounded-full w-[48%]"></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#a7b5c7] font-headline">
              <span className="text-emerald-400 font-semibold">Dentro do alvo (&lt; 6s)</span>
              <span>Quick-Pin Ativo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Practice History */}
      {rounds.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#3897f0]">history</span>
              <span className="font-headline text-[11px] uppercase tracking-wider text-[#a7b5c7] font-semibold">
                Histórico de Treinos Franco Droid
              </span>
            </div>
            <span className="font-headline text-[11px] text-[#3897f0] font-bold">
              {rounds.length} Registros
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {rounds.map((round) => (
              <div
                key={round.id}
                className="bg-[#132133] border border-[#233347] rounded-xl p-3.5 flex flex-col gap-2 shadow-sm hover:border-[#3897f0]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg bg-[#1b293d] border flex items-center justify-center font-telemetry font-bold text-[13px] ${
                        round.statusBadge
                          ? 'border-[#e51a24]/40 text-[#e51a24]'
                          : 'border-[#3897f0]/30 text-[#3897f0]'
                      }`}
                    >
                      #{round.id}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline text-[15px] font-bold text-white">
                          {round.score} pts
                        </span>
                        {round.statusBadge && (
                          <span className="px-2 py-0.5 rounded bg-[#e51a24]/15 text-[#e51a24] border border-[#e51a24]/30 font-headline text-[10px] font-bold">
                            {round.statusBadge}
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded bg-[#1c2b3d] text-[#a7b5c7] font-telemetry text-[11px]">
                          {Math.floor(round.durationSeconds / 60)}:
                          {String(round.durationSeconds % 60).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#a7b5c7]">
                        {round.date} • {round.runs.length} saídas
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectRound(round);
                        onNavigateTab('diagnostico');
                      }}
                      className="w-8 h-8 rounded-lg bg-[#1b293d] border border-[#233347] text-[#3897f0] flex items-center justify-center hover:bg-[#24354c]"
                      title="Assistir vídeo do round"
                    >
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                    </button>
                    <div
                      className="flex items-center gap-0.5 px-2 py-1 rounded bg-[#1b293d] border border-[#3897f0]/20 text-[#3897f0] font-headline text-[11px] font-bold"
                      title="Sincronizado na planilha"
                    >
                      <span className="material-symbols-outlined text-[13px]">check</span>
                      <span>Sync</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[#233347]/50 text-[#a7b5c7] text-[11px]">
                  <span className="truncate max-w-[240px] sm:max-w-md">Obs: {round.notes}</span>
                  <button
                    onClick={() => {
                      onSelectRound(round);
                      onNavigateTab('diagnostico');
                    }}
                    className="text-[#3897f0] font-headline font-semibold flex items-center gap-0.5 hover:underline whitespace-nowrap ml-2"
                  >
                    Detalhes <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Excel / Cloud Telemetry Banner */}
      <section className="bg-gradient-to-r from-[#0d1724] to-[#132133] border border-[#3897f0]/30 rounded-xl p-4 flex items-start gap-3 relative overflow-hidden shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-[#005a9c]/25 border border-[#3897f0]/40 flex items-center justify-center flex-shrink-0 text-[#3897f0]">
          <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
        </div>
        <div className="flex flex-col">
          <span className="font-headline text-[14px] font-bold text-white">
            Integração em Tempo Real • Franco Droid Cloud
          </span>
          <p className="text-[12px] text-[#a7b5c7] mt-0.5">
            Todas as pontuações da temporada <strong>BIOGLOW 2026/2027</strong>, tempos parciais
            por run e análises de causas raiz da IA são salvas e exportadas em formato Excel (.xlsx).
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-headline text-[11px] text-[#3897f0] flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#e51a24] animate-ping"></span>
              Conexão Ativa: Franco_Droid_BIOGLOW_2026_2027.xlsx
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
