'use client';
import { useGame } from '@/store/GameState';
import { Timer, RotateCcw, FastForward } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HeaderTimer() {
  const { timeLeft, stage, resetGame, goToStage } = useGame();
  const router = useRouter();

  if (stage === 3) return null; // hide on ending

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  const isUrgent = timeLeft < 60;

  const handleReset = () => {
    resetGame();
    router.replace('/');
  };

  const handleSkip = () => {
    goToStage(2);
    router.replace('/stage2');
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      <div className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 bg-black/80 backdrop-blur-md transition-colors duration-500 shadow-lg ${isUrgent ? 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
        <Timer className={isUrgent ? 'animate-pulse' : ''} />
        <span className="text-2xl font-mono font-bold tracking-wider">
          {min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}
        </span>
      </div>
      
      {stage === 1 && (
        <button 
          onClick={handleSkip}
          title="Stage 2로 스킵 (테스트용)"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-600 text-purple-400 hover:bg-purple-900/50 hover:text-purple-300 hover:border-purple-500 transition-all shadow-lg hover:scale-110 duration-300"
        >
          <FastForward size={20} />
        </button>
      )}

      <button 
        onClick={handleReset}
        title="게임 초기화"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-600 text-slate-300 hover:bg-red-900/50 hover:text-red-400 hover:border-red-500 transition-all shadow-lg hover:rotate-180 duration-500"
      >
        <RotateCcw size={20} />
      </button>
    </div>
  );
}
