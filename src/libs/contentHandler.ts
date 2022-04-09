import fs from 'fs';
import path, { join } from 'path';

const contentDirectory = join(process.cwd(), 'content');

type FolderItem = {
	lang: string;
	contents: {
		name: string;
		text: string;
	}[];
};

const contentHandler = {
	folders: () => {
		const result: FolderItem[] = [];

		const langFolders = fs.readdirSync(contentDirectory);

		for (const folder of langFolders) {
			const folderItem: FolderItem = {
				lang: `${folder}`,
				contents: Array(),
			};

			const contentFiles = fs.readdirSync(join(contentDirectory, `${folder}`));

			for (const file of contentFiles) {
				const fileContents = fs.readFileSync(
					join(contentDirectory, `${folder}/${file}`),
					'utf-8'
				);

				folderItem.contents.push({ name: `${file}`, text: fileContents });
			}

			result.push(folderItem);
		}

		return result;
	},
	langContents: (lang: string) => {
		return (
			contentHandler.folders().find((f) => f.lang === lang)?.contents ??
			contentHandler.folders().find((f) => f.lang === 'en')?.contents
		);
	},
};

export default contentHandler;
