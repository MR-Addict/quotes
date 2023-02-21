/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      aspectRatio: {
        "9/13": "9 / 13",
      },
      animation: {
        "custom-spin": "spin 3s linear infinite",
        "custom-stretch": "stretch 1.5s ease infinite",
      },
      keyframes: {
        stretch: {
          "50%": { "border-width": "2rem" },
        },
      },
    },
  },
  plugins: [],
};
