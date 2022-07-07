import { paramCase } from 'change-case';

const getColorDefs = (colors) => {
  return Object.keys(colors).map((key) => {
    return `--${paramCase(key)}: ${colors[key]};`;
  });
};

export const generateColorStyles = (colors) => {
  if (!colors) {
    return '';
  }
  let ret = '';
  if (colors.default) {
    const lightColors = getColorDefs(colors.default);
    if (lightColors.length) {
      ret += `:root { ${lightColors.join('')} }`;
    }
  }
  if (colors.dark) {
    const darkColors = getColorDefs(colors.dark);
    if (darkColors.length) {
      ret += `.dark { :root { ${darkColors.join('')} } }`;
    }
  }
  return ret;
};
