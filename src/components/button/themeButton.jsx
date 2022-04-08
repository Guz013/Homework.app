import useDarkMode from 'use-dark-mode';
import { useSpring, animated } from 'react-spring';
import { useEffect } from 'react';

import { SunIcon, MoonIcon } from '@heroicons/react/solid';

const ThemeButton = () => {
	const darkMode = useDarkMode(false, {
		classNameDark: 'dark',
		classNameLight: 'light',
	});

	const anim = useSpring({
		from: { rotateZ: 0 },
		to: { rotateZ: darkMode.value ? 0 : 180 },
	});

	const { scale } = useSpring({ scale: 0 });
	useEffect(() => {
		scale.start({ from: 0.8, to: 1 });
	});

	return (
		<animated.button
			onClick={darkMode.toggle}
			className='min-h-8 min-w-8 grid place-content-center rounded-lg'
			style={{scale}}
		>
			<animated.div
				id='icons'
				className='grid place-content-center'
				style={anim}
			>
				{darkMode.value ? (
					<MoonIcon className='h-6 w-6 m-0 scale-90 fill-zinc-900 dark:fill-zinc-300' />
				) : (
					<SunIcon className='h-6 w-6 m-0 fill-zinc-900 dark:fill-zinc-300' />
				)}
			</animated.div>
		</animated.button>
	);
};

export default ThemeButton;
