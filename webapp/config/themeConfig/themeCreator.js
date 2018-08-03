import { StyleSheet } from 'aphrodite/no-important';
import { utils } from '@bpanel/bpanel-ui';

import themeVariables from './themeVariables';
import { createCss } from '../../utils/createCss';

import { merge } from 'lodash';

const { makeRem, makeGutter } = utils;

const themeCreator = (_themeVariables = {}, _themeConfig = {}) => {
  /* This if statement gives you access to default themeVariables in your custom theme.
  ** Declaring your themeVariables as a function gives you access to the default themeVariables as
  ** an argument to that function.
  */
  if (typeof _themeVariables === 'function')
    _themeVariables = _themeVariables(themeVariables);

  const mergedThemeVariables = merge({}, themeVariables, _themeVariables);
  const {
    // rawRem holds all the values that will be converted to a stringified rem value
    rawRem,
    /// *****
    /// FONTS
    /// *****
    fontSizeBase,
    // Font Family
    fontFamily,
    // Font Opacity
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
    /// ***********
    /// TRANSITIONS
    /// ***********
    smoothTransition,
    /// *******************
    /// COMPONENT VARIABLES
    /// *******************
    // Logo
    logoUrl
  } = mergedThemeVariables;

  const {
    /// *****
    /// FONTS
    /// *****
    // Font Size
    fontSizeSmall,
    fontSizeNormal,
    fontSizeLarge,
    fontSizeH1,
    fontSizeH2,
    fontSizeH3,
    fontSizeH4,
    fontSizeH5,
    fontSizeH6,
    // Header
    headerHeight,
    // Footer
    footerHeight
  } = Object.keys(rawRem).reduce((acc, key) => {
    acc[key] = makeRem(rawRem[key], fontSizeBase);
    return acc;
  }, {});
  const appHeight = `calc(100vh - ${footerHeight})`;
  const lowlightGradient =
    themeColors.lowlightGradient ||
    `linear-gradient(to left, ${themeColors.lowlight1}, ${
      themeColors.lowlight2
    })`;

  /// ******
  /// THEME CONFIG
  /// ******

  const defaultButtonStyle = {
    backgroundColor: themeColors.transparent,
    border: `${borderWidth} ${borderStyle} ${themeColors.highlight1}`,
    borderRadius: borderRadius,
    color: themeColors.highlight1,
    cursor: 'pointer',
    fontSize: fontSizeNormal
  };

  const transition = {
    WebkitTransition: smoothTransition,
    MozTransition: smoothTransition,
    OTransition: smoothTransition,
    msTransition: smoothTransition,
    transition: smoothTransition
  };

  const themeConfig = {
    // MAIN APP COMPONENTS

    // App
    app: {
      container: {
        height: appHeight,
        overflowY: 'auto'
      },
      body: {
        color: themeColors.primary,
        background: appBg,
        backgroundSize: appBgSize,
        height: '100%',
        minHeight: makeRem(18.75, fontSizeBase),
        overflowY: 'visible',
        fontFamily
      },
      content: {
        ...makeGutter('padding', { left: 1.25, right: 2.5 })
      },
      sidebarContainer: {
        ...makeGutter('padding', { left: 0 })
      }
    },

    // Dropdown
    dropdown: {
      container: {
        width: '100%'
      }
    },

    // Sidebar
    sidebar: {
      container: {
        minHeight: '50vh',
        ...makeGutter('padding', { left: 0 })
      },
      link: {
        minWidth: makeRem(9.375, fontSizeBase),
        textDecoration: 'none',
        width: '100%',
        ':hover': {
          textDecoration: 'none'
        }
      },
      subItem: {
        ...makeGutter('padding', { left: 2.5 })
      },
      item: {
        border: borderTransparent,
        color: themeColors.primary,
        fontWeight: fontWeights.light,
        textDecoration: 'none',
        ...transition,
        ...makeGutter('padding', {
          horizontal: 2.1875,
          vertical: 0.625
        }),
        ':hover': {
          border: border1
        }
      },
      itemActive: {
        background: lowlightGradient
      },
      itemIcon: {
        ...makeGutter('padding', { right: 0.75 })
      },
      logoContainer: {
        opacity: fontOpacity,
        textAlign: 'center',
        width: '100%',
        ...makeGutter('padding', {
          horizontal: 0,
          vertical: 1.875
        })
      },
      logoImg: {
        height: makeRem(3.75, fontSizeBase),
        width: makeRem(3.75, fontSizeBase)
      },
      footer: {
        // ...makeGutter('padding', { bottom: 3.125 })
      },
      footerText: {
        fontSize: fontSizeSmall,
        fontWeight: fontWeights.light,
        opacity: fontOpacity,
        ...makeGutter('margin', { bottom: 0 })
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
        marginLeft: fontSizeSmall
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
        backgroundColor: themeColors.light2Bg,
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
        padding: makeRem(0.3125, fontSizeBase),
        ...transition,
        ':hover': {
          background: lowlightGradient,
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
        ...makeGutter('padding', {
          horizontal: 0.75,
          vertical: 0.5
        })
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
        ...makeGutter('padding', {
          horizontal: 0.75,
          vertical: 0.5
        })
      },
      time: {},
      url: {},
      week: {}
    },

    // Link
    link: {
      default: {
        color: themeColors.highlight1,
        fontSize: fontSizeNormal,
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

    // tableRowStyle: Function that styles the table rows depending on their index
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

    expandedRow: {
      container: {
        height: '100%',
        ...makeGutter('padding', { all: 1 })
      },
      mainDataContainer: {
        display: 'flex',
        flexDirection: 'column'
      },
      subDataContainer: {
        display: 'flex',
        flexDirection: 'row'
      },
      rowHeader: {
        width: '6rem'
      },
      dataRow: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '7px',
        ...makeGutter('padding', { all: 0.33 })
      },
      borderedCol: {
        border: border2,
        overflow: 'auto',
        width: '80%',
        ...makeGutter('padding', { all: 0.2 })
      },
      copyIcon: {
        lineHeight: '2rem',
        cursor: 'pointer',
        color: themeColors.highlight1,
        ...makeGutter('padding', { left: 1 })
      }
    },

    //Tab Menu
    tabMenu: {
      headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center'
      },
      headerText: {
        marginBottom: '-1px',
        ...makeGutter('padding', {
          horizontal: 0.625,
          vertical: 0.3125
        })
      },
      headerTextActive: {
        backgroundColor: themeColors.transparent,
        border: border2,
        borderBottomColor: themeColors.highlight1,
        zIndex: '1'
      },
      headerTextInactive: {
        backgroundColor: themeColors.darkBg,
        border: borderTransparent,
        borderBottomColor: themeColors.transparent,
        zIndex: '0',
        ':hover': {
          cursor: 'pointer'
        }
      },
      bodyContainer: {
        ...makeGutter('padding', { all: 1.25 })
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
        fontSize: fontSizeNormal
      },
      p: {
        fontSize: fontSizeNormal
      },
      strong: {
        fontSize: fontSizeNormal,
        fontWeight: fontWeights.semiBold
      }
    }
  };

  /* This if statement gives you access to default themeConfig in your custom theme.
  ** Declaring your themeConfig as a function gives you access to the default theme config as
  ** an argument to that function.
  */
  if (typeof _themeConfig === 'function')
    _themeConfig = _themeConfig(themeVariables, themeConfig);

  const mergedThemeConfig = merge({}, themeConfig, _themeConfig);

  const {
    app,
    dropdown,
    sidebar,
    headerbar,
    input,
    footer,
    button,
    header,
    link,
    table,
    expandedRow,
    tableRowStyle,
    tabMenu,
    text
  } = mergedThemeConfig;

  const styleSheet = {
    app: StyleSheet.create(app),
    dropdown: StyleSheet.create(dropdown),
    sidebar: StyleSheet.create(sidebar),
    headerbar: StyleSheet.create(headerbar),
    input: StyleSheet.create(input),
    footer: StyleSheet.create(footer),
    button: StyleSheet.create(button),
    header: StyleSheet.create(header),
    link: StyleSheet.create(link),
    table: StyleSheet.create(table),
    expandedRow: StyleSheet.create(expandedRow),
    tabMenu: StyleSheet.create(tabMenu),
    text: StyleSheet.create(text),
    themeVariables: mergedThemeVariables,
    logoUrl,
    tableRowStyle
  };
  // createCss takes the style sheets and turns their properties into css classes
  createCss(styleSheet);

  return styleSheet;
};

export default themeCreator;
