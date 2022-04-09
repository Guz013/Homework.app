import type { NextPage } from 'next';
import Content from '@components/content';
import { LangContext } from '@pages/_app';
import { useContext } from 'react';

const Home: NextPage = () => {
	const { value, setLang } = useContext(LangContext);

	const switchLang = () => {
		setLang(value === 'en' ? 'pt' : 'en');
	};

	return (
		<div className='flex min-h-screen flex-col items-center justify-center py-2'>
			<h1>Hello World</h1>
			<Content />
			<button onClick={() => switchLang()}>Change lang</button>
		</div>
	);
};

export default Home;
