import React, { useState, useEffect, useRef } from 'react';
import { MAT_CAMERA_IMAGE_URL } from '../data/mockData';
import { INITIAL_BIOGLOW_MISSIONS } from '../data/fllMissions';
import { Mission, RoundTelemetry, TabType } from '../types';

interface AoVivoTabProps {
  onFinishRound: (round: RoundTelemetry) => void;
  onNavigateTab: (tab: TabType) => void;
  showToast: (msg: string) => void;
}

export const AoVivoTab: React.FC<AoVivoTabProps> = ({
  onFinishRound,
  onNavigateTab,
  showToast,
}) => {
  const [totalDurationSeconds] = useState(150); // 2m30s
  const [remainingSeconds, setRemainingSeconds] = useState(150);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeRunIndex, setActiveRunIndex] = useState(1); // Run 1
  const [scoringMode, setScoringMode] = useState<'ai' | 'manual'>('manual');
  const [useLiveWebcam, setUseLiveWebcam] = useState(false);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_BIOGLOW_MISSIONS);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const [lastDelta, setLastDelta] = useState('Pronto para iniciar');
  const [isFinishing, setIsFinishing] = useState(false);

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Real score calculated dynamically from completed missions minus penalties
  const calculatedScore = Math.max(
    0,
    missions.reduce((sum, m) => sum + (m.completed ? m.points : 0), 0) - penaltyCount * 5
  );

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            showToast('Fim dos 150 segundos oficiais (2m30s)!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, remainingSeconds]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleWebcam = async () => {
    if (useLiveWebcam) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      setUseLiveWebcam(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        setUseLiveWebcam(true);
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
          videoElementRef.current.play();
        }
        showToast('Câmera física ativada com overlay de telemetria AR!');
      } catch (e) {
        showToast('Webcam não disponível. Usando visualização ótica de bancada.');
        setUseLiveWebcam(false);
      }
    }
  };

  const handleToggleMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const nextState = !m.completed;
          const delta = nextState ? m.points : -m.points;
          setLastDelta(`${delta > 0 ? '+' : ''}${delta} pts (${m.number})`);
          return { ...m, completed: nextState };
        }
        return m;
      })
    );
  };

  const handleApplyPenalty = () => {
    setPenaltyCount((c) => c + 1);
    setLastDelta('-5 pts (Penalidade)');
    showToast(`Penalidade de precisão aplicada (-5 pts). Total: ${penaltyCount + 1}`);
  };

  const handleRunAdvance = () => {
    const nextRun = activeRunIndex < 4 ? activeRunIndex + 1 : 1;
    setActiveRunIndex(nextRun);
    setLastDelta(`Saída ${nextRun} engatada`);
    showToast(`Transição para Saída ${nextRun} de 4! Troca de anexo registrada.`);
  };

  const handleSimulateAiDetection = (missionId: string) => {
    handleToggleMission(missionId);
    showToast('IA detectou acionamento da missão na bancada!');
  };

  const handleFinishRound = async () => {
    setIsFinishing(true);
    setTimerRunning(false);

    const elapsedSeconds = Math.max(1, totalDurationSeconds - remainingSeconds);
    const completedMissions = missions.filter((m) => m.completed);
    const uncompletedMissions = missions.filter((m) => !m.completed && m.id !== 'precision');

    try {
      const payload = {
        roundNumber: Math.floor(Math.random() * 10) + 1,
        score: calculatedScore,
        maxScore: 450,
        durationSeconds: elapsedSeconds,
        failedMissions: uncompletedMissions.map((m) => `${m.number} ${m.name}`),
        notes: `Round ao vivo Franco Droid (BIOGLOW 2026/2027) com ${completedMissions.length} missões concluídas e ${penaltyCount} penalidades.`,
      };

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const newRound: RoundTelemetry = {
        id: Math.floor(Date.now() / 1000) % 1000,
        score: calculatedScore,
        maxScore: 450,
        durationSeconds: elapsedSeconds,
        consistencyScore: data.kpis?.consistency?.score || Math.min(98, Math.max(70, Math.round((calculatedScore / 350) * 100))),
        proximityScore: data.kpis?.proximity?.score || 93,
        timeScore: data.kpis?.time?.score || (elapsedSeconds <= 150 ? 95 : 75),
        date: 'Hoje, recém concluído',
        statusText: 'Concluído',
        statusBadge: calculatedScore >= 350 ? 'Recorde Treino' : 'Match Ao Vivo',
        notes: data.assistantSummary || `Round concluído com ${calculatedScore} pontos em ${Math.floor(elapsedSeconds / 60)}m${elapsedSeconds % 60}s.`,
        runs: [
          { runNumber: 1, name: 'Run 1', score: 70, completionPercent: completedMissions.some(m => m.runIndex === 1) ? 100 : 50, attachment: 'Coletor Bio-A', status: 'completed' },
          { runNumber: 2, name: 'Run 2', score: 75, completionPercent: completedMissions.some(m => m.runIndex === 2) ? 100 : 60, attachment: 'Garra Traseira Technic', status: 'completed' },
          { runNumber: 3, name: 'Run 3', score: 90, completionPercent: completedMissions.some(m => m.runIndex === 3) ? 100 : 70, attachment: 'Empurrador Technic B', status: 'completed' },
          { runNumber: 4, name: 'Run 4', score: 85, completionPercent: completedMissions.some(m => m.runIndex === 4) ? 100 : 50, attachment: 'Elevador C', status: 'completed' },
        ],
        keyframes: [
          {
            timestamp: '00:02',
            title: 'Largada R1',
            status: 'Alinhado no Gabarito',
            statusColor: 'text-[#8fc5ff]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2zetVARFoUQ2z4bQ7HIcEtXQQ7HwwUBY0fqWnZeDbO5K1FxSMXcGMkehnS0e79hQwes1PCKtnTdrTTqU1NOX7KeoobSn7kXd8XTkWAe8HikYHg-euVcNunEPJZy_uB9lDNE_bqshcnwP7Vw3eRkraKYCB1gpXd8z7NdqwDv6pqhuZWNhnH0EkYebZTSbcjbdZnXip1AyXeyMdiWX_biJBpT4mxnnSrLPZpn2UIpQ',
            detail: 'Robô posicionado no alinhador sul da base.',
          },
          {
            timestamp: '01:14',
            title: 'M08 Extrator de Enzima',
            status: uncompletedMissions.some(m => m.id === 'm08') ? 'Flexão sob Carga' : 'Concluído com Sucesso',
            isAlert: uncompletedMissions.some(m => m.id === 'm08'),
            statusColor: uncompletedMissions.some(m => m.id === 'm08') ? 'text-[#e51a24]' : 'text-[#3897f0]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOMA0b6dYGdJ9zATh3J5WOoJSlxOrmOLWEgVlXYQLVESa58_4CKoDLRTwt3ekL20Kljgc_bXL2dRLS43Cw-mH3b0hYBAGRF2BQxM1rduH62qCEkI2h-ulOgDDPf8PmW6_gWfdK-u8Xq1jT3jQ_KTCvGQu6JC0kZsAUxdWwjsYEYym5dan1V0A4H5tXLf-eO9Io6retfcoP0sZsFQJEFl44v5PXm7iiUw-TtLdBF_I',
            detail: 'Mecanismo de cremalheira Technic avaliado.',
          },
          {
            timestamp: '01:42',
            title: 'Troca Base R3',
            status: 'Tempo: 5.4s',
            statusColor: 'text-[#3897f0]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASFf5H-eegD_gaDN-n2qUe06CabLwrieturAHfi5pF0z2PVV89ypKWVjHisIRiIA-gfqxpLTT_wvY_PCEC_Oh9EFaHBRQByNszlChBO4IW5aVbt_A396dyk5fSfFkS9YVg3qA2vgAfedYdxEtnCOVC74kRKAG3owsrK1hYuXtJ0SKKWsyVXFauqry4giviR91Ubjq7l96ahUrNRTrBay0gZcqNmkKcBo03Cpy4iJo',
            detail: 'Troca de anexo rápida dentro da meta.',
          },
          {
            timestamp: '02:18',
            title: 'M10 Retorno à Base',
            status: completedMissions.some(m => m.id === 'm10') ? 'Estacionado OK' : 'Desalinhado na Entrada',
            statusColor: 'text-[#8fc5ff]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiMyC20EohR3KHZhuJXRRX2UxT077w64lDBe5MFNdRocpDTbF3UNuhxKD8ML-mAWM9pvFM--95Hakst55HWcflgcKSD69R8UjCJDjb5Iw9p8T-vS8V6did98eFZdOrPNpZ8YiqTBIN81gupUf-TBmL1kLKyR-f1lPe0Z8SnJCxXY_XjtrWJw6zZDMcwlipCGcAH_ycceRocnPYet-WgGhvIXTsViVMxKChY67BHDE',
            detail: 'Robô encerrou match na área de base.',
          },
        ],
        failures: data.failures || [
          {
            id: 'fault-live-1',
            type: 'lego_technic',
            categoryName: 'Erro de Montagem / Lego Technic',
            confidence: '84% Confiança IA',
            mission: 'M08 - Extrator de Enzima',
            pointsLost: -20,
            timestamp: '01:14',
            diagnosis: 'Flexão de 2.5° no eixo da cremalheira ao puxar a trava de alta resistência.',
            recommendation: 'Adicionar travamento triangular com vigas Technic 5x7 e buchas axiais.',
          },
          {
            id: 'fault-live-2',
            type: 'human_operator',
            categoryName: 'Erro Humano / Operador de Base',
            confidence: '89% Confiança IA',
            mission: 'M10 - Retorno Estação',
            pointsLost: penaltyCount > 0 ? penaltyCount * 5 : 0,
            timestamp: '02:20',
            diagnosis: `Foram registradas ${penaltyCount} penalidades de toque manual fora da base durante o percurso.`,
            recommendation: 'Aguardar o robô cruzar 100% a linha da base antes de qualquer interferência física.',
          },
        ],
      };

      onFinishRound(newRound);
      showToast(`Round #${newRound.id} finalizado com ${calculatedScore} pts e salvo na telemetria!`);
      onNavigateTab('diagnostico');
    } catch (err: any) {
      showToast('Erro ao processar round: ' + err.message);
    } finally {
      setIsFinishing(false);
    }
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.max(0, (remainingSeconds / totalDurationSeconds) * 100);
  const offset = 100 - progressPercent;

  return (
    <div className="flex flex-col w-full px-3 sm:px-4 py-4 gap-4 max-w-4xl mx-auto pb-24">
      {/* HUD: Cronômetro Oficial & Scorecard Principal */}
      <section className="w-full bg-[#1b293d] rounded-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden border border-[#233347]">
        {/* Barra superior de progresso 150s */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#132133]">
          <div
            className="h-full bg-[#e51a24] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Cronômetro Digital 150s */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#132133]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#e51a24] transition-all duration-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="100, 100"
                  strokeDashoffset={offset.toFixed(1)}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="absolute w-8 h-8 rounded-full bg-[#0a111a] flex items-center justify-center text-[#e51a24] hover:scale-110 active:scale-95 transition-transform border border-[#233347]"
                title={timerRunning ? 'Pausar (Espaço)' : 'Iniciar Cronômetro'}
              >
                <span className="material-symbols-outlined text-[19px]">
                  {timerRunning ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-headline text-[#a7b5c7] uppercase tracking-wider font-semibold">
                  Cronômetro Oficial (2m 30s)
                </span>
                <button
                  onClick={() => {
                    setRemainingSeconds(150);
                    setTimerRunning(false);
                    showToast('Cronômetro reiniciado em 02:30.');
                  }}
                  className="text-[#a7b5c7] hover:text-white p-0.5 rounded"
                  title="Reiniciar 150s"
                >
                  <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-telemetry text-[34px] sm:text-[38px] font-extrabold text-white leading-none">
                  {timeFormatted}
                </span>
                <span className="text-[10px] font-headline text-[#3897f0] px-2 py-0.5 rounded bg-[#0a111a] font-bold border border-[#233347]">
                  RUN {activeRunIndex}
                </span>
              </div>
            </div>
          </div>

          {/* Placar Real Acumulado */}
          <div className="flex flex-col items-end flex-shrink-0 bg-[#0a111a] p-2.5 rounded-xl border border-[#233347]">
            <span className="text-[10px] font-headline text-[#a7b5c7] uppercase tracking-wider font-semibold">
              Pontuação Real
            </span>
            <div className="flex items-center gap-1">
              <span className="font-headline text-[26px] sm:text-[30px] text-[#e51a24] font-extrabold leading-none">
                {calculatedScore}
              </span>
              <span className="text-[12px] font-headline text-[#a7b5c7] font-bold">pts</span>
            </div>
            <div className="flex items-center gap-1 text-[#3897f0] text-[11px] font-headline font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>{lastDelta}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Viewfinder AR da Câmera ao Vivo com Bounding Boxes FLL BIOGLOW */}
      <section className="w-full relative rounded-2xl overflow-hidden shadow-xl bg-black border border-[#233347]">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-cover bg-center overflow-hidden">
          {useLiveWebcam ? (
            <video
              ref={videoElementRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              src={MAT_CAMERA_IMAGE_URL}
              alt="Mesa FLL BIOGLOW 2026/2027"
              className="w-full h-full object-cover"
            />
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-[#0a111a]/30 pointer-events-none"></div>

          {/* AR Reticular Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
            <div className="border-r border-b border-[#3897f0]"></div>
            <div className="border-r border-b border-[#3897f0]"></div>
            <div className="border-b border-[#3897f0]"></div>
            <div className="border-r border-b border-[#3897f0]"></div>
            <div className="border-r border-b border-[#3897f0]"></div>
            <div className="border-b border-[#3897f0]"></div>
            <div className="border-r border-b border-[#3897f0]"></div>
            <div className="border-r border-b border-[#3897f0]"></div>
            <div></div>
          </div>

          {/* Top Bar HUD */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a111a]/85 backdrop-blur-md text-white border border-[#233347]">
              <span className="w-2 h-2 rounded-full bg-[#e51a24] animate-ping"></span>
              <span className="text-[10px] font-headline uppercase tracking-wider text-[#e51a24] font-bold">
                BIOGLOW 26/27
              </span>
              <span className="text-[#a7b5c7] text-[10px]">• Franco Droid AR</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a111a]/85 backdrop-blur-md text-[#3897f0] border border-[#233347]">
              <span className="material-symbols-outlined text-[14px]">memory</span>
              <span className="text-[10px] font-headline font-bold">IA Visão Ativa</span>
            </div>
          </div>

          {/* Bounding Box 1: M01 Reator de Biomassa */}
          <div
            onClick={() => handleSimulateAiDetection('m01')}
            className="absolute top-[26%] left-[16%] w-[44%] h-[38%] rounded-xl p-2 flex flex-col justify-between cursor-pointer bg-[#005a9c]/25 border-2 border-[#3897f0] backdrop-blur-xs shadow-lg hover:bg-[#005a9c]/40 transition-all pointer-events-auto"
            title="Clique para confirmar ativação por IA"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-headline px-2 py-0.5 rounded bg-[#005a9c] text-white uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                M01: Reator Biomassa
              </span>
              <span className="text-[11px] font-headline px-1.5 py-0.5 rounded bg-[#1b293d] text-[#e51a24] font-bold">
                +30 pts
              </span>
            </div>
            <div className="flex items-center justify-between text-white bg-[#0a111a]/90 px-2 py-1 rounded-lg border border-[#233347]">
              <span className="text-[10px] font-headline text-[#3897f0] font-bold">
                {missions.find((m) => m.id === 'm01')?.completed ? 'ATIVADO ✓' : 'ALINHAR ANEXO'}
              </span>
              <span className="text-[10px] text-[#a7b5c7]">Conf: 99.2%</span>
            </div>
          </div>

          {/* Bounding Box 2: M08 Extrator */}
          <div
            onClick={() => handleSimulateAiDetection('m08')}
            className="absolute bottom-[12%] right-[8%] w-[40%] h-[34%] rounded-xl p-2 flex flex-col justify-between cursor-pointer bg-[#005a9c]/20 border border-[#a1c9ff] backdrop-blur-xs shadow-md hover:bg-[#005a9c]/35 transition-all pointer-events-auto"
            title="Clique para confirmar ativação por IA"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-headline px-2 py-0.5 rounded bg-[#005a9c] text-white uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">center_focus_strong</span>
                M08: Extrator
              </span>
              <span className="text-[11px] font-headline px-1.5 py-0.5 rounded bg-[#1b293d] text-[#e51a24] font-bold">
                +45 pts
              </span>
            </div>
            <div className="flex items-center justify-between text-white bg-[#0a111a]/90 px-2 py-1 rounded-lg border border-[#233347]">
              <span className="text-[10px] font-headline text-[#3897f0] font-bold">
                {missions.find((m) => m.id === 'm08')?.completed ? 'TRAVADO ✓' : 'EM ALCANCE'}
              </span>
              <span className="text-[10px] text-[#a7b5c7] font-telemetry">Δ 0.8cm</span>
            </div>
          </div>

          {/* Bottom Bar: Switch Camera source button */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a111a]/90 backdrop-blur-md text-[#a7b5c7] border border-[#233347] text-[11px]">
              <span className="material-symbols-outlined text-[13px] text-[#e51a24]">videocam</span>
              <span>{useLiveWebcam ? 'Câmera do Dispositivo Ativa' : 'Câmera Superior da Bancada'}</span>
            </div>

            <button
              onClick={toggleWebcam}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#005a9c] hover:bg-[#0077c8] text-white font-headline text-[11px] font-bold shadow-md pointer-events-auto"
            >
              <span className="material-symbols-outlined text-[14px]">
                {useLiveWebcam ? 'photo_camera_back' : 'videocam'}
              </span>
              <span>{useLiveWebcam ? 'Usar Feed de Bancada' : 'Ativar Minha Câmera'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mode Selector (Manual Checklist vs IA) */}
      <section className="w-full flex flex-col gap-2">
        <div className="w-full bg-[#132133] p-1.5 rounded-xl flex items-center gap-1.5 border border-[#233347]">
          <button
            onClick={() => setScoringMode('manual')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 font-headline text-[12px] transition-all font-bold ${
              scoringMode === 'manual'
                ? 'bg-[#005a9c] text-white shadow-md'
                : 'text-[#a7b5c7] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">checklist</span>
            <span>Manual (Checklist FLL)</span>
          </button>
          <button
            onClick={() => setScoringMode('ai')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 font-headline text-[12px] transition-all font-bold ${
              scoringMode === 'ai'
                ? 'bg-[#005a9c] text-white shadow-md'
                : 'text-[#a7b5c7] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span>IA - Visão Ótica</span>
            <span className="w-2 h-2 rounded-full bg-[#e51a24] animate-pulse"></span>
          </button>
        </div>

        {/* Informative Banner */}
        <div className="w-full px-3 py-2.5 rounded-xl bg-[#132133] flex items-start gap-2.5 border border-[#233347]">
          <span className="material-symbols-outlined text-[#3897f0] text-[20px] flex-shrink-0 mt-0.5">
            table_chart
          </span>
          <div className="flex flex-col min-w-0">
            <p className="text-[12px] text-white font-medium">
              {scoringMode === 'manual'
                ? 'Modo Manual interativo: marque as missões realizadas pela equipe.'
                : 'Modo IA: os bounding boxes e detecção ótica pontuam automaticamente.'}
            </p>
            <span className="text-[11px] text-[#a7b5c7]">
              Ao finalizar, a pontuação é calculada e exportada automaticamente para a planilha Excel.
            </span>
          </div>
        </div>

        {/* Functional Interactive Mission Checklist */}
        <div className="bg-[#132133] border border-[#233347] rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-headline text-[#a7b5c7] uppercase">
            <span className="font-bold">Missões da Temporada BIOGLOW 2026/2027</span>
            <span className="text-[#3897f0]">
              {missions.filter((m) => m.completed).length} de {missions.length - 1} Concluídas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {missions
              .filter((m) => m.id !== 'precision')
              .map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => handleToggleMission(mission.id)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-left transition-all ${
                    mission.completed
                      ? 'bg-[#005a9c]/30 border-[#3897f0] text-white'
                      : 'bg-[#1b293d] border-[#233347] text-[#a7b5c7] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border ${
                        mission.completed
                          ? 'bg-[#005a9c] border-[#3897f0] text-white'
                          : 'border-[#414750] bg-[#0a111a]'
                      }`}
                    >
                      {mission.completed && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-headline font-bold text-[12px] truncate">
                        {mission.number}: {mission.name}
                      </span>
                      <span className="text-[10px] text-[#a7b5c7] truncate">
                        {mission.attachmentName}
                      </span>
                    </div>
                  </div>
                  <span className="font-telemetry font-bold text-[12px] text-[#3897f0] ml-2">
                    +{mission.points}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* Seletor Rápido de Saída da Base (Runs Strip) */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-headline text-[#a7b5c7] uppercase tracking-wider font-semibold">
            Estratégia de Lançamento (Runs)
          </span>
          <span className="text-[11px] font-headline text-[#3897f0] font-bold">
            Saída {activeRunIndex} de 4 Ativa
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 w-full">
          {[
            { num: 1, name: 'Run 1', att: 'Coletor Bio-A' },
            { num: 2, name: 'Run 2', att: 'Garra Traseira' },
            { num: 3, name: 'Run 3', att: 'Empurrador B' },
            { num: 4, name: 'Run 4', att: 'Elevador C' },
          ].map((r) => {
            const isCurrent = activeRunIndex === r.num;
            return (
              <button
                key={r.num}
                onClick={() => setActiveRunIndex(r.num)}
                className={`p-2 rounded-xl flex flex-col justify-between h-20 text-left transition-all ${
                  isCurrent
                    ? 'bg-[#1b293d] border-2 border-[#005a9c] shadow-md relative overflow-hidden'
                    : 'bg-[#132133] border border-[#233347] opacity-75 hover:opacity-100'
                }`}
              >
                {isCurrent && <div className="absolute top-0 inset-x-0 h-1 bg-[#e51a24]"></div>}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] font-headline font-bold ${
                      isCurrent ? 'text-[#3897f0]' : 'text-[#a7b5c7]'
                    }`}
                  >
                    RUN {r.num}
                  </span>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-[#e51a24] animate-ping"></span>}
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-[12px] font-bold text-white truncate">
                    {isCurrent ? 'Em Pista' : 'Pronto'}
                  </span>
                  <span className="text-[10px] text-[#a7b5c7] truncate">{r.att}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Controles Inferiores de Campo e Ações Críticas */}
      <section className="w-full flex flex-col gap-2.5 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleRunAdvance}
            className="h-12 px-3 rounded-xl bg-[#1b293d] text-white hover:text-[#3897f0] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#233347] font-headline text-[12px] font-bold"
          >
            <span className="material-symbols-outlined text-[#3897f0] text-[20px]">swap_horiz</span>
            <span className="truncate">Troca de Anexo / Saída</span>
          </button>

          <button
            onClick={handleApplyPenalty}
            className="h-12 px-3 rounded-xl bg-[#1b293d] text-[#e51a24] hover:bg-[#e51a24]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm border border-[#e51a24]/30 font-headline text-[12px] font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span className="truncate">Penalidade (-5 pts) [{penaltyCount}]</span>
          </button>
        </div>

        <button
          onClick={handleFinishRound}
          disabled={isFinishing}
          className="h-14 py-3 w-full rounded-2xl bg-[#e51a24] hover:bg-[#c9141d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#e51a24]/25 text-white font-headline text-[14px] font-bold uppercase tracking-wider disabled:opacity-50"
        >
          {isFinishing ? (
            <>
              <span className="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
              <span>Processando Telemetria IA...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[24px]">stop_circle</span>
              <span>Finalizar Round &amp; Gerar Telemetria ({calculatedScore} pts)</span>
            </>
          )}
        </button>
      </section>
    </div>
  );
};
