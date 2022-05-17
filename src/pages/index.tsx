import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';
import { MDXRemote as MD } from 'next-mdx-remote';
import getContentProps from '@libs/contentHandler';

const Home: NextPage = ({ content }: any) => {
	const [text, translations]: [ContentList, object | any] = [
		content.data,
		content.translations,
	];
	return (
		<div className='flex min-h-screen flex-col items-center justify-center py-2'>
			<div>
				<MD {...text['nestedHello']} />
				<MD {...text['nestedBye']} />
			</div>
			<div>
				<button className='m-1 w-28 rounded-md transition-colors bg-zinc-200 hover:bg-zinc-800 hover:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-zinc-800'>
					<Link href='/' locale='en'>
						<a>{translations?.langs.english}</a>
					</Link>
				</button>
				<button className='m-1 w-28 rounded-md transition-colors bg-zinc-200 hover:bg-zinc-800 hover:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-200 dark:hover:text-zinc-800'>
					<Link href='/' locale='pt'>
						<a>{translations?.langs.portuguese}</a>
					</Link>
				</button>
			</div>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) =>
	getContentProps('test/testDir', locale);

export default Home;
