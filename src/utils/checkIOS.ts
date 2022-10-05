export const iosDetect = (): boolean => {
	const userAgent = navigator.userAgent;

	return (
		!!userAgent.match(/iPad/i) ||
		!!userAgent.match(/iPhone/i) ||
		!!userAgent.match(/iPod/i) ||
		!!userAgent.match(/Safari/i)
	);
};
