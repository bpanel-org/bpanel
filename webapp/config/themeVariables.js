import tinygradient from 'tinygradient';
import border from 'css-border-property';
import logo from '../assets/logo.png';

/// *****
/// FONTS
/// *****

// Font Family
const fontFamily = 'Open Sans, sans-serif';

// Font Size
const makeRem = size => size.toString().concat('rem');

const fontSizeBase = 1; // This gets transformed to rem

const fontSizeSmall = makeRem(fontSizeBase * 0.8);
const fontSizeNormal = makeRem(fontSizeBase);
const fontSizeLarge = makeRem(fontSizeBase * 1.2);

const fontSizeH1 = makeRem(fontSizeBase * 3.2);
const fontSizeH2 = makeRem(fontSizeBase * 2.6);
const fontSizeH3 = makeRem(fontSizeBase * 2.1);
const fontSizeH4 = makeRem(fontSizeBase * 1.7);
const fontSizeH5 = makeRem(fontSizeBase * 1.3);
const fontSizeH6 = makeRem(fontSizeBase * 1.1);

const fontOpacity = 0.75;

// Font Weights
const fontWeights = {
  light: 300,
  regular: 400,
  semiBold: 600,
  bold: 700
};

/// ******
/// COLORS
/// ******

// Background color for App
// ------------------------
// Here we are using a gradient for the background color.
// These colors can be a string, array, or array of objects.
// More documentation on this here: https://github.com/mistic100/tinygradient
// If you want a solid color or image, you can simply assign `appBg` to a
// hex, rgb, rgba string, or image url
// If using an image url, write your url like this:
// 'url(http://saxony-blue.com/data/out/103/6072158-moon-image.jpg)'
// replacing the example url with your own. `appBg` is a css `background` property
// so `no-repeat center center fixed` all apply, for example:
// 'url(http://saxony-blue.com/data/out/103/6072158-moon-image.jpg) no-repeat center center fixed'
const appBgColors = [
  '#835fac', // purple
  '#00558a', // blue
  '#009db6' // teal
];
const appBgGradientType = 'linear';
const appBgGradientAngle = '-35deg';
const appBg = tinygradient(appBgColors).css(
  appBgGradientType,
  appBgGradientAngle
);
// appBgSize is mainly for background images
// for full sized background images, use 'cover'
const appBgSize = 'auto';

// Primary Palette
const themeColors = {
  // Themeable colors
  primary: '#fff', // white
  highlight1: '#00ffe0', // teal
  highlight2: '#83d9ff', // light blue
  lowlight1: '#1b1464', // dark purple
  lowlight2: '#9e005d', // medium purple
  lightBg: 'rgba(255, 255, 255, 0.1)', // transparent white
  mediumBg: 'rgba(0, 255, 224, .2)', // transparent teal
  darkBg: 'rgba(0, 0, 0, .4)', // transparent black
  appBg,
  footerBg: 'rgba(255, 255, 255, 0.2)',
  get highlightGradient() {
    return tinygradient([this.highlight1, this.highlight2]).css();
  },
  get lowlightGradient() {
    return tinygradient([this.lowlight1, this.lowlight2]).css();
  },
  // Constants
  white: '#fff',
  black: '#000',
  transparent: 'transparent'
};

/// *******
/// BORDERS
/// *******

const borderWidth = { property: 'border-width', value: '1px' };
const borderStyle = { property: 'border-style', value: 'solid' };
const border1Color = { property: 'border-color', value: 'white' };
const border2Color = {
  property: 'border-color',
  value: 'rgba(255, 255, 255, 0.2)'
};
const border1 = border.stringify([borderWidth, borderStyle, border1Color]);
const border2 = border.stringify([borderWidth, borderStyle, border2Color]);
const borderRadius = '5px';

/// *******************
/// COMPONENT VARIABLES
/// *******************

const footerHeight = makeRem(fontSizeBase * 2);
const headerHeight = makeRem(fontSizeBase * 7);
const appHeight = `calc(100vh - ${footerHeight})`;
const appContentHeight = `calc(100vh - ${footerHeight} - ${headerHeight})`;
const sidebarHeight = appHeight;
const logoUrl = logo;

const themeVariables = {
  fontFamily,
  fontSizeBase: makeRem(fontSizeBase),
  fontSizeSmall,
  fontSizeNormal,
  fontSizeLarge,
  fontSizeH1,
  fontSizeH2,
  fontSizeH3,
  fontSizeH4,
  fontSizeH5,
  fontSizeH6,
  fontOpacity,
  fontWeights,
  themeColors,
  appBgSize,
  border1,
  border2,
  borderRadius,
  appHeight,
  appContentHeight,
  footerHeight,
  headerHeight,
  sidebarHeight,
  logoUrl
};

export default themeVariables;
