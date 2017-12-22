import themeVariables from './themeVariables';

const {
  fontSizeBase,
  fontSizeH1,
  fontSizeH2,
  fontSizeH3,
  fontSizeH4,
  fontSizeH5,
  fontSizeH6,
  fontWeights: { light, semiBold },
  themeColors,
  border1,
  borderRadius
} = themeVariables;

/// ******
/// THEME CONFIG
/// ******

export default {
  button: {
    backgroundColor: themeColors.transparent,
    border: `1px solid ${themeColors.action}`,
    borderRadius,
    color: themeColors.action
  },
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
  link: {
    color: themeColors.action,
    textDecoration: 'underline'
  },
  table: {
    container: {
      border: border1
    },
    header: {
      textTransform: 'capitalize',
      fontWeight: semiBold
    },
    body: {
      fontWeight: light
    },
    row: ({ index }) => {
      const style = {
        fontWeight: light
      };
      if (index === -1) {
        style.backgroundColor = themeColors.neutralBg;
      } else if (index % 2 === 0 || index === 0) {
        style.backgroundColor = themeColors.transparent;
      } else {
        style.backgroundColor = themeColors.lightBg;
      }
      return style;
    }
  },
  text: {
    span: {
      fontSize: fontSizeBase
    },
    p: {
      fontSize: fontSizeBase
    },
    strong: {
      fontSize: fontSizeBase,
      fontWeight: semiBold
    }
  }
};
