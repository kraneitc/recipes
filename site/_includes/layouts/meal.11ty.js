export const data = {
  layout: "layouts/base.njk"
};

function recipeLinksForWebsite(content) {
  return content.replaceAll(
    /href="\.\.\/recipes\/([^/]+)\/recipe\.md"/g,
    'href="/recipes/$1/"',
  );
}

export function render(meal) {
  return `<article class="recipe meal">
  <a class="back-link" href="/">&larr; All recipes and meals</a>
  <p class="recipe-status">Batch meal</p>
  <div class="recipe-content">
    ${recipeLinksForWebsite(meal.content)}
  </div>
</article>`;
}
