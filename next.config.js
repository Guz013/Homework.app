/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const withMDX = require('@next/mdx')({
	extension: /\.mdx?$/,
	options: {
		providerImportSource: '@mdx-js/react',
	},
});

module.exports = withMDX(
	withPWA({
		pwa: {
			dest: 'public',
			runtimeCaching,
		},
		i18n: {
			locales: ['en', 'pt'],
			defaultLocale: 'en',
		},
		pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	})
);
