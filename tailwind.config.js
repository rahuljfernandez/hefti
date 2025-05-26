export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Inter Variable', 'sans-serif'],
    },
    extend: {
      colors: {
        core: {
          white: 'var(--core-white)',
          black: 'var(--core-black)',
        },
        content: {
          primary: 'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          tertiary: 'var(--content-tertiary)',
          'inverse-primary': 'var(--content-inverse-primary)',
        },
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          'inverse-primary': 'var(--background-inverse-primary)',
          'inverse-secondary': 'var(--background-inverse-secondary)',
          hover: 'var(--background-hover)',
          'hover-overlay': 'var(--background-hover-overlay)',
          'inverse-hover-overlay': 'var(--background-inverse-hover-overlay)',
        },
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
          tertiary: 'var(--border-tertiary)',
          'inverse-primary': 'var(--border-inverse-primary)',
          'inverse-secondary': 'var(--border-inverse-secondary)',
          'inverse-tertiary': 'var(--border-inverse-tertiary)',
          'hover-overlay': 'var(--border-hover-overlay)',
          'inverse-hover-overlay': 'var(--border-inverse-hover-overlay)',
        },
      },
      fontSize: {
        display: {
          xl: [
            '8rem',
            {
              lineHeight: '8rem',
              letterSpacing: '-0.025em',
              fontWeight: '800',
            },
          ],
          lg: [
            '6rem',
            {
              lineHeight: '6rem',
              letterSpacing: '-0.025em',
              fontWeight: '800',
            },
          ],
          md: [
            '4.5rem',
            {
              lineHeight: '4.5rem',
              letterSpacing: '-0.025em',
              fontWeight: '800',
            },
          ],
          sm: [
            '3.75rem',
            {
              lineHeight: '3.75rem',
              letterSpacing: '-0.025em',
              fontWeight: '800',
            },
          ],
          xs: [
            '3rem',
            {
              lineHeight: '3rem',
              letterSpacing: '-0.025em',
              fontWeight: '800',
            },
          ],
        },
        heading: {
          lg: [
            '2.25rem',
            {
              lineHeight: '2.5rem',
              letterSpacing: '-0.025em',
              fontWeight: '700',
            },
          ],
          md: [
            '1.875rem',
            {
              lineHeight: '2.5rem',
              letterSpacing: '-0.025em',
              fontWeight: '700',
            },
          ],
          sm: [
            '1.5rem',
            {
              lineHeight: '2rem',
              letterSpacing: '-0.025em',
              fontWeight: '700',
            },
          ],
          xs: [
            '1.25rem',
            {
              lineHeight: '1.75rem',
              letterSpacing: '-0.025em',
              fontWeight: '700',
            },
          ],
        },
        label: {
          lg: [
            '1.25rem',
            {
              lineHeight: '1.75rem',
              fontWeight: '500',
            },
          ],
          base: [
            '1rem',
            {
              lineHeight: '1.5rem',
              fontWeight: '500',
            },
          ],
          sm: [
            '.875rem',
            {
              lineHeight: '1.25rem',
              fontWeight: '500',
            },
          ],
          xs: [
            '.75rem',
            {
              lineHeight: '1.25rem',
              fontWeight: '500',
            },
          ],
        },
        paragraph: {
          lg: [
            '1.125rem',
            {
              lineHeight: '1.75rem',
              fontWeight: '400',
            },
          ],
          base: [
            '1rem',
            {
              lineHeight: '1.5rem',
              fontWeight: '400',
            },
          ],
          sm: [
            '.875rem',
            {
              lineHeight: '1.25rem',
              fontWeight: '400',
            },
          ],
          xs: [
            '.75rem',
            {
              lineHeight: '1rem',
              fontWeight: '400',
            },
          ],
        },
      },
    },
    plugins: [],
  },
};
