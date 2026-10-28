import React, { useState } from 'react';
import { MASCOT_IMAGE_URL } from '../data/mockData';
import { RoundTelemetry, TabType } from '../types';

interface DiagnosticoTabProps {
  round: RoundTelemetry | null;
  onApplyStrategy: () => void;
  onExportExcel: () => void;
  onNavigateTab: (tab: TabType) => void;
  showToast: (msg: string) => void;
}

export const DiagnosticoTab: React.FC<DiagnosticoTabProps> = ({
  round,
  onApplyStrategy,
  onExportExcel,
  onNavigateTab,
}) => {
  const [selectedKeyframe, setSelectedKeyframe] = useState<number | null>(null);

  if (!round) {
    return (
      <div className="flex flex-col w-full px-3 sm:px-4 py-8 gap-5 max-w-4xl mx-auto pb-24 items-center text-center">
        <div className="bg-[#132030] border border-[#233347] rounded-2xl p-8 flex flex-col items-center gap-4 max-w-md w-full shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-[#005a9c]/20 border border-[#3897f0]/40 flex items-center justify-center text-[#3897f0]">
            <span className="material-symbols-outlined text-[36px]">analytics</span>
          </div>
          <h3 className="font-headline text-[20px] text-white font-bold">
            Aguardando 1º Round da Temporada BIOGLOW
          </h3>
          <p className="text-[13px] text-[#a7b5c7] leading-relaxed">
            Nenhum diagnóstico gerado ainda. Execute um treino no tab <strong>Ao Vivo</strong> ou
            envie uma gravação de vídeo para que a IA analise a Consistência, Proximidade, Tempo e
            Causas Raiz.
          </p>
          <button
            onClick={() => onNavigateTab('ao-vivo')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#005a9c] to-[#0077c8] hover:brightness-110 text-white font-headline text-[13px] font-bold flex items-center gap-2 shadow-lg shadow-[#005a9c]/30"
          >
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span>Iniciar Round Ao Vivo (150s)</span>
          </button>
        </div>
      </div>
    );
  }

  const durationMin = Math.floor(round.durationSeconds / 60);
  const durationSec = round.durationSeconds % 60;
  const durationFormatted = `${String(durationMin).padStart(2, '0')}:${String(durationSec).padStart(2, '0')}`;
  const bufferSeconds = Math.max(0, 150 - round.durationSeconds);

  return (
    <div className="flex flex-col w-full px-3 sm:px-4 py-4 gap-5 max-w-4xl mx-auto pb-24">
      {/* Assistente Virtual Franco Droid Bot Insight Card */}
      <section className="flex flex-col bg-gradient-to-r from-[#132030] via-[#0f1a28] to-[#16273c] border border-[#005a9c]/60 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#005a9c]/25 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start gap-3 sm:gap-4 relative z-10">
          <div className="relative flex-shrink-0">
            <img
              src={MASCOT_IMAGE_URL}
              alt="Mascote Franco Droid"
              className="w-14 h-14 object-contain rounded-xl p-1 bg-[#0a121c] border-2 border-[#0077c8] shadow-md shadow-[#005a9c]/30"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a121c] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </span>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-[16px] text-white font-bold tracking-tight">
                  Franco Droid Bot Assistente
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-headline uppercase bg-[#005a9c] text-white font-bold">
                  IA Ativa
                </span>
              </div>
              <span className="font-headline text-[11px] text-[#a1c9ff]">
                Diagnóstico R#{round.id}
              </span>
            </div>

            <p className="text-[13px] text-[#dce3f1] mt-1.5 leading-snug">
              &quot;Excelente desempenho de <strong className="text-white">{round.score} pts</strong> na
              temporada BIOGLOW! A IA avaliou a consistência em{' '}
              <strong className="text-[#3897f0]">{round.consistencyScore}%</strong> e a precisão dos
              anexos em <strong className="text-emerald-400">{round.proximityScore}%</strong>. Aplicando
              as correções de gabarito e reforço de eixo, a equipe Franco Droid pode maximizar a pontuação oficial!&quot;
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2 border-t border-[#414750]/40 text-[11px] text-[#a7b5c7] font-headline">
              <span className="flex items-center gap-1 text-[#8fc5ff]">
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                {round.failures?.length || 2} gargalos analisados
              </span>
              <span className="text-[#414750]">•</span>
              <span className="flex items-center gap-1 text-[#ffb4ac]">
                <span className="material-symbols-outlined text-[15px]">tune</span>
                Sugestões Technic prontas na Estratégia
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Header Card: Telemetry Overview */}
      <section className="flex flex-col bg-[#0f1a28] border border-[#414750]/40 rounded-2xl p-4 sm:p-5 shadow-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#a1c9ff]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#243244] text-[#a1c9ff] border border-[#a1c9ff]/20">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="font-headline text-[10px] uppercase tracking-wider font-bold">
              IA Visão Computacional Franco Droid
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#a7b5c7] font-telemetry text-[12px]">
            <span className="material-symbols-outlined text-[15px] text-[#3897f0]">timer</span>
            <span>Proc. 12s</span>
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <span className="font-headline text-[10px] text-[#3897f0] uppercase tracking-wider font-bold">
            FLL BIOGLOW 2026/2027
          </span>
          <h2 className="font-headline text-[24px] sm:text-[26px] text-white font-extrabold">
            Round #{round.id}
          </h2>
          <p className="text-[12px] text-[#a7b5c7]">{round.notes}</p>
        </div>

        {/* Quick Score & Official Match Chrono HUD */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#132030] p-3 rounded-xl flex flex-col justify-between border border-[#414750]/30">
            <div className="flex items-center justify-between">
              <span className="font-headline text-[10px] text-[#a7b5c7] uppercase font-bold">Score Final</span>
              <span className="material-symbols-outlined text-[#3897f0] text-[18px]">workspace_premium</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry text-[32px] sm:text-[36px] text-[#3897f0] font-extrabold leading-none">
                {round.score}
              </span>
              <span className="font-headline text-[11px] text-[#a7b5c7]">/ {round.maxScore} pts</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[#3897f0] font-headline text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>BIOGLOW 2026/2027</span>
            </div>
          </div>

          <div className="bg-[#132030] p-3 rounded-xl flex flex-col justify-between border border-[#414750]/30">
            <div className="flex items-center justify-between">
              <span className="font-headline text-[10px] text-[#a7b5c7] uppercase font-bold">Duração Match</span>
              <span className="material-symbols-outlined text-[#8fc5ff] text-[18px]">timelapse</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry text-[32px] sm:text-[36px] text-white font-extrabold leading-none">
                {durationFormatted}
              </span>
              <span className="font-headline text-[11px] text-[#a7b5c7]">/ 2:30</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[#8fc5ff] font-headline text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">hourglass_bottom</span>
              <span>Buffer: {bufferSeconds}s margem</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Keyframes & Detection Snapshot strip */}
      {round.keyframes && round.keyframes.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#a7b5c7] font-semibold">
              Frames Críticos Detectados no Round
            </span>
            <span className="font-headline text-[11px] text-[#3897f0] font-bold">
              {round.keyframes.length} Instantes Chave
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar">
            {round.keyframes.map((kf, i) => (
              <div
                key={i}
                onClick={() => setSelectedKeyframe(selectedKeyframe === i ? null : i)}
                className={`flex-shrink-0 w-40 bg-[#132030] rounded-xl overflow-hidden relative border cursor-pointer transition-all ${
                  kf.isAlert ? 'border-[#e51a24]/60 shadow-md shadow-[#e51a24]/10' : 'border-[#414750]/40'
                } ${selectedKeyframe === i ? 'ring-2 ring-[#0077c8]' : ''}`}
              >
                <div className="h-24 w-full relative">
                  <img
                    src={kf.imageUrl}
                    alt={kf.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-white font-telemetry text-[10px]">
                    {kf.timestamp}
                  </span>
                  {kf.isAlert && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#e51a24] animate-ping"></span>
                  )}
                </div>
                <div className="p-2 flex flex-col">
                  <span className="font-headline text-[11px] text-white font-bold truncate">
                    {kf.title}
                  </span>
                  <span
                    className={`text-[10px] font-semibold truncate ${
                      kf.isAlert ? 'text-[#e51a24]' : 'text-[#8fc5ff]'
                    }`}
                  >
                    {kf.status}
                  </span>
                  {selectedKeyframe === i && kf.detail && (
                    <p className="text-[10px] text-[#a7b5c7] mt-1 pt-1 border-t border-[#414750]/40">
                      {kf.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3 Fundamental Pillars Analyzed by AI */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3897f0] text-[22px]">psychology</span>
            <h3 className="font-headline text-[18px] text-white font-bold">
              3 Pilares Fundamentais (IA Franco Droid)
            </h3>
          </div>
          <span className="font-headline text-[11px] text-[#a7b5c7] uppercase font-bold">
            Temporada BIOGLOW
          </span>
        </div>

        {/* Pilar 1: Consistência Operacional */}
        <div className="bg-[#0f1a28] border border-[#414750]/40 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#19283a] border border-[#3897f0]/20 flex items-center justify-center text-[#3897f0]">
                <span className="material-symbols-outlined text-[22px]">repeat</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-headline text-[14px] text-white font-bold">
                  1. Consistência Operacional
                </h4>
                <span className="text-[11px] text-[#a7b5c7]">
                  Repetibilidade da trajetória e rotinas
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="font-headline text-[24px] text-[#3897f0] font-extrabold leading-none">
                {round.consistencyScore}%
              </span>
              <span className="font-headline text-[10px] text-[#a7b5c7] uppercase">
                Oscilação: ±4%
              </span>
            </div>
          </div>

          <div className="bg-[#132030] rounded-xl p-3 flex flex-col gap-2 border border-[#414750]/30">
            <div className="flex items-center justify-between text-[11px] font-headline text-[#a7b5c7]">
              <span>Curva de Estabilidade dos Treinos</span>
              <span className="text-emerald-400 font-bold">
                {round.consistencyScore >= 90 ? 'Trajetória Alta Estabilidade' : 'Ajustes recomendados'}
              </span>
            </div>
            <div className="w-full h-12 flex items-end">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 280 40">
                <path
                  d="M0,26 L20,22 L40,24 L60,18 L80,20 L100,16 L120,18 L140,24 L160,14 L180,16 L200,12 L220,10 L240,16 L260,14 L280,12"
                  stroke="#0077c8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                ></path>
                <circle className="fill-[#3897f0]" cx="280" cy="12" r="3.5"></circle>
              </svg>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#a7b5c7] pt-1 border-t border-[#414750]/20">
              <span>Sensor Giroscópio: Estável</span>
              <span>Repetibilidade: 95%</span>
            </div>
          </div>
        </div>

        {/* Pilar 2: Precisão & Proximidade */}
        <div className="bg-[#0f1a28] border border-[#414750]/40 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#19283a] border border-[#3897f0]/20 flex items-center justify-center text-[#3897f0]">
                <span className="material-symbols-outlined text-[22px]">target</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-headline text-[14px] text-white font-bold">
                  2. Precisão &amp; Proximidade
                </h4>
                <span className="text-[11px] text-[#a7b5c7]">
                  Encaixe nos modelos da mesa e paradas
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="font-headline text-[24px] text-[#3897f0] font-extrabold leading-none">
                {round.proximityScore}%
              </span>
              <span className="font-headline text-[10px] text-[#3897f0] uppercase">
                Tolerância: 3mm
              </span>
            </div>
          </div>

          <div className="bg-[#132030] rounded-xl p-3 flex flex-col gap-2.5 border border-[#414750]/30">
            <div className="flex items-center justify-between font-headline text-[11px]">
              <span className="text-white">Alinhamento Linha Preta / Sensor Óptico</span>
              <span className="text-[#3897f0] font-telemetry">2.5mm centralizado</span>
            </div>
            <div className="w-full bg-[#243244] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#0077c8] h-full rounded-full" style={{ width: `${round.proximityScore}%` }}></div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#19283a]/70 flex items-start gap-2 border border-[#414750]/30 mt-1">
              <span className="material-symbols-outlined text-[#3897f0] text-[16px] mt-0.5">info</span>
              <p className="text-[11px] text-[#a7b5c7] leading-relaxed">
                O engate nos módulos de LEGO Technic operou com margem de segurança alta. O alinhamento na base foi consistente.
              </p>
            </div>
          </div>
        </div>

        {/* Pilar 3: Distribuição de Tempo */}
        <div className="bg-[#0f1a28] border border-[#414750]/40 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#19283a] border border-[#3897f0]/20 flex items-center justify-center text-[#3897f0]">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-headline text-[14px] text-white font-bold">
                  3. Distribuição de Tempo
                </h4>
                <span className="text-[11px] text-[#a7b5c7]">
                  Meta: 150 segundos oficiais (2m 30s)
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="font-headline text-[24px] text-[#3897f0] font-extrabold leading-none">
                {round.timeScore}%
              </span>
              <span className="font-headline text-[10px] text-[#3897f0] uppercase">
                {bufferSeconds}s Sobra
              </span>
            </div>
          </div>

          <div className="bg-[#132030] rounded-xl p-3 flex flex-col gap-2.5 border border-[#414750]/30">
            <div className="flex items-center justify-between text-[12px] font-telemetry text-white">
              <span>
                Tempo Utilizado: <strong className="font-bold text-white">{durationFormatted}</strong>
              </span>
              <span>
                Buffer Livre: <strong className="text-emerald-400 font-bold">{bufferSeconds}s</strong>
              </span>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#243244]">
              <div
                className="h-full bg-[#0077c8]"
                style={{ width: `${Math.min(100, (round.durationSeconds / 150) * 100)}%` }}
              ></div>
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.max(0, (bufferSeconds / 150) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Root Cause Critical Section: Mechanical vs Operator */}
      {round.failures && round.failures.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3897f0] text-[22px]">troubleshoot</span>
              <h3 className="font-headline text-[18px] text-white font-bold">
                Causa Raiz da Falha: Análise Comparativa
              </h3>
            </div>
            <p className="text-[12px] text-[#a7b5c7]">
              Classificação por rede neural Franco Droid dos incidentes ocorridos no Round
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {round.failures.map((fail, i) => (
              <div
                key={fail.id || i}
                className={`border rounded-2xl p-4 flex flex-col gap-3 shadow-md relative overflow-hidden ${
                  fail.type === 'lego_technic'
                    ? 'bg-[#0f1a28] border-[#005a9c]/50'
                    : 'bg-[#0f1a28] border-[#e51a24]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-headline uppercase font-bold border ${
                      fail.type === 'lego_technic'
                        ? 'bg-[#005a9c]/25 text-[#a1c9ff] border-[#0077c8]/30'
                        : 'bg-[#e51a24]/15 text-[#ffb4ac] border-[#e51a24]/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {fail.type === 'lego_technic' ? 'precision_manufacturing' : 'front_hand'}
                    </span>
                    <span>{fail.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#19283a] text-[#3897f0] font-telemetry text-[11px] border border-[#3897f0]/20 font-bold">
                    <span>{fail.confidence}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline text-[16px] text-white font-bold">
                      {fail.mission}
                    </h4>
                    {fail.pointsLost < 0 && (
                      <span className="text-[#e51a24] font-headline text-[12px] font-bold">
                        {fail.pointsLost} pts perdidos
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#a7b5c7]">Timestamp: {fail.timestamp}</span>
                </div>

                <div className="bg-[#132030] rounded-xl p-3 flex flex-col gap-2 border border-[#414750]/30">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#3897f0] text-[18px] mt-0.5">
                      warning
                    </span>
                    <div className="flex flex-col">
                      <span className="font-headline text-[12px] text-white font-bold">
                        Diagnóstico Detalhado:
                      </span>
                      <p className="text-[12px] text-[#a7b5c7] mt-0.5 leading-relaxed">
                        {fail.diagnosis}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#19283a] flex flex-col gap-1 border border-[#3897f0]/25 mt-1">
                    <span className="font-headline text-[10px] uppercase tracking-wider text-[#3897f0] flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[14px]">build_circle</span>
                      Recomendação de Engenharia FLL:
                    </span>
                    <p className="text-[12px] text-white leading-relaxed">
                      {fail.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Export & Strategic Application CTAs */}
      <section className="flex flex-col gap-3 pt-2">
        <button
          onClick={onApplyStrategy}
          className="w-full h-13 bg-gradient-to-r from-[#005a9c] to-[#0077c8] hover:brightness-110 text-white rounded-xl font-headline text-[14px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-[#005a9c]/30"
        >
          <span className="material-symbols-outlined text-[20px]">sync_saved_locally</span>
          <span>Aplicar Recomendações na Estratégia</span>
        </button>

        <button
          onClick={onExportExcel}
          className="w-full h-12 bg-[#1b293d] hover:bg-[#24354c] text-white border border-[#414750]/50 rounded-xl font-headline text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px] text-[#3897f0]">table_view</span>
          <span>Planilha de Diagnóstico Completa (.xlsx)</span>
        </button>
      </section>
    </div>
  );
};
