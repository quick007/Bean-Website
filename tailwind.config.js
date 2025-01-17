module.exports = {
	content: ["./src/**/*.vue"],
	theme: {
		extend: {
			colors: {
				"zinc-850": "#1b1b1f",
			},
			screens: {
				xs: "362px",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
