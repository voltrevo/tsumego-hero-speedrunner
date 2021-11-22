import nil from "./helpers/nil";

const strategies = [
  // Extract from visible heading
  () => {
    const name = (document
      .querySelector(".homeLeft > .title4")
      ?.textContent
      ?.trim()
    );

    if (name !== nil && isUpperCase(name[0])) {
      return name;
    }

    return nil;
  },

  // Extract from document title
  () => {
    const title = document.title.trim();
    const expectedSuffix = " on Tsumego Hero";

    if (title.endsWith(expectedSuffix) && isUpperCase(title[0])) {
      return title.slice(0, title.length - expectedSuffix.length);
    }

    return nil;
  },

  // Extract from image with expected alt text prefix
  () => {
    const expectedPrefix = "Tsumego Collection: ";

    for (const img of document.querySelectorAll("img")) {
      if (img.alt.startsWith(expectedPrefix)) {
        return img.alt.slice(expectedPrefix.length);
      }
    }

    return nil;
  },
];

function isUpperCase(str: string) {
  return str.toUpperCase() === str;
}

export default function ProblemSetName(): string {
  for (const strategy of strategies) {
    const name = strategy();

    if (name !== nil) {
      return name;
    }
  }

  // TODO: Remote error reporting
  console.error("Failed to detect problem set name");

  return "Unknown";
}
