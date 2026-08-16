import { HtmlBasePlugin } from "@11ty/eleventy";

function formatMinutes(value) {
  if (!Number.isInteger(value) || value < 0) {
    return "";
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }

  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes} min`);
  }

  return parts.join(" ");
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "site/assets": "assets" });
  eleventyConfig.addPassthroughCopy("recipes/**/images/**");

  eleventyConfig.addFilter("formatMinutes", formatMinutes);

  eleventyConfig.addCollection("recipes", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./recipes/*/recipe.md")
      .sort((left, right) => left.data.title.localeCompare(right.data.title)),
  );

  eleventyConfig.addCollection("meals", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./meals/*.md")
      .sort((left, right) => left.data.title.localeCompare(right.data.title)),
  );
}

export const config = {
  dir: {
    input: ".",
    includes: "site/_includes",
    data: "site/_data",
    output: "_site"
  },
  markdownTemplateEngine: false,
  htmlTemplateEngine: "njk",
  templateFormats: ["md", "njk", "11ty.js"]
};
