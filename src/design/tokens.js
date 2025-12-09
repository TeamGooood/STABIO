/**
 * 디자인 토큰 (Design Tokens)
 * Figma cypibprc 채널에서 추출한 프로젝트 대시보드 디자인 시스템
 */

export const colors = {
  // Background Colors
  background: {
    primary: '#17191f',    // 메인 배경 (기본 배경)
    secondary: '#101010',  // 사이드바 배경
    elevated: '#1a1a1a',   // 카드/상승된 요소
    base: '#13151a',       // 가장 어두운 배경
    dark: '#222631',       // 어두운 배경/카드
    card: '#222631',       // 카드 배경
  },

  // Border & Divider Colors
  border: {
    primary: '#292929',    // 기본 테두리
    secondary: '#1f1f1f',  // 약한 테두리
    divider: '#2f374c',    // 구분선/분리선
    card: '#2f374c',       // 카드 테두리
  },

  // Text Colors
  text: {
    primary: '#ffffff',    // 주요 텍스트
    secondary: '#a1a9c0',  // 라벨, 캡션
    tertiary: '#727c95',   // Placeholder, 비활성
    muted: '#4a5568',      // 더 약한 텍스트
  },

  // Brand Colors
  brand: {
    primary: '#455cdc',    // 로고, 브랜드 컬러 (파란색)
    hover: '#3547c9',      // hover 상태
    active: '#2638a8',     // active 상태
  },

  // Chart & Data Visualization Colors (Figma cypibprc 채널)
  chart: {
    activity: '#f6465d',        // 활동성 - 레드
    volatility: '#f3ba3a',      // 경제적 변동성 - 옐로우
    persistence: '#0ecb81',     // 지속성 - 그린
    purple: '#9852ed',          // 보라색 - 추가 차트 색상
    
    // 투명도 버전
    activityAlpha: {
      100: '#f6465d',           // 100%
      66: 'rgba(246, 70, 93, 0.66)',   // 66%
      44: 'rgba(246, 70, 93, 0.44)',   // 44%
      10: 'rgba(246, 70, 93, 0.10)',   // 10%
    },
    persistenceAlpha: {
      100: '#0ecb81',           // 100%
      66: 'rgba(14, 203, 129, 0.66)',  // 66%
      44: 'rgba(14, 203, 129, 0.44)',  // 44%
      10: 'rgba(14, 203, 129, 0.10)',  // 10%
    },
  },

  // Gradient Colors (for chart indicators)
  gradient: {
    activity: {
      start: '#f6465d',  // 레드
      end: '#f3ba3a',    // 옐로우
    },
    volatility: {
      start: '#f3ba3a',  // 옐로우
      end: '#0ecb81',    // 그린
    },
  },

  // Semantic Colors
  success: '#0ecb81',      // 성공, 상승 (그린)
  warning: '#f3ba3a',      // 경고 (옐로우)
  danger: '#f6465d',       // 위험, 하락 (레드)
  info: '#455cdc',         // 정보 (블루)
};

export const typography = {
  // Font Family (Figma cypibprc 채널)
  fontFamily: {
    primary: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  },

  // Font Sizes
  fontSize: {
    xs: '12px',      // 작은 캡션
    sm: '13px',      // 작은 텍스트
    base: '15px',    // 기본 텍스트 (대부분의 UI)
    lg: '17px',      // 큰 텍스트
    xl: '20px',      // 로고, 큰 제목
    '2xl': '24px',   // 섹션 제목
    '3xl': '32px',   // 페이지 제목
  },

  // Font Weights (Figma Lato 폰트)
  fontWeight: {
    regular: 400,     // Lato Regular
    medium: 500,      // 일반 텍스트
    semibold: 600,    // 체인 이름, 강조
    bold: 700,        // Lato Bold - 라벨, 섹션 타이틀
    extrabold: 800,   // 로고
    black: 900,       // Lato Black - 헤비 강조
  },

  // Line Heights
  lineHeight: {
    tight: '1.2',     // 18px for 15px font
    normal: '1.5',
    relaxed: '1.75',
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.1em',     // 2px for 20px font (로고용)
  },
};

export const spacing = {
  // Spacing Scale (픽셀 기준)
  0: '0',
  1: '5px',      // 5px
  2: '10px',     // 10px - 기본 간격
  3: '15px',     // 15px
  4: '20px',     // 20px
  5: '25px',     // 25px
  6: '30px',     // 30px
  8: '40px',     // 40px
  10: '50px',    // 50px
  12: '60px',    // 60px
  16: '80px',    // 80px
};

export const borderRadius = {
  none: '0',
  sm: '5px',
  DEFAULT: '10px',   // 기본 border radius (카드, 인풋 등)
  lg: '15px',
  xl: '20px',
  '2xl': '30px',     // Figma Color 샘플 radius
  full: '9999px',    // 원형
};

export const layout = {
  // 레이아웃 치수 (Figma에서 추출)
  header: {
    height: '60px',
  },
  
  sidebar: {
    width: '450px',
  },

  content: {
    maxWidth: '1920px',
    height: '1080px',
  },

  // 컴포넌트 크기
  searchBar: {
    height: '50px',
  },

  chainCard: {
    width: '195px',
    height: '60px',
  },

  icon: {
    sm: '16px',
    base: '30px',
    lg: '40px',
  },
};

export const effects = {
  // Border Widths
  borderWidth: {
    DEFAULT: '1px',
    thick: '2px',
  },

  // Shadows
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.15)',
    md: '0 4px 12px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.25)',
  },

  // Transitions
  transition: {
    fast: '100ms ease',
    DEFAULT: '200ms ease',
    slow: '300ms ease',
  },
};

// 컴포넌트별 스타일 토큰
export const components = {
  // Weight Control Panel
  weightControl: {
    background: 'transparent',
    labelColor: colors.text.secondary,
    valueColor: colors.text.primary,
    spacing: spacing[4],
  },

  // Side Bar
  sidebar: {
    background: colors.background.secondary,
    border: colors.border.primary,
    width: layout.sidebar.width,
  },

  // Header
  header: {
    background: 'transparent',
    border: colors.border.primary,
    height: layout.header.height,
    logoSpacing: spacing[3],
  },

  // Search Bar
  searchBar: {
    background: colors.background.primary,
    border: colors.border.primary,
    borderRadius: borderRadius.DEFAULT,
    height: layout.searchBar.height,
    placeholder: colors.text.tertiary,
    padding: spacing[3],
  },

  // Chain Card
  chainCard: {
    background: 'transparent',
    border: colors.border.primary,
    borderRadius: borderRadius.DEFAULT,
    width: layout.chainCard.width,
    height: layout.chainCard.height,
    padding: spacing[3],
  },

  // Ranking Item
  rankingItem: {
    borderBottom: colors.border.primary,
    padding: spacing[2],
    hoverBackground: colors.background.elevated,
  },

  // Section Divider
  divider: {
    color: colors.border.primary,
    spacing: spacing[4],
  },
};

// 전체 토큰 Export
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  layout,
  effects,
  components,
};
