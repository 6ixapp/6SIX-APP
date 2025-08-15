// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Optional: disable unstable package exports if needed
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
