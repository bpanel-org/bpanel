import themeVariables from './themeVariables';

const {
  fontFamily,
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
  fontWeights,
  themeColors,
  border1,
  border2,
  borderRadius,
  footerHeight,
  headerHeight,
  appHeight,
  appContentHeight,
  sidebarHeight
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
    paddingLeft: '20px',
    paddingRight: '40px'
  },
  body: {
    fontFamily,
    height: '100%',
    minHeight: '300px',
    overflowY: 'hidden',
    background: themeColors.appBg,
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
    minWidth: '150px',
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
    padding: '10px 35px',
    WebkitTransition: '0.3s ease',
    MozTransition: '0.3s ease',
    OTransition: '0.3s ease',
    msTransition: '0.3s ease',
    transition: '0.3s ease',
    hover: {
      border: border1
    },
    active: {
      background: themeColors.lowlightGradient
    }
  },
  itemIcon: {
    paddingRight: '12px'
  },
  logo: {
    container: {
      width: '100%',
      padding: '30px 0',
      textAlign: 'center',
      opacity: '0.75'
    },
    img: {
      width: '60px',
      height: '60px'
    }
  },
  footer: {
    paddingBottom: '50px'
  },
  footerText: {
    fontSize: fontSizeSmall,
    fontWeight: fontWeights.light,
    marginBottom: '0',
    opacity: '0.75'
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
  fontSize: fontSizeBase,
  backgroundColor: themeColors.transparent,
  border: `1px solid ${themeColors.highlight1}`,
  borderRadius: borderRadius,
  color: themeColors.highlight1
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
