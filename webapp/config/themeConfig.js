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
  appHeight,
  appBodyMinHeight,
  appContentHeight,
  appContentPaddingLeft,
  appContentPaddingRight,
  headerHeight,
  footerHeight,
  sidebarHeight,
  sidebarItemTransition,
  sidebarItemPadding,
  sidebarLinkMinWidth,
  sidebarItemIconPaddingRight,
  sidebarFooterPaddingBottom,
  logoUrl,
  logoSize,
  logoContainerPadding,
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
    paddingLeft: appContentPaddingLeft,
    paddingRight: appContentPaddingRight
  },
  body: {
    fontFamily,
    height: '100%',
    minHeight: appBodyMinHeight,
    overflowY: 'hidden',
    background: themeColors.appBg,
    backgroundSize: appBgSize,
    color: themeColors.primary
  }
};

const sidebar = {
  container: {
    height: sidebarHeight,
    minHeight: '50vh'
  },
  link: {
    width: '100%',
    minWidth: sidebarLinkMinWidth,
    textTransform: 'capitalize',
    textDecoration: 'none',
    hover: {
      textDecoration: 'none'
    }
  },
  item: {
    border: '1px solid transparent',
    color: themeColors.primary,
    fontWeight: fontWeights.light,
    textDecoration: 'none',
    padding: sidebarItemPadding,
    WebkitTransition: sidebarItemTransition,
    MozTransition: sidebarItemTransition,
    OTransition: sidebarItemTransition,
    msTransition: sidebarItemTransition,
    transition: sidebarItemTransition,
    hover: {
      border: border1
    },
    active: {
      background: themeColors.lowlightGradient
    }
  },
  itemIcon: {
    paddingRight: sidebarItemIconPaddingRight
  },
  logo: {
    container: {
      width: '100%',
      padding: logoContainerPadding,
      textAlign: 'center',
      opacity: fontOpacity
    },
    img: {
      width: logoSize,
      height: logoSize,
      url: logoUrl
    }
  },
  footer: {
    paddingBottom: sidebarFooterPaddingBottom
  },
  footerText: {
    fontSize: fontSizeSmall,
    fontWeight: fontWeights.light,
    marginBottom: '0',
    opacity: fontOpacity
  }
};

const headerbar = {
  container: {
    height: headerHeight
  },
  icon: {
    fontSize: fontSizeLarge,
    marginLeft: fontSizeBase,
    color: themeColors.highlight1
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
    color: themeColors.primary,
    backgroundColor: themeColors.footerBg,
    bottom: 0,
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
    fontSize: fontSizeBase,
    backgroundColor: themeColors.transparent,
    border: border3,
    borderRadius: borderRadius,
    color: themeColors.highlight1
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
  fontSize: fontSizeBase,
  color: themeColors.highlight1,
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
    textTransform: 'capitalize',
    fontWeight: fontWeights.semiBold
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
