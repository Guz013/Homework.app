import { ReactElement, useContext } from 'react';
import useSWR from 'swr';
import { LangContext } from '@pages/_app';
import contentHandler from '@libs/contentHandler';

const Content = ({ content }: any): ReactElement => {
	const lang = useContext(LangContext);

	const fetcher = (url: string) => fetch(url).then((res) => res.json());
	const { data, error } = useSWR(`/api/content?lang=${lang.value}`, fetcher);

	if (error) return <>Failed to load content</>;

	return (
		<LangContext.Consumer>
			{() => {
				return (
					<span
						id='contentText'
						className={`transition-all ${
							!data ? 'opacity-0 translate-y-3' : 'opacity-100'
						}`}
					>
						{!data ? '...' : JSON.stringify(data)}
					</span>
				);
			}}
		</LangContext.Consumer>
	);
};

export default Content;
