if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this.map = new Map();

      if (Array.isArray(init)) {
        for (const [key, value] of init) {
          this.set(key, value);
        }
      } else {
        for (const [key, value] of Object.entries(init)) {
          this.set(key, value);
        }
      }
    }

    set(key, value) {
      this.map.set(String(key).toLowerCase(), String(value));
    }

    append(key, value) {
      this.set(key, value);
    }

    get(key) {
      return this.map.get(String(key).toLowerCase()) || null;
    }

    has(key) {
      return this.map.has(String(key).toLowerCase());
    }
  };
}

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.input = input;
      this.init = init;
      this.headers = new Headers(init.headers || {});
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    static json(data, init = {}) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init.headers || {}),
        },
      });
    }

    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.headers = new Headers(init.headers || {});
    }

    async json() {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body);
      }
      return this.body;
    }
  };
}

if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}
