import contentHandler from '@libs/contentHandler';
import { NextApiRequest, NextApiResponse } from 'next';

const content = (req: NextApiRequest, res: NextApiResponse) => {
	const {
		query: { lang },
	} = req;
	res.status(200).json(contentHandler.langContents(`${lang}`));
};

export default content;
