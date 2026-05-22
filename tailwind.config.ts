import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				pik: {
					blue: '#4DA3FF',
					violet: '#8B5CFF',
					magenta: '#D946EF',
					dark: '#03040A',
					navy: '#070A14',
					mid: '#0B1020',
					text: '#F5F7FF',
					muted: '#9BA3B7',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-pik': 'linear-gradient(135deg, #4DA3FF 0%, #8B5CFF 100%)',
				'gradient-pik-full': 'linear-gradient(135deg, #4DA3FF 0%, #8B5CFF 60%, #D946EF 100%)',
			},
			boxShadow: {
				'apple': 'var(--shadow-apple)',
				'apple-lg': 'var(--shadow-apple-lg)',
				'apple-xl': 'var(--shadow-apple-xl)',
				'glow-blue': '0 0 40px rgba(77, 163, 255, 0.4)',
				'glow-violet': '0 0 40px rgba(139, 92, 255, 0.4)',
				'glow-magenta': '0 0 40px rgba(217, 70, 239, 0.4)',
				'card-luxury': '0 30px 80px -20px rgba(0,0,0,0.6)',
			},
			transitionTimingFunction: {
				'apple': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
			},
			fontFamily: {
				'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
				'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '0.75' }
				},
				'slow-zoom': {
					'0%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1.15)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'reverse-spin': {
					'0%': { transform: 'rotate(360deg)' },
					'100%': { transform: 'rotate(0deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'orb-pulse': {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
					'50%': { transform: 'scale(1.06)', opacity: '1' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				},
				'marquee': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				'border-glow': {
					'0%, 100%': { borderColor: 'rgba(77, 163, 255, 0.3)' },
					'50%': { borderColor: 'rgba(139, 92, 255, 0.6)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) both',
				'fade-in': 'fade-in 1.2s ease-out both',
				'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
				'slow-zoom': 'slow-zoom 20s ease-out infinite alternate',
				'spin-slow': 'spin-slow 12s linear infinite',
				'reverse-spin': 'reverse-spin 8s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'orb-pulse': 'orb-pulse 3s ease-in-out infinite',
				'shimmer': 'shimmer 3s linear infinite',
				'marquee': 'marquee 30s linear infinite',
				'border-glow': 'border-glow 3s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
