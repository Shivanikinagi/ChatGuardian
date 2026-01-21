module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@components': './components',
            '@screens': './screens',
            '@services': './services',
            '@models': './models',
            '@utils': './utils',
            '@hooks': './hooks',
            '@store': './store',
            '@constants': './constants'
          }
        }
      ]
    ]
  };
};
