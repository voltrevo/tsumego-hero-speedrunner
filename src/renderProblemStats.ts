import Element from "./helpers/Element";
import { mistakePenalty } from "./constants";
import renderTime from "./renderTime";

export default function renderProblemStats(problemStats: ProblemStat[]) {
  const container = Element("div", {
    display: "flex",
    flexDirection: "column",
    gap: "0.5em",
    marginTop: "1em",
    width: "min(100%, 15em)",
    minHeight: "3em",
    maxHeight: "25vh",
    overflowY: "scroll",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    padding: "2px",
  });

  problemStats = problemStats.slice().sort((a, b) => (
    timeWithPenalty(b) - timeWithPenalty(a)
  ));

  for (const problemStat of problemStats) {
    const row = Element("div", {
      display: "flex",
      flexDirection: "row",
    });

    const nameCell = Element("div", {
      flexGrow: "1",
      flexBasis: "0",
    });

    row.append(nameCell);

    const link = Element("a");
    link.textContent = problemStat.name;
    link.href = problemStat.url;
    nameCell.append(link);

    const timeCell = Element("div", { textAlign: "right" });
    timeCell.textContent = renderTime(problemStat.time, problemStat.mistakes);
    row.append(timeCell);

    const mistakesCell = Element("div", {
      textAlign: "center",
      width: "2.5em",
    });

    mistakesCell.textContent = (problemStat.mistakes > 0
      ? `(${problemStat.mistakes})`
      : ""
    );

    row.append(mistakesCell);

    container.append(row);
  }

  return container;
}

type ProblemStat = {
  url: string,
  name: string,
  time: number,
  mistakes: number,
};

function timeWithPenalty(args: { time: number, mistakes: number }) {
  return args.time + mistakePenalty * args.mistakes;
}
