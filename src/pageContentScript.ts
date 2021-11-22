import assert from "./helpers/assert";

const startButtons = (Array
  .from(document.querySelectorAll(".new-button"))
  .filter((btn) => btn.textContent?.toUpperCase() === "START")
);

assert(startButtons.length === 1);

const siblingContainer = (
  startButtons[0].parentElement!.cloneNode(true) as HTMLElement
);

startButtons[0].parentElement!.parentElement!.append(siblingContainer);

const speedrunBtn = (
  siblingContainer.querySelector(".new-button") as HTMLAnchorElement
);

speedrunBtn.href = "#";
speedrunBtn.textContent = "Speedrun";

export {};
