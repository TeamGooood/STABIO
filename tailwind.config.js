import { colors, typography, spacing, borderRadius, effects } from './src/design/tokens.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // 커스텀 컬러 (네이밍 충돌 방지를 위한 구조화)
      colors: {
        // Background
        'bg-primary': colors.background.primary,      // #121212
        'bg-secondary': colors.background.secondary,  // #101010
        'bg-elevated': colors.background.elevated,    // #1a1a1a
        'bg-base': colors.background.base,            // #13151a
        'bg-dark': colors.background.dark,            // #17191f
        'bg-card': colors.background.card,            // #222631
        
        // Text
        'text-primary': colors.text.primary,          // #ffffff
        'text-secondary': colors.text.secondary,      // #a1a9c0
        'text-tertiary': colors.text.tertiary,        // #727c95
        'text-muted': colors.text.muted,              // #4a5568
        
        // Border
        'border-primary': colors.border.primary,      // #292929
        'border-secondary': colors.border.secondary,  // #1f1f1f
        'border-divider': colors.border.divider,      // #2f374c
        'border-card': colors.background.card,        // #222631
        
        // Brand
        'brand-primary': colors.brand.primary,        // #455cdc
        'brand-hover': colors.brand.hover,            // #3547c9
        'brand-active': colors.brand.active,          // #2638a8
        
        // Chart
        'chart-activity': colors.chart.activity,      // #f83464
        'chart-volatility': colors.chart.volatility,  // #ff852f
        'chart-persistence': colors.chart.persistence, // #43d2a7
        'chart-purple': colors.chart.purple,          // #9546ef
      },
      
      // 폰트
      fontFamily: {
        sans: typography.fontFamily.primary,
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      letterSpacing: typography.letterSpacing,
      
      // 스페이싱
      spacing: spacing,
      
      // Border Radius
      borderRadius: borderRadius,
      
      // Shadows
      boxShadow: effects.shadow,
      
      // Transitions
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
}
