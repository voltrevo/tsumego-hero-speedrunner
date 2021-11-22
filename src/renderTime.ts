import { mistakePenalty } from "./constants";

export default function renderTime(time: number, mistakes: number) {
  time += mistakes * mistakePenalty;
  const min = Math.floor(time / 60000);
  const sec = Math.floor((time - 60000 * min) / 1000);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}
