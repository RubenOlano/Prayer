interface Props {
	dimensions?: number;
	omitPadding?: boolean;
}

export const HouseOutline = ({ omitPadding }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		className={`${!omitPadding ? "mr-2" : ""}`}
		viewBox="0 0 16 16"
	>
		{" "}
		<path
			fillRule="evenodd"
			d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
		/>{" "}
		<path
			fillRule="evenodd"
			d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
		/>{" "}
	</svg>
);
export const HouseFill = ({ omitPadding }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		className={`${omitPadding ? "" : "mr-2"}`}
		viewBox="0 0 16 16"
	>
		{" "}
		<path
			fillRule="evenodd"
			d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
		/>{" "}
		<path
			fillRule="evenodd"
			d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
		/>{" "}
	</svg>
);

export const PeopleOutline = ({ omitPadding }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		className={`${omitPadding ? "" : "mr-2"}`}
		viewBox="0 0 16 16"
	>
		{" "}
		<path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />{" "}
	</svg>
);

export const PeopleFill = ({ omitPadding }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		className={`${omitPadding ? "" : "mr-2"}`}
		viewBox="0 0 16 16"
	>
		{" "}
		<path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />{" "}
		<path
			fillRule="evenodd"
			d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
		/>{" "}
		<path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />{" "}
	</svg>
);

export const Plus = ({ dimensions }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={dimensions}
		height={dimensions}
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />{" "}
	</svg>
);

export const Refresh = ({ dimensions }: Props) => (
	<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width={dimensions} height={dimensions}>
		<path
			fill="currentColor"
			d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"
		/>
	</svg>
);

export const X = ({ dimensions }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={dimensions}
		height={dimensions}
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		{" "}
		<path
			d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
			fill="red"
		></path>{" "}
	</svg>
);

export const Share = ({ dimensions }: Props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={dimensions}
		height={dimensions}
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		{" "}
		<path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />{" "}
	</svg>
);
