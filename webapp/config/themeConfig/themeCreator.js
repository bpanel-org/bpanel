import Immutable from 'seamless-immutable';
import themeVariables from './themeVariables';
import { StyleSheet } from 'aphrodite';
import { createCss } from '../../utils/createCss';

const themeCreator = (
  _themeVariables = Immutable({}),
  _themeConfig = Immutable({})
) => {
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
    sidebarFooterTextMargin,
    // Sidebar
    sidebarContainerHeight,
    sidebarContainerPadding,
    sidebarFooterPadding,
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
    // TabMenu
    tabMenuHeaderTextMarginBottom,
    tabMenuHeaderTextPadding,
    tabMenuHeaderTextActiveZindex,
    tabMenuHeaderTextInactiveZindex,
    tabMenuBodyPadding
  } = Immutable(themeVariables).merge(_themeVariables, { deep: true });

  /// ******
  /// THEME CONFIG
  /// ******

  const defaultButtonStyle = {
    backgroundColor: themeColors.transparent,
    border: `${borderWidth.value} ${borderStyle.value} ${themeColors.highlight1}`,
    borderRadius: borderRadius,
    color: themeColors.highlight1,
    cursor: 'pointer',
    fontSize: fontSizeBase
  };

  const transition = {
    WebkitTransition: smoothTransition,
    MozTransition: smoothTransition,
    OTransition: smoothTransition,
    msTransition: smoothTransition,
    transition: smoothTransition
  };

  const themeConfig = Immutable({
    // MAIN APP COMPONENTS

    // App
    app: {
      container: {
        height: appHeight,
        overflowY: 'overlay'
      },
      body: {
        color: themeColors.primary,
        background: appBg,
        backgroundSize: appBgSize,
        height: appBodyHeight,
        minHeight: appBodyMinHeight,
        overflowY: 'visible',
        fontFamily
      },
      content: {
        height: appContentHeight,
        ...appContentPadding
      },
      sidebarContainer: {
        ...appSidebarContainer
      }
    },

    // Sidebar
    sidebar: {
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
        ':hover': {
          textDecoration: 'none'
        }
      },
      item: {
        border: '1px solid transparent',
        color: themeColors.primary,
        fontWeight: fontWeights.light,
        textDecoration: 'none',
        ...transition,
        ...sidebarItemPadding,
        ':hover': {
          border: border1
        }
      },
      itemActive: {
        background: themeColors.lowlightGradient
      },
      itemIcon: {
        ...sidebarItemIconPadding
      },
      logoContainer: {
        opacity: fontOpacity,
        textAlign: 'center',
        width: '100%',
        ...logoContainerPadding
      },
      logoImg: {
        height: logoSize,
        width: logoSize
      },
      footer: {
        ...sidebarFooterPadding
      },
      footerText: {
        fontSize: fontSizeSmall,
        fontWeight: fontWeights.light,
        opacity: fontOpacity,
        ...sidebarFooterTextMargin
      }
    },

    // Header Bar
    headerbar: {
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
    },

    // Footer
    footer: {
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
    },

    // BPANEL UI COMPONENTS

    // Button
    button: {
      primary: {
        ...defaultButtonStyle,
        ...transition,
        ':hover': {
          backgroundColor: themeColors.highlight1,
          color: themeColors.white
        }
      },
      action: {
        border: 'none',
        backgroundColor: themeColors.primary,
        cursor: 'pointer',
        padding: buttonActionPadding,
        ...transition,
        ':hover': {
          background: themeColors.lowlightGradient,
          color: themeColors.white
        }
      }
    },

    // Header
    header: {
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
    },

    // Input
    input: {
      checkbox: {},
      color: {},
      date: {},
      'datetime-local': {},
      email: {},
      file: {
        ...defaultButtonStyle
      },
      month: {},
      number: {},
      password: {
        backgroundColor: themeColors.darkBg,
        border: 'none',
        color: themeColors.primary,
        ...inputTextPadding
      },
      radio: {},
      range: {},
      reset: {
        ...defaultButtonStyle
      },
      search: {},
      submit: {
        ...defaultButtonStyle
      },
      tel: {},
      text: {
        backgroundColor: themeColors.darkBg,
        border: 'none',
        color: themeColors.primary,
        ...inputTextPadding
      },
      time: {},
      url: {},
      week: {}
    },

    // Link
    link: {
      default: {
        color: themeColors.highlight1,
        fontSize: fontSizeBase,
        textDecoration: 'underline'
      }
    },

    // Table
    table: {
      container: {
        border: border2
      },
      header: {
        fontWeight: fontWeights.semiBold,
        textTransform: 'capitalize'
      },
      body: {
        fontWeight: fontWeights.light
      }
    },

    //Tab Menu
    tabMenu: {
      headerContainer: {
        ...rowContainer
      },
      headerText: {
        marginBottom: tabMenuHeaderTextMarginBottom,
        ...tabMenuHeaderTextPadding
      },
      headerTextActive: {
        backgroundColor: themeColors.transparent,
        border: border2,
        borderBottomColor: themeColors.highlight1,
        zIndex: tabMenuHeaderTextActiveZindex
      },
      headerTextInactive: {
        backgroundColor: themeColors.darkBg,
        border: borderTransparent,
        borderBottomColor: themeColors.transparent,
        zIndex: tabMenuHeaderTextInactiveZindex
      },
      bodyContainer: {
        ...tabMenuBodyPadding
      },
      bodyActive: {
        display: 'block',
        border: border2
      },
      bodyInactive: {
        display: 'none'
      }
    },

    tableRowStyle: ({ index }) => {
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
    },

    // Text
    text: {
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
    }
  }).merge(_themeConfig, { deep: true });
  const {
    app,
    sidebar,
    headerbar,
    input,
    footer,
    button,
    header,
    link,
    table,
    tableRowStyle,
    tabMenu,
    text
  } = themeConfig;
  const styleSheet = {
    app: StyleSheet.create(app),
    sidebar: StyleSheet.create(sidebar),
    headerbar: StyleSheet.create(headerbar),
    input: StyleSheet.create(input),
    footer: StyleSheet.create(footer),
    button: StyleSheet.create(button),
    header: StyleSheet.create(header),
    link: StyleSheet.create(link),
    table: StyleSheet.create(table),
    tabMenu: StyleSheet.create(tabMenu),
    text: StyleSheet.create(text),
    logoUrl,
    tableRowStyle
  };
  // createCss takes the style sheets and turns their properties into css classes
  createCss(styleSheet);

  return styleSheet;
};

export default themeCreator;
