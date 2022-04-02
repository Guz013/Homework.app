/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const withPreact = require('next-plugin-preact');

module.exports = withPreact(
	withPWA({
		pwa: {
			dest: 'public',
			runtimeCaching,
		},
	})
);
