/**
 * @jest-environment jsdom
 */
import Router from "./Router";
import Page from "./Page";
// моковая страница вместо настоящего Page
class MockPage extends Page {
  constructor() {
    super("<div>MockPage</div>", {}); // Page обычно принимает tagName и props
  }

  render(): HTMLElement {
    const el = document.createElement("div");
    el.textContent = "MockPage";
    return el;
  }
}

describe("Router", () => {
  let router: Router;

  beforeEach(() => {
    (Router as any).__instance = undefined;

    document.body.innerHTML = '<div id="app"></div>';

    localStorage.clear();

    router = new Router("#app");
  });

  test("use() регистрирует маршрут", () => {
    router.use("/mock", MockPage);
    router.go("/mock");
    const app = document.querySelector("#app");
    expect(app?.textContent).toContain("MockPage");
  });

  test("go() вызывает history.pushState и рендерит страницу", () => {
    const spy = jest.spyOn(window.history, "pushState");
    router.use("/mock", MockPage);
    router.go("/mock");
    expect(spy).toHaveBeenCalled();
    expect(document.querySelector("#app")?.textContent).toContain("MockPage");
    spy.mockRestore();
  });

  test("back() вызывает history.back", () => {
    const spy = jest.spyOn(window.history, "back").mockImplementation(() => {});
    router.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("forward() вызывает history.forward", () => {
    const spy = jest.spyOn(window.history, "forward").mockImplementation(() => {});
    router.forward();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("перенаправление неавторизованного пользователя с private route", () => {
    router.use("/", MockPage).use("/messenger", MockPage);
    router.go("/messenger");
    // так как userData нет в localStorage → должно редиректнуть на "/"
    expect(window.location.pathname).toBe("/");
  });

  test("перенаправление авторизованного пользователя с auth route", () => {
    localStorage.setItem("userData", JSON.stringify({ id: 1 }));
    router.use("/", MockPage).use("/messenger", MockPage);
    router.go("/");
    // авторизованный юзер должен улететь в "/messenger"
    expect(window.location.pathname).toBe("/messenger");
  });
});
