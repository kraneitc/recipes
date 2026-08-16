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
<h3>Group 1 — Base</h3>
<ul><li>1 onion, diced</li><li>500 mL stock</li></ul>
<h3>Group 2 — To finish</h3>
<ul><li>1 tsp salt</li></ul>
<h2>Method</h2>
<h3>Group 1 — Base</h3>
<ol><li>Cook the onion, then add the stock.</li></ol>
<h3>Group 2 — To finish</h3>
<ol start="2"><li>Season with the salt.</li></ol>`,
    ...overrides
  };
}

test("renders recipe HTML and Schema.org data from grouped content", () => {
  const output = render(recipeData());
  const scriptMatch = output.match(/<script type="application\/ld\+json">([\s\S]+)<\/script>/);

  assert.match(output, /<h1>Example soup<\/h1>/);
  assert.ok(scriptMatch, "expected a JSON-LD script");

  const structuredData = JSON.parse(scriptMatch[1]);
  assert.equal(structuredData["@type"], "Recipe");
  assert.equal(structuredData.totalTime, "PT1H");
  assert.deepEqual(structuredData.recipeIngredient, ["1 onion, diced", "500 mL stock", "1 tsp salt"]);
  assert.deepEqual(
    structuredData.recipeInstructions.map((section) => section.name),
    ["Group 1 — Base", "Group 2 — To finish"],
  );
  assert.equal(structuredData.image, "https://example.com/recipes/example-soup/images/soup.jpg");
});

test("rejects method groups that do not match ingredient groups", () => {
  const mismatchedContent = recipeData().content.replace(
    "<h3>Group 2 — To finish</h3>\n<ol",
    "<h3>Group 2 — Garnish</h3>\n<ol",
  );

  assert.throws(
    () => render(recipeData({ content: mismatchedContent })),
    /ingredient and method activity group headings must match exactly/,
  );
});
