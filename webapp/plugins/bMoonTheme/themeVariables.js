/// ***********
/// BACKGROUNDS
/// ***********

const appBg =
  'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(htt' +
  'ps://i2.wp.com/trendintech.com/wp-content/uploads/2017/05/477614_1' +
  '280x720.jpg?fit=1280%2C720) no-repeat center center fixed';
const appBgSize = 'cover';

/// ******
/// COLORS
/// ******

// Primary Palette
const themeColors = {
  // Themeable colors
  highlight1: '#91fbeb', // teal
  highlight2: '#ccd9ce', // light blue
  lowlight1: '#71b8ba', // dark purple
  lowlight2: '#0a1827', // medium purple
  mediumBg: 'rgba(246, 237, 211, 0.2)' // transparent teal
};

// Logo
const logoUrl =
  'https://e2-cdns2-fp.akamaized.net/media/img/subscription_modal/rocket.svg';

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
  logoUrl
};

export default themeVariables;
