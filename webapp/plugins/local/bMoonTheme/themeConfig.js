import { utils } from '@bpanel/bpanel-ui';

const { makeRem, makeGutter } = utils;

/// ******
/// THEME CONFIG
/// ******
const themeCreator = themeVariables => {
  const logoSize = makeRem(2.25);
  // MAIN APP COMPONENTS
  const sidebar = {
    logoContainer: {
      background: themeVariables.themeColors.light2Bg,
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
  return { sidebar };
};

export default themeCreator;
