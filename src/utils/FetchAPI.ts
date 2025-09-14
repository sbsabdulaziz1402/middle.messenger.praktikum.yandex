type HTTPMethod = "GET" | "PUT" | "POST" | "DELETE";

interface RequestOptions {
  method?: HTTPMethod;
  data?: Record<string, any> | FormData;
  credentials?: string,
  headers?: Record<string, string>;
  timeout?: number;
}

const METHODS: Record<HTTPMethod, HTTPMethod> = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE",
};

function queryStringify(data: Record<string, any>): string {
  if (!data || typeof data !== "object") {
    return "";
  }

  const keys = Object.keys(data);
  return keys.length
    ? "?" +
        keys
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
          )
          .join("&")
    : "";
}

class HTTPTransport {
  get<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    const query = options.data && !(options.data instanceof FormData)
      ? queryStringify(options.data as Record<string, any>)
      : "";
    return this.request<T>(
      url + query,
      { ...options, method: METHODS.GET, credentials: 'include' },
      options.timeout
    );
  }

  put<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout
    );
  }

  post<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(
      url,
      { ...options, method: METHODS.POST },
      options.timeout
    );
  }

  delete<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout
    );
  }

  request<T = unknown>(
    url: string,
    options: RequestOptions,
    timeout = 5000
  ): Promise<T> {
    const { method, data, headers = {} } = options;

    return new Promise<T>((resolve, reject) => {
      if (!method) {
        reject(new Error("No method specified"));
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.withCredentials = true;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(String(key), String(value));
      });

      xhr.onload = () => {
        try {
          const response =
            xhr.getResponseHeader("Content-Type")?.includes("application/json")
              ? JSON.parse(xhr.responseText)
              : xhr.responseText;
          resolve(response as T);
        } catch (e) {
          reject(e);
        }
      };

      xhr.onerror = () => {
        reject(new Error(`Request failed: ${xhr.status}`));
      };

      xhr.ontimeout = () => {
        reject(new Error("Request timed out"));
      };

      xhr.timeout = timeout;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        if (!(data instanceof FormData)) {
          if (!headers["Content-Type"]) {
            xhr.setRequestHeader("Content-Type", "application/json");
          }
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send(data);
        }
      }
    });
  }
}

export default HTTPTransport;
