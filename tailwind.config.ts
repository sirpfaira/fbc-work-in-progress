import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)',
  				block: 'var(--muted-block)'
  			},
  			icon: {
  				DEFAULT: 'var(--foreground)',
  				active: 'var(--icon-active)',
  				inactive: 'var(--icon-inactive)'
  			},
  			border: 'var(--border)',
  			outline: 'var(--outline)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)',
  				hover: 'var(--destructive-hover)'
  			},
  			rating: {
  				bottom: 'var(--destructive)',
  				middle: 'var(--middle)',
  				top: 'var(--top)'
  			},
  			subtext: 'var(--subtext)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			tiny: '0.6rem',
  			smallest: '0.65rem',
  			smaller: '0.75rem',
  			small: '0.875rem',
  			standard: '0.975rem',
  			big: '1.1rem',
  			bigger: '1.2rem',
  			biggest: '1.3rem',
  			huge: '1.5rem'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
