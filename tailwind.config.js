let colors_light = {
  red: 'red',
  transparent: 'transparent',
  current: 'currentColor',
  white: '#ffffff',
  accent: {
    'very-light': '#F5F6FC',
    light: 'rgb(96 96 115)',
    dark: 'rgb(48,30,86)',
    'very-dark': 'rgb(42,27,76)',
    important: 'rgb(72 118 212)',
    // rgb(72 118 212)
    // rgb(67 116 206)
    // rgb(64 115 186)

    // rgb(81,132,235)
    'important-on-dark': 'rgb(76,107,218)',
  },
  content: {
    title: 'rgb(48,30,86)',
    subtitle: 'rgb(48,30,86)',
    'subtitle-on-dark': 'rgba(255,255,255,0.9)',
    'title-on-dark': 'rgba(255,255,255,0.9)',
    normal: 'rgba(48,30,86,0.9)',
    'normal-on-dark': 'rgba(255,255,255,0.7)'
  },
}// rgb(78 70 95) rgb(96 96 115)

let colors_dark = {
  red: 'red',
  transparent: 'transparent',
  current: 'currentColor',
  white: '#ffffff',
  accent: {
    'very-light': 'rgba(0,0,0,0.03)',
    light: 'rgba(0,0,0,0.8)',
    dark: 'rgba(0,0,0,0.9)',
    important: 'rgba(40,107,246,1)',
    'important-on-dark': 'rgba(255,255,255,0.9)',
  },
  content: {
    title: 'rgba(0,0,0,0.9)',
    subtitle: 'rgba(0,0,0,0.8)',
    'title-on-dark': 'rgba(255,255,255,0.9)',
    normal: 'rgba(0,0,0,0.7)',
    'normal-on-dark': 'rgba(255,255,255,0.7)'
  },
}

module.exports = {
  experimental: {
    applyComplexClasses: true,
  },
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    colors: colors_light,
    fontSize: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '1.75rem'],
      '2xl': ['1.5rem', '2rem'],
      '3xl': ['1.875rem', '2.25rem'],
      '4xl': ['2.25rem', '2.5rem'],
      '5xl': ['3rem', '1'],
      '6xl': ['3.75rem', '1'],
      'h0': ['3.375rem', '0.9'],
      'h1': ['3rem', '1.25'],
      'h2': ['2.2rem', '2.25rem'],
      'h2x': ['1.5rem', '2.25rem'],
    },
    boxShadow: {
      simple: '0px 24px 60px -12px rgba(34, 20, 66, 0.15)'
    },
    extend: {
      borderWidth: {
        '3': '3px'
      }
    },
  },
  variants: {
    extend: {},
    zIndex: ['responsive', 'hover'],
  },
  plugins: [],
}
