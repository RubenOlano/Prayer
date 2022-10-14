export const iosDetect = (navigator: Navigator): boolean => {
	const { userAgent } = navigator;

	return navigator?.share !== undefined && userAgent.includes("iPhone");
};

export const getBaseUrl = (): string => {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
