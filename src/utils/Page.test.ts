import Page from "./Page";
import Block from "./Block";

class ChildBlock extends Block {
  render() {
    const el = document.createElement("span");
    el.textContent = "Child";
    return el;
  }
}

class MockPage extends Page {
  constructor() {
    super('<div><div data-slot="child"></div></div>', {});
  }

  render(): HTMLElement {
    const el = document.createElement("div");
    el.textContent = "MockPage";
    return el;
  }
}

test("Page mount вставляет компонент в слот", () => {
  const page = new MockPage();
  const child = new ChildBlock("div", {});
  page.initComponents({ child });
  const el = page.mount();

  expect(el.innerHTML).toContain("Child");
});
