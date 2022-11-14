export const iosDetect = (navigator: Navigator): boolean => {
	const { userAgent } = navigator;

	return navigator?.share !== undefined && userAgent.includes("iPhone");
};
