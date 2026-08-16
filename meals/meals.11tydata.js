function mealSlug(inputPath) {
  const normalizedPath = inputPath.replaceAll("\\", "/");
  const match = normalizedPath.match(/(?:^|\/)meals\/([^/]+)\.md$/);

  if (!match) {
    throw new Error(`Could not determine the meal slug from ${inputPath}.`);
  }

  return match[1];
}

export default {
  layout: "layouts/meal.11ty.js",
  eleventyComputed: {
    permalink: (data) => `/meals/${mealSlug(data.page.inputPath)}/index.html`
  }
};
