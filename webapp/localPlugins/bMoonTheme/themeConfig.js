import themeVariables from './themeVariables';
const {
  logoContainerBg,
  logoContainerBorderRadius,
  logoContainerMargin,
  logoContainerPadding,
  logoOpacity,
  logoSize
} = themeVariables;

/// ******
/// THEME CONFIG
/// ******

// MAIN APP COMPONENTS
const sidebar = {
  logoContainer: {
    background: logoContainerBg,
    borderRadius: logoContainerBorderRadius,
    opacity: logoOpacity,
    ...logoContainerPadding,
    ...logoContainerMargin
  },
  logoImg: {
    height: logoSize,
    width: logoSize
  }
};

export default {
  // App components
  sidebar
};
