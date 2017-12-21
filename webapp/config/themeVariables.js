/// ******
/// FONTS
/// ******

// Size
const fontSizeBase = 1; // This gets transformed to rem

const fontSizeSmall = fontSizeBase * 0.8;
const fontSizeNormal = fontSizeBase;
const fontSizeLarge = fontSizeBase * 1.2;
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
  action: '#00ffe0',
  neutral: '#83d9ff',
  white: '#fff',
  black: '#000'
};

const bgGradient = {
  'bg-gradient-purple': '#835fac',
  'bg-gradient-blue': '#00558a',
  'bg-gradient-teal': '#009db6',
  'btn-gradient-blue': '#1b1464',
  'btn-gradient-purple': '#9e005d'
};

/// ******
/// ELEMENT DIMENSIONS
/// ******

const footerHeight = fontSizeBase * 2;
const headerHeight = fontSizeBase * 7;

const themeVariables = {
  fontSizeBase,
  fontSizeSmall,
  fontSizeNormal,
  fontSizeLarge,
  fontOpacity,
  fontWeights,
  themeColors,
  bgGradient,
  footerHeight,
  headerHeight
};

export default themeVariables;
