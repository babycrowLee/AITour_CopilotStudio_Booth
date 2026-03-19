'use client';

import { useGame } from '@/store/GameState';
import { Download, QrCode, RotateCcw, ShieldCheck, Smartphone } from 'lucide-react';
import QRCode from 'qrcode';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const formatKstTimestamp = (date: Date) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

export default function Ending() {
  const { stage, resetGame } = useGame();
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [isCertificateReady, setIsCertificateReady] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    if (stage !== 3) {
      router.replace(stage === 1 ? '/' : '/stage2');
      return;
    }

    const timer = setTimeout(() => {
      setShowSummary(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [stage, router]);

  useEffect(() => {
    if (!certificateUrl) {
      return;
    }

    let isActive = true;

    void QRCode.toDataURL(certificateUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 260,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    }).then((url: string) => {
      if (isActive) {
        setQrCodeDataUrl(url);
      }
    });

    return () => {
      isActive = false;
    };
  }, [certificateUrl]);

  if (stage !== 3) return null;

  const handleRestart = () => {
    resetGame();
    router.push('/');
  };

  const handleCertificateCreate = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = playerName.trim();
    if (!trimmedName || typeof window === 'undefined') return;

    const clearedAt = new Date();
    const params = new URLSearchParams({
      name: trimmedName,
      clearedAt: clearedAt.toISOString(),
    });

    const url = `${window.location.origin}/certificate?${params.toString()}`;
    setQrCodeDataUrl('');
    setCertificateUrl(url);
    setIsCertificateReady(true);
  };

  return (
    <main className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.22),_transparent_30%),linear-gradient(180deg,#04070c_0%,#02040a_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)] opacity-25" />

      {!showSummary ? (
        <div className="z-10 flex animate-in fade-in zoom-in-75 flex-col items-center justify-center duration-700">
          <div className="flex h-36 w-36 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_80px_rgba(56,189,248,0.22)]">
            <ShieldCheck size={76} className="text-cyan-200" />
          </div>
          <h1 className="mt-8 text-center text-6xl font-black tracking-[0.26em] text-white">
            CASE CLOSED
          </h1>
          <p className="mt-4 text-lg text-cyan-100/80">철문 해제 및 탐정 구출 완료</p>
        </div>
      ) : (
        <div className="z-10 w-full max-w-4xl rounded-[32px] border border-cyan-300/20 bg-[#0b1119]/85 p-10 text-center shadow-[0_0_100px_rgba(56,189,248,0.14)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-400/40 bg-green-400/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <span className="text-4xl font-black text-green-300">✓</span>
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-[0.12em] text-white">사건 해결</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            사라진 탐정의 사무실에서 단서를 모아 범인의 지하 창고까지 추적해냈다.
            <br />
            범인의 아지트를 돌파했다! 탐정을 무사히 구출했다!
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[28px] border border-white/10 bg-black/35 p-6 text-left">
              <div className="text-sm font-black tracking-[0.24em] text-cyan-300">CLEAR REWARD</div>
              <div className="mt-5 flex items-start gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-cyan-300/15">
                  <Download size={22} className="text-cyan-200" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">맞춤형 탈출 Certificate</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">
                    이름을 입력하면 개인화된 수료증 링크와 QR 코드가 생성됩니다.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCertificateCreate} className="mt-5 flex flex-col gap-4">
                <input
                  type="text"
                  value={playerName}
                  onChange={(event) => {
                    setPlayerName(event.target.value);
                    setIsCertificateReady(false);
                    setCertificateUrl('');
                    setQrCodeDataUrl('');
                  }}
                  placeholder="이름"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-300/60"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 transition-all hover:scale-[1.01] hover:bg-cyan-200"
                >
                  수료증 만들기
                </button>
              </form>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
                <div className="font-semibold text-white">다운로드 방법</div>
                <p className="mt-2">
                  행사 노트북에서 이름을 입력한 뒤, 휴대폰으로 QR 코드를 스캔하면 본인 기기에서 수료증을 열고
                  저장할 수 있습니다.
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-black/35 p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-black tracking-[0.24em] text-cyan-300">
                <QrCode size={16} />
                MOBILE DOWNLOAD
              </div>

              {isCertificateReady && qrCodeDataUrl ? (
                <>
                  <div className="mt-5 flex justify-center">
                    <div className="rounded-[28px] border border-cyan-300/20 bg-white p-4 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeDataUrl}
                        alt="Certificate QR code"
                        className="h-[240px] w-[240px] rounded-xl"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    <span className="font-semibold text-white">{playerName.trim()}</span>님의 맞춤형 수료증이
                    준비되었습니다.
                    <br />
                    휴대폰으로 QR을 스캔하거나 아래 버튼으로 새 탭에서 열어보세요.
                  </p>

                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition-colors hover:bg-cyan-300/20"
                  >
                    <Smartphone size={18} />
                    수료증 페이지 열기
                  </a>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left text-xs leading-relaxed text-slate-400">
                    발급 시각: {formatKstTimestamp(new Date(new URL(certificateUrl).searchParams.get('clearedAt') || new Date().toISOString()))} (UTC+9)
                  </div>
                </>
              ) : (
                <div className="mt-6 flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-8 text-slate-400">
                  <QrCode size={52} className="text-cyan-300/50" />
                  <p className="mt-4 text-sm leading-relaxed">
                    이름을 입력하고 수료증을 만들면
                    <br />
                    여기에서 QR 코드가 생성됩니다.
                  </p>
                </div>
              )}
            </section>
          </div>

          <button
            onClick={handleRestart}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-cyan-300 px-8 py-4 text-lg font-black text-slate-950 transition-all hover:scale-[1.02] hover:bg-cyan-200"
          >
            <RotateCcw size={22} />
            다시 플레이하기
          </button>
        </div>
      )}
    </main>
  );
}
