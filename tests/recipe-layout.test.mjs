import assert from "node:assert/strict";
import test from "node:test";
import { render } from "../site/_includes/layouts/recipe.11ty.js";

function recipeData(overrides = {}) {
  return {
    title: "Example soup",
    description: "A recipe used only to test the HTML generator.",
    status: "tested",
    servings: 4,
    prep_minutes: 15,
    cook_minutes: 45,
    tags: ["soup", "test"],
    image: "images/soup.jpg",
    image_alt: "A bowl of soup",
    page: {
      inputPath: "./recipes/example-soup/recipe.md",
      url: "/recipes/example-soup/"
    },
    site: {
      url: "https://example.com/"
    },
    content: `<h2>Ingredients</h2>
<h3>Base</h3>
<p><em>1 medium bowl (about 2 L).</em></p>
<ul><li>1 onion, diced</li><li>500 mL stock</li></ul>
<h3>To finish</h3>
<p><em>1 small bowl (about 250 mL).</em></p>
<ul><li>1 tsp salt</li></ul>
<h2>Ingredient Shopping</h2>
<h3>Fruit and vegetables</h3>
<ul><li>1 onion</li></ul>
<h3>Pantry</h3>
<ul><li>500 mL stock</li><li>1 tsp salt</li></ul>
<h2>Method</h2>
<h3>Base</h3>
<ol><li>Cook the onion, then add the stock.</li></ol>
<h3>To finish</h3>
<ol start="2"><li>Season with the salt.</li></ol>`,
    ...overrides
  };
}

test("renders recipe HTML and Schema.org data from grouped content", () => {
  const output = render(recipeData());
  const scriptMatch = output.match(/<script type="application\/ld\+json">([\s\S]+)<\/script>/);

  assert.match(output, /<h1>Example soup<\/h1>/);
  assert.match(output, /<details class="ingredient-shopping">/);
  assert.doesNotMatch(output, /<details class="ingredient-shopping" open>/);
  assert.match(output, /<summary>Ingredient shopping<\/summary>/);
  assert.match(output, /<div class="ingredient-shopping-content"><h3>Fruit and vegetables<\/h3>/);
  assert.equal((output.match(/<input type="checkbox">/g) ?? []).length, 3);
  assert.match(
    output,
    /<label class="shopping-item"><input type="checkbox"><span>1 onion<\/span><\/label>/,
  );
  assert.ok(scriptMatch, "expected a JSON-LD script");

  const structuredData = JSON.parse(scriptMatch[1]);
  assert.equal(structuredData["@type"], "Recipe");
  assert.equal(structuredData.totalTime, "PT1H");
  assert.deepEqual(structuredData.recipeIngredient, ["1 onion, diced", "500 mL stock", "1 tsp salt"]);
  assert.deepEqual(
    structuredData.recipeInstructions.map((section) => section.name),
    ["Base", "To finish"],
  );
  assert.equal(
    structuredData.recipeInstructions[0].itemListElement[0].text,
    "Cook the onion, then add the stock.",
  );
  assert.equal(structuredData.image, "https://example.com/recipes/example-soup/images/soup.jpg");
});

test("rejects a recipe without ingredient shopping groups", () => {
  const contentWithoutShopping = recipeData().content.replace(
    /<h2>Ingredient Shopping<\/h2>[\s\S]*?(?=<h2>Method<\/h2>)/,
    "",
  );

  assert.throws(
    () => render(recipeData({ content: contentWithoutShopping })),
    /a `## Ingredient Shopping` section is required/,
  );
});

test("rejects method sections that do not match ingredient sections", () => {
  const mismatchedContent = recipeData().content.replace(
    "<h3>To finish</h3>\n<ol",
    "<h3>Garnish</h3>\n<ol",
  );

  assert.throws(
    () => render(recipeData({ content: mismatchedContent })),
    /ingredient and method activity group headings must match exactly/,
  );
});

test("rejects a break in continuous method numbering", () => {
  const incorrectlyNumberedContent = recipeData().content.replace(
    '<ol start="2">',
    '<ol start="3">',
  );

  assert.throws(
    () => render(recipeData({ content: incorrectlyNumberedContent })),
    /expected step 2 under `To finish` but found 3/,
  );
});

test("rejects indexed activity headings", () => {
  const indexedContent = recipeData().content.replaceAll("<h3>Base</h3>", "<h3>1 — Base</h3>");

  assert.throws(
    () => render(recipeData({ content: indexedContent })),
    /must contain only the activity name/,
  );
});

test("allows an ingredient group without optional suggested-container text", () => {
  const contentWithoutSuggestedContainer = recipeData().content.replace(
    '<p><em>1 small bowl (about 250 mL).</em></p>\n',
    "",
  );

  assert.doesNotThrow(() => render(recipeData({ content: contentWithoutSuggestedContainer })));
});
