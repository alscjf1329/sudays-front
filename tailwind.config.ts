import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        blueTheme: {
          background: "#1e3a8a",
          text: "#e0f2fe",
        },
        pinkTheme: {
          background: "#9d174d",
          text: "#fce7f3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
