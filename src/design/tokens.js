/**
 * 디자인 토큰 (Design Tokens)
 * Figma qohj0go3 채널에서 추출한 프로젝트 대시보드 디자인 시스템
 */

export const colors = {
  // Background Colors
  background: {
    primary: '#121212',    // 메인 배경
    secondary: '#101010',  // 사이드바 배경
    elevated: '#1a1a1a',   // 카드/상승된 요소
  },

  // Border & Divider Colors
  border: {
    primary: '#292929',    // 기본 테두리
    secondary: '#1f1f1f',  // 약한 테두리
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
    primary: '#455cdc',    // 로고, 브랜드 컬러
    hover: '#3547c9',      // hover 상태
    active: '#2638a8',     // active 상태
  },

  // Chart & Data Visualization Colors
  chart: {
    activity: '#f83464',        // 활동성 - 핑크/레드
    volatility: '#ff852f',      // 경제적 변동성 - 오렌지
    persistence: '#43d2a7',     // 지속성 - 민트/그린
  },

  // Gradient Colors (for chart indicators)
  gradient: {
    activity: {
      start: '#f83464',  // 핑크
      end: '#ff852f',    // 오렌지
    },
    volatility: {
      start: '#ff852f',  // 오렌지
      end: '#43d2a7',    // 민트
    },
  },

  // Semantic Colors
  success: '#43d2a7',      // 성공, 상승
  warning: '#ff852f',      // 경고
  danger: '#f83464',       // 위험, 하락
  info: '#455cdc',         // 정보
};

export const typography = {
  // Font Family
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

  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,      // 일반 텍스트
    semibold: 600,    // 체인 이름, 강조
    bold: 700,        // 라벨, 섹션 타이틀
    extrabold: 800,   // 로고
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

