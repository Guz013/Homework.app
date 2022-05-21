import { useState, useEffect } from 'react';

const getSize = () => {
	const { innerWidth: width, innerHeight: height } =
		typeof window !== 'undefined' ? window : { innerWidth: 0, innerHeight: 0 };
	return { width, height };
};

const useWinSize = () => {
	const [winSize, setWinSize] = useState(getSize());

	useEffect(() => {
		function resizeHandler() {
			setWinSize(getSize());
		}
		window.addEventListener('resize', resizeHandler);
		return () => window.removeEventListener('resize', resizeHandler);
	}, []);

	return winSize;
};

export default useWinSize;
