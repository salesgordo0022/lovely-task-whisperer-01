
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
		screens: {
			'xs': '375px',    // iPhone SE and small phones
			'sm': '640px',    // Large phones and small tablets
			'md': '768px',    // Tablets (portrait)
			'lg': '1024px',   // Tablets (landscape) and small laptops
			'xl': '1280px',   // Laptops and desktop
			'2xl': '1440px',  // Large desktop screens
			'3xl': '1920px',  // Ultra-wide and 4K monitors
			// Custom breakpoints for specific device targeting
			'mobile': {'max': '767px'},     // Mobile-first approach
			'tablet': {'min': '768px', 'max': '1023px'},  // Tablet only
			'desktop': {'min': '1024px'},   // Desktop and larger
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				work: {
					DEFAULT: 'hsl(var(--work))',
					foreground: 'hsl(var(--work-foreground))'
				},
				personal: {
					DEFAULT: 'hsl(var(--personal))',
					foreground: 'hsl(var(--personal-foreground))'
				},
				agenda: {
					DEFAULT: 'hsl(var(--agenda))',
					foreground: 'hsl(var(--agenda-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
			},
			backgroundSize: {
				'size-200': '200% 200%',
			},
			backgroundPosition: {
				'pos-0': '0% 0%',
				'pos-100': '100% 100%',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'macos-fade-in': {
					'0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
					'100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
				},
				'macos-slide-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'macos-slide-down': {
					'0%': { opacity: '0', transform: 'translateY(-15px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'macos-spring': {
					'0%': { transform: 'scale(0.8)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				},
				'bounce-in': {
					'0%': { opacity: '0', transform: 'scale(0.3)' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'macos-fade-in': 'macos-fade-in 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
				'macos-slide-up': 'macos-slide-up 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
				'macos-slide-down': 'macos-slide-down 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
				'macos-spring': 'macos-spring 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6)',
				'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
