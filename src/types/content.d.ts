import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

declare global {
	interface ContentProps {
		props: {
			content: {
				data: ContentList | ContentData;
				lang: string;
				translations?: any;
			};
		};
	}

	type ContentData = MDXRemoteSerializeResult;

	interface ContentList {
		[fileName: string]: MDXRemoteSerializeResult;
	}
}
