/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      backgroundColor: {
        "mint-green": "#DDF7E3",
        "sky-blue": "#D8EFFE",
      },
      colors: {
        "mint-green": "#DDF7E3",
        lavender: "#E5DFFB",
        "sky-blue": "#D8EFFE",
        peach: "#FFE5D9",
      },
      borderColor: {
        "mint-green": "#DDF7E3",
      },
      keyframes: {
        fadeInOut: {
          "0%, 100%": {
            opacity: 0,
            transform: "translateX(calc(-100% - 16px))",
          },
          "10%, 90%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 5s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
