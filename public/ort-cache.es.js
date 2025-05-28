const u = (e) => {
  if (e !== "node") {
    const o = e + "Storage";
    if (typeof window < "u" && window[o])
      return window[o];
  } else {
    const o = /* @__PURE__ */ new Map();
    return {
      getItem: (t) => o.get(t) ?? null,
      setItem: (t, r) => o.set(t, r),
      removeItem: (t) => o.delete(t)
    };
  }
}, h = u("local"), C = u("session"), g = u("node");
let s = null;
const p = (e) => {
  s = e;
}, i = /* @__PURE__ */ new Set(), a = () => typeof window < "u" ? h || window.localStorage : s && s.storage ? s.storage : g, w = (e, o) => {
  try {
    const t = a(), r = JSON.stringify(o);
    return t.setItem(e, r), !0;
  } catch (t) {
    return console.error("setCacheLoca error:", t), !1;
  }
}, m = (e) => {
  try {
    const t = a().getItem(e);
    return t ? JSON.parse(t) : null;
  } catch (o) {
    return console.error("getCacheLoca error:", o), null;
  }
}, v = (e, o, t = 0, r = "mm") => {
  try {
    const c = a();
    let n = 0;
    if (t > 0)
      n = Date.now() + (r === "mm" ? t * 60 * 1e3 : t * 1e3);
    else {
      const l = m(`cache_${e}`);
      l && (n = l.expire);
    }
    const d = {
      value: o,
      expire: n
    };
    return c.setItem(`cache_${e}`, JSON.stringify(d)), i.add(e), !0;
  } catch (c) {
    return console.error("setCache error:", c), !1;
  }
}, x = (e) => {
  try {
    const t = a().getItem(`cache_${e}`);
    if (!t) return null;
    const r = JSON.parse(t);
    return r.expire > 0 && Date.now() > r.expire ? (f(e), null) : r.value;
  } catch (o) {
    return console.error("getCache error:", o), null;
  }
}, f = (e) => {
  try {
    a().removeItem(`cache_${e}`), i.delete(e);
  } catch (o) {
    console.error("delCache error:", o);
  }
}, S = () => {
  try {
    const e = a();
    i.forEach((o) => {
      e.removeItem(`cache_${o}`);
    }), i.clear();
  } catch (e) {
    console.error("clearCache error:", e);
  }
}, I = (e, o = "ss") => {
  try {
    const r = a().getItem(`cache_${e}`);
    if (!r) return 0;
    const c = JSON.parse(r);
    if (c.expire <= 0) return 0;
    const n = Math.max(0, c.expire - Date.now());
    return Math.floor(o === "ss" ? n / 1e3 : n / (60 * 1e3));
  } catch (t) {
    return console.error("comCache error:", t), 0;
  }
}, y = (e, o, t) => {
  if (typeof document > "u") {
    console.warn("setCookie: document is not available in this environment");
    return;
  }
  const r = /* @__PURE__ */ new Date();
  r.setTime(r.getTime() + t * 24 * 60 * 60 * 1e3);
  const c = "expires=" + r.toUTCString();
  document.cookie = e + "=" + o + ";" + c + ";path=/";
}, b = (e) => {
  if (typeof document > "u") {
    console.warn("getCookie: document is not available in this environment");
    return;
  }
  const o = e + "=", r = decodeURIComponent(document.cookie).split(";");
  for (let c = 0; c < r.length; c++) {
    let n = r[c];
    for (; n.charAt(0) === " "; )
      n = n.substring(1);
    if (n.indexOf(o) === 0)
      return n.substring(o.length, n.length);
  }
}, k = (e) => {
  if (typeof document > "u") {
    console.warn("clearCookie: document is not available in this environment");
    return;
  }
  document.cookie = e + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
export {
  S as clearCache,
  k as clearCookie,
  I as comCache,
  f as delCache,
  x as getCache,
  m as getCacheLoca,
  b as getCookie,
  a as getStorageGlobal,
  h as local,
  g as nodeStorage,
  C as session,
  v as setCache,
  w as setCacheLoca,
  y as setCookie,
  p as setVariable
};
//# sourceMappingURL=ort-cache.es.js.map
