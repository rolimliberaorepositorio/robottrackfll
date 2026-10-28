import React, { useState } from 'react';
import { INITIAL_STRATEGY_ITEMS } from '../data/mockData';
import { StrategyItem } from '../types';

interface EstrategiaTabProps {
  showToast: (msg: string) => void;
}

export const EstrategiaTab: React.FC<EstrategiaTabProps> = ({ showToast }) => {
  const [strategies, setStrategies] = useState<StrategyItem[]>(INITIAL_STRATEGY_ITEMS);
  const [userQuery, setUserQuery] = useState('');
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiCustomAdvice, setAiCustomAdvice] = useState<string | null>(null);

  // BIOGLOW 2026/2027 Run Configuration
  const [runConfigs, setRunConfigs] = useState([
    { run: 'Run 1', attachment: 'Coletor Bio-A (Garra Frontal)', missions: ['M01 Reator', 'M02 Micélio Glow'], estTime: '32s', targetPts: 70 },
    { run: 'Run 2', attachment: 'Garra Traseira Technic', missions: ['M03 Flora Noturna', 'M04 Espécime Abissal', 'M05 Drone'], estTime: '38s', targetPts: 110 },
    { run: 'Run 3', attachment: 'Empurrador Technic B (Alavanca 12D)', missions: ['M06 Banco Genético', 'M07 Dispersor', 'M08 Extrator Enzima'], estTime: '45s', targetPts: 130 },
    { run: 'Run 4', attachment: 'Elevador C (Cremalheira 24M)', missions: ['M09 Habitat Microbiano', 'M10 Retorno Base'], estTime: '30s', targetPts: 85 },
  ]);

  const toggleApplyStrategy = (id: string) => {
    setStrategies((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newState = !s.applied;
          showToast(newState ? `Estratégia "${s.title}" aplicada no plano Franco Droid!` : 'Estratégia desmarcada.');
          return { ...s, applied: newState };
        }
        return s;
      })
    );
  };

  const handleSwapAttachment = (runIndex: number) => {
    const nextAtt = prompt(
      `Alterar anexo da ${runConfigs[runIndex].run} (BIOGLOW 2026/2027):`,
      runConfigs[runIndex].attachment
    );
    if (nextAtt && nextAtt.trim()) {
      setRunConfigs((prev) =>
        prev.map((item, idx) => (idx === runIndex ? { ...item, attachment: nextAtt.trim() } : item))
      );
      showToast(`Anexo da ${runConfigs[runIndex].run} atualizado para "${nextAtt.trim()}"!`);
    }
  };

  const handleAskAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsAskingAi(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundNumber: 1,
          score: 395,
          notes: `Temporada FLL BIOGLOW 2026/2027 da equipe Franco Droid. Dúvida sobre estratégia e anexos: ${userQuery}`,
        }),
      });
      const data = await res.json();
      setAiCustomAdvice(
        data.assistantSummary ||
          `Sugestão do Franco Droid Bot: Para resolver "${userQuery}" no tapete BIOGLOW, recomendamos alinhar o torque do motor de passo e aplicar travamento triangular com vigas Technic 5x7.`
      );
      showToast('Resposta gerada pelo Franco Droid Bot!');
    } catch (err: any) {
      setAiCustomAdvice(
        `Sugestão do Franco Droid Bot: Para "${userQuery}" na temporada BIOGLOW 2026/2027, agrupe as missões M01 e M02 na Run 1 para poupar tempo de percurso e utilize pinos lisos na troca de anexo da base.`
      );
    } finally {
      setIsAskingAi(false);
      setUserQuery('');
    }
  };

  return (
    <div className="flex flex-col w-full px-3 sm:px-4 py-4 gap-5 max-w-4xl mx-auto pb-24">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#132030] via-[#0f1a28] to-[#16273c] border border-[#005a9c]/50 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#005a9c]/25 border border-[#3897f0]/40 flex items-center justify-center text-[#3897f0] flex-shrink-0">
            <span className="material-symbols-outlined text-[26px]">precision_manufacturing</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-headline uppercase tracking-wider text-[#e51a24] font-bold">
                Franco Droid Estratégia
              </span>
              <span className="text-[10px] font-headline text-[#a7b5c7]">
                • BIOGLOW 2026/2027
              </span>
            </div>
            <h2 className="font-headline text-[18px] sm:text-[20px] text-white font-extrabold">
              Planejamento de Anexos &amp; Sequência de Saídas
            </h2>
            <p className="text-[12px] text-[#a7b5c7] mt-1 leading-relaxed">
              Otimize as 4 saídas do robô Franco Droid, eliminando retornos desnecessários à base e
              ajustando engates rápidos de LEGO Technic para economizar segundos no cronômetro de 150s.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Runs Attachment Matrix */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-headline text-[11px] uppercase tracking-wider text-[#a7b5c7] font-semibold">
            Matriz de Saídas (Runs) &amp; Anexos Franco Droid
          </span>
          <span className="text-[11px] text-[#3897f0] font-headline font-bold">
            Potencial Máximo: 395 pts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {runConfigs.map((config, index) => (
            <div
              key={index}
              className="bg-[#132133] border border-[#233347] rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-sm hover:border-[#3897f0]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#005a9c]/30 text-[#3897f0] font-headline text-[11px] font-bold border border-[#005a9c]/40">
                    {config.run}
                  </span>
                  <span className="text-[11px] font-telemetry text-white font-semibold">
                    ~{config.estTime}
                  </span>
                </div>
                <span className="font-headline text-[12px] text-[#e51a24] font-bold">
                  {config.targetPts} pts
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-headline text-[#a7b5c7] uppercase">
                  Anexo Modular da Equipe:
                </span>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1b293d] border border-[#233347]">
                  <span className="font-headline text-[12px] text-white font-bold truncate">
                    {config.attachment}
                  </span>
                  <button
                    onClick={() => handleSwapAttachment(index)}
                    className="text-[#3897f0] hover:text-[#8fc5ff] text-[11px] font-headline font-bold flex items-center gap-0.5 flex-shrink-0 ml-1"
                    title="Trocar este anexo"
                  >
                    <span>Mudar</span>
                    <span className="material-symbols-outlined text-[13px]">edit</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#233347]/50 text-[11px] text-[#a7b5c7]">
                <span>Missões: {config.missions.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Strategies by AI Card List */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#3897f0] text-[18px]">psychology</span>
            <span className="font-headline text-[12px] uppercase tracking-wider text-white font-bold">
              Recomendações Construtivas da IA Franco Droid
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#1b293d] text-[#3897f0] font-headline text-[11px] font-bold">
            {strategies.filter((s) => s.applied).length} de {strategies.length} Aplicadas
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {strategies.map((strat) => (
            <div
              key={strat.id}
              className={`p-4 rounded-2xl border transition-all shadow-md flex flex-col gap-3 ${
                strat.applied
                  ? 'bg-[#132133] border-[#3897f0] shadow-[#005a9c]/15'
                  : 'bg-[#0f1a28] border-[#414750]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      strat.category === 'mechanical_reinforcement'
                        ? 'text-[#3897f0]'
                        : strat.category === 'human_procedure'
                        ? 'text-[#ffb4ac]'
                        : 'text-[#e51a24]'
                    }`}
                  >
                    {strat.category === 'mechanical_reinforcement'
                      ? 'build'
                      : strat.category === 'human_procedure'
                      ? 'accessibility_new'
                      : 'swap_calls'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline text-[13px] text-white font-bold">
                      {strat.title}
                    </span>
                    <span className="text-[10px] text-[#a7b5c7]">
                      {strat.currentRun} ➔ {strat.suggestedRun}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-[#19283a] text-[#3897f0] font-telemetry text-[11px] font-bold border border-[#3897f0]/20">
                    {strat.estimatedPointGain}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#19283a] text-[#a7b5c7] font-telemetry text-[11px] border border-[#414750]/30">
                    {strat.estimatedTimeGain}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-[#c1c7d2] leading-relaxed bg-[#0a111a]/60 p-2.5 rounded-xl border border-[#233347]">
                {strat.description}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#a7b5c7] font-headline">
                  Status:{' '}
                  <strong className={strat.applied ? 'text-emerald-400' : 'text-[#a7b5c7]'}>
                    {strat.applied ? 'Ativado na Estratégia' : 'Pendente de Teste'}
                  </strong>
                </span>

                <button
                  onClick={() => toggleApplyStrategy(strat.id)}
                  className={`px-3 py-1.5 rounded-xl font-headline text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                    strat.applied
                      ? 'bg-[#1b293d] text-[#c1c7d2] hover:text-white border border-[#414750]'
                      : 'bg-[#005a9c] hover:bg-[#0077c8] text-white shadow-md'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {strat.applied ? 'check_box' : 'add_task'}
                  </span>
                  <span>{strat.applied ? 'Aplicado' : 'Aplicar na Estratégia'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ask Franco Droid Bot Assistant Form */}
      <section className="bg-[#132133] border border-[#233347] rounded-2xl p-4 flex flex-col gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3897f0] text-[20px]">smart_toy</span>
          <h3 className="font-headline text-[14px] text-white font-bold">
            Consultar Franco Droid Bot (Temporada BIOGLOW)
          </h3>
        </div>
        <p className="text-[11px] text-[#a7b5c7]">
          Tire dúvidas sobre relação de engrenagens, redução de torque de motor SPIKE Prime, ou
          gabaritos de encosto para a temporada BIOGLOW 2026/2027.
        </p>

        <form onSubmit={handleAskAssistant} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ex: Como evitar folga na alavanca do Extrator de Enzima M08?"
            className="flex-1 bg-[#0a111a] border border-[#233347] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#005a9c]"
          />
          <button
            type="submit"
            disabled={isAskingAi}
            className="px-4 py-2 rounded-xl bg-[#005a9c] hover:bg-[#0077c8] text-white font-headline text-[12px] font-bold flex items-center justify-center gap-1.5 flex-shrink-0 disabled:opacity-50"
          >
            {isAskingAi ? (
              <span className="material-symbols-outlined text-[16px] animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">send</span>
            )}
            <span>Pedir Análise</span>
          </button>
        </form>

        {aiCustomAdvice && (
          <div className="p-3 rounded-xl bg-[#005a9c]/15 border border-[#005a9c]/30 text-white text-[12px] leading-relaxed flex items-start gap-2.5 mt-1">
            <span className="material-symbols-outlined text-[#3897f0] text-[18px] mt-0.5">
              auto_awesome
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-headline font-bold text-[#3897f0] text-[11px] uppercase">
                Resposta do Franco Droid Bot:
              </span>
              <p className="mt-0.5 text-[#dce3f1]">{aiCustomAdvice}</p>
            </div>
          </div>
        )}
      </section>

      {/* Technic & Operator Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#0f1a28] border border-[#414750]/40 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3897f0] text-[18px]">
              handyman
            </span>
            <span className="font-headline text-[12px] text-white font-bold">
              Checklist Mecânico LEGO Technic
            </span>
          </div>
          <ul className="text-[11px] text-[#a7b5c7] space-y-1.5 list-disc pl-4 mt-1">
            <li>Reforço triangular com vigas 5x7 em anexos com torque vertical (M08).</li>
            <li>Eixo de cremalheira apoiado dos dois lados com buchas de encosto axial.</li>
            <li>Zero atrito lateral em engrenagens de 12 e 24 dentes.</li>
            <li>Pinos azuis de fricção firmes na base modular de acoplamento rápido.</li>
          </ul>
        </div>

        <div className="bg-[#0f1a28] border border-[#414750]/40 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb4ac] text-[18px]">
              checklist_rtl
            </span>
            <span className="font-headline text-[12px] text-white font-bold">
              POP do Operador de Base (Franco Droid)
            </span>
          </div>
          <ul className="text-[11px] text-[#a7b5c7] space-y-1.5 list-disc pl-4 mt-1">
            <li>Encostar o robô no gabarito rígido de LEGO antes de iniciar a contagem.</li>
            <li>Operador #1 remove o anexo; Operador #2 encaixa o novo com Quick-Pin.</li>
            <li>Checar se o robô cruzou 100% a linha da base para não tomar penalidade.</li>
            <li>Meta oficial de troca na base: menos de 5.0 segundos.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
