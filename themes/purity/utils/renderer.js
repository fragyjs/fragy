export const optimizeExternalLink = (el) => {
  if (!el) {
    // eslint-disable-next-line no-console
    console.error('Cannot optimize external link, because the element is null.');
    return;
  }
  const elements = el.querySelectorAll('a');
  elements.forEach((element) => {
    // eslint-disable-next-line no-param-reassign
    element.target = '_blank';
    // eslint-disable-next-line no-param-reassign
    element.rel = 'external nofollow noopener noreferrer';
  });
};
