'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { useGame } from '@/store/GameState';

// Define the WebChat Store type loosely to avoid global declaration issues
let webChatStore: any = null;

export function ChatPanel() {
  const { stage, collectedHints } = useGame();
  const [isWebChatLoaded, setIsWebChatLoaded] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [botStatus, setBotStatus] = useState('대기 중...');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // .env.local 파일에 NEXT_PUBLIC_DIRECT_LINE_SECRET 값을 설정하세요.
  const directLineSecret = process.env.NEXT_PUBLIC_DIRECT_LINE_SECRET || '';

  // Initialize WebChat when user clicks "Start Chat"
  const startChat = () => {
    if (!isWebChatLoaded || !window.WebChat) return;
    
    setIsChatStarted(true);
    setBotStatus('연결 중...');

    // 1. Create WebChat Store (Singleton for the session)
    if (!webChatStore) {
      webChatStore = window.WebChat.createStore(
        {},
        () => (next: any) => (action: any) => next(action)
      );
    }

    // 2. Create DirectLine
    const directLine = window.WebChat.createDirectLine({
      secret: directLineSecret
    });

    // 3. Render WebChat
    if (chatContainerRef.current) {
      window.WebChat.renderWebChat(
        {
          directLine,
          store: webChatStore,
          locale: 'ko-KR',
          styleOptions: {
            hideUploadButton: true,
            botAvatarInitials: '🕵️‍♂️',
            userAvatarInitials: '👤',
            primaryFont: "'Geist Sans', sans-serif",
            rootHeight: '100%',
            backgroundColor: '#1a1a2e',
            bubbleBackground: '#1e1e35',
            bubbleTextColor: '#e6edf3',
            bubbleBorderColor: '#30363d',
            bubbleFromUserBackground: '#e3b341',
            bubbleFromUserTextColor: '#1a1a2e',
            sendBoxBackground: '#111827',
            sendBoxTextColor: '#e6edf3',
            sendBoxBorderTop: '1px solid rgba(255,255,255,.1)',
            inputBorderColor: 'transparent',
            timestampColor: 'rgba(255,255,255,.3)',
          },
        },
        chatContainerRef.current
      );
      
      setBotStatus('연결됨');
      
      // Trigger Welcome Topic with startConversation event, then send initial context
      setTimeout(() => {
        webChatStore.dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: { name: 'startConversation', value: {} },
        });

        const initialContext = {
          gCurrentStage: stage,
          gCurrentHints: collectedHints.length,
          gCurrentStageLabel: stage === 1 && collectedHints.length > 0 ? 'CLUE_FOUND' : stage === 2 ? 'CODE_KNOWN' : stage === 3 ? 'ESCAPED' : 'START',
          gClearTime: ''
        };

        webChatStore.dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: { name: 'setContext', value: initialContext },
        });
        console.log('[Bridge] Initial setContext →', initialContext);
      }, 800);
    }
  };

  // Sync GameContext to Bot whenever stage or hints change
  useEffect(() => {
    if (!isChatStarted || !webChatStore) return;

    let stageLabel = 'START';
    if (stage === 1 && collectedHints.length > 0) stageLabel = 'CLUE_FOUND';
    if (stage === 2) stageLabel = 'CODE_KNOWN';
    if (stage === 3) stageLabel = 'ESCAPED';

    const contextValue = {
      gCurrentStage: stage,
      gCurrentHints: collectedHints.length,
      gCurrentStageLabel: stageLabel,
      gClearTime: ''
    };

    webChatStore.dispatch({
      type: 'WEB_CHAT/SEND_EVENT',
      payload: {
        name: 'setContext',
        value: contextValue,
      },
    });
    console.log('[Bridge] setContext →', contextValue);
  }, [stage, collectedHints.length, isChatStarted]);

  return (
    <div className="w-[40vw] min-w-[320px] max-w-[500px] h-full flex flex-col bg-[#f5f5f5] border-l border-slate-700/50 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-50">
      
      {/* Bot Framework Script Load */}
      <Script 
        src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"
        onLoad={() => setIsWebChatLoaded(true)}
      />

      {/* Powered By Banner */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white/75 text-[0.78rem] tracking-[2px] uppercase text-center py-[10px] flex items-center justify-center gap-[10px] border-b border-white/10">
        <div className="flex items-center gap-[6px]">
          <div className="w-[22px] h-[22px] bg-gradient-to-br from-[#0078d4] to-[#50e6ff] rounded-[5px] flex items-center justify-center text-[0.85rem] shrink-0 shadow-[0_0_8px_rgba(80,230,255,0.35)]">
            ✨
          </div>
          <span><strong>Powered by</strong> <em className="text-[#50e6ff] not-italic font-semibold">Copilot Studio</em></span>
        </div>
      </div>

      {/* Bot Header */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-[18px_20px_16px] flex items-center gap-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.25)] z-10">
        <div className="relative shrink-0">
          <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#e3b341] to-[#f0a500] flex items-center justify-center text-[1.8rem] shadow-[0_0_0_3px_rgba(227,179,65,0.35)]">
            🕵️‍♂️
          </div>
          {isChatStarted && (
            <div className="absolute bottom-[2px] right-[2px] w-[12px] h-[12px] rounded-full bg-[#4caf50] border-2 border-[#16213e] shadow-[0_0_6px_#4caf50]"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[1rem] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">왓슨</div>
          <div className="text-[0.72rem] text-white/55 mt-[2px]">탐정의 비밀 수첩 도우미</div>
        </div>
        <span className={`shrink-0 text-[0.65rem] px-[9px] py-[3px] rounded-[10px] border whitespace-nowrap ${isChatStarted ? 'bg-[#4caf50]/25 border-[#4caf50] text-[#a5d6a7]' : 'bg-white/15 border-white/20 text-white/70'}`}>
          {botStatus}
        </span>
      </div>

      {/* Welcome Screen (Before Chat) */}
      {!isChatStarted && (
        <div className="flex-1 flex flex-col items-center justify-center p-[28px_24px] gap-[16px] bg-gradient-to-b from-[#1e1e30] to-[#111827]">
          <div className="text-[3.5rem] drop-shadow-[0_0_16px_rgba(227,179,65,0.5)] animate-[bounce_3s_ease-in-out_infinite]">🕵️‍♂️</div>
          <div className="text-[1.1rem] font-bold text-[#e3b341] text-center">안녕하세요, 저는 왓슨입니다!</div>
          <div className="text-[0.82rem] text-white/55 text-center leading-[1.6] max-w-[280px]">탐정님의 비밀 수첩 조수로, 여러분의 탈출을 돕겠습니다. 힌트가 필요하면 언제든지 묻어보세요!</div>
          
          <div className="bg-white/5 border border-white/10 rounded-[10px] p-[12px_16px] w-full max-w-[300px] mt-2">
            <p className="text-[0.75rem] text-white/45 mb-[6px] uppercase tracking-[1px]">학습 가이드</p>
            <ul>
              <li className="text-[0.8rem] text-white/70 list-none py-[4px] border-b border-white/5 before:content-['💡_']">"힌트를 줘" 라고 말하세요</li>
              <li className="text-[0.8rem] text-white/70 list-none py-[4px] border-b border-white/5 before:content-['💡_']">"다음 단계 알려줘" 라고 해보세요</li>
              <li className="text-[0.8rem] text-white/70 list-none py-[4px] before:content-['💡_']">"어떻게 풀어요?" 라고 질문하세요</li>
            </ul>
          </div>
          
          <button 
            onClick={startChat}
            disabled={!isWebChatLoaded}
            className="mt-[4px] px-[32px] py-[12px] border-none rounded-[28px] bg-gradient-to-r from-[#e3b341] to-[#f0a500] text-[#1a1a2e] text-[0.95rem] font-bold cursor-pointer shadow-[0_4px_18px_rgba(227,179,65,0.45)] transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(227,179,65,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWebChatLoaded ? '💬 채팅 시작하기' : '로딩 중...'}
          </button>
        </div>
      )}

      {/* WebChat Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-hidden" 
        style={{ display: isChatStarted ? 'block' : 'none' }}
      />
    </div>
  );
}
