import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head />
				<body>
					{/* eslint-disable-next-line @next/next/no-sync-scripts */}
					<script src='noflash.js' />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
