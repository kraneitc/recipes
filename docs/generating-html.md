# Generating HTML with Eleventy

This guide assumes no previous experience with Node.js, npm, Eleventy, terminals, or static-site generators.

## What the HTML generator does

The files under `recipes/` are the editable source. Each recipe is written once in Markdown. Eleventy reads those files and produces a website under `_site/`.

For example:

```text
recipes/beef-rendang/recipe.md
```

becomes:

```text
_site/recipes/beef-rendang/index.html
```

The generated HTML includes:

- a recipe index;
- a page for every recipe;
- preparation, cooking, and total times;
- activity-based ingredient and method groups;
- responsive screen styling;
- print-friendly styling; and
- Schema.org Recipe metadata generated from the visible recipe.

Do not edit `_site/`. Its contents are generated, can be overwritten by future builds, and are excluded from Git. Always edit the Markdown source instead.

## Terms used in this guide

- **Terminal:** a text window where you type commands. On Windows, use PowerShell or the terminal built into your editor.
- **Node.js:** the program that runs Eleventy.
- **npm:** the package manager installed with Node.js. It downloads the exact tools listed by this repository.
- **Eleventy:** the static-site generator that converts Markdown into HTML.
- **Build:** one conversion of the source files into `_site/`.
- **Preview server:** a small local web server that lets you view the generated site in a browser while editing.

## One-time setup on a computer

### 1. Install Node.js if necessary

This repository requires Node.js 18 or newer. A current Node.js LTS release is recommended.

1. Visit [the official Node.js download page](https://nodejs.org/en/download).
2. Download the installer for your operating system.
3. Run the installer using its default options. npm is included automatically.
4. Close and reopen any terminal windows after installation.

Node.js is already installed on the computer where this repository was created.

### 2. Open a terminal in the repository

On Windows:

1. Open the Start menu.
2. Search for **PowerShell** and open it.
3. Change to this repository by running:

```powershell
Set-Location -LiteralPath 'C:\Users\north\source\repos\recipes'
```

If the repository is moved later, replace that path with its new location.

### 3. Verify Node.js and npm

Run these commands separately:

```powershell
node --version
npm --version
```

Each command should print a version number. If `node` or `npm` is not recognized, restart the terminal. If that does not help, reinstall Node.js.

### 4. Install this repository's dependencies

Run:

```powershell
npm ci
```

`npm ci` reads `package-lock.json` and installs the tested versions of Eleventy and its supporting packages into `node_modules/`. The operation can take a minute and requires internet access the first time.

The `node_modules/` folder is generated locally and excluded from Git. Do not edit it.

If PowerShell reports that `npm.ps1` cannot be run because script execution is disabled, use the Windows command shim instead:

```powershell
npm.cmd ci
```

You normally run this installation step only after first downloading the repository or after `package-lock.json` changes.

## Build the website once

From the repository directory, run:

```powershell
npm run build
```

npm runs Eleventy. A successful build ends with a message stating how many files were written. The complete generated website will be in `_site/`.

The build also validates every recipe. It stops with a descriptive error if required metadata is missing, time values are not integers, or ingredient and method groups do not match.

## Preview the website while editing

Run:

```powershell
npm run serve
```

Eleventy builds the site, watches the source files, and prints a local address. The default address is:

```text
http://localhost:8080/
```

Open that address in a web browser. Keep the terminal running while editing recipes. Eleventy rebuilds when a source file changes; refresh the browser if it does not refresh automatically.

To stop the preview server, return to the terminal and press `Ctrl+C` once. If PowerShell asks whether to terminate the job, answer `Y` and press Enter.

The preview is visible only on the local computer. It does not publish the recipes to the internet.

## Add a recipe

### 1. Choose a recipe slug

A slug is the folder name used in the recipe's web address. Use lowercase words separated by hyphens. For example:

```text
beef-rendang
```

Do not use spaces, capital letters, or punctuation.

### 2. Create the recipe folder and copy the template

In PowerShell, replace `beef-rendang` in these commands with the chosen slug:

```powershell
$recipeSlug = 'beef-rendang'
New-Item -ItemType Directory -Path "recipes\$recipeSlug\images"
Copy-Item -LiteralPath 'templates\recipe.md' -Destination "recipes\$recipeSlug\recipe.md"
```

This creates:

```text
recipes/
└── beef-rendang/
    ├── recipe.md
    └── images/
```

Open the new `recipe.md` in a text editor.

### 3. Complete the front matter

Front matter is the YAML block between the `---` lines at the top of the file:

```yaml
---
title: Beef rendang
description: Slow-cooked beef with coconut, lemongrass, and warm spices.
status: tested
servings: 6
prep_minutes: 30
cook_minutes: 180
tags:
  - indonesian
  - beef
  - make-ahead
image: images/rendang.jpg
image_alt: Beef rendang served in a shallow bowl
source: Family recipe
source_url:
last_made: 2026-08-16
---
```

The fields mean:

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | Yes | The name shown on the page and recipe index. |
| `description` | Yes | A short summary shown below the title and on the index. |
| `status` | Yes | Exactly `draft`, `tested`, or `favorite`. |
| `servings` | Usually | A positive whole number. Use `yield` instead for values such as `2 loaves`. |
| `prep_minutes` | Yes | Preparation time as a whole number of minutes, without the word “minutes.” |
| `cook_minutes` | Yes | Cooking time as a whole number of minutes. Use `0` for a no-cook recipe. |
| `tags` | Yes | A YAML list used for cuisine, course, season, or other labels. Use `tags: []` if there are none. |
| `image` | No | The path to the main image, relative to the recipe folder. |
| `image_alt` | With an image | A concise description for people who cannot see the image. |
| `source` | No | A person, book, publication, or other attribution. |
| `source_url` | No | A web address for the source, when applicable. |
| `last_made` | No | The most recent known cooking date in `YYYY-MM-DD` form. |

If there is no value for an optional field, leave it blank after the colon.

### 4. Write activity-based ingredients and methods

Do not add a `#` title to the Markdown body. The HTML template creates the title from front matter.

Every ingredient activity group must have an identically named method group in the same position:

```markdown
## Ingredients

### Group 1 — Aromatic base

- 1 onion, finely diced
- 3 garlic cloves, minced
- 20 g ginger, grated

### Group 2 — Braising liquid

- 400 mL coconut milk
- 1 tbsp tamarind paste

### Group 3 — To finish

- 1 tsp salt
- 1 lime, cut into wedges

## Method

### Group 1 — Aromatic base

1. Cook the prepared Group 1 ingredients over medium heat until soft and fragrant, about 8 minutes.

### Group 2 — Braising liquid

2. Add the prepared Group 2 ingredients and bring to a gentle simmer.

### Group 3 — To finish

3. Season with the prepared Group 3 salt and serve with the lime wedges.
```

This one-to-one grouping lets ingredients be prepared into labelled bowls before cooking and lets the generator produce matching structured instruction sections.

### 5. Add an image, if available

Copy the image into the recipe's `images/` folder. Use a short lowercase filename such as `rendang.jpg`. Set both `image` and `image_alt` in front matter.

The repository stores the original image file. Eleventy copies it to the corresponding generated recipe folder.

### 6. Build and review

If the preview server is running, save the file and open the recipe from the home page. Otherwise run:

```powershell
npm run build
```

Review the generated page on both a wide and narrow browser window. To inspect the print version, use the browser's Print command; printing to PDF is a convenient way to review it without using paper.

## Run the automated checks

Run:

```powershell
npm test
npm run build
```

`npm test` checks the recipe HTML layout and structured metadata. `npm run build` validates the real recipe files and generates the site.

## Understand common build errors

### A required front matter field is missing

Example:

```text
front matter field `description` must be non-empty text
```

Open the recipe path shown at the start of the error and add the missing value.

### A time contains words

Incorrect:

```yaml
prep_minutes: 15 minutes
```

Correct:

```yaml
prep_minutes: 15
```

### Tags are not a list

Incorrect:

```yaml
tags: dinner
```

Correct:

```yaml
tags:
  - dinner
```

### Ingredient and method groups do not match

The text after each ingredient `###` heading must exactly match the corresponding method `###` heading, including its group number and punctuation.

### Port 8080 is already in use

Another preview server may already be running. Stop it with `Ctrl+C`. Alternatively, start this server on another port:

```powershell
npm run serve -- --port=8081
```

Then open `http://localhost:8081/`.

## What belongs in Git

Commit these files:

- recipe Markdown;
- recipe images;
- templates, layouts, styles, and configuration;
- `package.json`; and
- `package-lock.json`.

Do not commit:

- `_site/`, because it is generated; or
- `node_modules/`, because `npm ci` recreates it.

## Publishing later

The current setup generates and previews the site locally; it does not publish anywhere. Before publishing, set `url` in `site/_data/site.json` to the public site origin, such as `https://recipes.example.com`. That lets the generator emit absolute image addresses in Schema.org metadata.

Hosting can be added later without changing the recipe Markdown format.
