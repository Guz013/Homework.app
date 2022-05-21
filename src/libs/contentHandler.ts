import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import { join } from 'path';

/**
 * The base path for the files to be searched on the functions.
 */
const contentFolder = join(process.cwd(), 'src/content');

/**
 * Returns a prop object (designed for `getStaticProps()`) with a dictionary of all serialized files inside a directory,
 * or a single file if it's specified on the path and a translations file. If a file doesn't have a translation, it will
 * be returned a file in the default language (english).
 *
 * @param contentPath - The path to the directory or file inside the {@link contentFolder | content folder};
 * @param lang - In what language to return the content _(default english)_;
 * @param returnTranslationFile - Return the Translations File? _(default true)_;
 * @param recursive - Search for files inside sub-folders? _(default true)_;
 * @returns The serialized data of all files, language used and the translations file (a _{@link ContentProps}_ object);
 *
 * @remarks
 *
 * @example
 * A simple example of how to use the function:
 * ```tsx
 * import { MDXRemote as MD } from 'next-mdx-remote';
 *
 * const Page: NextPage = ({ content }: any) => {
 * 	const [text, translations]: [ContentList, object | any] = [
 *			content.data,
 *			content.translations,
 *		];
 *		return (<div>
 *			<MD {...text['helloWorld']} />
 *			{translations?.words.yes}
 *		</div>);
 * };
 *
 * export const getStaticProps: GetStaticProps = async ({ locale }) => getContentProps('test/testDir', locale);
 * ```
 */
async function getContentProps(
	contentPath: string,
	lang: string = 'en',
	returnTranslationFile: boolean = true,
	recursive: boolean = true
): Promise<ContentProps> {
	const defaultPath = `${contentFolder}/en/${contentPath}`;
	const path = `${contentFolder}/${lang}/${contentPath}`;

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

/**
 * Creates and returns a list/dictionary of serialized content files inside a folder of a language.
 * If a translation is not found, it will be replaced with one of the default language.
 *
 * @param path - The path to the directory inside the {@link contentFolder | content folder};
 * @param lang - What language to search for the translation _(default english)_;
 * @param recursive - Search for files inside sub-folders? _(default true)_;
 * @returns A object with all files in the directory (a _{@link ContentList}_ object);
 *
 * @see {@link getContentProps} if you need data more compatible with Nextjs's `getStaticProps` method.
 */
export async function getContentList(
	path: string,
	lang: string = 'en',
	recursive: boolean = true
): Promise<ContentList> {
	const fileList: ContentList = {};

	const defaultPath = `${contentFolder}/en/${path}`;
	path = `${contentFolder}/${lang}/${path}`;

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

export async function getTranslationPercentage(lang: string = 'en') {}

/**
 * Read and parse the Translations json file of a specified language.
 * If the file doesn't exist, returns one in the default language.
 *
 * @param lang - What language to read the file from.
 * @returns The parsed json file contents.
 */
export function getTranslationFile(lang: string = 'en'): object {
	const translationPath = `${contentFolder}/${lang}/translations.json`;

	const translationFile = fs.lstatSync(translationPath).isFile()
		? JSON.parse(fs.readFileSync(translationPath, 'utf8'))
		: JSON.parse(
				fs.readFileSync(`${contentFolder}/en/translations.json`, 'utf8')
		  );

	return translationFile;
}

/**
 * Reads all files inside a directory.
 *
 * @param path - Path to the directory/folder;
 * @param onRead - A functions that will be called when the file is read;
 * @param recursive - Search for files inside sub-folders?
 */
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
