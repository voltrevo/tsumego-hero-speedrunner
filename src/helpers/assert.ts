export default function assert(value: boolean): asserts value {
  if (!value) {
    throw new Error("Assertion failure");
  }
}
