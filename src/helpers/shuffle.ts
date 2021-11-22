export default function shuffle<T>(array: T[]) {
  const result = array.slice();

  for (let i = 0; i < result.length; i++) {
    const j = i + Math.floor((result.length - i) * Math.random());
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
