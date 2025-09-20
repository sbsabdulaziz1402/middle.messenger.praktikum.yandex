// src/utils/HTTPTransport.test.ts
import HTTPTransport from "./FetchAPI";

let mockOpen: jest.Mock;
let mockSend: jest.Mock;
let mockSetRequestHeader: jest.Mock;

beforeEach(() => {
  mockOpen = jest.fn();
  mockSend = jest.fn();
  mockSetRequestHeader = jest.fn();

  const mockXHR = {
    open: mockOpen,
    send: mockSend,
    setRequestHeader: mockSetRequestHeader,
    withCredentials: false,
    responseText: "",
    status: 200,
    getResponseHeader: jest.fn().mockReturnValue("application/json"),
    onload: null as any,
    onerror: null as any,
    ontimeout: null as any,
    timeout: 0,
  };

  // @ts-ignore
  global.XMLHttpRequest = jest.fn(() => mockXHR);

  (global.XMLHttpRequest as unknown as jest.Mock).mockImplementation(() => mockXHR);
});

describe("HTTPTransport", () => {
  it("должен вызывать GET с query параметрами", async () => {
    const transport = new HTTPTransport();

    const promise = transport.get("/test", { data: { a: 1, b: "hi" } });

    const xhrInstance = (XMLHttpRequest as unknown as jest.Mock).mock.results[0].value;
    xhrInstance.responseText = JSON.stringify({ ok: true });

    // эмулируем успешный ответ
    xhrInstance.onload();

    const response = await promise;

    expect(mockOpen).toHaveBeenCalledWith("GET", "/test?a=1&b=hi");
    expect(response).toEqual({ ok: true });
  });

  it("должен вызывать POST с JSON телом", async () => {
    const transport = new HTTPTransport();

    const promise = transport.post("/post", { data: { name: "John" } });

    const xhrInstance = (XMLHttpRequest as unknown as jest.Mock).mock.results[0].value;
    xhrInstance.responseText = JSON.stringify({ id: 1 });

    xhrInstance.onload();

    const response = await promise;

    expect(mockOpen).toHaveBeenCalledWith("POST", "/post");
    expect(mockSetRequestHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(mockSend).toHaveBeenCalledWith(JSON.stringify({ name: "John" }));
    expect(response).toEqual({ id: 1 });
  });

  it("должен обрабатывать ошибку", async () => {
    const transport = new HTTPTransport();

    const promise = transport.get("/fail");

    const xhrInstance = (XMLHttpRequest as unknown as jest.Mock).mock.results[0].value;

    xhrInstance.status = 500;
    xhrInstance.onerror();

    await expect(promise).rejects.toThrow("Request failed: 500");
  });

  it("должен обрабатывать таймаут", async () => {
    const transport = new HTTPTransport();

    const promise = transport.get("/timeout");

    const xhrInstance = (XMLHttpRequest as unknown as jest.Mock).mock.results[0].value;

    xhrInstance.ontimeout();

    await expect(promise).rejects.toThrow("Request timed out");
  });
});
