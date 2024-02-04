"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  ZhipuAI: () => zhipu_ai_default,
  default: () => zhipu_ai_default
});
module.exports = __toCommonJS(lib_exports);

// lib/zhipu-ai.ts
var import_assert = __toESM(require("assert"), 1);

// lib/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var API_TOKEN_TTL_SECONDS = 3 * 60;
var generateToken = (apiKey) => {
  try {
    const [api_key, secret] = apiKey.split(".");
    const payload = {
      "api_key": api_key,
      "exp": Math.round(Date.now() * 1e3) + API_TOKEN_TTL_SECONDS * 1e3,
      "timestamp": Math.round(Date.now() * 1e3)
    };
    const ret = import_jsonwebtoken.default.sign(payload, secret, {
      algorithm: "HS256",
      header: { alg: "HS256", sign_type: "SIGN" }
    });
    return ret;
  } catch (e) {
    throw "invalid api_key";
  }
};

// lib/zhipu-ai.ts
var import_axios = __toESM(require("axios"), 1);

// lib/completions.ts
var Completions = class {
  constructor(app) {
    this.app = app;
  }
  create(options) {
    return __async(this, null, function* () {
      return this.app.post("/chat/completions", {
        "model": options.model,
        "request_id": options.request_id,
        "temperature": options.temperature,
        "top_p": options.top_p,
        "do_sample": options.do_sample,
        "max_tokens": options.max_tokens,
        "seed": options.seed,
        "messages": options.messages,
        "stop": options.stop,
        "sensitive_word_check": options.sensitive_word_check,
        "stream": options.stream,
        "tools": options.tools,
        "tool_choice": options.tool_choice
      }, {
        headers: options.extra_headers,
        responseType: options.stream ? "stream" : "json"
      });
    });
  }
};

// lib/zhipu-ai.ts
var ZhipuAI = class {
  constructor(options) {
    this.options = options;
    __publicField(this, "__esModule", false);
    __publicField(this, "request");
    if (!options.apiKey)
      options.apiKey = process.env["ZHIPUAI_API_KEY"] || "";
    import_assert.default.ok(options.apiKey, "\u672A\u63D0\u4F9Bapi_key\uFF0C\u8BF7\u901A\u8FC7\u53C2\u6570\u6216\u73AF\u5883\u53D8\u91CF\u63D0\u4F9B");
    if (!options.baseUrl)
      options.baseUrl = process.env["ZHIPUAI_BASE_URL"] || "";
    if (!options.baseUrl)
      options.baseUrl = "https://open.bigmodel.cn/api/paas/v4";
    this.request = import_axios.default.create({
      baseURL: options.baseUrl,
      timeout: options.timeout,
      headers: options.customHeaders
    });
    this.request.interceptors.request.use((config) => {
      config.headers.set(this.authHeaders());
      return config;
    });
  }
  post(url, data, config) {
    return __async(this, null, function* () {
      return this.request.post(url, data, config);
    });
  }
  createCompletions(options) {
    return __async(this, null, function* () {
      return new Completions(this).create(options);
    });
  }
  authHeaders() {
    const token = generateToken(this.options.apiKey);
    return { "Authorization": token };
  }
};
var zhipu_ai_default = ZhipuAI;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ZhipuAI
});
//# sourceMappingURL=index.cjs.map