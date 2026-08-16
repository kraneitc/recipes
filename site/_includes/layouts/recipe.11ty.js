import {
  collapseIngredientShopping,
  createRecipeJsonLd,
  parseRecipeContent,
  validateMetadata
} from "../lib/recipe-data.js";

export const data = {
  layout: "layouts/base.njk"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMinutes(value) {
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

function jsonForScript(value) {
  return JSON.stringify(value, null, 2)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

export function render(recipe) {
  validateMetadata(recipe);
  const parsedRecipe = parseRecipeContent(recipe.content, recipe);
  const recipeContent = collapseIngredientShopping(recipe.content, recipe);
  const structuredData = createRecipeJsonLd(recipe, parsedRecipe);
  const totalMinutes = recipe.prep_minutes + recipe.cook_minutes;
  const yieldText = recipe.servings ? `${recipe.servings} servings` : recipe.yield;
  const image = recipe.image
    ? `<img class="recipe-hero" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.image_alt)}">`
    : "";
  const tagList = recipe.tags.length > 0
    ? `<ul class="tag-list" aria-label="Recipe tags">${recipe.tags
      .map((tag) => `<li>${escapeHtml(tag)}</li>`)
      .join("")}</ul>`
    : "";
  const sourceLabel = recipe.source ? escapeHtml(recipe.source) : "Original source";
  const source = recipe.source_url
    ? `<p class="recipe-source"><strong>Source:</strong> <a href="${escapeHtml(recipe.source_url)}">${sourceLabel}</a></p>`
    : recipe.source
      ? `<p class="recipe-source"><strong>Source:</strong> ${sourceLabel}</p>`
      : "";

  return `<article class="recipe">
  <a class="back-link" href="/">&larr; All recipes</a>
  <header class="recipe-header">
    <p class="recipe-status">${escapeHtml(recipe.status)}</p>
    <h1>${escapeHtml(recipe.title)}</h1>
    <p class="recipe-description">${escapeHtml(recipe.description)}</p>
    ${image}
    <dl class="recipe-facts">
      <div><dt>Yield</dt><dd>${escapeHtml(yieldText)}</dd></div>
      <div><dt>Prep</dt><dd>${escapeHtml(formatMinutes(recipe.prep_minutes))}</dd></div>
      <div><dt>Cook</dt><dd>${escapeHtml(formatMinutes(recipe.cook_minutes))}</dd></div>
      <div><dt>Total</dt><dd>${escapeHtml(formatMinutes(totalMinutes))}</dd></div>
    </dl>
    ${tagList}
  </header>
  <div class="recipe-content">
    ${recipeContent}
  </div>
  ${source}
</article>
<script type="application/ld+json">${jsonForScript(structuredData)}</script>`;
}
