# 천재 탐정 K: 방탈출 데모 게임 🕵️‍♂️

"천재 탐정 K의 비밀 수첩"을 테마로 한 단서 수집형 웹 방탈출 게임입니다. 이 프로젝트는 **Microsoft AITour Copilot Studio Booth** 등의 행사 시연 데모를 위해 Next.js와 Tailwind CSS를 활용해 제작되었습니다.

## 📸 스크린샷

![방탈출 게임 데모 화면](./public/demo-screenshot.png)

## 🧩 게임 특징
- **비주얼 노벨 UI**: 직관적인 하단 텍스트 및 대화창 지원
- **스테이지 기반 진행**: 총 2개의 스테이지와 탈출 엔딩으로 구성
- **실시간 타이머**: 5분 타이머가 긴장감을 더해주는 플레이 경험
- **저장 가능한 진행 상황**: LocalStorage 연동으로 실수로 화면을 종료해도 이어서 플레이 가능

## 🚀 빠른 시작 (Getting Started)

의존성 패키지를 설치하고 개발 서버를 가동합니다.

```bash
npm install
npm run dev
```

이후 브라우저에서 [http://localhost:3000](http://localhost:3000) 주소로 접속하면 게임을 플레이할 수 있습니다.

## 🛠 기술 스택
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context & LocalStorage

## Architecture
```mermaid
flowchart LR

  %% =======================
  %% As-Is Architecture
  %% =======================
  subgraph HOST["Azure Static Web Apps (Static Next.js Hosting)"]
    subgraph BROWSER["User Browser / Kiosk Session"]
      GP["Game Pages\nStage 1 / Stage 2 / Ending"]
      GC["GameProvider (React Context)\nstage, collectedHints, timeLeft, dialog"]
      LS["localStorage\npersist: stage + hints"]
      CP["ChatPanel\nBot Framework Web Chat\nDirectLine client (createDirectLine)"]

      GP -->|"addHint(), goToStage(), showDialog()"| GC
      GC <-->|"persist / restore"| LS
      GC -->|"shared game context"| CP
    end

    CDN["Static assets\n(HTML/JS/CSS)"]
    CDN -->|"serve app"| GP
  end

  DL["Direct Line Service\n(Bot Framework Direct Line API 3.0)"]
  AG["Copilot Studio Agent\nhint dialog / context-aware flow"]

  CP -->|"postActivity: event = startConversation"| DL
  CP -->|"postActivity: event = setContext\n(gCurrentStage, gCurrentHints,\ngCurrentStageLabel, gClearTime)"| DL
  DL -->|"activities"| AG
  AG -->|"activities"| DL
  DL -->|"activities"| CP

  %% =======================
  %% Notes / Constraints
  %% =======================
  NB["Repo characteristic:\nNo dedicated game backend\nNo Next.js API layer"]
  SEC["Current risk:\nDirect Line secret used client-side\n(should avoid exposing secret)"]
  DLNOTE["Direct Line auth:\nAuthorization: Bearer SECRET_OR_TOKEN\n(secret or token)"]

  HOST -.-> NB
  CP -.-> SEC
  DL -.-> DLNOTE

  %% =======================
  %% Recommended (Minimal Backend Add-on)
  %% =======================
  subgraph REC["Recommended add-on (Production hardening)"]
    TOK["Token Broker API\n(Azure Function / API)\nIssue short-lived Direct Line token"]
  end

  CP -.->|"request token (recommended)"| TOK
  TOK -.->|"return short-lived token"| CP
```

## 💡 플레이 팁
> 제한 시간 안에 맵 내의 여러 단서(힌트)를 찾아 모으고, 최종 비밀번호나 키워드를 유추해 닫혀 있는 문과 시스템의 잠금을 해제하세요!
