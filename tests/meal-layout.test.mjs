import assert from "node:assert/strict";
import test from "node:test";
import { render } from "../site/_includes/layouts/meal.11ty.js";

test("renders a meal and translates repository recipe links to website URLs", () => {
  const output = render({
    content: `<h1>Example meal</h1>
<p><a href="../recipes/example-stew/recipe.md">Example stew</a></p>`,
  });

  assert.match(output, /<p class="recipe-status">Batch meal<\/p>/);
  assert.match(output, /href="\/recipes\/example-stew\/"/);
  assert.doesNotMatch(output, /recipe\.md/);
});
