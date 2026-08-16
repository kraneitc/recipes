function recipeSlug(inputPath) {
  const normalizedPath = inputPath.replaceAll("\\", "/");
  const match = normalizedPath.match(/(?:^|\/)recipes\/([^/]+)\/recipe\.md$/);

  if (!match) {
    throw new Error(`Could not determine the recipe slug from ${inputPath}.`);
  }

  return match[1];
}

export default {
  layout: "layouts/recipe.11ty.js",
  eleventyComputed: {
    permalink: (data) => `/recipes/${recipeSlug(data.page.inputPath)}/index.html`
  }
};
