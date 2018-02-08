import tinygradient from 'tinygradient';
import border from 'css-border-property';
import logo from '../../assets/logo.png';
import { utils } from 'bpanel-ui';

const { makeRem, makeGutter } = utils;

/// *****
/// FONTS
/// *****

// Font Family
const fontFamily = 'Open Sans, sans-serif';

// Font Size
const fontSizeBase = 1; // This gets transformed to rem

const fontSizeSmall = makeRem(0.8, fontSizeBase);
const fontSizeNormal = makeRem(1, fontSizeBase);
const fontSizeLarge = makeRem(1.2, fontSizeBase);

const fontSizeH1 = makeRem(3.2, fontSizeBase);
const fontSizeH2 = makeRem(2.6, fontSizeBase);
const fontSizeH3 = makeRem(2.1, fontSizeBase);
const fontSizeH4 = makeRem(1.7, fontSizeBase);
const fontSizeH5 = makeRem(1.3, fontSizeBase);
const fontSizeH6 = makeRem(1.1, fontSizeBase);

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
const appBgGradientAngle = '-35deg';
const appBgGradientType = 'linear';
const appBg = tinygradient(appBgColors).css(
  appBgGradientType,
  appBgGradientAngle
);
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
  lightBg: 'rgba(255, 255, 255, 0.1)', // transparent white
  mediumBg: 'rgba(0, 255, 224, .2)', // transparent teal
  darkBg: 'rgba(0, 0, 0, .4)', // transparent black
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
const borderTransparentColor = {
  property: 'border-color',
  value: themeColors.transparent
};
const border1Color = { property: 'border-color', value: 'white' };
const border2Color = {
  property: 'border-color',
  value: 'rgba(255, 255, 255, 0.2)'
};
const borderTransparent = border.stringify([
  borderWidth,
  borderStyle,
  borderTransparentColor
]);
const border1 = border.stringify([borderWidth, borderStyle, border1Color]);
const border2 = border.stringify([borderWidth, borderStyle, border2Color]);
const borderRadius = '5px';

/// **********
/// CONTAINERS
/// **********

const rowContainer = {
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center'
};
/// ***********
/// TRANSITIONS
/// ***********

const smoothTransition = '0.3s ease';

/// *******************
/// COMPONENT VARIABLES
/// *******************

// Footer
const footerHeight = makeRem(2, fontSizeBase);

// App
const appBodyHeight = `calc(100% + ${footerHeight})`;
const appBodyMinHeight = makeRem(18.75, fontSizeBase);
const appContentHeight = `calc(100vh - ${footerHeight} - ${headerHeight})`;
const appContentPadding = makeGutter('padding', { left: 1.25, right: 2.5 });
const appHeight = `calc(100vh - ${footerHeight})`;
const appSidebarContainer = makeGutter('padding', { left: 0 });

// Header
const headerHeight = makeRem(7, fontSizeBase);

// Sidebar
const sidebarContainerHeight = appHeight;
const sidebarContainerPadding = makeGutter('padding', { left: 0 });
const sidebarFooterPadding = makeGutter('padding', { bottom: 3.125 });
const sidebarFooterTextMargin = makeGutter('margin', { bottom: 0 });
const sidebarItemIconPadding = makeGutter('padding', { right: 0.75 });
const sidebarItemPadding = makeGutter('padding', {
  horizontal: 2.1875,
  vertical: 0.625
});
const sidebarLinkMinWidth = makeRem(9.375, fontSizeBase);

// Logo
const logoContainerPadding = makeGutter('padding', {
  horizontal: 0,
  vertical: 1.875
});
const logoSize = makeRem(3.75, fontSizeBase);
const logoUrl = logo;

// Button
const buttonActionPadding = makeRem(0.3125, fontSizeBase);

// Input
const inputTextPadding = makeGutter('padding', {
  horizontal: 0.75,
  vertical: 0.5
});

// Table
const rowRenderer = ({ index }) => {
  const style = {
    fontWeight: fontWeights.light
  };
  if (index === -1) {
    style.backgroundColor = themeColors.mediumBg;
  } else if (index % 2 === 0 || index === 0) {
    style.backgroundColor = themeColors.transparent;
  } else {
    style.backgroundColor = themeColors.lightBg;
  }
  return style;
};

// Tab Menu
const tabMenuHeaderTextMarginBottom = '-1px';
const tabMenuHeaderTextPadding = makeGutter('padding', {
  horizontal: 0.625,
  vertical: 0.3125
});
const tabMenuHeaderTextActiveZindex = '1';
const tabMenuHeaderTextInactiveZindex = '0';
const tabMenuBodyPadding = makeGutter('padding', { all: 1.25 });

const themeVariables = {
  /// *****
  /// FONTS
  /// *****
  // Font Family
  fontFamily,
  // Font Size
  fontSizeBase: `${fontSizeBase}rem`,
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
  borderTransparent,
  border1,
  border2,
  borderRadius,
  /// *********
  /// CONTAINER
  /// *********
  rowContainer,
  /// ***********
  /// TRANSITIONS
  /// ***********
  smoothTransition,
  /// *******************
  /// COMPONENT VARIABLES
  /// *******************
  // App
  appBodyHeight,
  appBodyMinHeight,
  appContentHeight,
  appContentPadding,
  appHeight,
  appSidebarContainer,
  // Header
  headerHeight,
  // Footer
  footerHeight,
  // Sidebar
  sidebarContainerHeight,
  sidebarContainerPadding,
  sidebarFooterPadding,
  sidebarFooterTextMargin,
  sidebarItemIconPadding,
  sidebarItemPadding,
  sidebarLinkMinWidth,
  // Logo
  logoContainerPadding,
  logoSize,
  logoUrl,
  // Button
  buttonActionPadding,
  // Input
  inputTextPadding,
  // Table
  rowRenderer,
  // TabMenu
  tabMenuHeaderTextMarginBottom,
  tabMenuHeaderTextPadding,
  tabMenuHeaderTextActiveZindex,
  tabMenuHeaderTextInactiveZindex,
  tabMenuBodyPadding
};

export default themeVariables;
