# 디자인 시스템 가이드

Figma qohj0go3 채널에서 추출한 STABIO 프로젝트 대시보드 디자인 시스템입니다.

## 📁 파일 구조

```
src/design/
├── tokens.js       # 디자인 토큰 정의
└── README.md       # 이 파일
```

## 🎨 컬러 팔레트

### 배경 (Background)
```jsx
// 메인 배경
className="bg-bg-primary"       // #121212

// 사이드바 배경
className="bg-bg-secondary"     // #101010

// 카드/상승된 요소
className="bg-bg-elevated"      // #1a1a1a
```

### 텍스트 (Text)
```jsx
// 주요 텍스트
className="text-text-primary"   // #ffffff

// 라벨, 캡션
className="text-text-secondary" // #a1a9c0

// Placeholder, 비활성
className="text-text-tertiary"  // #727c95

// 더 약한 텍스트
className="text-text-muted"     // #4a5568
```

### 테두리 (Border)
```jsx
// 기본 테두리
className="border-border-primary"   // #292929

// 약한 테두리
className="border-border-secondary" // #1f1f1f
```

### 브랜드 컬러
```jsx
// 로고, 브랜드
className="bg-brand-primary"    // #455cdc
className="text-brand-primary"  // #455cdc

// Hover 상태
className="bg-brand-hover"      // #3547c9

// Active 상태
className="bg-brand-active"     // #2638a8
```

### 차트 컬러
```jsx
// 활동성 (Activity)
className="bg-chart-activity"       // #f83464
className="text-chart-activity"     // #f83464

// 경제적 변동성 (Economic Volatility)
className="bg-chart-volatility"     // #ff852f
className="text-chart-volatility"   // #ff852f

// 지속성 (Persistence)
className="bg-chart-persistence"    // #43d2a7
className="text-chart-persistence"  // #43d2a7
```

## ✏️ 타이포그래피

### 폰트 크기
```jsx
// 기본 텍스트 (15px)
className="text-base"

// 로고 (20px)
className="text-xl"

// 큰 제목 (24px)
className="text-2xl"
```

### 폰트 굵기
```jsx
// Medium (500) - 일반 텍스트
className="font-medium"

// SemiBold (600) - 체인 이름
className="font-semibold"

// Bold (700) - 라벨, 섹션 타이틀
className="font-bold"

// ExtraBold (800) - 로고
className="font-extrabold"
```

### 자간 (Letter Spacing)
```jsx
// 일반
className="tracking-normal"

// 로고용 (2px)
className="tracking-wide"
```

## 📏 간격 (Spacing)

```jsx
// 10px - 기본 간격
className="p-2"    // padding
className="m-2"    // margin
className="gap-2"  // flex gap

// 20px
className="p-4"

// 30px
className="p-6"
```

## 🔲 Border Radius

```jsx
// 기본 (10px) - 카드, 인풋
className="rounded"

// 작게 (5px)
className="rounded-sm"

// 크게 (15px)
className="rounded-lg"

// 원형
className="rounded-full"
```

## 📦 컴포넌트 예시

### Header
```jsx
<header className="h-[60px] border-b border-border-primary">
  <div className="bg-bg-secondary w-[450px] h-full flex items-center px-4 border-r border-border-primary">
    <div className="text-xl font-extrabold text-text-primary tracking-wide">
      STABIO
    </div>
  </div>
</header>
```

### Search Bar
```jsx
<div className="h-[50px] bg-bg-primary border border-border-primary rounded px-3 flex items-center">
  <input 
    type="text" 
    placeholder="Select a chain"
    className="bg-transparent text-text-primary placeholder:text-text-tertiary text-base font-medium outline-none w-full"
  />
</div>
```

### Chain Card
```jsx
<div className="w-[195px] h-[60px] border border-border-primary rounded p-3 flex items-center gap-2">
  <img src="/icon.png" className="w-[30px] h-[30px]" alt="Chain Icon" />
  <span className="text-base font-semibold text-text-primary">
    COSMOS HUB
  </span>
</div>
```

### Section Label
```jsx
<h2 className="text-base font-bold text-text-secondary tracking-normal">
  WEIGHT CONTROL
</h2>
```

### Weight Item
```jsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-chart-activity"></div>
    <span className="text-base font-medium text-text-primary">Activity</span>
  </div>
  <span className="text-base font-medium text-text-primary">30%</span>
</div>
```

### Divider
```jsx
<hr className="border-t border-border-primary" />
```

## 💡 사용 팁

### 1. 토큰 직접 import
```jsx
import { colors, typography } from '@/design/tokens';

// 스타일에서 직접 사용
const customStyle = {
  backgroundColor: colors.background.primary,
  color: colors.text.primary,
};
```

### 2. Tailwind 클래스 사용 (권장)
```jsx
// Tailwind config에 이미 설정되어 있어서 바로 사용 가능
<div className="bg-bg-primary text-text-primary">
  Content
</div>
```

### 3. 차트 컬러 활용
```jsx
import { colors } from '@/design/tokens';

// Chart.js, Recharts 등에서 사용
const chartData = {
  datasets: [
    {
      label: 'Activity',
      borderColor: colors.chart.activity,
      backgroundColor: colors.chart.activity + '20', // 20% opacity
    },
    {
      label: 'Volatility',
      borderColor: colors.chart.volatility,
    },
    {
      label: 'Persistence',
      borderColor: colors.chart.persistence,
    },
  ],
};
```

## 🔄 업데이트 방법

Figma 디자인이 변경되면:

1. Figma에서 새로운 컬러/폰트 확인
2. `src/design/tokens.js` 파일 업데이트
3. 변경사항이 Tailwind를 통해 자동 반영됨

## 📚 참고

- Figma 채널: qohj0go3
- 메인 폰트: Lato
- 기본 배경: #121212
- 기본 텍스트: #ffffff

