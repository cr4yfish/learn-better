import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(accordion|autocomplete|avatar|badge|button|calendar|card|checkbox|chip|divider|dropdown|image|input|kbd|link|modal|progress|radio|scroll-shadow|select|skeleton|slider|spinner|toggle|table|tabs|popover|user|ripple|listbox|menu|spacer).js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    typography,
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              foreground: "#250326",
              DEFAULT: "#E879F9",
            }
          }
        }
      }
    })
  ],
};
export default config;
