import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'fs';
import { join } from 'path';

async function getContentProps(
	path: string,
	lang: string = 'en',
	recursive: boolean = true
): Promise<ContentProps> {
	/**
	 * TODO: Return a file, in english (default language), if the translation doesn't exist;
	 */

	path = join(process.cwd(), `src/content/${lang}/${path}`);

	if (fs.existsSync(path + '.mdx') || !fs.lstatSync(path).isDirectory()) {
		const fileData = await serialize(fs.readFileSync(path + '.mdx', 'utf8'));

		return { props: { content: { data: fileData, lang } } };
	}

	const fileList: { [fileName: string]: MDXRemoteSerializeResult } = {};

	readDirectoryFiles(
		path,
		async (fileName: string, fileData: string) => {
			fileList[fileName.replace('.mdx', '')] = await serialize(fileData);
		},
		recursive
	);

	return { props: { content: { data: fileList, lang } } };
export default getContentProps;
}

export function readDirectoryFiles(
	path: string,
	onRead: (file: string, data: string) => any,
	recursive?: boolean
) {
	for (const file of fs.readdirSync(path)) {
		const filePath = join(path, file);

		if (recursive && fs.lstatSync(filePath).isDirectory()) {
			readDirectoryFiles(
				filePath,
				(nestedFile, nestedData) => {
					onRead(nestedFile, nestedData);
				},
				true
			);
		} else if (!fs.lstatSync(filePath).isDirectory()) {
			const data = fs.readFileSync(filePath, 'utf8');

			onRead(file, data);
		}
	}
}

export interface ContentProps {
	props: {
		content: {
			data:
				| {
						[fileName: string]: MDXRemoteSerializeResult;
				  }
				| MDXRemoteSerializeResult;
			lang: string;
			translations?: any;
		};
	};
}
