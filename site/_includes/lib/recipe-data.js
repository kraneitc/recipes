import * as cheerio from "cheerio";

const REQUIRED_STATUSES = new Set(["draft", "tested", "favorite"]);

function recipeError(data, message) {
  const path = data.page?.inputPath ?? "recipe";
  return new Error(`${path}: ${message}`);
}

function requireText(data, field) {
  if (typeof data[field] !== "string" || data[field].trim() === "") {
    throw recipeError(data, `front matter field \`${field}\` must be non-empty text.`);
  }
}

function requireMinutes(data, field) {
  if (!Number.isInteger(data[field]) || data[field] < 0) {
    throw recipeError(data, `front matter field \`${field}\` must be a non-negative integer.`);
  }
}

export function validateMetadata(data) {
  requireText(data, "title");
  requireText(data, "description");
  requireText(data, "status");
  requireMinutes(data, "prep_minutes");
  requireMinutes(data, "cook_minutes");

  if (!REQUIRED_STATUSES.has(data.status)) {
    throw recipeError(data, "front matter field `status` must be `draft`, `tested`, or `favorite`.");
  }

  if (data.servings === undefined && (typeof data.yield !== "string" || data.yield.trim() === "")) {
    throw recipeError(data, "front matter must include `servings` or a non-empty `yield`.");
  }

  if (data.servings !== undefined && (!Number.isInteger(data.servings) || data.servings <= 0)) {
    throw recipeError(data, "front matter field `servings` must be a positive integer when present.");
  }

  if (!Array.isArray(data.tags)) {
    throw recipeError(data, "front matter field `tags` must be a YAML list, such as `tags: []`.");
  }

  if (data.image && (typeof data.image_alt !== "string" || data.image_alt.trim() === "")) {
    throw recipeError(data, "front matter field `image_alt` is required when `image` is set.");
  }

  if (data.source_url) {
    if (typeof data.source_url !== "string") {
      throw recipeError(data, "front matter field `source_url` must be a web address written as text.");
    }

    let sourceUrl;
    try {
      sourceUrl = new URL(data.source_url);
    } catch {
      throw recipeError(data, "front matter field `source_url` must be a valid absolute web address.");
    }

    if (sourceUrl.protocol !== "https:" && sourceUrl.protocol !== "http:") {
      throw recipeError(data, "front matter field `source_url` must start with `https://` or `http://`.");
    }
  }
}

function findSection($, name, data) {
  const heading = $("h2")
    .filter((_, element) => $(element).text().trim() === name)
    .first();

  if (heading.length === 0) {
    throw recipeError(data, `a \`## ${name}\` section is required.`);
  }

  return heading;
}

function collectGroups($, sectionName, listTag, data) {
  const sectionHeading = findSection($, sectionName, data);
  const groups = [];
  let currentGroup;
  let current = sectionHeading.next();

  while (current.length > 0 && current[0].tagName !== "h2") {
    if (current[0].tagName === "h3") {
      if (currentGroup) {
        groups.push(currentGroup);
      }

      currentGroup = {
        name: current.text().trim(),
        items: []
      };
    } else if (current[0].tagName === listTag && currentGroup) {
      current.children("li").each((_, item) => {
        currentGroup.items.push($(item).text().replace(/\s+/g, " ").trim());
      });
    }

    current = current.next();
  }

  if (currentGroup) {
    groups.push(currentGroup);
  }

  if (groups.length === 0) {
    throw recipeError(data, `\`## ${sectionName}\` must contain named \`###\` activity groups.`);
  }

  for (const group of groups) {
    if (group.items.length === 0) {
      throw recipeError(data, `activity group \`${group.name}\` in \`## ${sectionName}\` has no list items.`);
    }
  }

  return groups;
}

export function parseRecipeContent(content, data) {
  const $ = cheerio.load(`<main>${content}</main>`);

  if ($("main > h1").length > 0) {
    throw recipeError(data, "recipe Markdown must not contain a `#` heading; the HTML layout creates it from `title`.");
  }

  const ingredientGroups = collectGroups($, "Ingredients", "ul", data);
  const methodGroups = collectGroups($, "Method", "ol", data);
  const ingredientNames = ingredientGroups.map((group) => group.name);
  const methodNames = methodGroups.map((group) => group.name);

  if (JSON.stringify(ingredientNames) !== JSON.stringify(methodNames)) {
    throw recipeError(
      data,
      "ingredient and method activity group headings must match exactly and appear in the same order.",
    );
  }

  return { ingredientGroups, methodGroups };
}

export function minutesToIsoDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourPart = hours > 0 ? `${hours}H` : "";
  const minutePart = minutes > 0 || hours === 0 ? `${minutes}M` : "";
  return `PT${hourPart}${minutePart}`;
}

function absoluteImageUrl(data) {
  if (!data.image || !data.site?.url) {
    return undefined;
  }

  const recipePath = data.page?.url ?? "/";
  return new URL(data.image, new URL(recipePath, data.site.url)).href;
}

export function createRecipeJsonLd(data, parsedRecipe) {
  const totalMinutes = data.prep_minutes + data.cook_minutes;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: data.title,
    description: data.description,
    prepTime: minutesToIsoDuration(data.prep_minutes),
    cookTime: minutesToIsoDuration(data.cook_minutes),
    totalTime: minutesToIsoDuration(totalMinutes),
    recipeYield: data.servings ? `${data.servings} servings` : data.yield,
    keywords: data.tags.join(", "),
    recipeIngredient: parsedRecipe.ingredientGroups.flatMap((group) => group.items),
    recipeInstructions: parsedRecipe.methodGroups.map((group, groupIndex) => ({
      "@type": "HowToSection",
      name: group.name,
      position: groupIndex + 1,
      itemListElement: group.items.map((step, stepIndex) => ({
        "@type": "HowToStep",
        position: stepIndex + 1,
        text: step
      }))
    }))
  };

  const imageUrl = absoluteImageUrl(data);
  if (imageUrl) {
    structuredData.image = imageUrl;
  }

  return structuredData;
}
