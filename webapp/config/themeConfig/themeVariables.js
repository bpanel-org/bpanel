import logo from '../../assets/logo.png';
import favicon from '../../assets/favicon.ico';

/// *****
/// FONTS
/// *****

// Font Family
const fontFamily = 'Open Sans, sans-serif';

// Font Size
const fontSizeBase = 1; // This gets transformed to rem

const fontSizeSmall = 0.8;
const fontSizeNormal = 1;
const fontSizeLarge = 1.2;

const fontSizeH1 = 3.2;
const fontSizeH2 = 2.6;
const fontSizeH3 = 2.1;
const fontSizeH4 = 1.7;
const fontSizeH5 = 1.3;
const fontSizeH6 = 1.1;

const fontOpacity = 0.75;

// Font Weights
const fontWeights = {
  light: 300,
  regular: 400,
  semiBold: 600,
  bold: 700
};

/// ***********
/// BACKGROUNDS
/// ***********

// Background color for App
// ------------------------
// Here we are using a gradient for the background color.
// These colors can be a string, array, or array of objects.
// If you want a solid color or image, you can simply assign `appBg` to a
// hex, rgb, rgba string, or image url
// If using an image url, write your url like this:
// 'url(http://saxony-blue.com/data/out/103/6072158-moon-image.jpg)'
// replacing the example url with your own url. `appBg` is a css `background` property
// so `no-repeat center center fixed` can be applied, for example:
// 'url(http://saxony-blue.com/data/out/103/6072158-moon-image.jpg) no-repeat center center fixed'

// purple blue and teal gradient
const appBg = 'linear-gradient(-35deg, #835fac, #00558a, #009db6)';

// appBgSize is mainly for background images
// for full sized background images, use 'cover'
const appBgSize = 'auto';

/// ******
/// COLORS
/// ******

// Primary Palette
const themeColors = {
  // Themeable colors
  primary: '#fff', // white
  highlight1: '#00ffe0', // teal
  highlight2: '#83d9ff', // light blue
  lowlight1: '#1b1464', // dark purple
  lowlight2: '#9e005d', // medium purple
  lightBg: 'rgba(255, 255, 255, 0.1)', // transparent white 1
  light2Bg: 'rgba(255, 255, 255, 0.2)', // transparent white 2
  mediumBg: 'rgba(0, 255, 224, .2)', // transparent teal
  darkBg: 'rgba(0, 0, 0, .4)', // transparent black
  // Constants
  white: '#fff',
  black: '#000',
  transparent: 'transparent',
  error: '#990000'
};

/// *******
/// BORDERS
/// *******

const borderWidth = '1px';
const borderStyle = 'solid';
const border1 = `${borderWidth} ${borderStyle} ${themeColors.white}`;
const border2 = `${borderWidth} ${borderStyle} ${themeColors.light2Bg}`;
const borderTransparent = `${borderWidth} ${borderStyle} ${
  themeColors.transparent
}`;
const borderRadius = '5px';

/// ***********
/// TRANSITIONS
/// ***********

const smoothTransition = '0.3s ease';

/// *******************
/// COMPONENT VARIABLES
/// *******************

// Header
const headerHeight = 7;

// Footer
const footerHeight = 2;

// Logo
const logoUrl = `/${logo}`;
const faviconUrl = `/${favicon}`;

const themeVariables = {
  // rawRem holds all the values that will be converted
  // to a stringified rem value based off the fontSizeBase
  rawRem: {
    /// *****
    /// FONTS
    /// *****
    // Font Size
    fontSizeSmall,
    fontSizeNormal,
    fontSizeLarge,
    fontSizeH1,
    fontSizeH2,
    fontSizeH3,
    fontSizeH4,
    fontSizeH5,
    fontSizeH6,
    // Header
    headerHeight,
    // Footer
    footerHeight
  },
  /// *****
  /// FONTS
  /// *****
  // Font Size
  fontSizeBase,
  // Font Family
  fontFamily,
  // Font Opacity
  fontOpacity,
  // Font Weights
  fontWeights,
  /// ***********
  /// BACKGROUNDS
  /// ***********
  appBg,
  appBgSize,
  /// ******
  /// COLORS
  /// ******
  themeColors,
  /// *******
  /// BORDERS
  /// *******
  borderWidth,
  borderStyle,
  border1,
  border2,
  borderTransparent,
  borderRadius,
  /// ***********
  /// TRANSITIONS
  /// ***********
  smoothTransition,
  /// *******************
  /// COMPONENT VARIABLES
  /// *******************
  // Logo
  logoUrl,
  faviconUrl
};

export default themeVariables;
