export const iosDetect = (): boolean => {
	const userAgent = navigator.userAgent;

	return (
		!!userAgent.match(/iPad/i) ||
		!!userAgent.match(/iPhone/i) ||
		!!userAgent.match(/iPod/i) ||
		!!userAgent.match(/Safari/i)
	);
};

export const getBaseUrl = (): string => {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
