export const getTagsFromMeta = (meta) => {
  if (meta?.tags) {
    return typeof meta.tags === 'string' ? [meta.tags] : meta.tags;
  }
  if (meta?.tag) {
    return typeof meta.tag === 'string' ? [meta.tag] : meta.tag;
  }
  return null;
};

export const getCategoriesFromMeta = (meta) => {
  if (meta?.categories) {
    return typeof meta.categories === 'string' ? [meta.categories] : meta.categories;
  }
  if (meta?.category) {
    return typeof meta.category === 'string' ? [meta.category] : meta.category;
  }
  return null;
};
