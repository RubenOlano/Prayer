/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
		fontFamily: {
			display: ["Kanit"],
			body: ["Kanit"],
			sans: ["Kanit"],
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["cupcake", "halloween"],
		darkTheme: "halloween",
	},
};
