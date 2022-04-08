import {
	MenuIcon,
	ArrowSmLeftIcon,
	CodeIcon,
	DocumentTextIcon,
} from '@heroicons/react/solid';
import { useSpring, animated } from 'react-spring';
import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import useWinSize from '@hooks/useWinSize';

import ThemeButton from '@components/button/themeButton';
import SocialButtons from '@components/button/socialButtons';

const SideBar = () => {
	const [opened, setOpen] = useState(false);

	const { width } = useWinSize();

	const [animSideBar, animButton, animBg, { scale }] = [
		useSpring({
			from: { x: 0 },
			to: { x: opened ? 0 : -360 },
		}),
		useSpring({
			from: { x: 0, rotateZ: 0 },
			to: {
				x: opened ? 0 : width < 640 ? -320 : -380,
				rotateZ: opened ? 0 : 180,
			},
		}),
		useSpring({
			from: { opacity: 0 },
			to: { opacity: opened ? 0.25 : 0 },
		}),
		useSpring({ scale: 0 }),
	];
	useEffect(() => {
		scale.start({ from: 0.8, to: 1 });
	});

	const handlers = useSwipeable({
		onSwipedRight: () => setOpen(true),
		onSwipedLeft: () => setOpen(false),
	});

	return (
		<div className='fixed' {...handlers} style={{ touchAction: 'pan-y' }}>
			<section id='sidebar' className='flex'>
				<animated.footer
					style={animSideBar}
					className='w-80 sm:w-96 h-screen pl-2 rounded-r-3xl sm:rounded-none z-50 bg-zinc-100 dark:bg-zinc-900'
				>
					<div id='sidebar-main' className='pt-1'>
						<ThemeButton />
					</div>

					<div id='side-bar-bottom' className='font-mono bottom-2 absolute'>

						<SocialButtons />
						<p>By Guz013 &bull; {new Date().getFullYear()}</p>

						<div
							id='licenses'
							className='text-zinc-400 dark:text-zinc-600 text-xs'
						>
							<a
								className='hover:text-emerald-500 group'
								href='https://github.com/Guz013/Homework.app/blob/main/LICENSE'
								target='_blank'
								rel='noreferrer'
							>
								<CodeIcon className='w-4 h-4 mr-1 inline-block' />
								MIT License
								{/* <ExternalLinkIcon className='w-3 h-3 ml-0.5 inline-block opacity-40 transition-opacity group-hover:opacity-100' /> */}
							</a>{' '}
							&bull;{' '}
							<a
								className='hover:text-violet-500 group'
								href='http://creativecommons.org/licenses/by-sa/4.0/'
								target='_blank'
								rel='noreferrer'
							>
								<DocumentTextIcon className='w-4 h-4 mr-1 inline-block' />
								CC-BY-SA 4.0
								{/* <ExternalLinkIcon className='w-3 h-3 ml-0.5 inline-block opacity-40 transition-opacity group-hover:opacity-100' /> */}
							</a>
						</div>
					</div>
				</animated.footer>

				<animated.button
					id='side-bar-button'
					onClick={() => setOpen(!opened)}
					className='left-0 z-50 h-6 w-6 m-2'
					style={{ scale }}
				>
					<animated.div
						id='icons'
						className='grid place-content-center'
						style={animButton}
					>
						{opened ? (
							<ArrowSmLeftIcon className='h-6 w-6 m-0 fill-zinc-200 dark:fill-zinc-800' />
						) : (
							<>
								<MenuIcon className='h-6 w-6 m-0 fill-zinc-300 dark:fill-zinc-700 hidden sm:block' />
								<ArrowSmLeftIcon className='h-6 w-6 m-0 fill-zinc-300 dark:fill-zinc-700 block sm:hidden' />
							</>
						)}
					</animated.div>
				</animated.button>
			</section>

			<animated.div
				onClick={() => {
					if (opened) setOpen(!opened);
				}}
				id='side-bar-background'
				className='fixed top-0 bg-[#000000] w-screen h-screen'
				style={animBg}
			></animated.div>
		</div>
	);
};

export default SideBar;
