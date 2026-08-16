# Recipes

Store each reusable recipe in its own lowercase kebab-case folder:

```text
recipes/
└── roast-chicken/
    ├── recipe.md
    └── images/
```

Copy [`../templates/recipe.md`](../templates/recipe.md) to start a recipe. Keep recipe-specific images beside the recipe and use relative links to them.

The Eleventy build converts each `recipe.md` into `_site/recipes/<recipe-slug>/index.html`. Recipe Markdown remains the source of truth; do not edit files under `_site/`.
