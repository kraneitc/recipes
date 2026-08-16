# Repository instructions

## Purpose

This repository is the source of truth for a personal recipe collection. Keep recipes clear, reproducible, easy to search, and pleasant to cook from.

## Repository structure

- Store finished recipes in `recipes/<recipe-slug>/recipe.md`.
- Store recipe-specific images in `recipes/<recipe-slug>/images/`.
- Put incomplete or unprocessed material in `inbox/`.
- Use `meals/` to combine reusable recipes into a coordinated meal.
- Use `menus/` for multi-meal plans, rotations, holidays, and events.
- Store general cooking information in `reference/`.
- Store repository and HTML-generation documentation in `docs/`.
- Start new content from the files in `templates/`.
- Use lowercase kebab-case for directory and file names.
- Do not add category subdirectories under `recipes/`; use metadata tags instead.

## Recipe format

Every recipe should contain:

1. YAML front matter with:
   - `title`
   - `description`
   - `status`: `draft`, `tested`, or `favorite`
   - `servings` or `yield`
   - `prep_minutes` as a non-negative integer
   - `cook_minutes` as a non-negative integer
   - `tags`
   - `image` and `image_alt`, when a main image exists
   - `source`, when known
   - `source_url`, when known
   - `last_made`, when known, in `YYYY-MM-DD` format
2. `## Ingredients`.
3. `## Method` with numbered steps.
4. `## Notes` when useful.
5. `## Variations` when tested alternatives exist.

### Mise-en-place and ingredient groups

**Mise-en-place is the guiding principle for writing and interpreting every recipe's ingredient groups.** Each group should represent a practical preparation batch for one cooking activity: ingredients the cook can measure, prepare, and, where useful and safe, combine before starting that activity. Write and interpret groups from the cook's workflow rather than from shopping categories or ingredient types.

Activity-based ingredient grouping is required for every recipe. Use it to make the mise-en-place sequence obvious before cooking begins and easy to follow as the method progresses. Although the grouping follows the cooking activity, each heading should be a short, generic name for the prepared batch or dish component.

- Under `## Ingredients`, divide ingredients into named `###` sections based on the cooking activity in which they are used.
- Use concise noun headings such as `Aromatics`, `Filling`, `Sauce`, or `Garnish`. Do not enumerate the ingredients in the heading, and do not write an instruction such as `Prepare the aromatics` or `Make the sauce`.
- When the ingredients in a group can be added directly to an initially empty pan, pot, or saucepan, add an italic, unlabelled instruction immediately below the ingredient-group heading, formatted like suggested-container text and naming the vessel, such as `*Add directly to a small saucepan.*`. Do not repeat this instruction below the matching method heading. Do not use this note when the vessel already contains ingredients from an earlier activity, or when one ingredient must heat or cook before the rest of the group is added.
- Add an italic, unlabelled suggested-container line immediately below an ingredient-group heading only when it gives the cook a useful prompt to batch two or more ingredients together, such as `*1 medium bowl (about 2 L).*`. Do not add this text merely to satisfy the format, and normally omit it when the group contains only one ingredient or its ingredients go directly into the cooking vessel.
- Treat a suggested-container line that names multiple containers as a prompt to reconsider the grouping. Prefer separate activity groups when ingredients cannot be batched together. Retain multiple containers in one group only when the ingredients genuinely belong to the same cooking activity but must remain separate for food safety or recipe performance; explain the separation clearly.
- Do not include an index number or the word `Group` in an ingredient-group heading.
- Put groups in the order they are first used in the method.
- Within each group, list ingredients in the order they are used.
- Group ingredients that can be pre-measured or safely combined in the same bowl or container.
- If ingredients in the same activity must remain separate for food safety or recipe performance, create separate groups or explicitly mark the affected ingredient `keep separate`.
- If an ingredient is used in more than one activity, split its quantity between the relevant groups. Avoid an ambiguous `divided` quantity.
- Do not group ingredients by shopping category or ingredient type unless that grouping also matches a cooking activity.

Under `## Method`, create matching `###` sections with the same concise names, in the same order as the ingredient sections. Put an ordered Markdown list beneath each group heading. Number method steps sequentially across the entire recipe using ordinary whole numbers: `1`, `2`, `3`, and so on. When a new section begins, start its Markdown list at the next number rather than restarting at `1`. Each step must make clear which prepared section or container is being used. A method section may use an earlier ingredient section again, but it must not introduce an unlisted ingredient.

Make quantities, timing, temperature, and visual or tactile cues clear in the method.

## HTML compatibility

- Markdown files are the source of truth. Never edit generated files in `_site/`.
- Recipe Markdown must not contain a `#` heading. The HTML layout creates the single page title from the front matter `title`.
- Use `##` for major recipe sections and `###` for ingredient groups and their matching method sections. Do not skip heading levels.
- Keep ingredients as unordered Markdown lists and method steps as ordered Markdown lists.
- Do not embed raw HTML or template syntax in recipe Markdown.
- Use relative image paths, such as `images/rendang.jpg`, and provide meaningful `image_alt` text.
- Keep front matter field names and value types consistent with `templates/recipe.md`.
- Preserve the exact `## Ingredients` and `## Method` headings because the HTML build uses them to generate structured recipe data.
- Run `npm test` and `npm run build` after changing the site generator, templates, or recipe format.
- Consult `docs/generating-html.md` for the complete local build and preview process.

## Meals and menus

- Keep reusable cooking instructions in individual files under `recipes/`.
- A meal should link to its component recipes instead of duplicating their ingredients or methods.
- Record recipe scaling, preparation order, timing, equipment conflicts, and serving notes in the meal file.
- Menus may link to meals or directly to recipes.
- When changing a recipe, check linked meals if the change materially affects timing, yield, or equipment requirements.

## Measurements

- Preserve original units unless conversion is requested.
- Prefer weights for baking and other precision-sensitive recipes.
- Do not invent converted quantities.
- State whether oven temperatures are conventional or fan-forced when known.
- When tablespoon size matters, state the volume explicitly; an Australian tablespoon is 20 mL.
- Use consistent unit abbreviations: `g`, `kg`, `mL`, `L`, `tsp`, and `tbsp`.

## Editing rules

- Preserve the author's voice while improving clarity.
- Do not silently change tested quantities, timings, or temperatures.
- Put untested changes under `Variations` and label them as untested.
- Preserve uncertainty from source notes instead of guessing.
- Mark newly reconstructed or untested recipes as `draft`.
- Search for an existing recipe before adding a possible duplicate.
- Prefer relative links for repository files and images.
- Attribute external sources with a link when known. Paraphrase source instructions rather than copying their prose.
- Do not rename or reorganize unrelated content while making a focused change.

## Validation

Before finishing a change:

- Check that every ingredient is accounted for in the method.
- Check that quantities in the method agree with the ingredient list.
- Check that every ingredient-group heading is a short, generic name for the prepared batch or dish component, without enumerating ingredients or giving an instruction.
- Check that ingredient and method group headings match, contain no index numbers or `Group` prefixes, and appear in the same order.
- Check that method steps use ordinary whole numbers in one continuous sequence across all method sections.
- Check that any suggested-container line is genuinely useful for batching ingredients, has a practical size and enough capacity, and does not hide ingredients that would be clearer in separate activity groups.
- Check that each group which can go directly into an initially empty pan, pot, or saucepan has an italic direct-to-vessel instruction below its ingredient-group heading and names the vessel, and that groups requiring staged additions do not use this note.
- Check that groups with only one ingredient or ingredients added directly to the cooking vessel do not have unnecessary suggested-container text.
- Check headings, lists, links, and YAML front matter.
- Run `npm run build` to validate recipe metadata and generate HTML when Node.js dependencies are available.
- Review the Git diff for unintended changes.
- Report ambiguity that could materially affect the result.
