import Immutable from 'seamless-immutable';
import themeVariables from './themeVariables';

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
    sidebarFooterTextMargin,
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
  } = Immutable(themeVariables).merge(_themeVariables, { deep: true });

  /// ******
  /// THEME CONFIG
  /// ******

  const themeConfig = Immutable({
    // MAIN APP COMPONENTS

    // App
    app: {
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
        background: appBg,
        backgroundSize: appBgSize,
        height: appBodyHeight,
        minHeight: appBodyMinHeight,
        overflowY: 'hidden',
        fontFamily
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
        backgroundColor: themeColors.transparent,
        border: `${borderWidth.value} ${borderStyle.value} ${themeColors.highlight1}`,
        borderRadius: borderRadius,
        color: themeColors.highlight1,
        cursor: 'pointer',
        fontSize: fontSizeBase
      },
      action: {
        border: 'none',
        backgroundColor: themeColors.primary,
        cursor: 'pointer',
        padding: buttonActionPadding,
        hover: {
          background: themeColors.lowlightGradient
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
        backgroundColor: themeColors.transparent,
        border: `${borderWidth.value} ${borderStyle.value} ${themeColors.highlight1}`,
        borderRadius: borderRadius,
        color: themeColors.highlight1,
        cursor: 'pointer',
        fontSize: fontSizeBase
      },
      search: {},
      submit: {
        backgroundColor: themeColors.transparent,
        border: `${borderWidth.value} ${borderStyle.value} ${themeColors.highlight1}`,
        borderRadius: borderRadius,
        color: themeColors.highlight1,
        cursor: 'pointer',
        fontSize: fontSizeBase
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
      color: themeColors.highlight1,
      fontSize: fontSizeBase,
      textDecoration: 'underline'
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
      },
      // This row renderer alternates background colors between
      // transparent and a slightly transparent white
      row: rowRenderer
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
  return themeConfig;
};

export default themeCreator;
