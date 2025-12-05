# 컬러 팔레트 사용 가이드

## ✅ 검토 완료 (2024)

모든 컴포넌트에서 `tokens.js`의 컬러 팔레트가 올바르게 적용되었습니다.

---

## 📋 컬러 네이밍 규칙

### 배경색 (Background)
| Tailwind 클래스 | 색상 코드 | 용도 |
|----------------|----------|------|
| `bg-bg-primary` | `#121212` | 메인 배경 |
| `bg-bg-secondary` | `#101010` | 사이드바 배경 |
| `bg-bg-elevated` | `#1a1a1a` | 카드, 상승된 요소 |

### 텍스트색 (Text)
| Tailwind 클래스 | 색상 코드 | 용도 |
|----------------|----------|------|
| `text-text-primary` | `#ffffff` | 주요 텍스트 (흰색) |
| `text-text-secondary` | `#a1a9c0` | 라벨, 캡션, 섹션 제목 |
| `text-text-tertiary` | `#727c95` | Placeholder, 비활성 텍스트 |
| `text-text-muted` | `#4a5568` | 더 약한 텍스트 |

### 테두리색 (Border)
| Tailwind 클래스 | 색상 코드 | 용도 |
|----------------|----------|------|
| `border-border-primary` | `#292929` | 기본 테두리, 구분선 |
| `border-border-secondary` | `#1f1f1f` | 약한 테두리 |

### 브랜드색 (Brand)
| Tailwind 클래스 | 색상 코드 | 용도 |
|----------------|----------|------|
| `bg-brand-primary` / `text-brand-primary` | `#455cdc` | 로고, 브랜드 요소 |
| `bg-brand-hover` | `#3547c9` | Hover 상태 |
| `bg-brand-active` | `#2638a8` | Active 상태 |

### 차트색 (Chart)
| Tailwind 클래스 | 색상 코드 | 용도 |
|----------------|----------|------|
| `bg-chart-activity` / `text-chart-activity` | `#f83464` | 활동성 (핑크/레드) |
| `bg-chart-volatility` / `text-chart-volatility` | `#ff852f` | 경제적 변동성 (오렌지) |
| `bg-chart-persistence` / `text-chart-persistence` | `#43d2a7` | 지속성 (민트/그린) |

---

## 🎯 사용 예시

### ✅ 올바른 사용
```jsx
// 배경
<div className="bg-bg-primary">...</div>
<div className="bg-bg-secondary">...</div>

// 텍스트
<h1 className="text-text-primary">제목</h1>
<p className="text-text-secondary">부제목</p>

// 테두리
<div className="border border-border-primary">...</div>

// 차트 컬러
<div className="bg-chart-activity">Activity</div>
```

### ❌ 잘못된 사용
```jsx
// 하드코딩된 색상 (tokens 사용 안 함)
<div className="bg-[#121212]">...</div>  // ❌
<div className="text-[#ffffff]">...</div> // ❌

// 잘못된 클래스명
<div className="bg-primary">...</div>     // ❌ (모호함)
<div className="text-secondary">...</div> // ❌ (모호함)
```

---

## 📁 파일별 적용 현황

### ✅ `tailwind.config.js`
- 모든 컬러가 명확한 네이밍으로 정의됨
- 네이밍 충돌 없음

### ✅ `src/App.jsx`
- `bg-bg-primary` ✓
- `text-text-primary` ✓

### ✅ `src/components/Header.jsx`
- `border-border-primary` ✓
- `bg-bg-secondary` ✓
- `text-text-primary` ✓

### ✅ `src/components/Sidebar.jsx`
- `bg-bg-secondary` ✓
- `border-border-primary` ✓
- `text-text-secondary` ✓

### ✅ `src/index.css`
- `.btn-primary` → `bg-brand-primary`, `text-text-primary` ✓
- `.btn-secondary` → `border-border-primary`, `bg-bg-elevated` ✓

---

## 🔧 개발 팁

### 1. 색상 추가하기
`src/design/tokens.js`에서 색상 추가:
```js
export const colors = {
  // 새로운 색상 추가
  success: '#22c55e',
};
```

`tailwind.config.js`에 등록:
```js
colors: {
  'success': colors.success,
}
```

### 2. 색상 변경하기
`src/design/tokens.js`에서만 수정하면 전체 프로젝트에 자동 반영됩니다.

### 3. 일관성 유지
- **항상** tokens에 정의된 색상 사용
- 하드코딩된 색상 값(`#ffffff`) 사용 금지
- 새로운 컴포넌트 만들 때도 동일한 네이밍 규칙 따르기

---

## 🚀 다음 단계

새로운 컴포넌트를 만들 때:
1. 이 가이드 참고
2. tokens에 정의된 색상만 사용
3. 일관된 네이밍 규칙 유지

질문이나 색상 추가가 필요하면 `src/design/tokens.js` 수정 후 이 문서도 업데이트하세요!

