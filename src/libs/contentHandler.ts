import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import { join } from 'path';

async function getContentProps(
	contentPath: string,
	lang: string = 'en',
	returnTranslationFile: boolean = true,
	recursive: boolean = true
): Promise<ContentProps> {
	const defaultPath = join(process.cwd(), `src/content/en/${contentPath}`);
	const path = join(process.cwd(), `src/content/${lang}/${contentPath}`);

	const translations = returnTranslationFile ? getTranslationFile(lang) : null;

	if (
		fs.existsSync(path + '.mdx') ||
		(fs.existsSync(path) && !fs.lstatSync(path).isDirectory())
	) {
		const fileData = await serialize(fs.readFileSync(path + '.mdx', 'utf8'));

		return { props: { content: { data: fileData, lang, translations } } };
	} else if (
		fs.existsSync(defaultPath + '.mdx') ||
		(fs.existsSync(path) && !fs.lstatSync(defaultPath).isDirectory())
	) {
		const defaultFileData = await serialize(
			fs.readFileSync(defaultPath + '.mdx', 'utf8')
		);

		return {
			props: { content: { data: defaultFileData, lang, translations } },
		};
	}

	return {
		props: {
			content: {
				data: await getContentList(contentPath, lang, recursive),
				lang,
				translations,
			},
		},
	};
}
export default getContentProps;

export async function getContentList(
	path: string,
	lang: string = 'en',
	recursive: boolean = true
): Promise<ContentList> {
	const fileList: ContentList = {};

	const defaultPath = join(process.cwd(), `src/content/en/${path}`);
	path = join(process.cwd(), `src/content/${lang}/${path}`);

	await readDirectoryFiles(
		path,
		async (fileName: string, fileData: string) => {
			fileList[fileName.replace('.mdx', '')] = await serialize(fileData);
		},
		recursive
	);

	const defaultFileList: ContentList = {};

	await readDirectoryFiles(
		defaultPath,
		async (fileName: string, fileData: string) => {
			defaultFileList[fileName.replace('.mdx', '')] = await serialize(fileData);
			fileList[fileName.replace('.mdx', '')] =
				fileList[fileName.replace('.mdx', '')] || (await serialize(fileData));
		},
		recursive
	);

	return fileList;
}

export function getTranslationFile(lang: string = 'en'): object {
	const translationPath = join(
		process.cwd(),
		`src/content/${lang}/translations.json`
	);

	const translationFile = fs.lstatSync(translationPath).isFile()
		? JSON.parse(fs.readFileSync(translationPath, 'utf8'))
		: JSON.parse(
				fs.readFileSync(
					join(process.cwd(), `src/content/en/translations.json`),
					'utf8'
				)
		  );

	return translationFile;
}

export async function readDirectoryFiles(
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
