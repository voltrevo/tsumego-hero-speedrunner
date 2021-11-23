import renderTime from "./renderTime";

export default async function renderCertificate(props: {
  problemSetName: string;
  duration: number;
  mistakes: number;
  finishTime: number;
}): Promise<HTMLCanvasElement> {
  const fontPath = "/s/greatvibes/v9/RWmMoKWR9v4ksMfaWd_JN9XFiaQoDmlr.woff2";

  document.fonts.add(await new FontFace(
    "Great Vibes",
    `url(https://fonts.gstatic.com${fontPath})`,
  ).load());

  const canvas = document.createElement("canvas");

  canvas.width = 1280;
  canvas.height = 720;

  const ctx = canvas.getContext("2d")!;

  // Create gradient
  const grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grd.addColorStop(0, "hsl(180deg 100% 50% / 20%)");
  grd.addColorStop(1, "hsl(100deg 100% 50% / 20%)");

  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";

  const textGap = 140;
  let y = 120;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "20px serif";
  ctx.fillText("I completed Tsumego Hero's", 640, y);
  y += 0.95 * textGap;

  ctx.font = "95px 'Great Vibes'";
  ctx.fillText(fixName(props.problemSetName), 640, y);
  y += 0.75 * textGap;

  ctx.font = "20px serif";
  ctx.fillText("in", 640, y);
  y += textGap;

  ctx.font = "150px serif";
  ctx.fillText(renderTime(props.duration, props.mistakes), 640, y);
  y += 0.6 * textGap;

  ctx.font = "20px serif";
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

  if (props.mistakes === 0) {
    ctx.fillText("without any mistakes", 640, y);
  } else {
    ctx.fillText(
      `${props.mistakes} penalty minutes included for mistakes`,
      640,
      y,
    );
  }

  ctx.fillStyle = "black";

  ctx.font = "20px serif";
  ctx.textAlign = "left";
  ctx.fillText(
    new Date(props.finishTime).toDateString(),
    80,
    canvas.height - 50,
  );

  ctx.font = "20px serif";
  ctx.textAlign = "right";
  ctx.fillText(
    "Tsumego Hero Speedrunner",
    canvas.width - 80,
    canvas.height - 50,
  );

  return canvas;
}

function fixName(name: string) {
  const lastWordMap = {
    I: "1",
    II: "2",
    III: "3",
    IV: "4",
  };

  const words = name.split(" ");
  const lastWord = words[words.length - 1];

  if (lastWord in lastWordMap) {
    return [
      ...words.slice(0, words.length - 1),
      lastWordMap[lastWord as keyof typeof lastWordMap],
    ].join(" ");
  }

  return name;
}
