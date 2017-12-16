import themeConfig from './themeConfig';

export default {
  config: {
    // font family with optional fallbacks
    fontFamily: '"Open Sans", sans-serif',
    // bpanel background color
    backgroundColor:
      'linear-gradient(-35deg, #835fac 0%, #00558a 50%, #009db6 100%);',
    // font color
    color: '',
    // custom css to add on top of bpanel
    css: '',
    colors: {
      black: '#000000',
      red: '#ff0000',
      green: '#33ff00',
      yellow: '#ffff00',
      blue: '#0066ff',
      magenta: '#cc00ff',
      cyan: '#00ffff',
      white: '#d0d0d0',
      lightBlack: '#808080',
      lightRed: '#ff0000',
      lightGreen: '#33ff00',
      lightYellow: '#ffff00',
      lightBlue: '#0066ff',
      lightMagenta: '#cc00ff',
      lightCyan: '#00ffff',
      lightWhite: '#ffffff'
    }
  },
  // localPlugins are for either development of a plugin or
  // for default/built-in plugins
  localPlugins: ['dashboard', 'wallets'],

  // This will be the list of plugins to install from npm
  // This system still needs to be built
  plugins: []
};
