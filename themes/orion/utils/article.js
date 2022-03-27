export const getArticleMenu = (id) => {
  const articleNode = document.querySelector(`#${id}`);
  const titleNodes = articleNode.querySelectorAll('.article-heading-anchor');
  let menu = [];
  titleNodes.forEach((node) => {
    menu.push({
      level: parseInt(node.dataset.level, 10),
      anchor: `#${node.name}`,
      text: decodeURIComponent(node.name),
    });
  });
  menu = menu.filter((item) => item.level > 1);
  // set parent flag
  let parentAnchor;
  return menu.map((item) => {
    if (item.level === 2) {
      parentAnchor = item.anchor;
    }
    if (item.level === 3 && parentAnchor) {
      item.parent = parentAnchor;
    }
    return item;
  });
};
