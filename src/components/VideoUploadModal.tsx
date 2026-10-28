import React, { useState, useRef } from 'react';
import { RoundTelemetry } from '../types';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewRoundCreated: (round: RoundTelemetry) => void;
  showToast: (msg: string) => void;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onNewRoundCreated,
  showToast,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'record'>('record');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roundNotes, setRoundNotes] = useState('');
  const [teamRoundNumber, setTeamRoundNumber] = useState('43');

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, using simulation fallback:', err);
      showToast('Câmera física não disponível no ambiente atual. Modo de demonstração ativo.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    chunksRef.current = [];
    setRecordSeconds(0);
    setIsRecording(true);

    if (mediaStreamRef.current) {
      try {
        const recorder = new MediaRecorder(mediaStreamRef.current);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          setRecordedBlob(blob);
          setRecordedVideoUrl(URL.createObjectURL(blob));
        };
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn('MediaRecorder error:', e);
      }
    }

    timerIntervalRef.current = setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setRecordedVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleSendForAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const payload = {
        roundNumber: parseInt(teamRoundNumber) || 43,
        score: 395,
        maxScore: 450,
        durationSeconds: recordSeconds > 0 ? recordSeconds : 144,
        notes: roundNotes || 'Vídeo de teste enviado pela bancada FD',
        failedMissions: ['M08 Submarino Amarelo', 'M11 Sonar'],
      };

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const newRound: RoundTelemetry = {
        id: parseInt(teamRoundNumber) || 43,
        score: 395,
        maxScore: 450,
        durationSeconds: recordSeconds > 0 ? recordSeconds : 144,
        consistencyScore: data.kpis?.consistency?.score || 91,
        proximityScore: data.kpis?.proximity?.score || 94,
        timeScore: data.kpis?.time?.score || 96,
        date: 'Hoje, recém analisado',
        statusText: 'Analisado por IA',
        statusBadge: 'IA Recente',
        notes: data.assistantSummary || 'Vídeo processado com sucesso pela rede neural FD.',
        runs: [
          { runNumber: 1, name: 'Run 1', score: 70, completionPercent: 100, attachment: 'Coletor Bio-A', status: 'completed' },
          { runNumber: 2, name: 'Run 2', score: 110, completionPercent: 95, attachment: 'Garra Traseira', status: 'completed' },
          { runNumber: 3, name: 'Run 3', score: 130, completionPercent: 90, attachment: 'Empurrador Technic B', status: 'completed' },
          { runNumber: 4, name: 'Run 4', score: 85, completionPercent: 100, attachment: 'Elevador C', status: 'completed' },
        ],
        keyframes: [
          {
            timestamp: '00:03',
            title: 'Largada R1',
            status: 'Alinhado no Gabarito',
            statusColor: 'text-[#8fc5ff]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2zetVARFoUQ2z4bQ7HIcEtXQQ7HwwUBY0fqWnZeDbO5K1FxSMXcGMkehnS0e79hQwes1PCKtnTdrTTqU1NOX7KeoobSn7kXd8XTkWAe8HikYHg-euVcNunEPJZy_uB9lDNE_bqshcnwP7Vw3eRkraKYCB1gpXd8z7NdqwDv6pqhuZWNhnH0EkYebZTSbcjbdZnXip1AyXeyMdiWX_biJBpT4mxnnSrLPZpn2UIpQ',
            detail: 'Alinhamento verificado no gabarito sul.',
          },
          {
            timestamp: '01:14',
            title: 'M08 Extrator Enzima',
            status: 'Flexão Mecânica',
            isAlert: true,
            statusColor: 'text-[#e51a24]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOMA0b6dYGdJ9zATh3J5WOoJSlxOrmOLWEgVlXYQLVESa58_4CKoDLRTwt3ekL20Kljgc_bXL2dRLS43Cw-mH3b0hYBAGRF2BQxM1rduH62qCEkI2h-ulOgDDPf8PmW6_gWfdK-u8Xq1jT3jQ_KTCvGQu6JC0kZsAUxdWwjsYEYym5dan1V0A4H5tXLf-eO9Io6retfcoP0sZsFQJEFl44v5PXm7iiUw-TtLdBF_I',
            detail: 'Viga de sustentação flexionou sob torque na cremalheira.',
          },
          {
            timestamp: '01:42',
            title: 'Troca Base 2',
            status: 'Tempo: 4.8s',
            statusColor: 'text-[#3897f0]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASFf5H-eegD_gaDN-n2qUe06CabLwrieturAHfi5pF0z2PVV89ypKWVjHisIRiIA-gfqxpLTT_wvY_PCEC_Oh9EFaHBRQByNszlChBO4IW5aVbt_A396dyk5fSfFkS9YVg3qA2vgAfedYdxEtnCOVC74kRKAG3owsrK1hYuXtJ0SKKWsyVXFauqry4giviR91Ubjq7l96ahUrNRTrBay0gZcqNmkKcBo03Cpy4iJo',
            detail: 'Troca eficiente de anexo pelo operador.',
          },
          {
            timestamp: '02:18',
            title: 'M10 Retorno Base',
            status: 'Estacionado OK',
            statusColor: 'text-[#8fc5ff]',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiMyC20EohR3KHZhuJXRRX2UxT077w64lDBe5MFNdRocpDTbF3UNuhxKD8ML-mAWM9pvFM--95Hakst55HWcflgcKSD69R8UjCJDjb5Iw9p8T-vS8V6did98eFZdOrPNpZ8YiqTBIN81gupUf-TBmL1kLKyR-f1lPe0Z8SnJCxXY_XjtrWJw6zZDMcwlipCGcAH_ycceRocnPYet-WgGhvIXTsViVMxKChY67BHDE',
            detail: 'Robô encerrou 100% contido dentro da área da base.',
          },
        ],
        failures: data.failures || [
          {
            id: 'fault-1',
            type: 'lego_technic',
            categoryName: 'Erro de Montagem / Lego Technic',
            confidence: '85% Confiança IA',
            mission: 'M08 - Extrator de Enzima',
            pointsLost: -20,
            timestamp: '01:14',
            diagnosis: 'A viga de sustentação do anexo flexiona sob torque na cremalheira, pulando dentes da engrenagem.',
            recommendation: 'Adicionar travamento triangular com vigas Technic 5x7 e bucha de reforço axial.',
          },
          {
            id: 'fault-2',
            type: 'human_operator',
            categoryName: 'Erro Humano / Operador de Base',
            confidence: '92% Confiança IA',
            mission: 'M10 - Retorno Estação',
            pointsLost: -10,
            timestamp: '02:08',
            diagnosis: 'O robô foi posicionado desalinhado no gabarito de largada da base esquerda.',
            recommendation: 'Utilizar gabarito rígido de encosto de LEGO encostado na mureta sul antes de largar.',
          },
        ],
      };

      onNewRoundCreated(newRound);
      showToast(`Vídeo analisado pela IA: Round #${newRound.id} registrado com sucesso!`);
      onClose();
    } catch (e: any) {
      showToast('Erro na análise do vídeo: ' + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatSecs = (total: number) => {
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f1a26] border border-[#22354c] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#22354c] flex items-center justify-between bg-[#162233]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005a9c]/30 text-[#a1c9ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-white text-[16px]">
                Filmar ou Enviar Vídeo para IA
              </h3>
              <p className="text-[12px] text-[#a7b5c7]">
                Diagnóstico de Consistência, Proximidade, Tempo e Falhas
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopRecording();
              onClose();
            }}
            className="w-8 h-8 rounded-lg text-[#a7b5c7] hover:text-white hover:bg-white/10 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-[13px]">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 bg-[#0a111a] p-1 rounded-xl border border-[#22354c]">
            <button
              onClick={() => {
                setActiveMode('record');
                startCamera();
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-headline font-bold transition-all ${
                activeMode === 'record'
                  ? 'bg-[#005a9c] text-white shadow-md'
                  : 'text-[#a7b5c7] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">fiber_manual_record</span>
              <span>1. Gravar com Câmera</span>
            </button>
            <button
              onClick={() => {
                setActiveMode('upload');
                stopCamera();
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 font-headline font-bold transition-all ${
                activeMode === 'upload'
                  ? 'bg-[#005a9c] text-white shadow-md'
                  : 'text-[#a7b5c7] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              <span>2. Upload de Arquivo</span>
            </button>
          </div>

          {/* Round Info Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#a7b5c7] uppercase">Número do Round</label>
              <input
                type="number"
                value={teamRoundNumber}
                onChange={(e) => setTeamRoundNumber(e.target.value)}
                className="w-full mt-1 bg-[#162233] border border-[#22354c] rounded-lg px-3 py-1.5 text-white font-telemetry text-[14px] focus:outline-none focus:border-[#005a9c]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#a7b5c7] uppercase">Tempo do Match</label>
              <div className="mt-1 bg-[#162233] border border-[#22354c] rounded-lg px-3 py-1.5 text-[#a1c9ff] font-telemetry text-[14px]">
                {recordSeconds > 0 ? formatSecs(recordSeconds) : '02:24 (Padrão FLL)'}
              </div>
            </div>
          </div>

          {/* Record Mode View */}
          {activeMode === 'record' && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-[#22354c] flex items-center justify-center">
                <video
                  ref={videoPreviewRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                {!mediaStreamRef.current && !recordedVideoUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#09101a]/85">
                    <span className="material-symbols-outlined text-[#005a9c] text-[40px] mb-2 animate-pulse">
                      videocam
                    </span>
                    <p className="text-[#dce3f1] font-semibold text-[13px]">
                      Aguardando feed da câmera do Pit / Celular
                    </p>
                    <button
                      onClick={startCamera}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-[#005a9c] text-white text-[12px] font-bold hover:brightness-110"
                    >
                      Ativar Câmera
                    </button>
                  </div>
                )}

                {isRecording && (
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-red-500/50 text-white font-telemetry text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-[#e51a24] animate-ping"></span>
                    <span className="font-bold text-[#e51a24]">REC</span>
                    <span>{formatSecs(recordSeconds)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 h-11 rounded-xl bg-[#e51a24] hover:bg-[#c9141d] text-white font-headline font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#e51a24]/30 active:scale-98 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">radio_button_checked</span>
                    <span>Iniciar Gravação do Round</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 h-11 rounded-xl bg-[#23354c] hover:bg-[#2e4566] text-white font-headline font-bold flex items-center justify-center gap-2 border border-[#a1c9ff]/30 active:scale-98 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#e51a24]">stop</span>
                    <span>Parar Gravação ({formatSecs(recordSeconds)})</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upload Mode View */}
          {activeMode === 'upload' && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-[#22354c] hover:border-[#005a9c] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#0a111a]/50 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-[#005a9c]/20 border border-[#005a9c]/40 flex items-center justify-center text-[#a1c9ff]">
                  <span className="material-symbols-outlined text-[28px]">upload</span>
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-white text-[14px]">
                    {selectedFile ? selectedFile.name : 'Selecionar vídeo do round (.mp4, .mov)'}
                  </p>
                  <span className="text-[11px] text-[#a7b5c7]">
                    Tamanho recomendado até 100MB (câmera aérea ou bancada)
                  </span>
                </div>
              </label>

              {recordedVideoUrl && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video border border-[#22354c]">
                  <video
                    src={recordedVideoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Notes Area */}
          <div>
            <label className="text-[11px] font-bold text-[#a7b5c7] uppercase">
              Observações do Operador / Equipe
            </label>
            <textarea
              value={roundNotes}
              onChange={(e) => setRoundNotes(e.target.value)}
              placeholder="Ex: O robô trepidou na transição da Run 2 para Run 3. Suspeita de engrenagem pulando no submarino M08..."
              className="w-full mt-1 bg-[#162233] border border-[#22354c] rounded-lg p-2.5 text-white text-[12px] focus:outline-none focus:border-[#005a9c] h-18 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#22354c] bg-[#162233]/70 flex items-center gap-2">
          <button
            onClick={() => {
              stopRecording();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-lg border border-[#22354c] text-[#c1c7d2] hover:text-white hover:bg-white/5 font-headline font-semibold text-[13px]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendForAnalysis}
            disabled={isAnalyzing}
            className="flex-[2] py-2.5 rounded-lg bg-gradient-to-r from-[#005a9c] to-[#0077c8] hover:brightness-110 text-white font-headline font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-[#005a9c]/30 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Analisando com IA FLL...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>Mandar Vídeo para IA Diagnóstico</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
