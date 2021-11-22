import nil from "./helpers/nil";
import renderProblemStats from "./renderProblemStats";
import renderTime from "./renderTime";
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
  problemStats: {
    url: string,
    name: string,
    time: number,
    mistakes: number,
  }[],
};

export type Problem = {
  name: string;
  url: string;
};

export default async function run(problems: Problem[]) {
  problems = shuffle(problems);
  let problemIndex = 0;

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
    problemStats: [],
  };

  let startTime: number | nil = nil;

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

    display.append(renderProblemStats(state.problemStats));
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

  activeIframe.src = problems[problemIndex++].url;

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

    const problemStart = Date.now();
    const currentProblem = problems[problemIndex];
    let currentProblemMistakes = 0;

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

    const nextProblemUrl = problems[problemIndex++].url;

    if (nextProblemUrl !== nil) {
      bufferIframe.src = nextProblemUrl;
    } else {
      // Show finish screen
    }

    resetBtn.addEventListener("click", () => {
      state.mistakes++;
      currentProblemMistakes++;
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

    state.problemStats.push({
      url: currentProblem.url,
      name: currentProblem.name,
      time: Date.now() - problemStart,
      mistakes: currentProblemMistakes,
    });

    render();

    activeIframe.remove();
    activeIframe = bufferIframe;
  }
}
