export const iosDetect = (navigator: Navigator): boolean => {
	const { userAgent, share } = navigator;

	return share !== undefined && userAgent.includes("iPhone");
};
