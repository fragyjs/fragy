import Color from 'color';

const ColorTester = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/i;

export const generateStyle = (primaryColor) => {
  if (!primaryColor || !ColorTester.test(primaryColor)) {
    return null;
  }
  const color = new Color(primaryColor);
  const style = document.createElement('style');
  style.id = 'fragy-generated-styles';
  let lightenRate = 0.05;
  if (color.red() <= 50 && color.green() <= 50 && color.blue() <= 50) {
    lightenRate = 0.2;
  }
  const hoverColor = color.lighten(lightenRate).hex();
  const borderColor = color.lighten(lightenRate).hex();
  // light
  style.innerHTML = `:root {--primary:${primaryColor};--primary-hover:${hoverColor};--article-block-border:${borderColor};--article-border:${borderColor}}`;
  // dark
  const darkenRate = 0.05;
  let darkHoverColor;
  let darkBorderColor;
  if (color.red() <= 50 && color.green() <= 50 && color.blue() <= 50) {
    darkHoverColor = color.lighten(0.1).hex();
    darkBorderColor = color.lighten(0.1).hex();
  } else {
    darkHoverColor = color.darken(darkenRate).hex();
    darkBorderColor = color.darken(darkenRate).hex();
  }
  style.innerHTML += `.dark {--primary-hover:${darkHoverColor};--article-block-border:${darkBorderColor};--article-border:${darkBorderColor};}`;
  return style;
};
