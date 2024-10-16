import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|calendar|checkbox|chip|date-input|date-picker|dropdown|image|input|link|listbox|modal|popover|radio|select|slider|spinner|table|ripple|menu|divider|scroll-shadow|spacer).js",
  ],
  theme: {
    extend: {
      colors: {
        blanco: "#ffffff",
        negro: "#000814",
        primario: "#FFFEFA",
        secundario: "#060606",
        terciario: "#FAFAFA",
      },
    },
  },
  plugins: [nextui()],
};
export default config;
