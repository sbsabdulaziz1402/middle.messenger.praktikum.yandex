
const METHODS = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
};


function queryStringify(data) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const keys = Object.keys(data);
  return keys.length
    ? "?" +
        keys
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
          .join("&")
    : "";
}

/**
	* Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
	* На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
	* На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
*/

class HTTPTransport {
  get = (url, options = {}) => {
    const query = options.data ? queryStringify(options.data) : "";
    return this.request(url + query, { ...options, method: METHODS.GET }, options.timeout);
  };

  put = (url, options = {}) => {
    return this.request(url, { ...options, method: METHODS.PUT }, options.timeout);
  };

  post = (url, options = {}) => {
    return this.request(url, { ...options, method: METHODS.POST }, options.timeout);
  };

  delete = (url, options = {}) => {
    return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
  };

  /**
   * @param {string} url
   * @param {Object} options
   * @param {string} options.method - GET, POST, PUT, DELETE
   * @param {Object} [options.data] - тело запроса
   * @param {Object} [options.headers] - пользовательские заголовки
   * @param {number} [timeout] - время ожидания
   */
  request = (url, options = {}, timeout = 5000) => {
    const { method, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method specified"));
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      // Устанавливаем заголовки
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(String(key), String(value));
      });

      xhr.onload = () => {
        resolve(xhr); // возвращаем сам XHR, а не только данные
      };

      xhr.onerror = () => {
        reject(new Error(`Request failed: ${xhr.status}`));
      };

      xhr.ontimeout = () => {
        reject(new Error("Request timed out"));
      };

      xhr.timeout = timeout;

      // Если это GET или нет data
      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        // Если не передан Content-Type, по умолчанию JSON
        if (!headers["Content-Type"]) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send(data);
        }
      }
    });
  };
}

function fetchWithRetry(url, options = {}) {
  const { tries = 3, ...rest } = options;

  if (typeof tries !== "number" || tries <= 1) {
    throw new Error("Параметр tries должен быть числом больше 1");
  }

  const transport = new HTTPTransport();
  let attempt = 0;

  function tryRequest() {
    attempt++;
    console.log(`Попытка ${attempt} из ${tries}`);

    return transport.request(url, rest)
      .then(xhr => {
        // Успех — возвращаем ответ
        if (xhr.status >= 200 && xhr.status < 300) {
          return xhr.response;
        }

        // Ошибка HTTP
        if (attempt < tries) {
          return tryRequest();
        }
        throw new Error(`HTTP ошибка: ${xhr.status} ${xhr.statusText}`);
      })
      .catch(err => {
        // Сетевая ошибка или таймаут
        console.warn(`Ошибка на попытке ${attempt}:`, err.message || err);

        if (attempt < tries) {
          return tryRequest();
        }
        throw new Error(`Не удалось выполнить запрос за ${tries} попыток: ${err.message || err}`);
      });
  }

  return tryRequest();
}


fetchWithRetry('https://api.mahalla.bank-kredit.uz/api/v1/wefi/dashboard/customers',{ tries: 3, method: 'GET' });






