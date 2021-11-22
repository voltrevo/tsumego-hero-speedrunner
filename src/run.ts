/* eslint-disable import/no-unused-modules */

import nil from "./helpers/nil";
import shuffle from "./helpers/shuffle";

type State = {
  completed: number,
  mistakes: number,
  text: string,
  checkpoints: {
    completed: number;
    time: number;
    mistakes: number;
  }[],
};

export default async function run(problemUrls: string[]) {
  problemUrls = shuffle(problemUrls);
  let problemUrlIndex = 0;

  document.documentElement.innerHTML = "";
  document.body.style.margin = "0";

  const container = document.createElement("div");

  container.style.display = "flex";
  container.style.flexDirection = "row";
  document.body.append(container);

  const iframeContainer = document.createElement("div");
  const display = document.createElement("div");

  iframeContainer.style.width = "1380px";
  iframeContainer.style.height = "100vh";
  display.style.flexGrow = "1";
  display.style.flexBasis = "0";
  display.style.padding = "1em";

  container.append(iframeContainer);
  container.append(display);

  const state: State = {
    completed: 0,
    mistakes: 0,
    text: "",
    checkpoints: [],
  };

  let startTime: number | nil = nil;

  function renderTime(time: number, mistakes: number) {
    time += mistakes * 60000;
    const min = Math.floor(time / 60000);
    const sec = Math.floor((time - 60000 * min) / 1000);

    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  function render() {
    display.innerHTML = "";
    const pre = document.createElement("pre");

    display.append(pre);
    pre.textContent = [
      renderTime(Date.now() - (startTime ?? Date.now()), state.mistakes),
      `completed: ${state.completed}`,
      `mistakes: ${state.mistakes}`,
      ...state.checkpoints.map(
        ({ completed, time, mistakes }) => `  ${[
          `${completed}: `,
          renderTime(time, mistakes),
          ` (${mistakes})`,
        ].join(" ")}`,
      ),
    ].join("\n");
  }

  render();

  function Iframe() {
    const iframe = document.createElement("iframe");

    iframe.style.display = "none";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframeContainer.append(iframe);

    return iframe;
  }

  let activeIframe = Iframe();

  activeIframe.src = problemUrls[problemUrlIndex++];

  while (true) {
    activeIframe.style.display = "";

    let doc = activeIframe.contentDocument!;

    state.text = "detecting load...";
    render();

    await new Promise<void>((resolve) => {
      if (doc.querySelector("#status")) {
        resolve();
      } else {
        activeIframe.addEventListener("load", () => resolve());
      }
    });

    state.text = "load detected";
    render();

    const activePath = activeIframe.contentWindow!.location.pathname;
    const unloadIframe = activeIframe;

    unloadIframe.contentWindow!.addEventListener("unload", () => {
      const intervalId = setInterval(() => {
        if (unloadIframe.parentElement === null) {
          clearInterval(intervalId);
          return;
        }

        const path = unloadIframe.contentWindow?.location.pathname;

        if (path === undefined) {
          return;
        }

        if (path !== activePath) {
          const newHref = unloadIframe.contentWindow?.location.href;
          unloadIframe.remove();
          window.location.href = newHref ?? path;
        }
      }, 100);

      setTimeout(() => {
        clearInterval(intervalId);
      }, 5000);
    });

    startTime = startTime ?? Date.now();

    doc = activeIframe.contentDocument!;
    const resetBtn = doc.querySelector(".tsumegoNavi-middle")!.children[1];

    const bufferIframe = Iframe();

    const nextProblemUrl = problemUrls[problemUrlIndex++];

    if (nextProblemUrl !== nil) {
      bufferIframe.src = problemUrls[problemUrlIndex++];
    } else {
      // Show finish screen
    }

    resetBtn.addEventListener("click", () => {
      state.mistakes++;
      render();
    });

    state.text = "detecting completion...";
    render();

    await new Promise<void>((resolve) => {
      const observer = new MutationObserver(() => {
        if (doc!.querySelector("#status")!.textContent === "Correct!") {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(
        doc!.querySelector("#status")!,
        { attributes: true, childList: true, subtree: true },
      );
    });

    state.text = "completion detected";
    state.completed++;

    if (state.completed % 50 === 0) {
      state.checkpoints.push({
        completed: state.completed,
        time: Date.now() - startTime,
        mistakes: state.mistakes,
      });
    }

    render();

    activeIframe.remove();
    activeIframe = bufferIframe;
  }
}
