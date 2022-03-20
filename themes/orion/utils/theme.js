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
  const { light, dark } = colors;
  let ret = '';
  if (light) {
    const lightColors = getColorDefs(light);
    if (lightColors.length) {
      ret += `:root { ${lightColors.join('')} }`;
    }
  }
  if (dark) {
    const darkColors = getColorDefs(dark);
    if (darkColors.length) {
      ret += `.dark { :root { ${darkColors.join('')} } }`;
    }
  }
  return ret;
};
