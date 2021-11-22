export default function Element<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  styles: Partial<Record<string & keyof CSSStyleDeclaration, string>> = {},
): HTMLElementTagNameMap[T] {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(styles)) {
    el.style[key as any] = value;
  }

  return el;
}
