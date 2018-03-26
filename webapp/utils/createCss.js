import { css } from 'aphrodite/no-important';

// Search through the styleSheet object for aphrodite objects
// that can be invoked with `css()`, then invoke css() on those objects
export const createCss = styleSheet => {
  for (const k in styleSheet) {
    const currentVal = styleSheet[k];
    if (currentVal._definition) {
      styleSheet[k] = css(currentVal);
    } else if (typeof currentVal === 'object' && !Array.isArray(currentVal)) {
      createCss(currentVal);
    }
  }
};

export default { createCss };
