import { utils } from 'bpanel-ui';
import themeVariables from './themeVariables';

const { makeRem, makeGutter } = utils;

const themeCreator = defaultThemeVariables => {
  /// ******
  /// THEME CONFIG
  /// ******
  const logoSize = '2.25rem';
  // MAIN APP COMPONENTS
  const sidebar = {
    logoContainer: {
      border: `1px solid ${themeVariables.themeColors.darkBg}`,
      borderRadius: '50%',
      opacity: 1,
      ...makeGutter('padding', { all: 1.25 }), // Creates the padding
      ...makeGutter('margin', { vertical: 1.875 }) // Creates the vertical margin
    },
    logoImg: {
      height: logoSize,
      width: logoSize
    }
  };

  const tableRowStyle = ({ index }) => {
    const style = {
      fontWeight: defaultThemeVariables.fontWeights.light
    };
    if (index === -1) {
      style.backgroundColor = themeVariables.themeColors.mediumBg;
    } else if (index % 2 === 0 || index === 0) {
      style.backgroundColor = themeVariables.themeColors.transparent;
    } else {
      style.backgroundColor = themeVariables.themeColors.darkBg;
    }
    return style;
  };

  return { sidebar, tableRowStyle };
};

export default themeCreator;
