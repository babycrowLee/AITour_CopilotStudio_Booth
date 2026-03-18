'use client';

import { useGame } from '@/store/GameState';
import { HeaderTimer } from '@/components/HeaderTimer';
import { DialogBox } from '@/components/DialogBox';
import { InventorySidebar } from '@/components/InventorySidebar';
import { Monitor, CreditCard, Lock, X } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Stage1() {
  const { stage, addHint, showDialog, collectedHints, goToStage } = useGame();
  const router = useRouter();
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showLaptopModal, setShowLaptopModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [password, setPassword] = useState('');

  // Handle stage routing mismatch
  useEffect(() => {
    if (stage === 2) {
      router.replace('/stage2');
    } else if (stage === 3) {
      router.replace('/ending');
    }
  }, [stage, router]);

  // Auto-show intro dialog on load
  useEffect(() => {
    if (stage === 1) {
      const timer = setTimeout(() => {
        showDialog({ speaker: '나', text: '탐정님이 사라졌다... 사무실에서 단서를 찾아 노트북에 접속해야 한다.' });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, showDialog]);

  if (stage !== 1) return null;

  const handleCalendarOpen = () => {
    setShowCalendarModal(true);
  };

  const handleCalendarDateClick = () => {
    setShowCalendarModal(false);
    addHint(1);
    showDialog({ speaker: '나', text: '달력에 이번 달 15일에 빨간 동그라미가 쳐져 있다. 중요한 날인가?' });
  };

  const handleCard = () => {
    if (!collectedHints.includes(1)) {
      showDialog({ speaker: '나', text: '아직 명함을 볼 단계가 아닌 것 같다. (달력을 먼저 확인하자)' });
      return;
    }
    setIsCardFlipped(true);
    addHint(2);
    showDialog({ speaker: '나', text: '명함 뒤에 4자리 숫자 [7392]가 적혀 있다.' });
  };

  const handleCoffee = () => {
    if (!collectedHints.includes(2)) {
      showDialog({ speaker: '나', text: '지금은 이걸 볼 때가 아닌 것 같다. (명함을 먼저 확인하자)' });
      return;
    }
    addHint(3);
    showDialog({ speaker: '나', text: '마시다 만 커피잔 밑에 메모지 조각이 있다. "비밀번호는 [달력 날짜] + [명함 숫자]"' });
  };

  const handleLaptop = () => {
    if (collectedHints.length < 3) {
      showDialog({ speaker: '나', text: '노트북에 잠금이 걸려 있다. 주변에서 단서를 더 모아야겠다.' });
    } else {
      setShowLaptopModal(true);
    }
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '157392') {
      showDialog({ speaker: '시스템', text: '비밀번호 일치. 마지막 검색 기록: "지하 창고 B동 402호"... 탐정님이 위험해, 서둘러야겠다!' });
      setShowLaptopModal(false);
      setTimeout(() => {
        goToStage(2);
      }, 4000);
    } else {
      showDialog({ speaker: '시스템', text: '비밀번호가 틀렸습니다.' });
      setPassword('');
    }
  };

  // Guide text based on progress (Strict Sequential)
  const getGuideText = () => {
    if (collectedHints.length === 0) return '🔍 달력을 먼저 확인해 보자.';
    if (collectedHints.length === 1) return '🔍 명함 뒤에 뭔가 숨겨져 있지 않을까?';
    if (collectedHints.length === 2) return '🔍 단서 하나가 더 필요하다... (커피잔 근처 메모)';
    return '💻 모든 단서를 모았다! 노트북을 확인하자';
  };

  // Calendar data for March 2026
  const daysInMonth = 31;
  const firstDayOfWeek = 0; // March 2026 starts on Sunday
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <main className="relative w-full h-full bg-[#1a1b26] flex items-center justify-center overflow-hidden font-sans">
      <HeaderTimer />
      <InventorySidebar />
      <DialogBox />

      {/* Stage Banner */}
      <div className="stage-banner absolute top-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1">
        <div className="bg-black/70 backdrop-blur-md border border-amber-500/40 rounded-xl px-6 py-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <span className="text-amber-400 font-black text-sm tracking-[0.3em] uppercase">Stage 1</span>
          <span className="text-slate-400 mx-3">|</span>
          <span className="text-slate-300 font-semibold text-sm">텅 빈 탐정 사무소</span>
        </div>
      </div>

      {/* Guide Text */}
      <div className="guide-text absolute bottom-24 left-1/2 -translate-x-1/2 z-40" key={collectedHints.length}>
        <div className="bg-black/60 backdrop-blur-sm border border-slate-600/40 rounded-lg px-5 py-2 shadow-lg">
          <span className="text-slate-300 text-sm font-medium">{getGuideText()}</span>
        </div>
      </div>

      {/* ===== ROOM ===== */}
      <div className="relative w-[1000px] h-[620px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] border-4 border-[#2A2520]">

        {/* Ceiling area */}
        <div className="absolute top-0 left-0 w-full h-[12px] bg-gradient-to-b from-[#4A5568] to-[#5A6A7A] z-10" />

        {/* Walls */}
        <div className="absolute inset-0 wall-texture">
          {/* Wall light effect from window */}
          <div className="absolute top-0 left-[20%] w-[30%] h-[60%] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
        </div>

        {/* Baseboard */}
        <div className="absolute bottom-[200px] left-0 w-full h-[14px] baseboard z-20 shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />

        {/* Floor */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] wood-floor z-10 relative">
          {/* Floor shadow from desk */}
          <div className="absolute top-0 left-[15%] w-[70%] h-[60px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* ===== WALL DECORATIONS ===== */}

        {/* Picture frame on wall (left) */}
        <div className="absolute top-[60px] left-[60px] w-[120px] h-[90px] picture-frame rounded-sm z-20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[90px] h-[60px] bg-gradient-to-br from-[#1A3028] to-[#0D1F17] rounded-sm flex items-center justify-center">
              <span className="text-emerald-700/50 text-xs font-bold tracking-wider">DETECTIVE K.</span>
            </div>
          </div>
        </div>

        {/* Wall shelf (left side) */}
        <div className="absolute top-[180px] left-[40px] w-[150px] h-[10px] wall-shelf rounded-sm z-20" />
        {/* Items on shelf — books */}
        <div className="absolute top-[140px] left-[50px] flex gap-[3px] z-20 pointer-events-none">
          <div className="w-[14px] h-[38px] bg-[#8B4513] rounded-t-sm shadow-sm" />
          <div className="w-[12px] h-[32px] bg-[#2F4F4F] rounded-t-sm shadow-sm mt-[6px]" />
          <div className="w-[16px] h-[42px] bg-[#8B0000] rounded-t-sm shadow-sm -mt-[4px]" />
          <div className="w-[12px] h-[28px] bg-[#DAA520] rounded-t-sm shadow-sm mt-[10px]" />
          <div className="w-[14px] h-[35px] bg-[#2E4057] rounded-t-sm shadow-sm mt-[3px]" />
        </div>

        {/* Wall outlet */}
        <div className="absolute top-[310px] left-[200px] w-[22px] h-[34px] wall-outlet rounded-sm z-20">
          <div className="flex flex-col items-center justify-center h-full gap-[4px]">
            <div className="flex gap-[4px]">
              <div className="w-[2px] h-[6px] bg-[#555] rounded-full" />
              <div className="w-[2px] h-[6px] bg-[#555] rounded-full" />
            </div>
            <div className="w-[4px] h-[4px] rounded-full bg-[#555]" />
          </div>
        </div>

        {/* CCTV Camera (top right) */}
        <div className="absolute top-[20px] right-[80px] z-20 pointer-events-none">
          <div className="relative">
            <div className="w-[10px] h-[20px] bg-[#333] rounded-b-sm mx-auto" />
            <div className="w-[30px] h-[22px] bg-[#2A2A2A] rounded-md shadow-md flex items-center justify-center">
              <div className="w-[10px] h-[10px] rounded-full bg-[#111] border border-[#444]">
                <div className="w-[3px] h-[3px] rounded-full bg-red-500 mx-auto mt-[3px] animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== DOOR (right side) ===== */}
        <div className="absolute top-[50px] right-[180px] w-[110px] h-[310px] room-door rounded-t-md z-15 shadow-[inset_0_0_20px_rgba(0,0,0,0.3),_4px_0_10px_rgba(0,0,0,0.2)]">
          {/* Door frame */}
          <div className="absolute inset-0 border-[6px] border-[#6B553D] rounded-t-md pointer-events-none" />
          {/* Door panel decoration */}
          <div className="absolute top-[20px] left-[15px] right-[15px] h-[80px] border-2 border-[#8B6E50]/50 rounded-sm" />
          <div className="absolute top-[120px] left-[15px] right-[15px] h-[120px] border-2 border-[#8B6E50]/50 rounded-sm" />
          {/* Door handle */}
          <div className="absolute top-[55%] right-[12px] w-[10px] h-[28px] bg-gradient-to-b from-[#C0C0C0] to-[#808080] rounded-full shadow-md" />
          {/* Door diamond window */}
          <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[50px] h-[50px] rotate-45 bg-[#3A2A1A] border-2 border-[#8B6E50] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#4A3A2A]/80 to-[#2A1A0A]" />
          </div>
        </div>

        {/* ===== DESK ===== */}
        <div className="absolute bottom-[160px] left-[180px] z-30">
          {/* Desk top surface */}
          <div className="w-[280px] h-[16px] wood-desk rounded-t-md shadow-[0_-2px_8px_rgba(0,0,0,0.3)]" />
          {/* Desk front panel */}
          <div className="w-[280px] h-[120px] bg-gradient-to-b from-[#8B6E50] to-[#7A5D42] rounded-b-md shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            {/* Desk drawer */}
            <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-[100px] h-[50px] bg-[#7A5D42] border border-[#6B4E38] rounded-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[16px] h-[8px] bg-[#B0A090] rounded-full shadow-sm" />
            </div>
          </div>
          {/* Desk legs */}
          <div className="absolute -bottom-[40px] left-[10px] w-[12px] h-[40px] bg-[#6B4E38] rounded-b-sm" />
          <div className="absolute -bottom-[40px] right-[10px] w-[12px] h-[40px] bg-[#6B4E38] rounded-b-sm" />
        </div>

        {/* ===== CHAIR ===== */}
        <div className="absolute bottom-[140px] left-[260px] z-25 pointer-events-none">
          {/* Chair back */}
          <div className="w-[50px] h-[80px] bg-gradient-to-b from-[#9E8462] to-[#8B7355] rounded-t-lg border-2 border-[#7A6548] shadow-md">
            {/* Chair back slats */}
            <div className="flex justify-center gap-[6px] mt-[8px]">
              <div className="w-[4px] h-[55px] bg-[#7A6548] rounded-full" />
              <div className="w-[4px] h-[55px] bg-[#7A6548] rounded-full" />
              <div className="w-[4px] h-[55px] bg-[#7A6548] rounded-full" />
            </div>
          </div>
          {/* Chair seat */}
          <div className="w-[56px] h-[10px] bg-[#8B7355] rounded-sm -ml-[3px] shadow-sm" />
          {/* Chair legs */}
          <div className="flex justify-between w-[50px]">
            <div className="w-[5px] h-[24px] bg-[#7A6548] rounded-b-sm" />
            <div className="w-[5px] h-[24px] bg-[#7A6548] rounded-b-sm" />
          </div>
        </div>

        {/* ===== INTERACTIVE OBJECTS ===== */}

        {/* Calendar on Wall */}
        <button
          onClick={handleCalendarOpen}
          className="absolute top-[80px] right-[340px] z-30 group transition-transform hover:scale-105"
        >
          <div className="w-[80px] h-[70px] bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-gray-300 overflow-hidden relative">
            {/* Calendar header */}
            <div className="h-[18px] bg-red-600 flex items-center justify-center">
              <span className="text-white text-[8px] font-bold tracking-wider">MARCH 2026</span>
            </div>
            {/* Calendar mini grid */}
            <div className="p-[4px] grid grid-cols-7 gap-[1px]">
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  className={`w-[7px] h-[7px] flex items-center justify-center text-[4px] rounded-full ${
                    i + 1 === 15
                      ? 'bg-red-500 text-white font-bold ring-1 ring-red-400'
                      : 'text-gray-500'
                  }`}
                >
                  {i + 1 === 15 ? '●' : ''}
                </div>
              ))}
            </div>
            {/* Hover glow */}
            <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/10 transition-colors pointer-events-none" />
          </div>
          {collectedHints.includes(1) && (
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          )}
        </button>

        {/* Laptop on Desk */}
        <button
          onClick={handleLaptop}
          className="group absolute bottom-[280px] left-[260px] z-40 flex flex-col items-center transition-transform hover:scale-[1.03]"
        >
          {/* Laptop screen */}
          <div className="w-[140px] h-[90px] bg-[#1a1b26] rounded-t-lg border-[3px] border-[#333] shadow-2xl flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(122,162,247,0.3)] transition-shadow">
            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-400/15 transition-colors" />
            {collectedHints.length === 3 ? (
              <Lock size={32} className="text-green-400 animate-pulse" />
            ) : (
              <Monitor size={32} className="text-[#7aa2f7]" />
            )}
          </div>
          {/* Laptop base */}
          <div className="w-[160px] h-[8px] bg-[#555] rounded-b-lg border-x-2 border-b-2 border-[#333]" />
        </button>

        {/* Coffee Mug on Desk */}
        <button
          onClick={handleCoffee}
          className="absolute bottom-[280px] left-[420px] z-40 group transition-transform hover:scale-110 hover:-translate-y-2 duration-300"
        >
          <div className="relative">
            {/* Steam */}
            <div className="absolute -top-[20px] left-[8px] flex gap-[6px] pointer-events-none">
              <div className="steam-line w-[2px] h-[12px] bg-white/30 rounded-full" />
              <div className="steam-line w-[2px] h-[10px] bg-white/20 rounded-full" />
              <div className="steam-line w-[2px] h-[14px] bg-white/25 rounded-full" />
            </div>
            {/* Cup */}
            <div className="w-[32px] h-[28px] bg-gradient-to-b from-[#E8E0D4] to-[#D0C8BC] rounded-b-lg border-2 border-[#C0B0A0] shadow-md relative">
              {/* Coffee liquid */}
              <div className="absolute top-[4px] left-[3px] right-[3px] h-[8px] bg-[#3E2723] rounded-sm" />
              {/* Handle */}
              <div className="absolute top-[4px] -right-[10px] w-[10px] h-[14px] border-2 border-[#C0B0A0] rounded-r-full bg-transparent" />
            </div>
            {collectedHints.includes(3) && (
              <div className="absolute -bottom-2 -right-4 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </button>

        {/* Business Card on Desk */}
        <button
          onClick={handleCard}
          className="absolute bottom-[270px] right-[260px] z-40 [perspective:1000px] group"
        >
          <div className={`w-[100px] h-[60px] transition-all duration-700 [transform-style:preserve-3d] ${isCardFlipped ? '[transform:rotateY(180deg)] scale-110' : 'hover:-translate-y-2 hover:shadow-xl'}`}>
            {/* Front of card */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E8] to-[#E8E0D0] border border-[#C0B0A0] rounded-md shadow-lg flex flex-col items-center justify-center [backface-visibility:hidden]">
              <CreditCard className="text-amber-800 mb-1" size={18} />
              <div className="w-[50px] h-[1px] bg-amber-800/30 rounded-full" />
              <span className="text-[6px] text-amber-800/50 mt-1 font-semibold tracking-wider">DETECTIVE K.</span>
            </div>
            {/* Back of card */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-300 rounded-md shadow-[0_0_20px_rgba(165,180,252,0.5)] flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="font-mono font-black text-xl text-indigo-900 tracking-[0.2em]">7392</span>
            </div>

            {!isCardFlipped && collectedHints.includes(2) && (
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-in zoom-in z-50">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>

          {!isCardFlipped && (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              클릭하여 뒤집기
            </div>
          )}
        </button>

        {/* ===== DECORATIVE FURNITURE ===== */}

        {/* Plant (right side) */}
        <div className="absolute bottom-[200px] right-[60px] z-25 pointer-events-none">
          {/* Leaves */}
          <div className="relative">
            <div className="absolute -top-[50px] -left-[20px] w-[24px] h-[40px] bg-[#2D7A3A] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-[-30deg] shadow-sm" />
            <div className="absolute -top-[60px] left-[0px] w-[22px] h-[45px] bg-[#3A9148] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-[5deg] shadow-sm" />
            <div className="absolute -top-[55px] left-[15px] w-[24px] h-[42px] bg-[#2D7A3A] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-[25deg] shadow-sm" />
            <div className="absolute -top-[45px] left-[28px] w-[20px] h-[36px] bg-[#3A9148] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-[45deg] shadow-sm" />
            <div className="absolute -top-[48px] -left-[10px] w-[20px] h-[38px] bg-[#3A9148] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-[-15deg] shadow-sm" />
          </div>
          {/* Stem */}
          <div className="w-[4px] h-[20px] bg-[#2D5A1E] mx-auto rounded-full" />
          {/* Pot */}
          <div className="w-[36px] h-[30px] plant-pot rounded-b-lg -ml-[8px]" />
        </div>

        {/* Filing cabinet (right side) */}
        <div className="absolute bottom-[200px] right-[120px] z-20 pointer-events-none">
          <div className="w-[70px] h-[100px] bg-gradient-to-b from-[#4A4A4A] to-[#3A3A3A] rounded-t-md shadow-md">
            {/* Drawers */}
            <div className="flex flex-col gap-[2px] p-[4px]">
              <div className="h-[28px] bg-[#555] rounded-sm border border-[#666] flex items-center justify-center">
                <div className="w-[14px] h-[3px] bg-[#888] rounded-full" />
              </div>
              <div className="h-[28px] bg-[#555] rounded-sm border border-[#666] flex items-center justify-center">
                <div className="w-[14px] h-[3px] bg-[#888] rounded-full" />
              </div>
              <div className="h-[28px] bg-[#555] rounded-sm border border-[#666] flex items-center justify-center">
                <div className="w-[14px] h-[3px] bg-[#888] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Sofa corner (bottom right) */}
        <div className="absolute bottom-[200px] right-[0px] z-20 pointer-events-none">
          <div className="w-[80px] h-[70px] bg-gradient-to-b from-[#3A6B68] to-[#2D5754] rounded-tl-2xl shadow-md">
            {/* Cushion */}
            <div className="absolute top-[10px] left-[10px] w-[60px] h-[30px] bg-[#4A8B87] rounded-lg shadow-inner" />
            {/* Armrest */}
            <div className="absolute top-0 right-0 w-[15px] h-[70px] bg-[#2D5754] rounded-tl-xl" />
          </div>
        </div>

        {/* Floor shadow (ambient) */}
        <div className="absolute bottom-[200px] left-[250px] w-[200px] h-[20px] bg-black/10 rounded-[50%] blur-sm z-15 pointer-events-none" />

        {/* Room ambient light overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none z-[35]" />
      </div>

      {/* ===== CALENDAR MODAL ===== */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-[340px] relative animate-in zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowCalendarModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors p-1 z-10"
            >
              <X size={18} />
            </button>

            {/* Calendar header */}
            <div className="bg-red-600 rounded-t-2xl px-6 py-4">
              <div className="text-red-200 text-xs font-semibold tracking-wider">2026</div>
              <div className="text-white text-xl font-bold">3월 (March)</div>
            </div>

            {/* Calendar body */}
            <div className="p-5">
              {/* Day names */}
              <div className="calendar-grid mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="w-[36px] h-[24px] flex items-center justify-center text-xs font-bold text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day numbers */}
              <div className="calendar-grid">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDayOfWeek }, (_, i) => (
                  <div key={`empty-${i}`} className="calendar-day" />
                ))}
                {/* Actual days */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isCircled = day === 15;
                  return (
                    <button
                      key={day}
                      onClick={isCircled ? handleCalendarDateClick : undefined}
                      className={`calendar-day ${isCircled ? 'circled cursor-pointer hover:bg-red-50 transition-colors' : 'cursor-default'}`}
                      disabled={!isCircled}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hint text */}
            {!collectedHints.includes(1) && (
              <div className="px-5 pb-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-amber-800 text-xs font-medium text-center">
                  💡 빨간 동그라미가 쳐진 날짜를 클릭해 보세요
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PASSWORD MODAL ===== */}
      {showLaptopModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-[#1a1b26] border-2 border-[#7aa2f7] rounded-3xl p-10 w-[26rem] shadow-[0_0_80px_rgba(122,162,247,0.3)] relative transform transition-all duration-300 animate-in zoom-in-95">
            <button
              onClick={() => setShowLaptopModal(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors p-2"
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-[#24283b] rounded-full flex items-center justify-center border-4 border-[#16161e] shadow-inner mb-2">
                <Lock size={36} className="text-[#7dcfff]" />
              </div>
              <h2 className="text-2xl font-black text-[#c0caf5] tracking-widest">SYSTEM LOCK</h2>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col w-full gap-5">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                  placeholder="6자리 코드 입력"
                  maxLength={6}
                  className="w-full bg-[#16161e] border-2 border-[#414868] rounded-xl px-4 py-4 text-3xl text-center font-mono font-bold tracking-[0.4em] text-[#e0af68] focus:outline-none focus:border-[#7aa2f7] transition-colors placeholder:text-[#414868] placeholder:text-base placeholder:tracking-normal"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={password.length !== 6}
                  className="w-full bg-[#7aa2f7] hover:bg-[#8db4ff] disabled:bg-[#414868] disabled:text-[#565f89] disabled:cursor-not-allowed text-[#16161e] font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 text-lg tracking-widest mt-2"
                >
                  ACCESS
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
