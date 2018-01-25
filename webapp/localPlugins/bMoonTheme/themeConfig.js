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
  logo: {
    container: {
      background: logoContainerBg,
      borderRadius: logoContainerBorderRadius,
      opacity: logoOpacity,
      ...logoContainerPadding,
      ...logoContainerMargin
    },
    img: {
      height: logoSize,
      width: logoSize
    }
  }
};

export default {
  // App components
  sidebar
};
