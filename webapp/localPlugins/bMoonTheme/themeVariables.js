import tinygradient from 'tinygradient';
const logo =
  'https://e2-cdns2-fp.akamaized.net/media/img/subscription_modal/rocket.svg';

/// *********
/// FUNCTIONS
/// *********

const makeRem = size => (size * fontSizeBase).toString().concat('rem');

const makeGutter = (
  type = 'padding',
  { top, bottom, left, right, horizontal, vertical, all }
) => {
  let gutterTop, gutterRight, gutterBottom, gutterLeft;

  // All gutter calculations
  if (all) gutterRight = gutterLeft = gutterTop = gutterBottom = makeRem(all);

  // Horizontal gutter calculation
  if (horizontal || horizontal === 0) {
    gutterRight = gutterLeft = makeRem(horizontal);
  } else {
    gutterRight = gutterRight || ((right || right === 0) && makeRem(right));
    gutterLeft = gutterLeft || ((left || left === 0) && makeRem(left));
  }

  // Vertical gutter calculation
  if (vertical || vertical === 0) {
    gutterTop = gutterBottom = makeRem(vertical);
  } else {
    gutterTop = gutterTop || ((top || top === 0) && makeRem(top));
    gutterBottom =
      gutterBottom || ((bottom || bottom === 0) && makeRem(bottom));
  }

  return {
    [`${type}Top`]: gutterTop,
    [`${type}Right`]: gutterRight,
    [`${type}Bottom`]: gutterBottom,
    [`${type}Left`]: gutterLeft
  };
};

const fontSizeBase = 1; // This gets transformed to rem

/// ***********
/// BACKGROUNDS
/// ***********

const appBg =
  'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://i2.wp.com/trendintech.com/wp-content/uploads/2017/05/477614_1280x720.jpg?fit=1280%2C720) no-repeat center center fixed';
const appBgSize = 'cover';

/// ******
/// COLORS
/// ******

// Primary Palette
const themeColors = {
  // Themeable colors
  primary: '#fff', // white
  highlight1: '#91FBEB', // teal
  highlight2: '#CCD9CE', // light blue
  lowlight1: '#71B8BA', // dark purple
  lowlight2: '#0A1827', // medium purple
  lightBg: 'rgba(255, 255, 255, 0.1)', // transparent white
  mediumBg: 'rgba(246, 237, 211, .2)', // transparent teal
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

// Logo
const logoContainerBg = 'rgba(255, 255, 255, 0.2)';
const logoContainerBorderRadius = '50%';
const logoContainerMargin = makeGutter('margin', { vertical: 1.875 });
const logoContainerPadding = makeGutter('padding', { all: 1.25 });

const logoOpacity = 1;
const logoSize = '2.25rem';
const logoUrl = logo;

const themeVariables = {
  /// ***********
  /// BACKGROUNDS
  /// ***********
  appBg,
  appBgSize,
  /// ******
  /// COLORS
  /// ******
  themeColors,
  // Logo
  logoContainerBg,
  logoContainerBorderRadius,
  logoContainerMargin,
  logoContainerPadding,
  logoOpacity,
  logoSize,
  logoUrl
};

export default themeVariables;
