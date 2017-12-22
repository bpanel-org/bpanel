/// ******
/// FONTS
/// ******

// Size
const fontSizeBase = 1; // This gets transformed to rem

const fontSizeSmall = fontSizeBase * 0.8;
const fontSizeNormal = fontSizeBase;
const fontSizeLarge = fontSizeBase * 1.2;

const fontSizeH1 = fontSizeBase * 3.2;
const fontSizeH2 = fontSizeBase * 2.6;
const fontSizeH3 = fontSizeBase * 2.1;
const fontSizeH4 = fontSizeBase * 1.7;
const fontSizeH5 = fontSizeBase * 1.3;
const fontSizeH6 = fontSizeBase * 1.1;
const makeRem = size => size.toString().concat('rem');

const fontOpacity = 0.75;

// Weights
const fontWeights = {
  light: 300,
  regular: 400,
  semiBold: 600,
  bold: 700
};

/// ******
/// COLORS
/// ******

/// Primary Palette
const themeColors = {
  action: '#00ffe0', // teal
  neutral: '#83d9ff', // light blue
  white: '#fff',
  black: '#000',
  transparent: 'transparent',
  lightBg: 'rgba(255, 255, 255, 0.1)',
  neutralBg: 'rgba(0, 255, 224, .2)',
  darkBg: 'rgba(0, 0, 0, .4)'
};

const bgGradient = {
  'bg-gradient-purple': '#835fac',
  'bg-gradient-blue': '#00558a',
  'bg-gradient-teal': '#009db6',
  'btn-gradient-blue': '#1b1464',
  'btn-gradient-purple': '#9e005d'
};

/// Borders
const border1 = '1px solid rgba(255, 255, 255, 0.15)';
const borderRadius = '5px';

/// ******
/// ELEMENT DIMENSIONS
/// ******

const footerHeight = fontSizeBase * 2;
const headerHeight = fontSizeBase * 7;

const themeVariables = {
  fontSizeBase: makeRem(fontSizeBase),
  fontSizeSmall: makeRem(fontSizeSmall),
  fontSizeNormal: makeRem(fontSizeNormal),
  fontSizeLarge: makeRem(fontSizeLarge),
  fontSizeH1: makeRem(fontSizeH1),
  fontSizeH2: makeRem(fontSizeH2),
  fontSizeH3: makeRem(fontSizeH3),
  fontSizeH4: makeRem(fontSizeH4),
  fontSizeH5: makeRem(fontSizeH5),
  fontSizeH6: makeRem(fontSizeH6),
  fontOpacity,
  fontWeights,
  themeColors,
  bgGradient,
  border1,
  borderRadius,
  footerHeight,
  headerHeight
};

export default themeVariables;
