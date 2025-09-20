import Block from "./Block";

class TestBlock extends Block {
  render(): HTMLElement {
    const el = document.createElement("div");
    el.textContent = "Hello";
    return el;
  }
}

test("render возвращает HTMLElement", () => {
  const block = new TestBlock("div", {});
  const content = block.getContent();
  expect(content).toBeInstanceOf(HTMLElement);
  expect(content?.textContent).toBe("Hello");
});
