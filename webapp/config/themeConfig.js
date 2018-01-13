import themeVariables from './themeVariables';

const {
  /// *****
  /// FONTS
  /// *****
  // Font Family
  fontFamily,
  // Font Size
  fontSizeBase,
  fontSizeSmall,
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
  appBgSize,
  /// ******
  /// COLORS
  /// ******
  themeColors,
  /// *******
  /// BORDERS
  /// *******
  border1,
  border2,
  border3,
  borderRadius,
  /// *******************
  /// COMPONENT VARIABLES
  /// *******************
  // App
  appBodyHeight,
  appBodyMinHeight,
  appContentHeight,
  appContentPadding,
  appHeight,
  // Header
  headerHeight,
  // Footer
  footerHeight,
  footerTextMargin,
  // Sidebar
  sidebarContainerHeight,
  sidebarContainerPadding,
  sidebarFooterPadding,
  sidebarItemIconPadding,
  sidebarItemPadding,
  sidebarItemTransition,
  sidebarLinkMinWidth,
  // Logo
  logoContainerPadding,
  logoSize,
  logoUrl,
  // Button
  buttonActionPadding
} = themeVariables;

/// ******
/// THEME CONFIG
/// ******

// MAIN APP COMPONENTS
const app = {
  container: {
    height: appHeight,
    overflowY: 'overlay'
  },
  content: {
    height: appContentHeight,
    ...appContentPadding
  },
  body: {
    color: themeColors.primary,
    background: themeColors.appBg,
    backgroundSize: appBgSize,
    height: appBodyHeight,
    minHeight: appBodyMinHeight,
    overflowY: 'hidden',
    fontFamily
  }
};

const sidebar = {
  container: {
    height: sidebarContainerHeight,
    minHeight: '50vh',
    ...sidebarContainerPadding
  },
  link: {
    minWidth: sidebarLinkMinWidth,
    textDecoration: 'none',
    textTransform: 'capitalize',
    width: '100%',
    hover: {
      textDecoration: 'none'
    }
  },
  item: {
    border: '1px solid transparent',
    color: themeColors.primary,
    fontWeight: fontWeights.light,
    textDecoration: 'none',
    WebkitTransition: sidebarItemTransition,
    MozTransition: sidebarItemTransition,
    OTransition: sidebarItemTransition,
    msTransition: sidebarItemTransition,
    transition: sidebarItemTransition,
    ...sidebarItemPadding,
    hover: {
      border: border1
    },
    active: {
      background: themeColors.lowlightGradient
    }
  },
  itemIcon: {
    ...sidebarItemIconPadding
  },
  logo: {
    container: {
      opacity: fontOpacity,
      textAlign: 'center',
      width: '100%',
      ...logoContainerPadding
    },
    img: {
      height: logoSize,
      width: logoSize,
      url: logoUrl
    }
  },
  footer: {
    ...sidebarFooterPadding
  },
  footerText: {
    fontSize: fontSizeSmall,
    fontWeight: fontWeights.light,
    opacity: fontOpacity,
    ...footerTextMargin
  }
};

const headerbar = {
  container: {
    height: headerHeight
  },
  icon: {
    color: themeColors.highlight1,
    fontSize: fontSizeLarge,
    marginLeft: fontSizeBase
  },
  networkStatus: {
    fontSize: fontSizeSmall,
    opacity: fontOpacity
  },
  nodeText: {
    color: themeColors.highlight2
  },
  text: {
    fontSize: fontSizeSmall
  }
};

const footer = {
  container: {
    backgroundColor: themeColors.footerBg,
    bottom: 0,
    color: themeColors.primary,
    height: footerHeight,
    position: 'fixed',
    width: '100%'
  },
  progress: {
    backgroundColor: themeColors.transparent
  },
  text: {
    fontSize: fontSizeSmall
  }
};

// BPANEL UI COMPONENTS

// Button
const button = {
  primary: {
    backgroundColor: themeColors.transparent,
    border: border3,
    borderRadius: borderRadius,
    color: themeColors.highlight1,
    fontSize: fontSizeBase
  },
  action: {
    backgroundColor: themeColors.primary,
    padding: buttonActionPadding,
    hover: {
      background: themeColors.lowlightGradient
    }
  }
};

// Header
const header = {
  h1: {
    fontSize: fontSizeH1
  },
  h2: {
    fontSize: fontSizeH2
  },
  h3: {
    fontSize: fontSizeH3
  },
  h4: {
    fontSize: fontSizeH4
  },
  h5: {
    fontSize: fontSizeH5
  },
  h6: {
    fontSize: fontSizeH6
  }
};

// Link
const link = {
  color: themeColors.highlight1,
  fontSize: fontSizeBase,
  textDecoration: 'underline'
};

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

const table = {
  container: {
    border: border2
  },
  header: {
    fontWeight: fontWeights.semiBold,
    textTransform: 'capitalize'
  },
  body: {
    fontWeight: fontWeights.light
  },
  // This row renderer alternates background colors between
  // transparent and a slightly transparent white
  row: rowRenderer
};

// Text
const text = {
  span: {
    fontSize: fontSizeBase
  },
  p: {
    fontSize: fontSizeBase
  },
  strong: {
    fontSize: fontSizeBase,
    fontWeight: fontWeights.semiBold
  }
};

export default {
  // App components
  app,
  sidebar,
  headerbar,
  footer,
  // bPanel UI components
  button,
  header,
  link,
  table,
  text
};
