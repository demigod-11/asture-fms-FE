function kf(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != 'string' && !Array.isArray(r)) {
      for (const l in r)
        if (l !== 'default' && !(l in e)) {
          const i = Object.getOwnPropertyDescriptor(r, l);
          i &&
            Object.defineProperty(
              e,
              l,
              i.get ? i : { enumerable: !0, get: () => r[l] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' })
  );
}
(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
  new MutationObserver(l => {
    for (const i of l)
      if (i.type === 'childList')
        for (const u of i.addedNodes)
          u.tagName === 'LINK' && u.rel === 'modulepreload' && r(u);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(l) {
    const i = {};
    return (
      l.integrity && (i.integrity = l.integrity),
      l.referrerPolicy && (i.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === 'use-credentials'
        ? (i.credentials = 'include')
        : l.crossOrigin === 'anonymous'
          ? (i.credentials = 'omit')
          : (i.credentials = 'same-origin'),
      i
    );
  }
  function r(l) {
    if (l.ep) return;
    l.ep = !0;
    const i = n(l);
    fetch(l.href, i);
  }
})();
function Bs(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default')
    ? e.default
    : e;
}
var Ws = { exports: {} },
  _l = {},
  Vs = { exports: {} },
  M = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var pr = Symbol.for('react.element'),
  Ef = Symbol.for('react.portal'),
  Pf = Symbol.for('react.fragment'),
  _f = Symbol.for('react.strict_mode'),
  Of = Symbol.for('react.profiler'),
  Nf = Symbol.for('react.provider'),
  Ff = Symbol.for('react.context'),
  Rf = Symbol.for('react.forward_ref'),
  Lf = Symbol.for('react.suspense'),
  Tf = Symbol.for('react.memo'),
  Mf = Symbol.for('react.lazy'),
  wo = Symbol.iterator;
function zf(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (wo && e[wo]) || e['@@iterator']),
      typeof e == 'function' ? e : null);
}
var Hs = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Ks = Object.assign,
  qs = {};
function kn(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = qs),
    (this.updater = n || Hs));
}
kn.prototype.isReactComponent = {};
kn.prototype.setState = function (e, t) {
  if (typeof e != 'object' && typeof e != 'function' && e != null)
    throw Error(
      'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
    );
  this.updater.enqueueSetState(this, e, t, 'setState');
};
kn.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
};
function Gs() {}
Gs.prototype = kn.prototype;
function Cu(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = qs),
    (this.updater = n || Hs));
}
var xu = (Cu.prototype = new Gs());
xu.constructor = Cu;
Ks(xu, kn.prototype);
xu.isPureReactComponent = !0;
var So = Array.isArray,
  Ys = Object.prototype.hasOwnProperty,
  ku = { current: null },
  Xs = { key: !0, ref: !0, __self: !0, __source: !0 };
function Zs(e, t, n) {
  var r,
    l = {},
    i = null,
    u = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (u = t.ref),
    t.key !== void 0 && (i = '' + t.key),
    t))
      Ys.call(t, r) && !Xs.hasOwnProperty(r) && (l[r] = t[r]);
  var o = arguments.length - 2;
  if (o === 1) l.children = n;
  else if (1 < o) {
    for (var s = Array(o), a = 0; a < o; a++) s[a] = arguments[a + 2];
    l.children = s;
  }
  if (e && e.defaultProps)
    for (r in ((o = e.defaultProps), o)) l[r] === void 0 && (l[r] = o[r]);
  return {
    $$typeof: pr,
    type: e,
    key: i,
    ref: u,
    props: l,
    _owner: ku.current,
  };
}
function Df(e, t) {
  return {
    $$typeof: pr,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Eu(e) {
  return typeof e == 'object' && e !== null && e.$$typeof === pr;
}
function jf(e) {
  var t = { '=': '=0', ':': '=2' };
  return (
    '$' +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var Co = /\/+/g;
function Gl(e, t) {
  return typeof e == 'object' && e !== null && e.key != null
    ? jf('' + e.key)
    : t.toString(36);
}
function Ur(e, t, n, r, l) {
  var i = typeof e;
  (i === 'undefined' || i === 'boolean') && (e = null);
  var u = !1;
  if (e === null) u = !0;
  else
    switch (i) {
      case 'string':
      case 'number':
        u = !0;
        break;
      case 'object':
        switch (e.$$typeof) {
          case pr:
          case Ef:
            u = !0;
        }
    }
  if (u)
    return (
      (u = e),
      (l = l(u)),
      (e = r === '' ? '.' + Gl(u, 0) : r),
      So(l)
        ? ((n = ''),
          e != null && (n = e.replace(Co, '$&/') + '/'),
          Ur(l, t, n, '', function (a) {
            return a;
          }))
        : l != null &&
          (Eu(l) &&
            (l = Df(
              l,
              n +
                (!l.key || (u && u.key === l.key)
                  ? ''
                  : ('' + l.key).replace(Co, '$&/') + '/') +
                e
            )),
          t.push(l)),
      1
    );
  if (((u = 0), (r = r === '' ? '.' : r + ':'), So(e)))
    for (var o = 0; o < e.length; o++) {
      i = e[o];
      var s = r + Gl(i, o);
      u += Ur(i, t, n, s, l);
    }
  else if (((s = zf(e)), typeof s == 'function'))
    for (e = s.call(e), o = 0; !(i = e.next()).done; )
      ((i = i.value), (s = r + Gl(i, o++)), (u += Ur(i, t, n, s, l)));
  else if (i === 'object')
    throw (
      (t = String(e)),
      Error(
        'Objects are not valid as a React child (found: ' +
          (t === '[object Object]'
            ? 'object with keys {' + Object.keys(e).join(', ') + '}'
            : t) +
          '). If you meant to render a collection of children, use an array instead.'
      )
    );
  return u;
}
function Cr(e, t, n) {
  if (e == null) return e;
  var r = [],
    l = 0;
  return (
    Ur(e, r, '', '', function (i) {
      return t.call(n, i, l++);
    }),
    r
  );
}
function If(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        }
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var de = { current: null },
  $r = { transition: null },
  Uf = {
    ReactCurrentDispatcher: de,
    ReactCurrentBatchConfig: $r,
    ReactCurrentOwner: ku,
  };
function Js() {
  throw Error('act(...) is not supported in production builds of React.');
}
M.Children = {
  map: Cr,
  forEach: function (e, t, n) {
    Cr(
      e,
      function () {
        t.apply(this, arguments);
      },
      n
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Cr(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Cr(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Eu(e))
      throw Error(
        'React.Children.only expected to receive a single React element child.'
      );
    return e;
  },
};
M.Component = kn;
M.Fragment = Pf;
M.Profiler = Of;
M.PureComponent = Cu;
M.StrictMode = _f;
M.Suspense = Lf;
M.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Uf;
M.act = Js;
M.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      'React.cloneElement(...): The argument must be a React element, but you passed ' +
        e +
        '.'
    );
  var r = Ks({}, e.props),
    l = e.key,
    i = e.ref,
    u = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (u = ku.current)),
      t.key !== void 0 && (l = '' + t.key),
      e.type && e.type.defaultProps)
    )
      var o = e.type.defaultProps;
    for (s in t)
      Ys.call(t, s) &&
        !Xs.hasOwnProperty(s) &&
        (r[s] = t[s] === void 0 && o !== void 0 ? o[s] : t[s]);
  }
  var s = arguments.length - 2;
  if (s === 1) r.children = n;
  else if (1 < s) {
    o = Array(s);
    for (var a = 0; a < s; a++) o[a] = arguments[a + 2];
    r.children = o;
  }
  return { $$typeof: pr, type: e.type, key: l, ref: i, props: r, _owner: u };
};
M.createContext = function (e) {
  return (
    (e = {
      $$typeof: Ff,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Nf, _context: e }),
    (e.Consumer = e)
  );
};
M.createElement = Zs;
M.createFactory = function (e) {
  var t = Zs.bind(null, e);
  return ((t.type = e), t);
};
M.createRef = function () {
  return { current: null };
};
M.forwardRef = function (e) {
  return { $$typeof: Rf, render: e };
};
M.isValidElement = Eu;
M.lazy = function (e) {
  return { $$typeof: Mf, _payload: { _status: -1, _result: e }, _init: If };
};
M.memo = function (e, t) {
  return { $$typeof: Tf, type: e, compare: t === void 0 ? null : t };
};
M.startTransition = function (e) {
  var t = $r.transition;
  $r.transition = {};
  try {
    e();
  } finally {
    $r.transition = t;
  }
};
M.unstable_act = Js;
M.useCallback = function (e, t) {
  return de.current.useCallback(e, t);
};
M.useContext = function (e) {
  return de.current.useContext(e);
};
M.useDebugValue = function () {};
M.useDeferredValue = function (e) {
  return de.current.useDeferredValue(e);
};
M.useEffect = function (e, t) {
  return de.current.useEffect(e, t);
};
M.useId = function () {
  return de.current.useId();
};
M.useImperativeHandle = function (e, t, n) {
  return de.current.useImperativeHandle(e, t, n);
};
M.useInsertionEffect = function (e, t) {
  return de.current.useInsertionEffect(e, t);
};
M.useLayoutEffect = function (e, t) {
  return de.current.useLayoutEffect(e, t);
};
M.useMemo = function (e, t) {
  return de.current.useMemo(e, t);
};
M.useReducer = function (e, t, n) {
  return de.current.useReducer(e, t, n);
};
M.useRef = function (e) {
  return de.current.useRef(e);
};
M.useState = function (e) {
  return de.current.useState(e);
};
M.useSyncExternalStore = function (e, t, n) {
  return de.current.useSyncExternalStore(e, t, n);
};
M.useTransition = function () {
  return de.current.useTransition();
};
M.version = '18.3.1';
Vs.exports = M;
var _ = Vs.exports;
const Ut = Bs(_),
  $f = kf({ __proto__: null, default: Ut }, [_]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Af = _,
  Qf = Symbol.for('react.element'),
  Bf = Symbol.for('react.fragment'),
  Wf = Object.prototype.hasOwnProperty,
  Vf = Af.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Hf = { key: !0, ref: !0, __self: !0, __source: !0 };
function bs(e, t, n) {
  var r,
    l = {},
    i = null,
    u = null;
  (n !== void 0 && (i = '' + n),
    t.key !== void 0 && (i = '' + t.key),
    t.ref !== void 0 && (u = t.ref));
  for (r in t) Wf.call(t, r) && !Hf.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
  return {
    $$typeof: Qf,
    type: e,
    key: i,
    ref: u,
    props: l,
    _owner: Vf.current,
  };
}
_l.Fragment = Bf;
_l.jsx = bs;
_l.jsxs = bs;
Ws.exports = _l;
var R = Ws.exports,
  ki = {},
  ea = { exports: {} },
  _e = {},
  ta = { exports: {} },
  na = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(k, F) {
    var L = k.length;
    k.push(F);
    e: for (; 0 < L; ) {
      var U = (L - 1) >>> 1,
        G = k[U];
      if (0 < l(G, F)) ((k[U] = F), (k[L] = G), (L = U));
      else break e;
    }
  }
  function n(k) {
    return k.length === 0 ? null : k[0];
  }
  function r(k) {
    if (k.length === 0) return null;
    var F = k[0],
      L = k.pop();
    if (L !== F) {
      k[0] = L;
      e: for (var U = 0, G = k.length, wr = G >>> 1; U < wr; ) {
        var Rt = 2 * (U + 1) - 1,
          ql = k[Rt],
          Lt = Rt + 1,
          Sr = k[Lt];
        if (0 > l(ql, L))
          Lt < G && 0 > l(Sr, ql)
            ? ((k[U] = Sr), (k[Lt] = L), (U = Lt))
            : ((k[U] = ql), (k[Rt] = L), (U = Rt));
        else if (Lt < G && 0 > l(Sr, L)) ((k[U] = Sr), (k[Lt] = L), (U = Lt));
        else break e;
      }
    }
    return F;
  }
  function l(k, F) {
    var L = k.sortIndex - F.sortIndex;
    return L !== 0 ? L : k.id - F.id;
  }
  if (typeof performance == 'object' && typeof performance.now == 'function') {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var u = Date,
      o = u.now();
    e.unstable_now = function () {
      return u.now() - o;
    };
  }
  var s = [],
    a = [],
    h = 1,
    p = null,
    v = 3,
    m = !1,
    y = !1,
    g = !1,
    x = typeof setTimeout == 'function' ? setTimeout : null,
    f = typeof clearTimeout == 'function' ? clearTimeout : null,
    c = typeof setImmediate < 'u' ? setImmediate : null;
  typeof navigator < 'u' &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function d(k) {
    for (var F = n(a); F !== null; ) {
      if (F.callback === null) r(a);
      else if (F.startTime <= k)
        (r(a), (F.sortIndex = F.expirationTime), t(s, F));
      else break;
      F = n(a);
    }
  }
  function w(k) {
    if (((g = !1), d(k), !y))
      if (n(s) !== null) ((y = !0), ve(C));
      else {
        var F = n(a);
        F !== null && qe(w, F.startTime - k);
      }
  }
  function C(k, F) {
    ((y = !1), g && ((g = !1), f(N), (N = -1)), (m = !0));
    var L = v;
    try {
      for (
        d(F), p = n(s);
        p !== null && (!(p.expirationTime > F) || (k && !he()));

      ) {
        var U = p.callback;
        if (typeof U == 'function') {
          ((p.callback = null), (v = p.priorityLevel));
          var G = U(p.expirationTime <= F);
          ((F = e.unstable_now()),
            typeof G == 'function' ? (p.callback = G) : p === n(s) && r(s),
            d(F));
        } else r(s);
        p = n(s);
      }
      if (p !== null) var wr = !0;
      else {
        var Rt = n(a);
        (Rt !== null && qe(w, Rt.startTime - F), (wr = !1));
      }
      return wr;
    } finally {
      ((p = null), (v = L), (m = !1));
    }
  }
  var E = !1,
    O = null,
    N = -1,
    Q = 5,
    T = -1;
  function he() {
    return !(e.unstable_now() - T < Q);
  }
  function Ft() {
    if (O !== null) {
      var k = e.unstable_now();
      T = k;
      var F = !0;
      try {
        F = O(!0, k);
      } finally {
        F ? Ce() : ((E = !1), (O = null));
      }
    } else E = !1;
  }
  var Ce;
  if (typeof c == 'function')
    Ce = function () {
      c(Ft);
    };
  else if (typeof MessageChannel < 'u') {
    var ze = new MessageChannel(),
      lt = ze.port2;
    ((ze.port1.onmessage = Ft),
      (Ce = function () {
        lt.postMessage(null);
      }));
  } else
    Ce = function () {
      x(Ft, 0);
    };
  function ve(k) {
    ((O = k), E || ((E = !0), Ce()));
  }
  function qe(k, F) {
    N = x(function () {
      k(e.unstable_now());
    }, F);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (k) {
      k.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      y || m || ((y = !0), ve(C));
    }),
    (e.unstable_forceFrameRate = function (k) {
      0 > k || 125 < k
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
          )
        : (Q = 0 < k ? Math.floor(1e3 / k) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return v;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(s);
    }),
    (e.unstable_next = function (k) {
      switch (v) {
        case 1:
        case 2:
        case 3:
          var F = 3;
          break;
        default:
          F = v;
      }
      var L = v;
      v = F;
      try {
        return k();
      } finally {
        v = L;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (k, F) {
      switch (k) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          k = 3;
      }
      var L = v;
      v = k;
      try {
        return F();
      } finally {
        v = L;
      }
    }),
    (e.unstable_scheduleCallback = function (k, F, L) {
      var U = e.unstable_now();
      switch (
        (typeof L == 'object' && L !== null
          ? ((L = L.delay), (L = typeof L == 'number' && 0 < L ? U + L : U))
          : (L = U),
        k)
      ) {
        case 1:
          var G = -1;
          break;
        case 2:
          G = 250;
          break;
        case 5:
          G = 1073741823;
          break;
        case 4:
          G = 1e4;
          break;
        default:
          G = 5e3;
      }
      return (
        (G = L + G),
        (k = {
          id: h++,
          callback: F,
          priorityLevel: k,
          startTime: L,
          expirationTime: G,
          sortIndex: -1,
        }),
        L > U
          ? ((k.sortIndex = L),
            t(a, k),
            n(s) === null &&
              k === n(a) &&
              (g ? (f(N), (N = -1)) : (g = !0), qe(w, L - U)))
          : ((k.sortIndex = G), t(s, k), y || m || ((y = !0), ve(C))),
        k
      );
    }),
    (e.unstable_shouldYield = he),
    (e.unstable_wrapCallback = function (k) {
      var F = v;
      return function () {
        var L = v;
        v = F;
        try {
          return k.apply(this, arguments);
        } finally {
          v = L;
        }
      };
    }));
})(na);
ta.exports = na;
var Kf = ta.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var qf = _,
  Pe = Kf;
function S(e) {
  for (
    var t = 'https://reactjs.org/docs/error-decoder.html?invariant=' + e, n = 1;
    n < arguments.length;
    n++
  )
    t += '&args[]=' + encodeURIComponent(arguments[n]);
  return (
    'Minified React error #' +
    e +
    '; visit ' +
    t +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  );
}
var ra = new Set(),
  Gn = {};
function Kt(e, t) {
  (mn(e, t), mn(e + 'Capture', t));
}
function mn(e, t) {
  for (Gn[e] = t, e = 0; e < t.length; e++) ra.add(t[e]);
}
var be = !(
    typeof window > 'u' ||
    typeof window.document > 'u' ||
    typeof window.document.createElement > 'u'
  ),
  Ei = Object.prototype.hasOwnProperty,
  Gf =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  xo = {},
  ko = {};
function Yf(e) {
  return Ei.call(ko, e)
    ? !0
    : Ei.call(xo, e)
      ? !1
      : Gf.test(e)
        ? (ko[e] = !0)
        : ((xo[e] = !0), !1);
}
function Xf(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case 'function':
    case 'symbol':
      return !0;
    case 'boolean':
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== 'data-' && e !== 'aria-');
    default:
      return !1;
  }
}
function Zf(e, t, n, r) {
  if (t === null || typeof t > 'u' || Xf(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function pe(e, t, n, r, l, i, u) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = l),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = u));
}
var le = {};
'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
  .split(' ')
  .forEach(function (e) {
    le[e] = new pe(e, 0, !1, e, null, !1, !1);
  });
[
  ['acceptCharset', 'accept-charset'],
  ['className', 'class'],
  ['htmlFor', 'for'],
  ['httpEquiv', 'http-equiv'],
].forEach(function (e) {
  var t = e[0];
  le[t] = new pe(t, 1, !1, e[1], null, !1, !1);
});
['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (e) {
  le[e] = new pe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  'autoReverse',
  'externalResourcesRequired',
  'focusable',
  'preserveAlpha',
].forEach(function (e) {
  le[e] = new pe(e, 2, !1, e, null, !1, !1);
});
'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
  .split(' ')
  .forEach(function (e) {
    le[e] = new pe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
['checked', 'multiple', 'muted', 'selected'].forEach(function (e) {
  le[e] = new pe(e, 3, !0, e, null, !1, !1);
});
['capture', 'download'].forEach(function (e) {
  le[e] = new pe(e, 4, !1, e, null, !1, !1);
});
['cols', 'rows', 'size', 'span'].forEach(function (e) {
  le[e] = new pe(e, 6, !1, e, null, !1, !1);
});
['rowSpan', 'start'].forEach(function (e) {
  le[e] = new pe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Pu = /[\-:]([a-z])/g;
function _u(e) {
  return e[1].toUpperCase();
}
'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
  .split(' ')
  .forEach(function (e) {
    var t = e.replace(Pu, _u);
    le[t] = new pe(t, 1, !1, e, null, !1, !1);
  });
'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'
  .split(' ')
  .forEach(function (e) {
    var t = e.replace(Pu, _u);
    le[t] = new pe(t, 1, !1, e, 'http://www.w3.org/1999/xlink', !1, !1);
  });
['xml:base', 'xml:lang', 'xml:space'].forEach(function (e) {
  var t = e.replace(Pu, _u);
  le[t] = new pe(t, 1, !1, e, 'http://www.w3.org/XML/1998/namespace', !1, !1);
});
['tabIndex', 'crossOrigin'].forEach(function (e) {
  le[e] = new pe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
le.xlinkHref = new pe(
  'xlinkHref',
  1,
  !1,
  'xlink:href',
  'http://www.w3.org/1999/xlink',
  !0,
  !1
);
['src', 'href', 'action', 'formAction'].forEach(function (e) {
  le[e] = new pe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Ou(e, t, n, r) {
  var l = le.hasOwnProperty(t) ? le[t] : null;
  (l !== null
    ? l.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== 'o' && t[0] !== 'O') ||
      (t[1] !== 'n' && t[1] !== 'N')) &&
    (Zf(t, n, l, r) && (n = null),
    r || l === null
      ? Yf(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, '' + n))
      : l.mustUseProperty
        ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : '') : n)
        : ((t = l.attributeName),
          (r = l.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((l = l.type),
              (n = l === 3 || (l === 4 && n === !0) ? '' : '' + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var rt = qf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  xr = Symbol.for('react.element'),
  Zt = Symbol.for('react.portal'),
  Jt = Symbol.for('react.fragment'),
  Nu = Symbol.for('react.strict_mode'),
  Pi = Symbol.for('react.profiler'),
  la = Symbol.for('react.provider'),
  ia = Symbol.for('react.context'),
  Fu = Symbol.for('react.forward_ref'),
  _i = Symbol.for('react.suspense'),
  Oi = Symbol.for('react.suspense_list'),
  Ru = Symbol.for('react.memo'),
  ot = Symbol.for('react.lazy'),
  ua = Symbol.for('react.offscreen'),
  Eo = Symbol.iterator;
function On(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (Eo && e[Eo]) || e['@@iterator']),
      typeof e == 'function' ? e : null);
}
var H = Object.assign,
  Yl;
function Dn(e) {
  if (Yl === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Yl = (t && t[1]) || '';
    }
  return (
    `
` +
    Yl +
    e
  );
}
var Xl = !1;
function Zl(e, t) {
  if (!e || Xl) return '';
  Xl = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, 'props', {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == 'object' && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (a) {
          var r = a;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (a) {
          r = a;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (a) {
        r = a;
      }
      e();
    }
  } catch (a) {
    if (a && r && typeof a.stack == 'string') {
      for (
        var l = a.stack.split(`
`),
          i = r.stack.split(`
`),
          u = l.length - 1,
          o = i.length - 1;
        1 <= u && 0 <= o && l[u] !== i[o];

      )
        o--;
      for (; 1 <= u && 0 <= o; u--, o--)
        if (l[u] !== i[o]) {
          if (u !== 1 || o !== 1)
            do
              if ((u--, o--, 0 > o || l[u] !== i[o])) {
                var s =
                  `
` + l[u].replace(' at new ', ' at ');
                return (
                  e.displayName &&
                    s.includes('<anonymous>') &&
                    (s = s.replace('<anonymous>', e.displayName)),
                  s
                );
              }
            while (1 <= u && 0 <= o);
          break;
        }
    }
  } finally {
    ((Xl = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : '') ? Dn(e) : '';
}
function Jf(e) {
  switch (e.tag) {
    case 5:
      return Dn(e.type);
    case 16:
      return Dn('Lazy');
    case 13:
      return Dn('Suspense');
    case 19:
      return Dn('SuspenseList');
    case 0:
    case 2:
    case 15:
      return ((e = Zl(e.type, !1)), e);
    case 11:
      return ((e = Zl(e.type.render, !1)), e);
    case 1:
      return ((e = Zl(e.type, !0)), e);
    default:
      return '';
  }
}
function Ni(e) {
  if (e == null) return null;
  if (typeof e == 'function') return e.displayName || e.name || null;
  if (typeof e == 'string') return e;
  switch (e) {
    case Jt:
      return 'Fragment';
    case Zt:
      return 'Portal';
    case Pi:
      return 'Profiler';
    case Nu:
      return 'StrictMode';
    case _i:
      return 'Suspense';
    case Oi:
      return 'SuspenseList';
  }
  if (typeof e == 'object')
    switch (e.$$typeof) {
      case ia:
        return (e.displayName || 'Context') + '.Consumer';
      case la:
        return (e._context.displayName || 'Context') + '.Provider';
      case Fu:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ''),
            (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
          e
        );
      case Ru:
        return (
          (t = e.displayName || null),
          t !== null ? t : Ni(e.type) || 'Memo'
        );
      case ot:
        ((t = e._payload), (e = e._init));
        try {
          return Ni(e(t));
        } catch {}
    }
  return null;
}
function bf(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return 'Cache';
    case 9:
      return (t.displayName || 'Context') + '.Consumer';
    case 10:
      return (t._context.displayName || 'Context') + '.Provider';
    case 18:
      return 'DehydratedFragment';
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ''),
        t.displayName || (e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')
      );
    case 7:
      return 'Fragment';
    case 5:
      return t;
    case 4:
      return 'Portal';
    case 3:
      return 'Root';
    case 6:
      return 'Text';
    case 16:
      return Ni(t);
    case 8:
      return t === Nu ? 'StrictMode' : 'Mode';
    case 22:
      return 'Offscreen';
    case 12:
      return 'Profiler';
    case 21:
      return 'Scope';
    case 13:
      return 'Suspense';
    case 19:
      return 'SuspenseList';
    case 25:
      return 'TracingMarker';
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == 'function') return t.displayName || t.name || null;
      if (typeof t == 'string') return t;
  }
  return null;
}
function Et(e) {
  switch (typeof e) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return e;
    case 'object':
      return e;
    default:
      return '';
  }
}
function oa(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === 'input' &&
    (t === 'checkbox' || t === 'radio')
  );
}
function ed(e) {
  var t = oa(e) ? 'checked' : 'value',
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = '' + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < 'u' &&
    typeof n.get == 'function' &&
    typeof n.set == 'function'
  ) {
    var l = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return l.call(this);
        },
        set: function (u) {
          ((r = '' + u), i.call(this, u));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (u) {
          r = '' + u;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function kr(e) {
  e._valueTracker || (e._valueTracker = ed(e));
}
function sa(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = '';
  return (
    e && (r = oa(e) ? (e.checked ? 'true' : 'false') : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Jr(e) {
  if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u'))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Fi(e, t) {
  var n = t.checked;
  return H({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function Po(e, t) {
  var n = t.defaultValue == null ? '' : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = Et(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === 'checkbox' || t.type === 'radio'
          ? t.checked != null
          : t.value != null,
    }));
}
function aa(e, t) {
  ((t = t.checked), t != null && Ou(e, 'checked', t, !1));
}
function Ri(e, t) {
  aa(e, t);
  var n = Et(t.value),
    r = t.type;
  if (n != null)
    r === 'number'
      ? ((n === 0 && e.value === '') || e.value != n) && (e.value = '' + n)
      : e.value !== '' + n && (e.value = '' + n);
  else if (r === 'submit' || r === 'reset') {
    e.removeAttribute('value');
    return;
  }
  (t.hasOwnProperty('value')
    ? Li(e, t.type, n)
    : t.hasOwnProperty('defaultValue') && Li(e, t.type, Et(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function _o(e, t, n) {
  if (t.hasOwnProperty('value') || t.hasOwnProperty('defaultValue')) {
    var r = t.type;
    if (
      !(
        (r !== 'submit' && r !== 'reset') ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    ((t = '' + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== '' && (e.name = ''),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== '' && (e.name = n));
}
function Li(e, t, n) {
  (t !== 'number' || Jr(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = '' + e._wrapperState.initialValue)
      : e.defaultValue !== '' + n && (e.defaultValue = '' + n));
}
var jn = Array.isArray;
function cn(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var l = 0; l < n.length; l++) t['$' + n[l]] = !0;
    for (n = 0; n < e.length; n++)
      ((l = t.hasOwnProperty('$' + e[n].value)),
        e[n].selected !== l && (e[n].selected = l),
        l && r && (e[n].defaultSelected = !0));
  } else {
    for (n = '' + Et(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        ((e[l].selected = !0), r && (e[l].defaultSelected = !0));
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function Ti(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(S(91));
  return H({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: '' + e._wrapperState.initialValue,
  });
}
function Oo(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(S(92));
      if (jn(n)) {
        if (1 < n.length) throw Error(S(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ''), (n = t));
  }
  e._wrapperState = { initialValue: Et(n) };
}
function ca(e, t) {
  var n = Et(t.value),
    r = Et(t.defaultValue);
  (n != null &&
    ((n = '' + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = '' + r));
}
function No(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== '' && t !== null && (e.value = t);
}
function fa(e) {
  switch (e) {
    case 'svg':
      return 'http://www.w3.org/2000/svg';
    case 'math':
      return 'http://www.w3.org/1998/Math/MathML';
    default:
      return 'http://www.w3.org/1999/xhtml';
  }
}
function Mi(e, t) {
  return e == null || e === 'http://www.w3.org/1999/xhtml'
    ? fa(t)
    : e === 'http://www.w3.org/2000/svg' && t === 'foreignObject'
      ? 'http://www.w3.org/1999/xhtml'
      : e;
}
var Er,
  da = (function (e) {
    return typeof MSApp < 'u' && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, l) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, l);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== 'http://www.w3.org/2000/svg' || 'innerHTML' in e)
      e.innerHTML = t;
    else {
      for (
        Er = Er || document.createElement('div'),
          Er.innerHTML = '<svg>' + t.valueOf().toString() + '</svg>',
          t = Er.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Yn(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var $n = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  td = ['Webkit', 'ms', 'Moz', 'O'];
Object.keys($n).forEach(function (e) {
  td.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), ($n[t] = $n[e]));
  });
});
function pa(e, t, n) {
  return t == null || typeof t == 'boolean' || t === ''
    ? ''
    : n || typeof t != 'number' || t === 0 || ($n.hasOwnProperty(e) && $n[e])
      ? ('' + t).trim()
      : t + 'px';
}
function ha(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf('--') === 0,
        l = pa(n, t[n], r);
      (n === 'float' && (n = 'cssFloat'), r ? e.setProperty(n, l) : (e[n] = l));
    }
}
var nd = H(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function zi(e, t) {
  if (t) {
    if (nd[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(S(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(S(60));
      if (
        typeof t.dangerouslySetInnerHTML != 'object' ||
        !('__html' in t.dangerouslySetInnerHTML)
      )
        throw Error(S(61));
    }
    if (t.style != null && typeof t.style != 'object') throw Error(S(62));
  }
}
function Di(e, t) {
  if (e.indexOf('-') === -1) return typeof t.is == 'string';
  switch (e) {
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return !1;
    default:
      return !0;
  }
}
var ji = null;
function Lu(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Ii = null,
  fn = null,
  dn = null;
function Fo(e) {
  if ((e = mr(e))) {
    if (typeof Ii != 'function') throw Error(S(280));
    var t = e.stateNode;
    t && ((t = Ll(t)), Ii(e.stateNode, e.type, t));
  }
}
function va(e) {
  fn ? (dn ? dn.push(e) : (dn = [e])) : (fn = e);
}
function ma() {
  if (fn) {
    var e = fn,
      t = dn;
    if (((dn = fn = null), Fo(e), t)) for (e = 0; e < t.length; e++) Fo(t[e]);
  }
}
function ya(e, t) {
  return e(t);
}
function ga() {}
var Jl = !1;
function wa(e, t, n) {
  if (Jl) return e(t, n);
  Jl = !0;
  try {
    return ya(e, t, n);
  } finally {
    ((Jl = !1), (fn !== null || dn !== null) && (ga(), ma()));
  }
}
function Xn(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Ll(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
    case 'onMouseEnter':
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === 'button' ||
          e === 'input' ||
          e === 'select' ||
          e === 'textarea'
        ))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != 'function') throw Error(S(231, t, typeof n));
  return n;
}
var Ui = !1;
if (be)
  try {
    var Nn = {};
    (Object.defineProperty(Nn, 'passive', {
      get: function () {
        Ui = !0;
      },
    }),
      window.addEventListener('test', Nn, Nn),
      window.removeEventListener('test', Nn, Nn));
  } catch {
    Ui = !1;
  }
function rd(e, t, n, r, l, i, u, o, s) {
  var a = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, a);
  } catch (h) {
    this.onError(h);
  }
}
var An = !1,
  br = null,
  el = !1,
  $i = null,
  ld = {
    onError: function (e) {
      ((An = !0), (br = e));
    },
  };
function id(e, t, n, r, l, i, u, o, s) {
  ((An = !1), (br = null), rd.apply(ld, arguments));
}
function ud(e, t, n, r, l, i, u, o, s) {
  if ((id.apply(this, arguments), An)) {
    if (An) {
      var a = br;
      ((An = !1), (br = null));
    } else throw Error(S(198));
    el || ((el = !0), ($i = a));
  }
}
function qt(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Sa(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Ro(e) {
  if (qt(e) !== e) throw Error(S(188));
}
function od(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = qt(e)), t === null)) throw Error(S(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var i = l.alternate;
    if (i === null) {
      if (((r = l.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === i.child) {
      for (i = l.child; i; ) {
        if (i === n) return (Ro(l), e);
        if (i === r) return (Ro(l), t);
        i = i.sibling;
      }
      throw Error(S(188));
    }
    if (n.return !== r.return) ((n = l), (r = i));
    else {
      for (var u = !1, o = l.child; o; ) {
        if (o === n) {
          ((u = !0), (n = l), (r = i));
          break;
        }
        if (o === r) {
          ((u = !0), (r = l), (n = i));
          break;
        }
        o = o.sibling;
      }
      if (!u) {
        for (o = i.child; o; ) {
          if (o === n) {
            ((u = !0), (n = i), (r = l));
            break;
          }
          if (o === r) {
            ((u = !0), (r = i), (n = l));
            break;
          }
          o = o.sibling;
        }
        if (!u) throw Error(S(189));
      }
    }
    if (n.alternate !== r) throw Error(S(190));
  }
  if (n.tag !== 3) throw Error(S(188));
  return n.stateNode.current === n ? e : t;
}
function Ca(e) {
  return ((e = od(e)), e !== null ? xa(e) : null);
}
function xa(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = xa(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var ka = Pe.unstable_scheduleCallback,
  Lo = Pe.unstable_cancelCallback,
  sd = Pe.unstable_shouldYield,
  ad = Pe.unstable_requestPaint,
  q = Pe.unstable_now,
  cd = Pe.unstable_getCurrentPriorityLevel,
  Tu = Pe.unstable_ImmediatePriority,
  Ea = Pe.unstable_UserBlockingPriority,
  tl = Pe.unstable_NormalPriority,
  fd = Pe.unstable_LowPriority,
  Pa = Pe.unstable_IdlePriority,
  Ol = null,
  He = null;
function dd(e) {
  if (He && typeof He.onCommitFiberRoot == 'function')
    try {
      He.onCommitFiberRoot(Ol, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var $e = Math.clz32 ? Math.clz32 : vd,
  pd = Math.log,
  hd = Math.LN2;
function vd(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((pd(e) / hd) | 0)) | 0);
}
var Pr = 64,
  _r = 4194304;
function In(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function nl(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    i = e.pingedLanes,
    u = n & 268435455;
  if (u !== 0) {
    var o = u & ~l;
    o !== 0 ? (r = In(o)) : ((i &= u), i !== 0 && (r = In(i)));
  } else ((u = n & ~l), u !== 0 ? (r = In(u)) : i !== 0 && (r = In(i)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & l) &&
    ((l = r & -r), (i = t & -t), l >= i || (l === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      ((n = 31 - $e(t)), (l = 1 << n), (r |= e[n]), (t &= ~l));
  return r;
}
function md(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function yd(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      l = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;

  ) {
    var u = 31 - $e(i),
      o = 1 << u,
      s = l[u];
    (s === -1
      ? (!(o & n) || o & r) && (l[u] = md(o, t))
      : s <= t && (e.expiredLanes |= o),
      (i &= ~o));
  }
}
function Ai(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function _a() {
  var e = Pr;
  return ((Pr <<= 1), !(Pr & 4194240) && (Pr = 64), e);
}
function bl(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function hr(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - $e(t)),
    (e[t] = n));
}
function gd(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - $e(n),
      i = 1 << l;
    ((t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~i));
  }
}
function Mu(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - $e(n),
      l = 1 << r;
    ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
  }
}
var j = 0;
function Oa(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var Na,
  zu,
  Fa,
  Ra,
  La,
  Qi = !1,
  Or = [],
  vt = null,
  mt = null,
  yt = null,
  Zn = new Map(),
  Jn = new Map(),
  ct = [],
  wd =
    'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
      ' '
    );
function To(e, t) {
  switch (e) {
    case 'focusin':
    case 'focusout':
      vt = null;
      break;
    case 'dragenter':
    case 'dragleave':
      mt = null;
      break;
    case 'mouseover':
    case 'mouseout':
      yt = null;
      break;
    case 'pointerover':
    case 'pointerout':
      Zn.delete(t.pointerId);
      break;
    case 'gotpointercapture':
    case 'lostpointercapture':
      Jn.delete(t.pointerId);
  }
}
function Fn(e, t, n, r, l, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [l],
      }),
      t !== null && ((t = mr(t)), t !== null && zu(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      l !== null && t.indexOf(l) === -1 && t.push(l),
      e);
}
function Sd(e, t, n, r, l) {
  switch (t) {
    case 'focusin':
      return ((vt = Fn(vt, e, t, n, r, l)), !0);
    case 'dragenter':
      return ((mt = Fn(mt, e, t, n, r, l)), !0);
    case 'mouseover':
      return ((yt = Fn(yt, e, t, n, r, l)), !0);
    case 'pointerover':
      var i = l.pointerId;
      return (Zn.set(i, Fn(Zn.get(i) || null, e, t, n, r, l)), !0);
    case 'gotpointercapture':
      return (
        (i = l.pointerId),
        Jn.set(i, Fn(Jn.get(i) || null, e, t, n, r, l)),
        !0
      );
  }
  return !1;
}
function Ta(e) {
  var t = zt(e.target);
  if (t !== null) {
    var n = qt(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Sa(n)), t !== null)) {
          ((e.blockedOn = t),
            La(e.priority, function () {
              Fa(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Ar(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Bi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((ji = r), n.target.dispatchEvent(r), (ji = null));
    } else return ((t = mr(n)), t !== null && zu(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function Mo(e, t, n) {
  Ar(e) && n.delete(t);
}
function Cd() {
  ((Qi = !1),
    vt !== null && Ar(vt) && (vt = null),
    mt !== null && Ar(mt) && (mt = null),
    yt !== null && Ar(yt) && (yt = null),
    Zn.forEach(Mo),
    Jn.forEach(Mo));
}
function Rn(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Qi ||
      ((Qi = !0),
      Pe.unstable_scheduleCallback(Pe.unstable_NormalPriority, Cd)));
}
function bn(e) {
  function t(l) {
    return Rn(l, e);
  }
  if (0 < Or.length) {
    Rn(Or[0], e);
    for (var n = 1; n < Or.length; n++) {
      var r = Or[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    vt !== null && Rn(vt, e),
      mt !== null && Rn(mt, e),
      yt !== null && Rn(yt, e),
      Zn.forEach(t),
      Jn.forEach(t),
      n = 0;
    n < ct.length;
    n++
  )
    ((r = ct[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < ct.length && ((n = ct[0]), n.blockedOn === null); )
    (Ta(n), n.blockedOn === null && ct.shift());
}
var pn = rt.ReactCurrentBatchConfig,
  rl = !0;
function xd(e, t, n, r) {
  var l = j,
    i = pn.transition;
  pn.transition = null;
  try {
    ((j = 1), Du(e, t, n, r));
  } finally {
    ((j = l), (pn.transition = i));
  }
}
function kd(e, t, n, r) {
  var l = j,
    i = pn.transition;
  pn.transition = null;
  try {
    ((j = 4), Du(e, t, n, r));
  } finally {
    ((j = l), (pn.transition = i));
  }
}
function Du(e, t, n, r) {
  if (rl) {
    var l = Bi(e, t, n, r);
    if (l === null) (ai(e, t, r, ll, n), To(e, r));
    else if (Sd(l, e, t, n, r)) r.stopPropagation();
    else if ((To(e, r), t & 4 && -1 < wd.indexOf(e))) {
      for (; l !== null; ) {
        var i = mr(l);
        if (
          (i !== null && Na(i),
          (i = Bi(e, t, n, r)),
          i === null && ai(e, t, r, ll, n),
          i === l)
        )
          break;
        l = i;
      }
      l !== null && r.stopPropagation();
    } else ai(e, t, r, null, n);
  }
}
var ll = null;
function Bi(e, t, n, r) {
  if (((ll = null), (e = Lu(r)), (e = zt(e)), e !== null))
    if (((t = qt(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Sa(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((ll = e), null);
}
function Ma(e) {
  switch (e) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return 1;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return 4;
    case 'message':
      switch (cd()) {
        case Tu:
          return 1;
        case Ea:
          return 4;
        case tl:
        case fd:
          return 16;
        case Pa:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var dt = null,
  ju = null,
  Qr = null;
function za() {
  if (Qr) return Qr;
  var e,
    t = ju,
    n = t.length,
    r,
    l = 'value' in dt ? dt.value : dt.textContent,
    i = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++);
  var u = n - e;
  for (r = 1; r <= u && t[n - r] === l[i - r]; r++);
  return (Qr = l.slice(e, 1 < r ? 1 - r : void 0));
}
function Br(e) {
  var t = e.keyCode;
  return (
    'charCode' in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Nr() {
  return !0;
}
function zo() {
  return !1;
}
function Oe(e) {
  function t(n, r, l, i, u) {
    ((this._reactName = n),
      (this._targetInst = l),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = u),
      (this.currentTarget = null));
    for (var o in e)
      e.hasOwnProperty(o) && ((n = e[o]), (this[o] = n ? n(i) : i[o]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? Nr
        : zo),
      (this.isPropagationStopped = zo),
      this
    );
  }
  return (
    H(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != 'unknown' && (n.returnValue = !1),
          (this.isDefaultPrevented = Nr));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != 'unknown' && (n.cancelBubble = !0),
          (this.isPropagationStopped = Nr));
      },
      persist: function () {},
      isPersistent: Nr,
    }),
    t
  );
}
var En = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Iu = Oe(En),
  vr = H({}, En, { view: 0, detail: 0 }),
  Ed = Oe(vr),
  ei,
  ti,
  Ln,
  Nl = H({}, vr, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Uu,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return 'movementX' in e
        ? e.movementX
        : (e !== Ln &&
            (Ln && e.type === 'mousemove'
              ? ((ei = e.screenX - Ln.screenX), (ti = e.screenY - Ln.screenY))
              : (ti = ei = 0),
            (Ln = e)),
          ei);
    },
    movementY: function (e) {
      return 'movementY' in e ? e.movementY : ti;
    },
  }),
  Do = Oe(Nl),
  Pd = H({}, Nl, { dataTransfer: 0 }),
  _d = Oe(Pd),
  Od = H({}, vr, { relatedTarget: 0 }),
  ni = Oe(Od),
  Nd = H({}, En, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Fd = Oe(Nd),
  Rd = H({}, En, {
    clipboardData: function (e) {
      return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Ld = Oe(Rd),
  Td = H({}, En, { data: 0 }),
  jo = Oe(Td),
  Md = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified',
  },
  zd = {
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    45: 'Insert',
    46: 'Delete',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    224: 'Meta',
  },
  Dd = {
    Alt: 'altKey',
    Control: 'ctrlKey',
    Meta: 'metaKey',
    Shift: 'shiftKey',
  };
function jd(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Dd[e]) ? !!t[e] : !1;
}
function Uu() {
  return jd;
}
var Id = H({}, vr, {
    key: function (e) {
      if (e.key) {
        var t = Md[e.key] || e.key;
        if (t !== 'Unidentified') return t;
      }
      return e.type === 'keypress'
        ? ((e = Br(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
        : e.type === 'keydown' || e.type === 'keyup'
          ? zd[e.keyCode] || 'Unidentified'
          : '';
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Uu,
    charCode: function (e) {
      return e.type === 'keypress' ? Br(e) : 0;
    },
    keyCode: function (e) {
      return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === 'keypress'
        ? Br(e)
        : e.type === 'keydown' || e.type === 'keyup'
          ? e.keyCode
          : 0;
    },
  }),
  Ud = Oe(Id),
  $d = H({}, Nl, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Io = Oe($d),
  Ad = H({}, vr, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Uu,
  }),
  Qd = Oe(Ad),
  Bd = H({}, En, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Wd = Oe(Bd),
  Vd = H({}, Nl, {
    deltaX: function (e) {
      return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return 'deltaY' in e
        ? e.deltaY
        : 'wheelDeltaY' in e
          ? -e.wheelDeltaY
          : 'wheelDelta' in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Hd = Oe(Vd),
  Kd = [9, 13, 27, 32],
  $u = be && 'CompositionEvent' in window,
  Qn = null;
be && 'documentMode' in document && (Qn = document.documentMode);
var qd = be && 'TextEvent' in window && !Qn,
  Da = be && (!$u || (Qn && 8 < Qn && 11 >= Qn)),
  Uo = ' ',
  $o = !1;
function ja(e, t) {
  switch (e) {
    case 'keyup':
      return Kd.indexOf(t.keyCode) !== -1;
    case 'keydown':
      return t.keyCode !== 229;
    case 'keypress':
    case 'mousedown':
    case 'focusout':
      return !0;
    default:
      return !1;
  }
}
function Ia(e) {
  return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
}
var bt = !1;
function Gd(e, t) {
  switch (e) {
    case 'compositionend':
      return Ia(t);
    case 'keypress':
      return t.which !== 32 ? null : (($o = !0), Uo);
    case 'textInput':
      return ((e = t.data), e === Uo && $o ? null : e);
    default:
      return null;
  }
}
function Yd(e, t) {
  if (bt)
    return e === 'compositionend' || (!$u && ja(e, t))
      ? ((e = za()), (Qr = ju = dt = null), (bt = !1), e)
      : null;
  switch (e) {
    case 'paste':
      return null;
    case 'keypress':
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case 'compositionend':
      return Da && t.locale !== 'ko' ? null : t.data;
    default:
      return null;
  }
}
var Xd = {
  color: !0,
  date: !0,
  datetime: !0,
  'datetime-local': !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Ao(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === 'input' ? !!Xd[e.type] : t === 'textarea';
}
function Ua(e, t, n, r) {
  (va(r),
    (t = il(t, 'onChange')),
    0 < t.length &&
      ((n = new Iu('onChange', 'change', null, n, r)),
      e.push({ event: n, listeners: t })));
}
var Bn = null,
  er = null;
function Zd(e) {
  Ya(e, 0);
}
function Fl(e) {
  var t = nn(e);
  if (sa(t)) return e;
}
function Jd(e, t) {
  if (e === 'change') return t;
}
var $a = !1;
if (be) {
  var ri;
  if (be) {
    var li = 'oninput' in document;
    if (!li) {
      var Qo = document.createElement('div');
      (Qo.setAttribute('oninput', 'return;'),
        (li = typeof Qo.oninput == 'function'));
    }
    ri = li;
  } else ri = !1;
  $a = ri && (!document.documentMode || 9 < document.documentMode);
}
function Bo() {
  Bn && (Bn.detachEvent('onpropertychange', Aa), (er = Bn = null));
}
function Aa(e) {
  if (e.propertyName === 'value' && Fl(er)) {
    var t = [];
    (Ua(t, er, e, Lu(e)), wa(Zd, t));
  }
}
function bd(e, t, n) {
  e === 'focusin'
    ? (Bo(), (Bn = t), (er = n), Bn.attachEvent('onpropertychange', Aa))
    : e === 'focusout' && Bo();
}
function ep(e) {
  if (e === 'selectionchange' || e === 'keyup' || e === 'keydown')
    return Fl(er);
}
function tp(e, t) {
  if (e === 'click') return Fl(t);
}
function np(e, t) {
  if (e === 'input' || e === 'change') return Fl(t);
}
function rp(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var Qe = typeof Object.is == 'function' ? Object.is : rp;
function tr(e, t) {
  if (Qe(e, t)) return !0;
  if (typeof e != 'object' || e === null || typeof t != 'object' || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!Ei.call(t, l) || !Qe(e[l], t[l])) return !1;
  }
  return !0;
}
function Wo(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Vo(e, t) {
  var n = Wo(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Wo(n);
  }
}
function Qa(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? Qa(e, t.parentNode)
          : 'contains' in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function Ba() {
  for (var e = window, t = Jr(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == 'string';
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Jr(e.document);
  }
  return t;
}
function Au(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === 'input' &&
      (e.type === 'text' ||
        e.type === 'search' ||
        e.type === 'tel' ||
        e.type === 'url' ||
        e.type === 'password')) ||
      t === 'textarea' ||
      e.contentEditable === 'true')
  );
}
function lp(e) {
  var t = Ba(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    Qa(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Au(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        'selectionStart' in n)
      )
        ((n.selectionStart = t),
          (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var l = n.textContent.length,
          i = Math.min(r.start, l);
        ((r = r.end === void 0 ? i : Math.min(r.end, l)),
          !e.extend && i > r && ((l = r), (r = i), (i = l)),
          (l = Vo(n, i)));
        var u = Vo(n, r);
        l &&
          u &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== l.node ||
            e.anchorOffset !== l.offset ||
            e.focusNode !== u.node ||
            e.focusOffset !== u.offset) &&
          ((t = t.createRange()),
          t.setStart(l.node, l.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(u.node, u.offset))
            : (t.setEnd(u.node, u.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == 'function' && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var ip = be && 'documentMode' in document && 11 >= document.documentMode,
  en = null,
  Wi = null,
  Wn = null,
  Vi = !1;
function Ho(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Vi ||
    en == null ||
    en !== Jr(r) ||
    ((r = en),
    'selectionStart' in r && Au(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Wn && tr(Wn, r)) ||
      ((Wn = r),
      (r = il(Wi, 'onSelect')),
      0 < r.length &&
        ((t = new Iu('onSelect', 'select', null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = en))));
}
function Fr(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n['Webkit' + e] = 'webkit' + t),
    (n['Moz' + e] = 'moz' + t),
    n
  );
}
var tn = {
    animationend: Fr('Animation', 'AnimationEnd'),
    animationiteration: Fr('Animation', 'AnimationIteration'),
    animationstart: Fr('Animation', 'AnimationStart'),
    transitionend: Fr('Transition', 'TransitionEnd'),
  },
  ii = {},
  Wa = {};
be &&
  ((Wa = document.createElement('div').style),
  'AnimationEvent' in window ||
    (delete tn.animationend.animation,
    delete tn.animationiteration.animation,
    delete tn.animationstart.animation),
  'TransitionEvent' in window || delete tn.transitionend.transition);
function Rl(e) {
  if (ii[e]) return ii[e];
  if (!tn[e]) return e;
  var t = tn[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Wa) return (ii[e] = t[n]);
  return e;
}
var Va = Rl('animationend'),
  Ha = Rl('animationiteration'),
  Ka = Rl('animationstart'),
  qa = Rl('transitionend'),
  Ga = new Map(),
  Ko =
    'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
      ' '
    );
function _t(e, t) {
  (Ga.set(e, t), Kt(t, [e]));
}
for (var ui = 0; ui < Ko.length; ui++) {
  var oi = Ko[ui],
    up = oi.toLowerCase(),
    op = oi[0].toUpperCase() + oi.slice(1);
  _t(up, 'on' + op);
}
_t(Va, 'onAnimationEnd');
_t(Ha, 'onAnimationIteration');
_t(Ka, 'onAnimationStart');
_t('dblclick', 'onDoubleClick');
_t('focusin', 'onFocus');
_t('focusout', 'onBlur');
_t(qa, 'onTransitionEnd');
mn('onMouseEnter', ['mouseout', 'mouseover']);
mn('onMouseLeave', ['mouseout', 'mouseover']);
mn('onPointerEnter', ['pointerout', 'pointerover']);
mn('onPointerLeave', ['pointerout', 'pointerover']);
Kt(
  'onChange',
  'change click focusin focusout input keydown keyup selectionchange'.split(' ')
);
Kt(
  'onSelect',
  'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
    ' '
  )
);
Kt('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']);
Kt(
  'onCompositionEnd',
  'compositionend focusout keydown keypress keyup mousedown'.split(' ')
);
Kt(
  'onCompositionStart',
  'compositionstart focusout keydown keypress keyup mousedown'.split(' ')
);
Kt(
  'onCompositionUpdate',
  'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')
);
var Un =
    'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
      ' '
    ),
  sp = new Set('cancel close invalid load scroll toggle'.split(' ').concat(Un));
function qo(e, t, n) {
  var r = e.type || 'unknown-event';
  ((e.currentTarget = n), ud(r, t, void 0, e), (e.currentTarget = null));
}
function Ya(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var u = r.length - 1; 0 <= u; u--) {
          var o = r[u],
            s = o.instance,
            a = o.currentTarget;
          if (((o = o.listener), s !== i && l.isPropagationStopped())) break e;
          (qo(l, o, a), (i = s));
        }
      else
        for (u = 0; u < r.length; u++) {
          if (
            ((o = r[u]),
            (s = o.instance),
            (a = o.currentTarget),
            (o = o.listener),
            s !== i && l.isPropagationStopped())
          )
            break e;
          (qo(l, o, a), (i = s));
        }
    }
  }
  if (el) throw ((e = $i), (el = !1), ($i = null), e);
}
function $(e, t) {
  var n = t[Yi];
  n === void 0 && (n = t[Yi] = new Set());
  var r = e + '__bubble';
  n.has(r) || (Xa(t, e, 2, !1), n.add(r));
}
function si(e, t, n) {
  var r = 0;
  (t && (r |= 4), Xa(n, e, r, t));
}
var Rr = '_reactListening' + Math.random().toString(36).slice(2);
function nr(e) {
  if (!e[Rr]) {
    ((e[Rr] = !0),
      ra.forEach(function (n) {
        n !== 'selectionchange' && (sp.has(n) || si(n, !1, e), si(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Rr] || ((t[Rr] = !0), si('selectionchange', !1, t));
  }
}
function Xa(e, t, n, r) {
  switch (Ma(t)) {
    case 1:
      var l = xd;
      break;
    case 4:
      l = kd;
      break;
    default:
      l = Du;
  }
  ((n = l.bind(null, t, n, e)),
    (l = void 0),
    !Ui ||
      (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') ||
      (l = !0),
    r
      ? l !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: l })
        : e.addEventListener(t, n, !0)
      : l !== void 0
        ? e.addEventListener(t, n, { passive: l })
        : e.addEventListener(t, n, !1));
}
function ai(e, t, n, r, l) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var u = r.tag;
      if (u === 3 || u === 4) {
        var o = r.stateNode.containerInfo;
        if (o === l || (o.nodeType === 8 && o.parentNode === l)) break;
        if (u === 4)
          for (u = r.return; u !== null; ) {
            var s = u.tag;
            if (
              (s === 3 || s === 4) &&
              ((s = u.stateNode.containerInfo),
              s === l || (s.nodeType === 8 && s.parentNode === l))
            )
              return;
            u = u.return;
          }
        for (; o !== null; ) {
          if (((u = zt(o)), u === null)) return;
          if (((s = u.tag), s === 5 || s === 6)) {
            r = i = u;
            continue e;
          }
          o = o.parentNode;
        }
      }
      r = r.return;
    }
  wa(function () {
    var a = i,
      h = Lu(n),
      p = [];
    e: {
      var v = Ga.get(e);
      if (v !== void 0) {
        var m = Iu,
          y = e;
        switch (e) {
          case 'keypress':
            if (Br(n) === 0) break e;
          case 'keydown':
          case 'keyup':
            m = Ud;
            break;
          case 'focusin':
            ((y = 'focus'), (m = ni));
            break;
          case 'focusout':
            ((y = 'blur'), (m = ni));
            break;
          case 'beforeblur':
          case 'afterblur':
            m = ni;
            break;
          case 'click':
            if (n.button === 2) break e;
          case 'auxclick':
          case 'dblclick':
          case 'mousedown':
          case 'mousemove':
          case 'mouseup':
          case 'mouseout':
          case 'mouseover':
          case 'contextmenu':
            m = Do;
            break;
          case 'drag':
          case 'dragend':
          case 'dragenter':
          case 'dragexit':
          case 'dragleave':
          case 'dragover':
          case 'dragstart':
          case 'drop':
            m = _d;
            break;
          case 'touchcancel':
          case 'touchend':
          case 'touchmove':
          case 'touchstart':
            m = Qd;
            break;
          case Va:
          case Ha:
          case Ka:
            m = Fd;
            break;
          case qa:
            m = Wd;
            break;
          case 'scroll':
            m = Ed;
            break;
          case 'wheel':
            m = Hd;
            break;
          case 'copy':
          case 'cut':
          case 'paste':
            m = Ld;
            break;
          case 'gotpointercapture':
          case 'lostpointercapture':
          case 'pointercancel':
          case 'pointerdown':
          case 'pointermove':
          case 'pointerout':
          case 'pointerover':
          case 'pointerup':
            m = Io;
        }
        var g = (t & 4) !== 0,
          x = !g && e === 'scroll',
          f = g ? (v !== null ? v + 'Capture' : null) : v;
        g = [];
        for (var c = a, d; c !== null; ) {
          d = c;
          var w = d.stateNode;
          if (
            (d.tag === 5 &&
              w !== null &&
              ((d = w),
              f !== null && ((w = Xn(c, f)), w != null && g.push(rr(c, w, d)))),
            x)
          )
            break;
          c = c.return;
        }
        0 < g.length &&
          ((v = new m(v, y, null, n, h)), p.push({ event: v, listeners: g }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((v = e === 'mouseover' || e === 'pointerover'),
          (m = e === 'mouseout' || e === 'pointerout'),
          v &&
            n !== ji &&
            (y = n.relatedTarget || n.fromElement) &&
            (zt(y) || y[et]))
        )
          break e;
        if (
          (m || v) &&
          ((v =
            h.window === h
              ? h
              : (v = h.ownerDocument)
                ? v.defaultView || v.parentWindow
                : window),
          m
            ? ((y = n.relatedTarget || n.toElement),
              (m = a),
              (y = y ? zt(y) : null),
              y !== null &&
                ((x = qt(y)), y !== x || (y.tag !== 5 && y.tag !== 6)) &&
                (y = null))
            : ((m = null), (y = a)),
          m !== y)
        ) {
          if (
            ((g = Do),
            (w = 'onMouseLeave'),
            (f = 'onMouseEnter'),
            (c = 'mouse'),
            (e === 'pointerout' || e === 'pointerover') &&
              ((g = Io),
              (w = 'onPointerLeave'),
              (f = 'onPointerEnter'),
              (c = 'pointer')),
            (x = m == null ? v : nn(m)),
            (d = y == null ? v : nn(y)),
            (v = new g(w, c + 'leave', m, n, h)),
            (v.target = x),
            (v.relatedTarget = d),
            (w = null),
            zt(h) === a &&
              ((g = new g(f, c + 'enter', y, n, h)),
              (g.target = d),
              (g.relatedTarget = x),
              (w = g)),
            (x = w),
            m && y)
          )
            t: {
              for (g = m, f = y, c = 0, d = g; d; d = Xt(d)) c++;
              for (d = 0, w = f; w; w = Xt(w)) d++;
              for (; 0 < c - d; ) ((g = Xt(g)), c--);
              for (; 0 < d - c; ) ((f = Xt(f)), d--);
              for (; c--; ) {
                if (g === f || (f !== null && g === f.alternate)) break t;
                ((g = Xt(g)), (f = Xt(f)));
              }
              g = null;
            }
          else g = null;
          (m !== null && Go(p, v, m, g, !1),
            y !== null && x !== null && Go(p, x, y, g, !0));
        }
      }
      e: {
        if (
          ((v = a ? nn(a) : window),
          (m = v.nodeName && v.nodeName.toLowerCase()),
          m === 'select' || (m === 'input' && v.type === 'file'))
        )
          var C = Jd;
        else if (Ao(v))
          if ($a) C = np;
          else {
            C = ep;
            var E = bd;
          }
        else
          (m = v.nodeName) &&
            m.toLowerCase() === 'input' &&
            (v.type === 'checkbox' || v.type === 'radio') &&
            (C = tp);
        if (C && (C = C(e, a))) {
          Ua(p, C, n, h);
          break e;
        }
        (E && E(e, v, a),
          e === 'focusout' &&
            (E = v._wrapperState) &&
            E.controlled &&
            v.type === 'number' &&
            Li(v, 'number', v.value));
      }
      switch (((E = a ? nn(a) : window), e)) {
        case 'focusin':
          (Ao(E) || E.contentEditable === 'true') &&
            ((en = E), (Wi = a), (Wn = null));
          break;
        case 'focusout':
          Wn = Wi = en = null;
          break;
        case 'mousedown':
          Vi = !0;
          break;
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          ((Vi = !1), Ho(p, n, h));
          break;
        case 'selectionchange':
          if (ip) break;
        case 'keydown':
        case 'keyup':
          Ho(p, n, h);
      }
      var O;
      if ($u)
        e: {
          switch (e) {
            case 'compositionstart':
              var N = 'onCompositionStart';
              break e;
            case 'compositionend':
              N = 'onCompositionEnd';
              break e;
            case 'compositionupdate':
              N = 'onCompositionUpdate';
              break e;
          }
          N = void 0;
        }
      else
        bt
          ? ja(e, n) && (N = 'onCompositionEnd')
          : e === 'keydown' && n.keyCode === 229 && (N = 'onCompositionStart');
      (N &&
        (Da &&
          n.locale !== 'ko' &&
          (bt || N !== 'onCompositionStart'
            ? N === 'onCompositionEnd' && bt && (O = za())
            : ((dt = h),
              (ju = 'value' in dt ? dt.value : dt.textContent),
              (bt = !0))),
        (E = il(a, N)),
        0 < E.length &&
          ((N = new jo(N, e, null, n, h)),
          p.push({ event: N, listeners: E }),
          O ? (N.data = O) : ((O = Ia(n)), O !== null && (N.data = O)))),
        (O = qd ? Gd(e, n) : Yd(e, n)) &&
          ((a = il(a, 'onBeforeInput')),
          0 < a.length &&
            ((h = new jo('onBeforeInput', 'beforeinput', null, n, h)),
            p.push({ event: h, listeners: a }),
            (h.data = O))));
    }
    Ya(p, t);
  });
}
function rr(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function il(e, t) {
  for (var n = t + 'Capture', r = []; e !== null; ) {
    var l = e,
      i = l.stateNode;
    (l.tag === 5 &&
      i !== null &&
      ((l = i),
      (i = Xn(e, n)),
      i != null && r.unshift(rr(e, i, l)),
      (i = Xn(e, t)),
      i != null && r.push(rr(e, i, l))),
      (e = e.return));
  }
  return r;
}
function Xt(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Go(e, t, n, r, l) {
  for (var i = t._reactName, u = []; n !== null && n !== r; ) {
    var o = n,
      s = o.alternate,
      a = o.stateNode;
    if (s !== null && s === r) break;
    (o.tag === 5 &&
      a !== null &&
      ((o = a),
      l
        ? ((s = Xn(n, i)), s != null && u.unshift(rr(n, s, o)))
        : l || ((s = Xn(n, i)), s != null && u.push(rr(n, s, o)))),
      (n = n.return));
  }
  u.length !== 0 && e.push({ event: t, listeners: u });
}
var ap = /\r\n?/g,
  cp = /\u0000|\uFFFD/g;
function Yo(e) {
  return (typeof e == 'string' ? e : '' + e)
    .replace(
      ap,
      `
`
    )
    .replace(cp, '');
}
function Lr(e, t, n) {
  if (((t = Yo(t)), Yo(e) !== t && n)) throw Error(S(425));
}
function ul() {}
var Hi = null,
  Ki = null;
function qi(e, t) {
  return (
    e === 'textarea' ||
    e === 'noscript' ||
    typeof t.children == 'string' ||
    typeof t.children == 'number' ||
    (typeof t.dangerouslySetInnerHTML == 'object' &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Gi = typeof setTimeout == 'function' ? setTimeout : void 0,
  fp = typeof clearTimeout == 'function' ? clearTimeout : void 0,
  Xo = typeof Promise == 'function' ? Promise : void 0,
  dp =
    typeof queueMicrotask == 'function'
      ? queueMicrotask
      : typeof Xo < 'u'
        ? function (e) {
            return Xo.resolve(null).then(e).catch(pp);
          }
        : Gi;
function pp(e) {
  setTimeout(function () {
    throw e;
  });
}
function ci(e, t) {
  var n = t,
    r = 0;
  do {
    var l = n.nextSibling;
    if ((e.removeChild(n), l && l.nodeType === 8))
      if (((n = l.data), n === '/$')) {
        if (r === 0) {
          (e.removeChild(l), bn(t));
          return;
        }
        r--;
      } else (n !== '$' && n !== '$?' && n !== '$!') || r++;
    n = l;
  } while (n);
  bn(t);
}
function gt(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === '$' || t === '$!' || t === '$?')) break;
      if (t === '/$') return null;
    }
  }
  return e;
}
function Zo(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === '$' || n === '$!' || n === '$?') {
        if (t === 0) return e;
        t--;
      } else n === '/$' && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Pn = Math.random().toString(36).slice(2),
  Ve = '__reactFiber$' + Pn,
  lr = '__reactProps$' + Pn,
  et = '__reactContainer$' + Pn,
  Yi = '__reactEvents$' + Pn,
  hp = '__reactListeners$' + Pn,
  vp = '__reactHandles$' + Pn;
function zt(e) {
  var t = e[Ve];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[et] || n[Ve])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Zo(e); e !== null; ) {
          if ((n = e[Ve])) return n;
          e = Zo(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function mr(e) {
  return (
    (e = e[Ve] || e[et]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function nn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(S(33));
}
function Ll(e) {
  return e[lr] || null;
}
var Xi = [],
  rn = -1;
function Ot(e) {
  return { current: e };
}
function A(e) {
  0 > rn || ((e.current = Xi[rn]), (Xi[rn] = null), rn--);
}
function I(e, t) {
  (rn++, (Xi[rn] = e.current), (e.current = t));
}
var Pt = {},
  se = Ot(Pt),
  ge = Ot(!1),
  Qt = Pt;
function yn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Pt;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    i;
  for (i in n) l[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    l
  );
}
function we(e) {
  return ((e = e.childContextTypes), e != null);
}
function ol() {
  (A(ge), A(se));
}
function Jo(e, t, n) {
  if (se.current !== Pt) throw Error(S(168));
  (I(se, t), I(ge, n));
}
function Za(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != 'function'))
    return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(S(108, bf(e) || 'Unknown', l));
  return H({}, n, r);
}
function sl(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Pt),
    (Qt = se.current),
    I(se, e),
    I(ge, ge.current),
    !0
  );
}
function bo(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(S(169));
  (n
    ? ((e = Za(e, t, Qt)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      A(ge),
      A(se),
      I(se, e))
    : A(ge),
    I(ge, n));
}
var Ye = null,
  Tl = !1,
  fi = !1;
function Ja(e) {
  Ye === null ? (Ye = [e]) : Ye.push(e);
}
function mp(e) {
  ((Tl = !0), Ja(e));
}
function Nt() {
  if (!fi && Ye !== null) {
    fi = !0;
    var e = 0,
      t = j;
    try {
      var n = Ye;
      for (j = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      ((Ye = null), (Tl = !1));
    } catch (l) {
      throw (Ye !== null && (Ye = Ye.slice(e + 1)), ka(Tu, Nt), l);
    } finally {
      ((j = t), (fi = !1));
    }
  }
  return null;
}
var ln = [],
  un = 0,
  al = null,
  cl = 0,
  Ne = [],
  Fe = 0,
  Bt = null,
  Xe = 1,
  Ze = '';
function Tt(e, t) {
  ((ln[un++] = cl), (ln[un++] = al), (al = e), (cl = t));
}
function ba(e, t, n) {
  ((Ne[Fe++] = Xe), (Ne[Fe++] = Ze), (Ne[Fe++] = Bt), (Bt = e));
  var r = Xe;
  e = Ze;
  var l = 32 - $e(r) - 1;
  ((r &= ~(1 << l)), (n += 1));
  var i = 32 - $e(t) + l;
  if (30 < i) {
    var u = l - (l % 5);
    ((i = (r & ((1 << u) - 1)).toString(32)),
      (r >>= u),
      (l -= u),
      (Xe = (1 << (32 - $e(t) + l)) | (n << l) | r),
      (Ze = i + e));
  } else ((Xe = (1 << i) | (n << l) | r), (Ze = e));
}
function Qu(e) {
  e.return !== null && (Tt(e, 1), ba(e, 1, 0));
}
function Bu(e) {
  for (; e === al; )
    ((al = ln[--un]), (ln[un] = null), (cl = ln[--un]), (ln[un] = null));
  for (; e === Bt; )
    ((Bt = Ne[--Fe]),
      (Ne[Fe] = null),
      (Ze = Ne[--Fe]),
      (Ne[Fe] = null),
      (Xe = Ne[--Fe]),
      (Ne[Fe] = null));
}
var Ee = null,
  ke = null,
  B = !1,
  Ue = null;
function ec(e, t) {
  var n = Re(5, null, null, 0);
  ((n.elementType = 'DELETED'),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function es(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Ee = e), (ke = gt(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === '' || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Ee = e), (ke = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Bt !== null ? { id: Xe, overflow: Ze } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = Re(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Ee = e),
            (ke = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Zi(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ji(e) {
  if (B) {
    var t = ke;
    if (t) {
      var n = t;
      if (!es(e, t)) {
        if (Zi(e)) throw Error(S(418));
        t = gt(n.nextSibling);
        var r = Ee;
        t && es(e, t)
          ? ec(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (B = !1), (Ee = e));
      }
    } else {
      if (Zi(e)) throw Error(S(418));
      ((e.flags = (e.flags & -4097) | 2), (B = !1), (Ee = e));
    }
  }
}
function ts(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Ee = e;
}
function Tr(e) {
  if (e !== Ee) return !1;
  if (!B) return (ts(e), (B = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== 'head' && t !== 'body' && !qi(e.type, e.memoizedProps))),
    t && (t = ke))
  ) {
    if (Zi(e)) throw (tc(), Error(S(418)));
    for (; t; ) (ec(e, t), (t = gt(t.nextSibling)));
  }
  if ((ts(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(S(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === '/$') {
            if (t === 0) {
              ke = gt(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== '$' && n !== '$!' && n !== '$?') || t++;
        }
        e = e.nextSibling;
      }
      ke = null;
    }
  } else ke = Ee ? gt(e.stateNode.nextSibling) : null;
  return !0;
}
function tc() {
  for (var e = ke; e; ) e = gt(e.nextSibling);
}
function gn() {
  ((ke = Ee = null), (B = !1));
}
function Wu(e) {
  Ue === null ? (Ue = [e]) : Ue.push(e);
}
var yp = rt.ReactCurrentBatchConfig;
function Tn(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != 'function' && typeof e != 'object')
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(S(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(S(147, e));
      var l = r,
        i = '' + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == 'function' &&
        t.ref._stringRef === i
        ? t.ref
        : ((t = function (u) {
            var o = l.refs;
            u === null ? delete o[i] : (o[i] = u);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != 'string') throw Error(S(284));
    if (!n._owner) throw Error(S(290, e));
  }
  return e;
}
function Mr(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      S(
        31,
        e === '[object Object]'
          ? 'object with keys {' + Object.keys(t).join(', ') + '}'
          : e
      )
    )
  );
}
function ns(e) {
  var t = e._init;
  return t(e._payload);
}
function nc(e) {
  function t(f, c) {
    if (e) {
      var d = f.deletions;
      d === null ? ((f.deletions = [c]), (f.flags |= 16)) : d.push(c);
    }
  }
  function n(f, c) {
    if (!e) return null;
    for (; c !== null; ) (t(f, c), (c = c.sibling));
    return null;
  }
  function r(f, c) {
    for (f = new Map(); c !== null; )
      (c.key !== null ? f.set(c.key, c) : f.set(c.index, c), (c = c.sibling));
    return f;
  }
  function l(f, c) {
    return ((f = xt(f, c)), (f.index = 0), (f.sibling = null), f);
  }
  function i(f, c, d) {
    return (
      (f.index = d),
      e
        ? ((d = f.alternate),
          d !== null
            ? ((d = d.index), d < c ? ((f.flags |= 2), c) : d)
            : ((f.flags |= 2), c))
        : ((f.flags |= 1048576), c)
    );
  }
  function u(f) {
    return (e && f.alternate === null && (f.flags |= 2), f);
  }
  function o(f, c, d, w) {
    return c === null || c.tag !== 6
      ? ((c = gi(d, f.mode, w)), (c.return = f), c)
      : ((c = l(c, d)), (c.return = f), c);
  }
  function s(f, c, d, w) {
    var C = d.type;
    return C === Jt
      ? h(f, c, d.props.children, w, d.key)
      : c !== null &&
          (c.elementType === C ||
            (typeof C == 'object' &&
              C !== null &&
              C.$$typeof === ot &&
              ns(C) === c.type))
        ? ((w = l(c, d.props)), (w.ref = Tn(f, c, d)), (w.return = f), w)
        : ((w = Yr(d.type, d.key, d.props, null, f.mode, w)),
          (w.ref = Tn(f, c, d)),
          (w.return = f),
          w);
  }
  function a(f, c, d, w) {
    return c === null ||
      c.tag !== 4 ||
      c.stateNode.containerInfo !== d.containerInfo ||
      c.stateNode.implementation !== d.implementation
      ? ((c = wi(d, f.mode, w)), (c.return = f), c)
      : ((c = l(c, d.children || [])), (c.return = f), c);
  }
  function h(f, c, d, w, C) {
    return c === null || c.tag !== 7
      ? ((c = At(d, f.mode, w, C)), (c.return = f), c)
      : ((c = l(c, d)), (c.return = f), c);
  }
  function p(f, c, d) {
    if ((typeof c == 'string' && c !== '') || typeof c == 'number')
      return ((c = gi('' + c, f.mode, d)), (c.return = f), c);
    if (typeof c == 'object' && c !== null) {
      switch (c.$$typeof) {
        case xr:
          return (
            (d = Yr(c.type, c.key, c.props, null, f.mode, d)),
            (d.ref = Tn(f, null, c)),
            (d.return = f),
            d
          );
        case Zt:
          return ((c = wi(c, f.mode, d)), (c.return = f), c);
        case ot:
          var w = c._init;
          return p(f, w(c._payload), d);
      }
      if (jn(c) || On(c))
        return ((c = At(c, f.mode, d, null)), (c.return = f), c);
      Mr(f, c);
    }
    return null;
  }
  function v(f, c, d, w) {
    var C = c !== null ? c.key : null;
    if ((typeof d == 'string' && d !== '') || typeof d == 'number')
      return C !== null ? null : o(f, c, '' + d, w);
    if (typeof d == 'object' && d !== null) {
      switch (d.$$typeof) {
        case xr:
          return d.key === C ? s(f, c, d, w) : null;
        case Zt:
          return d.key === C ? a(f, c, d, w) : null;
        case ot:
          return ((C = d._init), v(f, c, C(d._payload), w));
      }
      if (jn(d) || On(d)) return C !== null ? null : h(f, c, d, w, null);
      Mr(f, d);
    }
    return null;
  }
  function m(f, c, d, w, C) {
    if ((typeof w == 'string' && w !== '') || typeof w == 'number')
      return ((f = f.get(d) || null), o(c, f, '' + w, C));
    if (typeof w == 'object' && w !== null) {
      switch (w.$$typeof) {
        case xr:
          return (
            (f = f.get(w.key === null ? d : w.key) || null),
            s(c, f, w, C)
          );
        case Zt:
          return (
            (f = f.get(w.key === null ? d : w.key) || null),
            a(c, f, w, C)
          );
        case ot:
          var E = w._init;
          return m(f, c, d, E(w._payload), C);
      }
      if (jn(w) || On(w)) return ((f = f.get(d) || null), h(c, f, w, C, null));
      Mr(c, w);
    }
    return null;
  }
  function y(f, c, d, w) {
    for (
      var C = null, E = null, O = c, N = (c = 0), Q = null;
      O !== null && N < d.length;
      N++
    ) {
      O.index > N ? ((Q = O), (O = null)) : (Q = O.sibling);
      var T = v(f, O, d[N], w);
      if (T === null) {
        O === null && (O = Q);
        break;
      }
      (e && O && T.alternate === null && t(f, O),
        (c = i(T, c, N)),
        E === null ? (C = T) : (E.sibling = T),
        (E = T),
        (O = Q));
    }
    if (N === d.length) return (n(f, O), B && Tt(f, N), C);
    if (O === null) {
      for (; N < d.length; N++)
        ((O = p(f, d[N], w)),
          O !== null &&
            ((c = i(O, c, N)),
            E === null ? (C = O) : (E.sibling = O),
            (E = O)));
      return (B && Tt(f, N), C);
    }
    for (O = r(f, O); N < d.length; N++)
      ((Q = m(O, f, N, d[N], w)),
        Q !== null &&
          (e && Q.alternate !== null && O.delete(Q.key === null ? N : Q.key),
          (c = i(Q, c, N)),
          E === null ? (C = Q) : (E.sibling = Q),
          (E = Q)));
    return (
      e &&
        O.forEach(function (he) {
          return t(f, he);
        }),
      B && Tt(f, N),
      C
    );
  }
  function g(f, c, d, w) {
    var C = On(d);
    if (typeof C != 'function') throw Error(S(150));
    if (((d = C.call(d)), d == null)) throw Error(S(151));
    for (
      var E = (C = null), O = c, N = (c = 0), Q = null, T = d.next();
      O !== null && !T.done;
      N++, T = d.next()
    ) {
      O.index > N ? ((Q = O), (O = null)) : (Q = O.sibling);
      var he = v(f, O, T.value, w);
      if (he === null) {
        O === null && (O = Q);
        break;
      }
      (e && O && he.alternate === null && t(f, O),
        (c = i(he, c, N)),
        E === null ? (C = he) : (E.sibling = he),
        (E = he),
        (O = Q));
    }
    if (T.done) return (n(f, O), B && Tt(f, N), C);
    if (O === null) {
      for (; !T.done; N++, T = d.next())
        ((T = p(f, T.value, w)),
          T !== null &&
            ((c = i(T, c, N)),
            E === null ? (C = T) : (E.sibling = T),
            (E = T)));
      return (B && Tt(f, N), C);
    }
    for (O = r(f, O); !T.done; N++, T = d.next())
      ((T = m(O, f, N, T.value, w)),
        T !== null &&
          (e && T.alternate !== null && O.delete(T.key === null ? N : T.key),
          (c = i(T, c, N)),
          E === null ? (C = T) : (E.sibling = T),
          (E = T)));
    return (
      e &&
        O.forEach(function (Ft) {
          return t(f, Ft);
        }),
      B && Tt(f, N),
      C
    );
  }
  function x(f, c, d, w) {
    if (
      (typeof d == 'object' &&
        d !== null &&
        d.type === Jt &&
        d.key === null &&
        (d = d.props.children),
      typeof d == 'object' && d !== null)
    ) {
      switch (d.$$typeof) {
        case xr:
          e: {
            for (var C = d.key, E = c; E !== null; ) {
              if (E.key === C) {
                if (((C = d.type), C === Jt)) {
                  if (E.tag === 7) {
                    (n(f, E.sibling),
                      (c = l(E, d.props.children)),
                      (c.return = f),
                      (f = c));
                    break e;
                  }
                } else if (
                  E.elementType === C ||
                  (typeof C == 'object' &&
                    C !== null &&
                    C.$$typeof === ot &&
                    ns(C) === E.type)
                ) {
                  (n(f, E.sibling),
                    (c = l(E, d.props)),
                    (c.ref = Tn(f, E, d)),
                    (c.return = f),
                    (f = c));
                  break e;
                }
                n(f, E);
                break;
              } else t(f, E);
              E = E.sibling;
            }
            d.type === Jt
              ? ((c = At(d.props.children, f.mode, w, d.key)),
                (c.return = f),
                (f = c))
              : ((w = Yr(d.type, d.key, d.props, null, f.mode, w)),
                (w.ref = Tn(f, c, d)),
                (w.return = f),
                (f = w));
          }
          return u(f);
        case Zt:
          e: {
            for (E = d.key; c !== null; ) {
              if (c.key === E)
                if (
                  c.tag === 4 &&
                  c.stateNode.containerInfo === d.containerInfo &&
                  c.stateNode.implementation === d.implementation
                ) {
                  (n(f, c.sibling),
                    (c = l(c, d.children || [])),
                    (c.return = f),
                    (f = c));
                  break e;
                } else {
                  n(f, c);
                  break;
                }
              else t(f, c);
              c = c.sibling;
            }
            ((c = wi(d, f.mode, w)), (c.return = f), (f = c));
          }
          return u(f);
        case ot:
          return ((E = d._init), x(f, c, E(d._payload), w));
      }
      if (jn(d)) return y(f, c, d, w);
      if (On(d)) return g(f, c, d, w);
      Mr(f, d);
    }
    return (typeof d == 'string' && d !== '') || typeof d == 'number'
      ? ((d = '' + d),
        c !== null && c.tag === 6
          ? (n(f, c.sibling), (c = l(c, d)), (c.return = f), (f = c))
          : (n(f, c), (c = gi(d, f.mode, w)), (c.return = f), (f = c)),
        u(f))
      : n(f, c);
  }
  return x;
}
var wn = nc(!0),
  rc = nc(!1),
  fl = Ot(null),
  dl = null,
  on = null,
  Vu = null;
function Hu() {
  Vu = on = dl = null;
}
function Ku(e) {
  var t = fl.current;
  (A(fl), (e._currentValue = t));
}
function bi(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function hn(e, t) {
  ((dl = e),
    (Vu = on = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (ye = !0), (e.firstContext = null)));
}
function Te(e) {
  var t = e._currentValue;
  if (Vu !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), on === null)) {
      if (dl === null) throw Error(S(308));
      ((on = e), (dl.dependencies = { lanes: 0, firstContext: e }));
    } else on = on.next = e;
  return t;
}
var Dt = null;
function qu(e) {
  Dt === null ? (Dt = [e]) : Dt.push(e);
}
function lc(e, t, n, r) {
  var l = t.interleaved;
  return (
    l === null ? ((n.next = n), qu(t)) : ((n.next = l.next), (l.next = n)),
    (t.interleaved = n),
    tt(e, r)
  );
}
function tt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var st = !1;
function Gu(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function ic(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function Je(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function wt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), z & 2)) {
    var l = r.pending;
    return (
      l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
      (r.pending = t),
      tt(e, n)
    );
  }
  return (
    (l = r.interleaved),
    l === null ? ((t.next = t), qu(r)) : ((t.next = l.next), (l.next = t)),
    (r.interleaved = t),
    tt(e, n)
  );
}
function Wr(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Mu(e, n));
  }
}
function rs(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var l = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var u = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (i === null ? (l = i = u) : (i = i.next = u), (n = n.next));
      } while (n !== null);
      i === null ? (l = i = t) : (i = i.next = t);
    } else l = i = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function pl(e, t, n, r) {
  var l = e.updateQueue;
  st = !1;
  var i = l.firstBaseUpdate,
    u = l.lastBaseUpdate,
    o = l.shared.pending;
  if (o !== null) {
    l.shared.pending = null;
    var s = o,
      a = s.next;
    ((s.next = null), u === null ? (i = a) : (u.next = a), (u = s));
    var h = e.alternate;
    h !== null &&
      ((h = h.updateQueue),
      (o = h.lastBaseUpdate),
      o !== u &&
        (o === null ? (h.firstBaseUpdate = a) : (o.next = a),
        (h.lastBaseUpdate = s)));
  }
  if (i !== null) {
    var p = l.baseState;
    ((u = 0), (h = a = s = null), (o = i));
    do {
      var v = o.lane,
        m = o.eventTime;
      if ((r & v) === v) {
        h !== null &&
          (h = h.next =
            {
              eventTime: m,
              lane: 0,
              tag: o.tag,
              payload: o.payload,
              callback: o.callback,
              next: null,
            });
        e: {
          var y = e,
            g = o;
          switch (((v = t), (m = n), g.tag)) {
            case 1:
              if (((y = g.payload), typeof y == 'function')) {
                p = y.call(m, p, v);
                break e;
              }
              p = y;
              break e;
            case 3:
              y.flags = (y.flags & -65537) | 128;
            case 0:
              if (
                ((y = g.payload),
                (v = typeof y == 'function' ? y.call(m, p, v) : y),
                v == null)
              )
                break e;
              p = H({}, p, v);
              break e;
            case 2:
              st = !0;
          }
        }
        o.callback !== null &&
          o.lane !== 0 &&
          ((e.flags |= 64),
          (v = l.effects),
          v === null ? (l.effects = [o]) : v.push(o));
      } else
        ((m = {
          eventTime: m,
          lane: v,
          tag: o.tag,
          payload: o.payload,
          callback: o.callback,
          next: null,
        }),
          h === null ? ((a = h = m), (s = p)) : (h = h.next = m),
          (u |= v));
      if (((o = o.next), o === null)) {
        if (((o = l.shared.pending), o === null)) break;
        ((v = o),
          (o = v.next),
          (v.next = null),
          (l.lastBaseUpdate = v),
          (l.shared.pending = null));
      }
    } while (!0);
    if (
      (h === null && (s = p),
      (l.baseState = s),
      (l.firstBaseUpdate = a),
      (l.lastBaseUpdate = h),
      (t = l.shared.interleaved),
      t !== null)
    ) {
      l = t;
      do ((u |= l.lane), (l = l.next));
      while (l !== t);
    } else i === null && (l.shared.lanes = 0);
    ((Vt |= u), (e.lanes = u), (e.memoizedState = p));
  }
}
function ls(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        l = r.callback;
      if (l !== null) {
        if (((r.callback = null), (r = n), typeof l != 'function'))
          throw Error(S(191, l));
        l.call(r);
      }
    }
}
var yr = {},
  Ke = Ot(yr),
  ir = Ot(yr),
  ur = Ot(yr);
function jt(e) {
  if (e === yr) throw Error(S(174));
  return e;
}
function Yu(e, t) {
  switch ((I(ur, t), I(ir, e), I(Ke, yr), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Mi(null, '');
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Mi(t, e)));
  }
  (A(Ke), I(Ke, t));
}
function Sn() {
  (A(Ke), A(ir), A(ur));
}
function uc(e) {
  jt(ur.current);
  var t = jt(Ke.current),
    n = Mi(t, e.type);
  t !== n && (I(ir, e), I(Ke, n));
}
function Xu(e) {
  ir.current === e && (A(Ke), A(ir));
}
var W = Ot(0);
function hl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === '$?' || n.data === '$!')
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var di = [];
function Zu() {
  for (var e = 0; e < di.length; e++)
    di[e]._workInProgressVersionPrimary = null;
  di.length = 0;
}
var Vr = rt.ReactCurrentDispatcher,
  pi = rt.ReactCurrentBatchConfig,
  Wt = 0,
  V = null,
  Z = null,
  b = null,
  vl = !1,
  Vn = !1,
  or = 0,
  gp = 0;
function ie() {
  throw Error(S(321));
}
function Ju(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!Qe(e[n], t[n])) return !1;
  return !0;
}
function bu(e, t, n, r, l, i) {
  if (
    ((Wt = i),
    (V = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Vr.current = e === null || e.memoizedState === null ? xp : kp),
    (e = n(r, l)),
    Vn)
  ) {
    i = 0;
    do {
      if (((Vn = !1), (or = 0), 25 <= i)) throw Error(S(301));
      ((i += 1),
        (b = Z = null),
        (t.updateQueue = null),
        (Vr.current = Ep),
        (e = n(r, l)));
    } while (Vn);
  }
  if (
    ((Vr.current = ml),
    (t = Z !== null && Z.next !== null),
    (Wt = 0),
    (b = Z = V = null),
    (vl = !1),
    t)
  )
    throw Error(S(300));
  return e;
}
function eo() {
  var e = or !== 0;
  return ((or = 0), e);
}
function We() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (b === null ? (V.memoizedState = b = e) : (b = b.next = e), b);
}
function Me() {
  if (Z === null) {
    var e = V.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Z.next;
  var t = b === null ? V.memoizedState : b.next;
  if (t !== null) ((b = t), (Z = e));
  else {
    if (e === null) throw Error(S(310));
    ((Z = e),
      (e = {
        memoizedState: Z.memoizedState,
        baseState: Z.baseState,
        baseQueue: Z.baseQueue,
        queue: Z.queue,
        next: null,
      }),
      b === null ? (V.memoizedState = b = e) : (b = b.next = e));
  }
  return b;
}
function sr(e, t) {
  return typeof t == 'function' ? t(e) : t;
}
function hi(e) {
  var t = Me(),
    n = t.queue;
  if (n === null) throw Error(S(311));
  n.lastRenderedReducer = e;
  var r = Z,
    l = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (l !== null) {
      var u = l.next;
      ((l.next = i.next), (i.next = u));
    }
    ((r.baseQueue = l = i), (n.pending = null));
  }
  if (l !== null) {
    ((i = l.next), (r = r.baseState));
    var o = (u = null),
      s = null,
      a = i;
    do {
      var h = a.lane;
      if ((Wt & h) === h)
        (s !== null &&
          (s = s.next =
            {
              lane: 0,
              action: a.action,
              hasEagerState: a.hasEagerState,
              eagerState: a.eagerState,
              next: null,
            }),
          (r = a.hasEagerState ? a.eagerState : e(r, a.action)));
      else {
        var p = {
          lane: h,
          action: a.action,
          hasEagerState: a.hasEagerState,
          eagerState: a.eagerState,
          next: null,
        };
        (s === null ? ((o = s = p), (u = r)) : (s = s.next = p),
          (V.lanes |= h),
          (Vt |= h));
      }
      a = a.next;
    } while (a !== null && a !== i);
    (s === null ? (u = r) : (s.next = o),
      Qe(r, t.memoizedState) || (ye = !0),
      (t.memoizedState = r),
      (t.baseState = u),
      (t.baseQueue = s),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    l = e;
    do ((i = l.lane), (V.lanes |= i), (Vt |= i), (l = l.next));
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function vi(e) {
  var t = Me(),
    n = t.queue;
  if (n === null) throw Error(S(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    l = n.pending,
    i = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var u = (l = l.next);
    do ((i = e(i, u.action)), (u = u.next));
    while (u !== l);
    (Qe(i, t.memoizedState) || (ye = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i));
  }
  return [i, r];
}
function oc() {}
function sc(e, t) {
  var n = V,
    r = Me(),
    l = t(),
    i = !Qe(r.memoizedState, l);
  if (
    (i && ((r.memoizedState = l), (ye = !0)),
    (r = r.queue),
    to(fc.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (b !== null && b.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      ar(9, cc.bind(null, n, r, l, t), void 0, null),
      ee === null)
    )
      throw Error(S(349));
    Wt & 30 || ac(n, t, l);
  }
  return l;
}
function ac(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = V.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (V.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function cc(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), dc(t) && pc(e));
}
function fc(e, t, n) {
  return n(function () {
    dc(t) && pc(e);
  });
}
function dc(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Qe(e, n);
  } catch {
    return !0;
  }
}
function pc(e) {
  var t = tt(e, 1);
  t !== null && Ae(t, e, 1, -1);
}
function is(e) {
  var t = We();
  return (
    typeof e == 'function' && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: sr,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = Cp.bind(null, V, e)),
    [t.memoizedState, e]
  );
}
function ar(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = V.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (V.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function hc() {
  return Me().memoizedState;
}
function Hr(e, t, n, r) {
  var l = We();
  ((V.flags |= e),
    (l.memoizedState = ar(1 | t, n, void 0, r === void 0 ? null : r)));
}
function Ml(e, t, n, r) {
  var l = Me();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Z !== null) {
    var u = Z.memoizedState;
    if (((i = u.destroy), r !== null && Ju(r, u.deps))) {
      l.memoizedState = ar(t, n, i, r);
      return;
    }
  }
  ((V.flags |= e), (l.memoizedState = ar(1 | t, n, i, r)));
}
function us(e, t) {
  return Hr(8390656, 8, e, t);
}
function to(e, t) {
  return Ml(2048, 8, e, t);
}
function vc(e, t) {
  return Ml(4, 2, e, t);
}
function mc(e, t) {
  return Ml(4, 4, e, t);
}
function yc(e, t) {
  if (typeof t == 'function')
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function gc(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null),
    Ml(4, 4, yc.bind(null, t, e), n)
  );
}
function no() {}
function wc(e, t) {
  var n = Me();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ju(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Sc(e, t) {
  var n = Me();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Ju(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function Cc(e, t, n) {
  return Wt & 21
    ? (Qe(n, t) || ((n = _a()), (V.lanes |= n), (Vt |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (ye = !0)), (e.memoizedState = n));
}
function wp(e, t) {
  var n = j;
  ((j = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = pi.transition;
  pi.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((j = n), (pi.transition = r));
  }
}
function xc() {
  return Me().memoizedState;
}
function Sp(e, t, n) {
  var r = Ct(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    kc(e))
  )
    Ec(t, n);
  else if (((n = lc(e, t, n, r)), n !== null)) {
    var l = fe();
    (Ae(n, e, r, l), Pc(n, t, r));
  }
}
function Cp(e, t, n) {
  var r = Ct(e),
    l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (kc(e)) Ec(t, l);
  else {
    var i = e.alternate;
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var u = t.lastRenderedState,
          o = i(u, n);
        if (((l.hasEagerState = !0), (l.eagerState = o), Qe(o, u))) {
          var s = t.interleaved;
          (s === null
            ? ((l.next = l), qu(t))
            : ((l.next = s.next), (s.next = l)),
            (t.interleaved = l));
          return;
        }
      } catch {
      } finally {
      }
    ((n = lc(e, t, l, r)),
      n !== null && ((l = fe()), Ae(n, e, r, l), Pc(n, t, r)));
  }
}
function kc(e) {
  var t = e.alternate;
  return e === V || (t !== null && t === V);
}
function Ec(e, t) {
  Vn = vl = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t));
}
function Pc(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Mu(e, n));
  }
}
var ml = {
    readContext: Te,
    useCallback: ie,
    useContext: ie,
    useEffect: ie,
    useImperativeHandle: ie,
    useInsertionEffect: ie,
    useLayoutEffect: ie,
    useMemo: ie,
    useReducer: ie,
    useRef: ie,
    useState: ie,
    useDebugValue: ie,
    useDeferredValue: ie,
    useTransition: ie,
    useMutableSource: ie,
    useSyncExternalStore: ie,
    useId: ie,
    unstable_isNewReconciler: !1,
  },
  xp = {
    readContext: Te,
    useCallback: function (e, t) {
      return ((We().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: Te,
    useEffect: us,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Hr(4194308, 4, yc.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Hr(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Hr(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = We();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (n.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, n) {
      var r = We();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = Sp.bind(null, V, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = We();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: is,
    useDebugValue: no,
    useDeferredValue: function (e) {
      return (We().memoizedState = e);
    },
    useTransition: function () {
      var e = is(!1),
        t = e[0];
      return ((e = wp.bind(null, e[1])), (We().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = V,
        l = We();
      if (B) {
        if (n === void 0) throw Error(S(407));
        n = n();
      } else {
        if (((n = t()), ee === null)) throw Error(S(349));
        Wt & 30 || ac(r, t, n);
      }
      l.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (l.queue = i),
        us(fc.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        ar(9, cc.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = We(),
        t = ee.identifierPrefix;
      if (B) {
        var n = Ze,
          r = Xe;
        ((n = (r & ~(1 << (32 - $e(r) - 1))).toString(32) + n),
          (t = ':' + t + 'R' + n),
          (n = or++),
          0 < n && (t += 'H' + n.toString(32)),
          (t += ':'));
      } else ((n = gp++), (t = ':' + t + 'r' + n.toString(32) + ':'));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  kp = {
    readContext: Te,
    useCallback: wc,
    useContext: Te,
    useEffect: to,
    useImperativeHandle: gc,
    useInsertionEffect: vc,
    useLayoutEffect: mc,
    useMemo: Sc,
    useReducer: hi,
    useRef: hc,
    useState: function () {
      return hi(sr);
    },
    useDebugValue: no,
    useDeferredValue: function (e) {
      var t = Me();
      return Cc(t, Z.memoizedState, e);
    },
    useTransition: function () {
      var e = hi(sr)[0],
        t = Me().memoizedState;
      return [e, t];
    },
    useMutableSource: oc,
    useSyncExternalStore: sc,
    useId: xc,
    unstable_isNewReconciler: !1,
  },
  Ep = {
    readContext: Te,
    useCallback: wc,
    useContext: Te,
    useEffect: to,
    useImperativeHandle: gc,
    useInsertionEffect: vc,
    useLayoutEffect: mc,
    useMemo: Sc,
    useReducer: vi,
    useRef: hc,
    useState: function () {
      return vi(sr);
    },
    useDebugValue: no,
    useDeferredValue: function (e) {
      var t = Me();
      return Z === null ? (t.memoizedState = e) : Cc(t, Z.memoizedState, e);
    },
    useTransition: function () {
      var e = vi(sr)[0],
        t = Me().memoizedState;
      return [e, t];
    },
    useMutableSource: oc,
    useSyncExternalStore: sc,
    useId: xc,
    unstable_isNewReconciler: !1,
  };
function je(e, t) {
  if (e && e.defaultProps) {
    ((t = H({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function eu(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : H({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var zl = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? qt(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = fe(),
      l = Ct(e),
      i = Je(r, l);
    ((i.payload = t),
      n != null && (i.callback = n),
      (t = wt(e, i, l)),
      t !== null && (Ae(t, e, l, r), Wr(t, e, l)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = fe(),
      l = Ct(e),
      i = Je(r, l);
    ((i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = wt(e, i, l)),
      t !== null && (Ae(t, e, l, r), Wr(t, e, l)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = fe(),
      r = Ct(e),
      l = Je(n, r);
    ((l.tag = 2),
      t != null && (l.callback = t),
      (t = wt(e, l, r)),
      t !== null && (Ae(t, e, r, n), Wr(t, e, r)));
  },
};
function os(e, t, n, r, l, i, u) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == 'function'
      ? e.shouldComponentUpdate(r, i, u)
      : t.prototype && t.prototype.isPureReactComponent
        ? !tr(n, r) || !tr(l, i)
        : !0
  );
}
function _c(e, t, n) {
  var r = !1,
    l = Pt,
    i = t.contextType;
  return (
    typeof i == 'object' && i !== null
      ? (i = Te(i))
      : ((l = we(t) ? Qt : se.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? yn(e, l) : Pt)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = zl),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = l),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function ss(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == 'function' &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && zl.enqueueReplaceState(t, t.state, null));
}
function tu(e, t, n, r) {
  var l = e.stateNode;
  ((l.props = n), (l.state = e.memoizedState), (l.refs = {}), Gu(e));
  var i = t.contextType;
  (typeof i == 'object' && i !== null
    ? (l.context = Te(i))
    : ((i = we(t) ? Qt : se.current), (l.context = yn(e, i))),
    (l.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == 'function' && (eu(e, t, i, n), (l.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == 'function' ||
      typeof l.getSnapshotBeforeUpdate == 'function' ||
      (typeof l.UNSAFE_componentWillMount != 'function' &&
        typeof l.componentWillMount != 'function') ||
      ((t = l.state),
      typeof l.componentWillMount == 'function' && l.componentWillMount(),
      typeof l.UNSAFE_componentWillMount == 'function' &&
        l.UNSAFE_componentWillMount(),
      t !== l.state && zl.enqueueReplaceState(l, l.state, null),
      pl(e, n, l, r),
      (l.state = e.memoizedState)),
    typeof l.componentDidMount == 'function' && (e.flags |= 4194308));
}
function Cn(e, t) {
  try {
    var n = '',
      r = t;
    do ((n += Jf(r)), (r = r.return));
    while (r);
    var l = n;
  } catch (i) {
    l =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function mi(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function nu(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Pp = typeof WeakMap == 'function' ? WeakMap : Map;
function Oc(e, t, n) {
  ((n = Je(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (gl || ((gl = !0), (du = r)), nu(e, t));
    }),
    n
  );
}
function Nc(e, t, n) {
  ((n = Je(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == 'function') {
    var l = t.value;
    ((n.payload = function () {
      return r(l);
    }),
      (n.callback = function () {
        nu(e, t);
      }));
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == 'function' &&
      (n.callback = function () {
        (nu(e, t),
          typeof r != 'function' &&
            (St === null ? (St = new Set([this])) : St.add(this)));
        var u = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: u !== null ? u : '',
        });
      }),
    n
  );
}
function as(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Pp();
    var l = new Set();
    r.set(t, l);
  } else ((l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l)));
  l.has(n) || (l.add(n), (e = $p.bind(null, e, t, n)), t.then(e, e));
}
function cs(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function fs(e, t, n, r, l) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = l), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Je(-1, 1)), (t.tag = 2), wt(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var _p = rt.ReactCurrentOwner,
  ye = !1;
function ce(e, t, n, r) {
  t.child = e === null ? rc(t, null, n, r) : wn(t, e.child, n, r);
}
function ds(e, t, n, r, l) {
  n = n.render;
  var i = t.ref;
  return (
    hn(t, l),
    (r = bu(e, t, n, r, i, l)),
    (n = eo()),
    e !== null && !ye
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        nt(e, t, l))
      : (B && n && Qu(t), (t.flags |= 1), ce(e, t, r, l), t.child)
  );
}
function ps(e, t, n, r, l) {
  if (e === null) {
    var i = n.type;
    return typeof i == 'function' &&
      !co(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), Fc(e, t, i, r, l))
      : ((e = Yr(n.type, null, r, t, t.mode, l)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((i = e.child), !(e.lanes & l))) {
    var u = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : tr), n(u, r) && e.ref === t.ref)
    )
      return nt(e, t, l);
  }
  return (
    (t.flags |= 1),
    (e = xt(i, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function Fc(e, t, n, r, l) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (tr(i, r) && e.ref === t.ref)
      if (((ye = !1), (t.pendingProps = r = i), (e.lanes & l) !== 0))
        e.flags & 131072 && (ye = !0);
      else return ((t.lanes = e.lanes), nt(e, t, l));
  }
  return ru(e, t, n, r, l);
}
function Rc(e, t, n) {
  var r = t.pendingProps,
    l = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === 'hidden')
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        I(an, xe),
        (xe |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          I(an, xe),
          (xe |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        I(an, xe),
        (xe |= r));
    }
  else
    (i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      I(an, xe),
      (xe |= r));
  return (ce(e, t, l, n), t.child);
}
function Lc(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function ru(e, t, n, r, l) {
  var i = we(n) ? Qt : se.current;
  return (
    (i = yn(t, i)),
    hn(t, l),
    (n = bu(e, t, n, r, i, l)),
    (r = eo()),
    e !== null && !ye
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        nt(e, t, l))
      : (B && r && Qu(t), (t.flags |= 1), ce(e, t, n, l), t.child)
  );
}
function hs(e, t, n, r, l) {
  if (we(n)) {
    var i = !0;
    sl(t);
  } else i = !1;
  if ((hn(t, l), t.stateNode === null))
    (Kr(e, t), _c(t, n, r), tu(t, n, r, l), (r = !0));
  else if (e === null) {
    var u = t.stateNode,
      o = t.memoizedProps;
    u.props = o;
    var s = u.context,
      a = n.contextType;
    typeof a == 'object' && a !== null
      ? (a = Te(a))
      : ((a = we(n) ? Qt : se.current), (a = yn(t, a)));
    var h = n.getDerivedStateFromProps,
      p =
        typeof h == 'function' ||
        typeof u.getSnapshotBeforeUpdate == 'function';
    (p ||
      (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof u.componentWillReceiveProps != 'function') ||
      ((o !== r || s !== a) && ss(t, u, r, a)),
      (st = !1));
    var v = t.memoizedState;
    ((u.state = v),
      pl(t, r, u, l),
      (s = t.memoizedState),
      o !== r || v !== s || ge.current || st
        ? (typeof h == 'function' && (eu(t, n, h, r), (s = t.memoizedState)),
          (o = st || os(t, n, o, r, v, s, a))
            ? (p ||
                (typeof u.UNSAFE_componentWillMount != 'function' &&
                  typeof u.componentWillMount != 'function') ||
                (typeof u.componentWillMount == 'function' &&
                  u.componentWillMount(),
                typeof u.UNSAFE_componentWillMount == 'function' &&
                  u.UNSAFE_componentWillMount()),
              typeof u.componentDidMount == 'function' && (t.flags |= 4194308))
            : (typeof u.componentDidMount == 'function' && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = s)),
          (u.props = r),
          (u.state = s),
          (u.context = a),
          (r = o))
        : (typeof u.componentDidMount == 'function' && (t.flags |= 4194308),
          (r = !1)));
  } else {
    ((u = t.stateNode),
      ic(e, t),
      (o = t.memoizedProps),
      (a = t.type === t.elementType ? o : je(t.type, o)),
      (u.props = a),
      (p = t.pendingProps),
      (v = u.context),
      (s = n.contextType),
      typeof s == 'object' && s !== null
        ? (s = Te(s))
        : ((s = we(n) ? Qt : se.current), (s = yn(t, s))));
    var m = n.getDerivedStateFromProps;
    ((h =
      typeof m == 'function' ||
      typeof u.getSnapshotBeforeUpdate == 'function') ||
      (typeof u.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof u.componentWillReceiveProps != 'function') ||
      ((o !== p || v !== s) && ss(t, u, r, s)),
      (st = !1),
      (v = t.memoizedState),
      (u.state = v),
      pl(t, r, u, l));
    var y = t.memoizedState;
    o !== p || v !== y || ge.current || st
      ? (typeof m == 'function' && (eu(t, n, m, r), (y = t.memoizedState)),
        (a = st || os(t, n, a, r, v, y, s) || !1)
          ? (h ||
              (typeof u.UNSAFE_componentWillUpdate != 'function' &&
                typeof u.componentWillUpdate != 'function') ||
              (typeof u.componentWillUpdate == 'function' &&
                u.componentWillUpdate(r, y, s),
              typeof u.UNSAFE_componentWillUpdate == 'function' &&
                u.UNSAFE_componentWillUpdate(r, y, s)),
            typeof u.componentDidUpdate == 'function' && (t.flags |= 4),
            typeof u.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
          : (typeof u.componentDidUpdate != 'function' ||
              (o === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 4),
            typeof u.getSnapshotBeforeUpdate != 'function' ||
              (o === e.memoizedProps && v === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = y)),
        (u.props = r),
        (u.state = y),
        (u.context = s),
        (r = a))
      : (typeof u.componentDidUpdate != 'function' ||
          (o === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 4),
        typeof u.getSnapshotBeforeUpdate != 'function' ||
          (o === e.memoizedProps && v === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return lu(e, t, n, r, i, l);
}
function lu(e, t, n, r, l, i) {
  Lc(e, t);
  var u = (t.flags & 128) !== 0;
  if (!r && !u) return (l && bo(t, n, !1), nt(e, t, i));
  ((r = t.stateNode), (_p.current = t));
  var o =
    u && typeof n.getDerivedStateFromError != 'function' ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && u
      ? ((t.child = wn(t, e.child, null, i)), (t.child = wn(t, null, o, i)))
      : ce(e, t, o, i),
    (t.memoizedState = r.state),
    l && bo(t, n, !0),
    t.child
  );
}
function Tc(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? Jo(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Jo(e, t.context, !1),
    Yu(e, t.containerInfo));
}
function vs(e, t, n, r, l) {
  return (gn(), Wu(l), (t.flags |= 256), ce(e, t, n, r), t.child);
}
var iu = { dehydrated: null, treeContext: null, retryLane: 0 };
function uu(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Mc(e, t, n) {
  var r = t.pendingProps,
    l = W.current,
    i = !1,
    u = (t.flags & 128) !== 0,
    o;
  if (
    ((o = u) ||
      (o = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
    o
      ? ((i = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (l |= 1),
    I(W, l & 1),
    e === null)
  )
    return (
      Ji(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === '$!'
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((u = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (u = { mode: 'hidden', children: u }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = u))
                : (i = Il(u, r, 0, null)),
              (e = At(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = uu(n)),
              (t.memoizedState = iu),
              e)
            : ro(t, u))
    );
  if (((l = e.memoizedState), l !== null && ((o = l.dehydrated), o !== null)))
    return Op(e, t, u, r, o, l, n);
  if (i) {
    ((i = r.fallback), (u = t.mode), (l = e.child), (o = l.sibling));
    var s = { mode: 'hidden', children: r.children };
    return (
      !(u & 1) && t.child !== l
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = s),
          (t.deletions = null))
        : ((r = xt(l, s)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
      o !== null ? (i = xt(o, i)) : ((i = At(i, u, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (u = e.child.memoizedState),
      (u =
        u === null
          ? uu(n)
          : {
              baseLanes: u.baseLanes | n,
              cachePool: null,
              transitions: u.transitions,
            }),
      (i.memoizedState = u),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = iu),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = xt(i, { mode: 'visible', children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function ro(e, t) {
  return (
    (t = Il({ mode: 'visible', children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function zr(e, t, n, r) {
  return (
    r !== null && Wu(r),
    wn(t, e.child, null, n),
    (e = ro(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function Op(e, t, n, r, l, i, u) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = mi(Error(S(422)))), zr(e, t, u, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((i = r.fallback),
          (l = t.mode),
          (r = Il({ mode: 'visible', children: r.children }, l, 0, null)),
          (i = At(i, l, u, null)),
          (i.flags |= 2),
          (r.return = t),
          (i.return = t),
          (r.sibling = i),
          (t.child = r),
          t.mode & 1 && wn(t, e.child, null, u),
          (t.child.memoizedState = uu(u)),
          (t.memoizedState = iu),
          i);
  if (!(t.mode & 1)) return zr(e, t, u, null);
  if (l.data === '$!') {
    if (((r = l.nextSibling && l.nextSibling.dataset), r)) var o = r.dgst;
    return (
      (r = o),
      (i = Error(S(419))),
      (r = mi(i, r, void 0)),
      zr(e, t, u, r)
    );
  }
  if (((o = (u & e.childLanes) !== 0), ye || o)) {
    if (((r = ee), r !== null)) {
      switch (u & -u) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      ((l = l & (r.suspendedLanes | u) ? 0 : l),
        l !== 0 &&
          l !== i.retryLane &&
          ((i.retryLane = l), tt(e, l), Ae(r, e, l, -1)));
    }
    return (ao(), (r = mi(Error(S(421)))), zr(e, t, u, r));
  }
  return l.data === '$?'
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Ap.bind(null, e)),
      (l._reactRetry = t),
      null)
    : ((e = i.treeContext),
      (ke = gt(l.nextSibling)),
      (Ee = t),
      (B = !0),
      (Ue = null),
      e !== null &&
        ((Ne[Fe++] = Xe),
        (Ne[Fe++] = Ze),
        (Ne[Fe++] = Bt),
        (Xe = e.id),
        (Ze = e.overflow),
        (Bt = t)),
      (t = ro(t, r.children)),
      (t.flags |= 4096),
      t);
}
function ms(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), bi(e.return, t, n));
}
function yi(e, t, n, r, l) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: l,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = l));
}
function zc(e, t, n) {
  var r = t.pendingProps,
    l = r.revealOrder,
    i = r.tail;
  if ((ce(e, t, r.children, n), (r = W.current), r & 2))
    ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ms(e, n, t);
        else if (e.tag === 19) ms(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((I(W, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (l) {
      case 'forwards':
        for (n = t.child, l = null; n !== null; )
          ((e = n.alternate),
            e !== null && hl(e) === null && (l = n),
            (n = n.sibling));
        ((n = l),
          n === null
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
          yi(t, !1, l, n, i));
        break;
      case 'backwards':
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (((e = l.alternate), e !== null && hl(e) === null)) {
            t.child = l;
            break;
          }
          ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
        }
        yi(t, !0, n, null, i);
        break;
      case 'together':
        yi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Kr(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function nt(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Vt |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(S(153));
  if (t.child !== null) {
    for (
      e = t.child, n = xt(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      ((e = e.sibling),
        (n = n.sibling = xt(e, e.pendingProps)),
        (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function Np(e, t, n) {
  switch (t.tag) {
    case 3:
      (Tc(t), gn());
      break;
    case 5:
      uc(t);
      break;
    case 1:
      we(t.type) && sl(t);
      break;
    case 4:
      Yu(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        l = t.memoizedProps.value;
      (I(fl, r._currentValue), (r._currentValue = l));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (I(W, W.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? Mc(e, t, n)
            : (I(W, W.current & 1),
              (e = nt(e, t, n)),
              e !== null ? e.sibling : null);
      I(W, W.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return zc(e, t, n);
        t.flags |= 128;
      }
      if (
        ((l = t.memoizedState),
        l !== null &&
          ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
        I(W, W.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), Rc(e, t, n));
  }
  return nt(e, t, n);
}
var Dc, ou, jc, Ic;
Dc = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
ou = function () {};
jc = function (e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    ((e = t.stateNode), jt(Ke.current));
    var i = null;
    switch (n) {
      case 'input':
        ((l = Fi(e, l)), (r = Fi(e, r)), (i = []));
        break;
      case 'select':
        ((l = H({}, l, { value: void 0 })),
          (r = H({}, r, { value: void 0 })),
          (i = []));
        break;
      case 'textarea':
        ((l = Ti(e, l)), (r = Ti(e, r)), (i = []));
        break;
      default:
        typeof l.onClick != 'function' &&
          typeof r.onClick == 'function' &&
          (e.onclick = ul);
    }
    zi(n, r);
    var u;
    n = null;
    for (a in l)
      if (!r.hasOwnProperty(a) && l.hasOwnProperty(a) && l[a] != null)
        if (a === 'style') {
          var o = l[a];
          for (u in o) o.hasOwnProperty(u) && (n || (n = {}), (n[u] = ''));
        } else
          a !== 'dangerouslySetInnerHTML' &&
            a !== 'children' &&
            a !== 'suppressContentEditableWarning' &&
            a !== 'suppressHydrationWarning' &&
            a !== 'autoFocus' &&
            (Gn.hasOwnProperty(a)
              ? i || (i = [])
              : (i = i || []).push(a, null));
    for (a in r) {
      var s = r[a];
      if (
        ((o = l != null ? l[a] : void 0),
        r.hasOwnProperty(a) && s !== o && (s != null || o != null))
      )
        if (a === 'style')
          if (o) {
            for (u in o)
              !o.hasOwnProperty(u) ||
                (s && s.hasOwnProperty(u)) ||
                (n || (n = {}), (n[u] = ''));
            for (u in s)
              s.hasOwnProperty(u) &&
                o[u] !== s[u] &&
                (n || (n = {}), (n[u] = s[u]));
          } else (n || (i || (i = []), i.push(a, n)), (n = s));
        else
          a === 'dangerouslySetInnerHTML'
            ? ((s = s ? s.__html : void 0),
              (o = o ? o.__html : void 0),
              s != null && o !== s && (i = i || []).push(a, s))
            : a === 'children'
              ? (typeof s != 'string' && typeof s != 'number') ||
                (i = i || []).push(a, '' + s)
              : a !== 'suppressContentEditableWarning' &&
                a !== 'suppressHydrationWarning' &&
                (Gn.hasOwnProperty(a)
                  ? (s != null && a === 'onScroll' && $('scroll', e),
                    i || o === s || (i = []))
                  : (i = i || []).push(a, s));
    }
    n && (i = i || []).push('style', n);
    var a = i;
    (t.updateQueue = a) && (t.flags |= 4);
  }
};
Ic = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Mn(e, t) {
  if (!B)
    switch (e.tailMode) {
      case 'hidden':
        t = e.tail;
        for (var n = null; t !== null; )
          (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case 'collapsed':
        n = e.tail;
        for (var r = null; n !== null; )
          (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function ue(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags & 14680064),
        (r |= l.flags & 14680064),
        (l.return = e),
        (l = l.sibling));
  else
    for (l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags),
        (r |= l.flags),
        (l.return = e),
        (l = l.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function Fp(e, t, n) {
  var r = t.pendingProps;
  switch ((Bu(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (ue(t), null);
    case 1:
      return (we(t.type) && ol(), ue(t), null);
    case 3:
      return (
        (r = t.stateNode),
        Sn(),
        A(ge),
        A(se),
        Zu(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Tr(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Ue !== null && (vu(Ue), (Ue = null)))),
        ou(e, t),
        ue(t),
        null
      );
    case 5:
      Xu(t);
      var l = jt(ur.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (jc(e, t, n, r, l),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(S(166));
          return (ue(t), null);
        }
        if (((e = jt(Ke.current)), Tr(t))) {
          ((r = t.stateNode), (n = t.type));
          var i = t.memoizedProps;
          switch (((r[Ve] = t), (r[lr] = i), (e = (t.mode & 1) !== 0), n)) {
            case 'dialog':
              ($('cancel', r), $('close', r));
              break;
            case 'iframe':
            case 'object':
            case 'embed':
              $('load', r);
              break;
            case 'video':
            case 'audio':
              for (l = 0; l < Un.length; l++) $(Un[l], r);
              break;
            case 'source':
              $('error', r);
              break;
            case 'img':
            case 'image':
            case 'link':
              ($('error', r), $('load', r));
              break;
            case 'details':
              $('toggle', r);
              break;
            case 'input':
              (Po(r, i), $('invalid', r));
              break;
            case 'select':
              ((r._wrapperState = { wasMultiple: !!i.multiple }),
                $('invalid', r));
              break;
            case 'textarea':
              (Oo(r, i), $('invalid', r));
          }
          (zi(n, i), (l = null));
          for (var u in i)
            if (i.hasOwnProperty(u)) {
              var o = i[u];
              u === 'children'
                ? typeof o == 'string'
                  ? r.textContent !== o &&
                    (i.suppressHydrationWarning !== !0 &&
                      Lr(r.textContent, o, e),
                    (l = ['children', o]))
                  : typeof o == 'number' &&
                    r.textContent !== '' + o &&
                    (i.suppressHydrationWarning !== !0 &&
                      Lr(r.textContent, o, e),
                    (l = ['children', '' + o]))
                : Gn.hasOwnProperty(u) &&
                  o != null &&
                  u === 'onScroll' &&
                  $('scroll', r);
            }
          switch (n) {
            case 'input':
              (kr(r), _o(r, i, !0));
              break;
            case 'textarea':
              (kr(r), No(r));
              break;
            case 'select':
            case 'option':
              break;
            default:
              typeof i.onClick == 'function' && (r.onclick = ul);
          }
          ((r = l), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((u = l.nodeType === 9 ? l : l.ownerDocument),
            e === 'http://www.w3.org/1999/xhtml' && (e = fa(n)),
            e === 'http://www.w3.org/1999/xhtml'
              ? n === 'script'
                ? ((e = u.createElement('div')),
                  (e.innerHTML = '<script><\/script>'),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == 'string'
                  ? (e = u.createElement(n, { is: r.is }))
                  : ((e = u.createElement(n)),
                    n === 'select' &&
                      ((u = e),
                      r.multiple
                        ? (u.multiple = !0)
                        : r.size && (u.size = r.size)))
              : (e = u.createElementNS(e, n)),
            (e[Ve] = t),
            (e[lr] = r),
            Dc(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((u = Di(n, r)), n)) {
              case 'dialog':
                ($('cancel', e), $('close', e), (l = r));
                break;
              case 'iframe':
              case 'object':
              case 'embed':
                ($('load', e), (l = r));
                break;
              case 'video':
              case 'audio':
                for (l = 0; l < Un.length; l++) $(Un[l], e);
                l = r;
                break;
              case 'source':
                ($('error', e), (l = r));
                break;
              case 'img':
              case 'image':
              case 'link':
                ($('error', e), $('load', e), (l = r));
                break;
              case 'details':
                ($('toggle', e), (l = r));
                break;
              case 'input':
                (Po(e, r), (l = Fi(e, r)), $('invalid', e));
                break;
              case 'option':
                l = r;
                break;
              case 'select':
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (l = H({}, r, { value: void 0 })),
                  $('invalid', e));
                break;
              case 'textarea':
                (Oo(e, r), (l = Ti(e, r)), $('invalid', e));
                break;
              default:
                l = r;
            }
            (zi(n, l), (o = l));
            for (i in o)
              if (o.hasOwnProperty(i)) {
                var s = o[i];
                i === 'style'
                  ? ha(e, s)
                  : i === 'dangerouslySetInnerHTML'
                    ? ((s = s ? s.__html : void 0), s != null && da(e, s))
                    : i === 'children'
                      ? typeof s == 'string'
                        ? (n !== 'textarea' || s !== '') && Yn(e, s)
                        : typeof s == 'number' && Yn(e, '' + s)
                      : i !== 'suppressContentEditableWarning' &&
                        i !== 'suppressHydrationWarning' &&
                        i !== 'autoFocus' &&
                        (Gn.hasOwnProperty(i)
                          ? s != null && i === 'onScroll' && $('scroll', e)
                          : s != null && Ou(e, i, s, u));
              }
            switch (n) {
              case 'input':
                (kr(e), _o(e, r, !1));
                break;
              case 'textarea':
                (kr(e), No(e));
                break;
              case 'option':
                r.value != null && e.setAttribute('value', '' + Et(r.value));
                break;
              case 'select':
                ((e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? cn(e, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      cn(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof l.onClick == 'function' && (e.onclick = ul);
            }
            switch (n) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                r = !!r.autoFocus;
                break e;
              case 'img':
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (ue(t), null);
    case 6:
      if (e && t.stateNode != null) Ic(e, t, e.memoizedProps, r);
      else {
        if (typeof r != 'string' && t.stateNode === null) throw Error(S(166));
        if (((n = jt(ur.current)), jt(Ke.current), Tr(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Ve] = t),
            (i = r.nodeValue !== n) && ((e = Ee), e !== null))
          )
            switch (e.tag) {
              case 3:
                Lr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Lr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Ve] = t),
            (t.stateNode = r));
      }
      return (ue(t), null);
    case 13:
      if (
        (A(W),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (B && ke !== null && t.mode & 1 && !(t.flags & 128))
          (tc(), gn(), (t.flags |= 98560), (i = !1));
        else if (((i = Tr(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(S(318));
            if (
              ((i = t.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(S(317));
            i[Ve] = t;
          } else
            (gn(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (ue(t), (i = !1));
        } else (Ue !== null && (vu(Ue), (Ue = null)), (i = !0));
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || W.current & 1 ? J === 0 && (J = 3) : ao())),
          t.updateQueue !== null && (t.flags |= 4),
          ue(t),
          null);
    case 4:
      return (
        Sn(),
        ou(e, t),
        e === null && nr(t.stateNode.containerInfo),
        ue(t),
        null
      );
    case 10:
      return (Ku(t.type._context), ue(t), null);
    case 17:
      return (we(t.type) && ol(), ue(t), null);
    case 19:
      if ((A(W), (i = t.memoizedState), i === null)) return (ue(t), null);
      if (((r = (t.flags & 128) !== 0), (u = i.rendering), u === null))
        if (r) Mn(i, !1);
        else {
          if (J !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((u = hl(e)), u !== null)) {
                for (
                  t.flags |= 128,
                    Mn(i, !1),
                    r = u.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  ((i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (u = i.alternate),
                    u === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = u.childLanes),
                        (i.lanes = u.lanes),
                        (i.child = u.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = u.memoizedProps),
                        (i.memoizedState = u.memoizedState),
                        (i.updateQueue = u.updateQueue),
                        (i.type = u.type),
                        (e = u.dependencies),
                        (i.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling));
                return (I(W, (W.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          i.tail !== null &&
            q() > xn &&
            ((t.flags |= 128), (r = !0), Mn(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = hl(u)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Mn(i, !0),
              i.tail === null && i.tailMode === 'hidden' && !u.alternate && !B)
            )
              return (ue(t), null);
          } else
            2 * q() - i.renderingStartTime > xn &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Mn(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((u.sibling = t.child), (t.child = u))
          : ((n = i.last),
            n !== null ? (n.sibling = u) : (t.child = u),
            (i.last = u));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = q()),
          (t.sibling = null),
          (n = W.current),
          I(W, r ? (n & 1) | 2 : n & 1),
          t)
        : (ue(t), null);
    case 22:
    case 23:
      return (
        so(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? xe & 1073741824 && (ue(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : ue(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(S(156, t.tag));
}
function Rp(e, t) {
  switch ((Bu(t), t.tag)) {
    case 1:
      return (
        we(t.type) && ol(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        Sn(),
        A(ge),
        A(se),
        Zu(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (Xu(t), null);
    case 13:
      if ((A(W), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(S(340));
        gn();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (A(W), null);
    case 4:
      return (Sn(), null);
    case 10:
      return (Ku(t.type._context), null);
    case 22:
    case 23:
      return (so(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var Dr = !1,
  oe = !1,
  Lp = typeof WeakSet == 'function' ? WeakSet : Set,
  P = null;
function sn(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == 'function')
      try {
        n(null);
      } catch (r) {
        K(e, t, r);
      }
    else n.current = null;
}
function su(e, t, n) {
  try {
    n();
  } catch (r) {
    K(e, t, r);
  }
}
var ys = !1;
function Tp(e, t) {
  if (((Hi = rl), (e = Ba()), Au(e))) {
    if ('selectionStart' in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, i.nodeType);
          } catch {
            n = null;
            break e;
          }
          var u = 0,
            o = -1,
            s = -1,
            a = 0,
            h = 0,
            p = e,
            v = null;
          t: for (;;) {
            for (
              var m;
              p !== n || (l !== 0 && p.nodeType !== 3) || (o = u + l),
                p !== i || (r !== 0 && p.nodeType !== 3) || (s = u + r),
                p.nodeType === 3 && (u += p.nodeValue.length),
                (m = p.firstChild) !== null;

            )
              ((v = p), (p = m));
            for (;;) {
              if (p === e) break t;
              if (
                (v === n && ++a === l && (o = u),
                v === i && ++h === r && (s = u),
                (m = p.nextSibling) !== null)
              )
                break;
              ((p = v), (v = p.parentNode));
            }
            p = m;
          }
          n = o === -1 || s === -1 ? null : { start: o, end: s };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Ki = { focusedElem: e, selectionRange: n }, rl = !1, P = t; P !== null; )
    if (((t = P), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (P = e));
    else
      for (; P !== null; ) {
        t = P;
        try {
          var y = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (y !== null) {
                  var g = y.memoizedProps,
                    x = y.memoizedState,
                    f = t.stateNode,
                    c = f.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? g : je(t.type, g),
                      x
                    );
                  f.__reactInternalSnapshotBeforeUpdate = c;
                }
                break;
              case 3:
                var d = t.stateNode.containerInfo;
                d.nodeType === 1
                  ? (d.textContent = '')
                  : d.nodeType === 9 &&
                    d.documentElement &&
                    d.removeChild(d.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(S(163));
            }
        } catch (w) {
          K(t, t.return, w);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (P = e));
          break;
        }
        P = t.return;
      }
  return ((y = ys), (ys = !1), y);
}
function Hn(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var l = (r = r.next);
    do {
      if ((l.tag & e) === e) {
        var i = l.destroy;
        ((l.destroy = void 0), i !== void 0 && su(t, n, i));
      }
      l = l.next;
    } while (l !== r);
  }
}
function Dl(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function au(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == 'function' ? t(e) : (t.current = e);
  }
}
function Uc(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), Uc(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Ve], delete t[lr], delete t[Yi], delete t[hp], delete t[vp])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function $c(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function gs(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || $c(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function cu(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = ul)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (cu(e, t, n), e = e.sibling; e !== null; )
      (cu(e, t, n), (e = e.sibling));
}
function fu(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (fu(e, t, n), e = e.sibling; e !== null; )
      (fu(e, t, n), (e = e.sibling));
}
var te = null,
  Ie = !1;
function it(e, t, n) {
  for (n = n.child; n !== null; ) (Ac(e, t, n), (n = n.sibling));
}
function Ac(e, t, n) {
  if (He && typeof He.onCommitFiberUnmount == 'function')
    try {
      He.onCommitFiberUnmount(Ol, n);
    } catch {}
  switch (n.tag) {
    case 5:
      oe || sn(n, t);
    case 6:
      var r = te,
        l = Ie;
      ((te = null),
        it(e, t, n),
        (te = r),
        (Ie = l),
        te !== null &&
          (Ie
            ? ((e = te),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : te.removeChild(n.stateNode)));
      break;
    case 18:
      te !== null &&
        (Ie
          ? ((e = te),
            (n = n.stateNode),
            e.nodeType === 8
              ? ci(e.parentNode, n)
              : e.nodeType === 1 && ci(e, n),
            bn(e))
          : ci(te, n.stateNode));
      break;
    case 4:
      ((r = te),
        (l = Ie),
        (te = n.stateNode.containerInfo),
        (Ie = !0),
        it(e, t, n),
        (te = r),
        (Ie = l));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !oe &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        l = r = r.next;
        do {
          var i = l,
            u = i.destroy;
          ((i = i.tag),
            u !== void 0 && (i & 2 || i & 4) && su(n, t, u),
            (l = l.next));
        } while (l !== r);
      }
      it(e, t, n);
      break;
    case 1:
      if (
        !oe &&
        (sn(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == 'function')
      )
        try {
          ((r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount());
        } catch (o) {
          K(n, t, o);
        }
      it(e, t, n);
      break;
    case 21:
      it(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((oe = (r = oe) || n.memoizedState !== null), it(e, t, n), (oe = r))
        : it(e, t, n);
      break;
    default:
      it(e, t, n);
  }
}
function ws(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new Lp()),
      t.forEach(function (r) {
        var l = Qp.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      }));
  }
}
function De(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e,
          u = t,
          o = u;
        e: for (; o !== null; ) {
          switch (o.tag) {
            case 5:
              ((te = o.stateNode), (Ie = !1));
              break e;
            case 3:
              ((te = o.stateNode.containerInfo), (Ie = !0));
              break e;
            case 4:
              ((te = o.stateNode.containerInfo), (Ie = !0));
              break e;
          }
          o = o.return;
        }
        if (te === null) throw Error(S(160));
        (Ac(i, u, l), (te = null), (Ie = !1));
        var s = l.alternate;
        (s !== null && (s.return = null), (l.return = null));
      } catch (a) {
        K(l, t, a);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) (Qc(t, e), (t = t.sibling));
}
function Qc(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((De(t, e), Be(e), r & 4)) {
        try {
          (Hn(3, e, e.return), Dl(3, e));
        } catch (g) {
          K(e, e.return, g);
        }
        try {
          Hn(5, e, e.return);
        } catch (g) {
          K(e, e.return, g);
        }
      }
      break;
    case 1:
      (De(t, e), Be(e), r & 512 && n !== null && sn(n, n.return));
      break;
    case 5:
      if (
        (De(t, e),
        Be(e),
        r & 512 && n !== null && sn(n, n.return),
        e.flags & 32)
      ) {
        var l = e.stateNode;
        try {
          Yn(l, '');
        } catch (g) {
          K(e, e.return, g);
        }
      }
      if (r & 4 && ((l = e.stateNode), l != null)) {
        var i = e.memoizedProps,
          u = n !== null ? n.memoizedProps : i,
          o = e.type,
          s = e.updateQueue;
        if (((e.updateQueue = null), s !== null))
          try {
            (o === 'input' && i.type === 'radio' && i.name != null && aa(l, i),
              Di(o, u));
            var a = Di(o, i);
            for (u = 0; u < s.length; u += 2) {
              var h = s[u],
                p = s[u + 1];
              h === 'style'
                ? ha(l, p)
                : h === 'dangerouslySetInnerHTML'
                  ? da(l, p)
                  : h === 'children'
                    ? Yn(l, p)
                    : Ou(l, h, p, a);
            }
            switch (o) {
              case 'input':
                Ri(l, i);
                break;
              case 'textarea':
                ca(l, i);
                break;
              case 'select':
                var v = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var m = i.value;
                m != null
                  ? cn(l, !!i.multiple, m, !1)
                  : v !== !!i.multiple &&
                    (i.defaultValue != null
                      ? cn(l, !!i.multiple, i.defaultValue, !0)
                      : cn(l, !!i.multiple, i.multiple ? [] : '', !1));
            }
            l[lr] = i;
          } catch (g) {
            K(e, e.return, g);
          }
      }
      break;
    case 6:
      if ((De(t, e), Be(e), r & 4)) {
        if (e.stateNode === null) throw Error(S(162));
        ((l = e.stateNode), (i = e.memoizedProps));
        try {
          l.nodeValue = i;
        } catch (g) {
          K(e, e.return, g);
        }
      }
      break;
    case 3:
      if (
        (De(t, e), Be(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          bn(t.containerInfo);
        } catch (g) {
          K(e, e.return, g);
        }
      break;
    case 4:
      (De(t, e), Be(e));
      break;
    case 13:
      (De(t, e),
        Be(e),
        (l = e.child),
        l.flags & 8192 &&
          ((i = l.memoizedState !== null),
          (l.stateNode.isHidden = i),
          !i ||
            (l.alternate !== null && l.alternate.memoizedState !== null) ||
            (uo = q())),
        r & 4 && ws(e));
      break;
    case 22:
      if (
        ((h = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((oe = (a = oe) || h), De(t, e), (oe = a)) : De(t, e),
        Be(e),
        r & 8192)
      ) {
        if (
          ((a = e.memoizedState !== null),
          (e.stateNode.isHidden = a) && !h && e.mode & 1)
        )
          for (P = e, h = e.child; h !== null; ) {
            for (p = P = h; P !== null; ) {
              switch (((v = P), (m = v.child), v.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Hn(4, v, v.return);
                  break;
                case 1:
                  sn(v, v.return);
                  var y = v.stateNode;
                  if (typeof y.componentWillUnmount == 'function') {
                    ((r = v), (n = v.return));
                    try {
                      ((t = r),
                        (y.props = t.memoizedProps),
                        (y.state = t.memoizedState),
                        y.componentWillUnmount());
                    } catch (g) {
                      K(r, n, g);
                    }
                  }
                  break;
                case 5:
                  sn(v, v.return);
                  break;
                case 22:
                  if (v.memoizedState !== null) {
                    Cs(p);
                    continue;
                  }
              }
              m !== null ? ((m.return = v), (P = m)) : Cs(p);
            }
            h = h.sibling;
          }
        e: for (h = null, p = e; ; ) {
          if (p.tag === 5) {
            if (h === null) {
              h = p;
              try {
                ((l = p.stateNode),
                  a
                    ? ((i = l.style),
                      typeof i.setProperty == 'function'
                        ? i.setProperty('display', 'none', 'important')
                        : (i.display = 'none'))
                    : ((o = p.stateNode),
                      (s = p.memoizedProps.style),
                      (u =
                        s != null && s.hasOwnProperty('display')
                          ? s.display
                          : null),
                      (o.style.display = pa('display', u))));
              } catch (g) {
                K(e, e.return, g);
              }
            }
          } else if (p.tag === 6) {
            if (h === null)
              try {
                p.stateNode.nodeValue = a ? '' : p.memoizedProps;
              } catch (g) {
                K(e, e.return, g);
              }
          } else if (
            ((p.tag !== 22 && p.tag !== 23) ||
              p.memoizedState === null ||
              p === e) &&
            p.child !== null
          ) {
            ((p.child.return = p), (p = p.child));
            continue;
          }
          if (p === e) break e;
          for (; p.sibling === null; ) {
            if (p.return === null || p.return === e) break e;
            (h === p && (h = null), (p = p.return));
          }
          (h === p && (h = null),
            (p.sibling.return = p.return),
            (p = p.sibling));
        }
      }
      break;
    case 19:
      (De(t, e), Be(e), r & 4 && ws(e));
      break;
    case 21:
      break;
    default:
      (De(t, e), Be(e));
  }
}
function Be(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if ($c(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(S(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (Yn(l, ''), (r.flags &= -33));
          var i = gs(e);
          fu(e, i, l);
          break;
        case 3:
        case 4:
          var u = r.stateNode.containerInfo,
            o = gs(e);
          cu(e, o, u);
          break;
        default:
          throw Error(S(161));
      }
    } catch (s) {
      K(e, e.return, s);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function Mp(e, t, n) {
  ((P = e), Bc(e));
}
function Bc(e, t, n) {
  for (var r = (e.mode & 1) !== 0; P !== null; ) {
    var l = P,
      i = l.child;
    if (l.tag === 22 && r) {
      var u = l.memoizedState !== null || Dr;
      if (!u) {
        var o = l.alternate,
          s = (o !== null && o.memoizedState !== null) || oe;
        o = Dr;
        var a = oe;
        if (((Dr = u), (oe = s) && !a))
          for (P = l; P !== null; )
            ((u = P),
              (s = u.child),
              u.tag === 22 && u.memoizedState !== null
                ? xs(l)
                : s !== null
                  ? ((s.return = u), (P = s))
                  : xs(l));
        for (; i !== null; ) ((P = i), Bc(i), (i = i.sibling));
        ((P = l), (Dr = o), (oe = a));
      }
      Ss(e);
    } else
      l.subtreeFlags & 8772 && i !== null ? ((i.return = l), (P = i)) : Ss(e);
  }
}
function Ss(e) {
  for (; P !== null; ) {
    var t = P;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              oe || Dl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !oe)
                if (n === null) r.componentDidMount();
                else {
                  var l =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : je(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    l,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var i = t.updateQueue;
              i !== null && ls(t, i, r);
              break;
            case 3:
              var u = t.updateQueue;
              if (u !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                ls(t, u, n);
              }
              break;
            case 5:
              var o = t.stateNode;
              if (n === null && t.flags & 4) {
                n = o;
                var s = t.memoizedProps;
                switch (t.type) {
                  case 'button':
                  case 'input':
                  case 'select':
                  case 'textarea':
                    s.autoFocus && n.focus();
                    break;
                  case 'img':
                    s.src && (n.src = s.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var a = t.alternate;
                if (a !== null) {
                  var h = a.memoizedState;
                  if (h !== null) {
                    var p = h.dehydrated;
                    p !== null && bn(p);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(S(163));
          }
        oe || (t.flags & 512 && au(t));
      } catch (v) {
        K(t, t.return, v);
      }
    }
    if (t === e) {
      P = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), (P = n));
      break;
    }
    P = t.return;
  }
}
function Cs(e) {
  for (; P !== null; ) {
    var t = P;
    if (t === e) {
      P = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), (P = n));
      break;
    }
    P = t.return;
  }
}
function xs(e) {
  for (; P !== null; ) {
    var t = P;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Dl(4, t);
          } catch (s) {
            K(t, n, s);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == 'function') {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (s) {
              K(t, l, s);
            }
          }
          var i = t.return;
          try {
            au(t);
          } catch (s) {
            K(t, i, s);
          }
          break;
        case 5:
          var u = t.return;
          try {
            au(t);
          } catch (s) {
            K(t, u, s);
          }
      }
    } catch (s) {
      K(t, t.return, s);
    }
    if (t === e) {
      P = null;
      break;
    }
    var o = t.sibling;
    if (o !== null) {
      ((o.return = t.return), (P = o));
      break;
    }
    P = t.return;
  }
}
var zp = Math.ceil,
  yl = rt.ReactCurrentDispatcher,
  lo = rt.ReactCurrentOwner,
  Le = rt.ReactCurrentBatchConfig,
  z = 0,
  ee = null,
  Y = null,
  re = 0,
  xe = 0,
  an = Ot(0),
  J = 0,
  cr = null,
  Vt = 0,
  jl = 0,
  io = 0,
  Kn = null,
  me = null,
  uo = 0,
  xn = 1 / 0,
  Ge = null,
  gl = !1,
  du = null,
  St = null,
  jr = !1,
  pt = null,
  wl = 0,
  qn = 0,
  pu = null,
  qr = -1,
  Gr = 0;
function fe() {
  return z & 6 ? q() : qr !== -1 ? qr : (qr = q());
}
function Ct(e) {
  return e.mode & 1
    ? z & 2 && re !== 0
      ? re & -re
      : yp.transition !== null
        ? (Gr === 0 && (Gr = _a()), Gr)
        : ((e = j),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : Ma(e.type))),
          e)
    : 1;
}
function Ae(e, t, n, r) {
  if (50 < qn) throw ((qn = 0), (pu = null), Error(S(185)));
  (hr(e, n, r),
    (!(z & 2) || e !== ee) &&
      (e === ee && (!(z & 2) && (jl |= n), J === 4 && ft(e, re)),
      Se(e, r),
      n === 1 && z === 0 && !(t.mode & 1) && ((xn = q() + 500), Tl && Nt())));
}
function Se(e, t) {
  var n = e.callbackNode;
  yd(e, t);
  var r = nl(e, e === ee ? re : 0);
  if (r === 0)
    (n !== null && Lo(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Lo(n), t === 1))
      (e.tag === 0 ? mp(ks.bind(null, e)) : Ja(ks.bind(null, e)),
        dp(function () {
          !(z & 6) && Nt();
        }),
        (n = null));
    else {
      switch (Oa(r)) {
        case 1:
          n = Tu;
          break;
        case 4:
          n = Ea;
          break;
        case 16:
          n = tl;
          break;
        case 536870912:
          n = Pa;
          break;
        default:
          n = tl;
      }
      n = Xc(n, Wc.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function Wc(e, t) {
  if (((qr = -1), (Gr = 0), z & 6)) throw Error(S(327));
  var n = e.callbackNode;
  if (vn() && e.callbackNode !== n) return null;
  var r = nl(e, e === ee ? re : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Sl(e, r);
  else {
    t = r;
    var l = z;
    z |= 2;
    var i = Hc();
    (ee !== e || re !== t) && ((Ge = null), (xn = q() + 500), $t(e, t));
    do
      try {
        Ip();
        break;
      } catch (o) {
        Vc(e, o);
      }
    while (!0);
    (Hu(),
      (yl.current = i),
      (z = l),
      Y !== null ? (t = 0) : ((ee = null), (re = 0), (t = J)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((l = Ai(e)), l !== 0 && ((r = l), (t = hu(e, l)))), t === 1)
    )
      throw ((n = cr), $t(e, 0), ft(e, r), Se(e, q()), n);
    if (t === 6) ft(e, r);
    else {
      if (
        ((l = e.current.alternate),
        !(r & 30) &&
          !Dp(l) &&
          ((t = Sl(e, r)),
          t === 2 && ((i = Ai(e)), i !== 0 && ((r = i), (t = hu(e, i)))),
          t === 1))
      )
        throw ((n = cr), $t(e, 0), ft(e, r), Se(e, q()), n);
      switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(S(345));
        case 2:
          Mt(e, me, Ge);
          break;
        case 3:
          if (
            (ft(e, r), (r & 130023424) === r && ((t = uo + 500 - q()), 10 < t))
          ) {
            if (nl(e, 0) !== 0) break;
            if (((l = e.suspendedLanes), (l & r) !== r)) {
              (fe(), (e.pingedLanes |= e.suspendedLanes & l));
              break;
            }
            e.timeoutHandle = Gi(Mt.bind(null, e, me, Ge), t);
            break;
          }
          Mt(e, me, Ge);
          break;
        case 4:
          if ((ft(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var u = 31 - $e(r);
            ((i = 1 << u), (u = t[u]), u > l && (l = u), (r &= ~i));
          }
          if (
            ((r = l),
            (r = q() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * zp(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Gi(Mt.bind(null, e, me, Ge), r);
            break;
          }
          Mt(e, me, Ge);
          break;
        case 5:
          Mt(e, me, Ge);
          break;
        default:
          throw Error(S(329));
      }
    }
  }
  return (Se(e, q()), e.callbackNode === n ? Wc.bind(null, e) : null);
}
function hu(e, t) {
  var n = Kn;
  return (
    e.current.memoizedState.isDehydrated && ($t(e, t).flags |= 256),
    (e = Sl(e, t)),
    e !== 2 && ((t = me), (me = n), t !== null && vu(t)),
    e
  );
}
function vu(e) {
  me === null ? (me = e) : me.push.apply(me, e);
}
function Dp(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var l = n[r],
            i = l.getSnapshot;
          l = l.value;
          try {
            if (!Qe(i(), l)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function ft(e, t) {
  for (
    t &= ~io,
      t &= ~jl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - $e(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function ks(e) {
  if (z & 6) throw Error(S(327));
  vn();
  var t = nl(e, 0);
  if (!(t & 1)) return (Se(e, q()), null);
  var n = Sl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Ai(e);
    r !== 0 && ((t = r), (n = hu(e, r)));
  }
  if (n === 1) throw ((n = cr), $t(e, 0), ft(e, t), Se(e, q()), n);
  if (n === 6) throw Error(S(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Mt(e, me, Ge),
    Se(e, q()),
    null
  );
}
function oo(e, t) {
  var n = z;
  z |= 1;
  try {
    return e(t);
  } finally {
    ((z = n), z === 0 && ((xn = q() + 500), Tl && Nt()));
  }
}
function Ht(e) {
  pt !== null && pt.tag === 0 && !(z & 6) && vn();
  var t = z;
  z |= 1;
  var n = Le.transition,
    r = j;
  try {
    if (((Le.transition = null), (j = 1), e)) return e();
  } finally {
    ((j = r), (Le.transition = n), (z = t), !(z & 6) && Nt());
  }
}
function so() {
  ((xe = an.current), A(an));
}
function $t(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), fp(n)), Y !== null))
    for (n = Y.return; n !== null; ) {
      var r = n;
      switch ((Bu(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && ol());
          break;
        case 3:
          (Sn(), A(ge), A(se), Zu());
          break;
        case 5:
          Xu(r);
          break;
        case 4:
          Sn();
          break;
        case 13:
          A(W);
          break;
        case 19:
          A(W);
          break;
        case 10:
          Ku(r.type._context);
          break;
        case 22:
        case 23:
          so();
      }
      n = n.return;
    }
  if (
    ((ee = e),
    (Y = e = xt(e.current, null)),
    (re = xe = t),
    (J = 0),
    (cr = null),
    (io = jl = Vt = 0),
    (me = Kn = null),
    Dt !== null)
  ) {
    for (t = 0; t < Dt.length; t++)
      if (((n = Dt[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var l = r.next,
          i = n.pending;
        if (i !== null) {
          var u = i.next;
          ((i.next = l), (r.next = u));
        }
        n.pending = r;
      }
    Dt = null;
  }
  return e;
}
function Vc(e, t) {
  do {
    var n = Y;
    try {
      if ((Hu(), (Vr.current = ml), vl)) {
        for (var r = V.memoizedState; r !== null; ) {
          var l = r.queue;
          (l !== null && (l.pending = null), (r = r.next));
        }
        vl = !1;
      }
      if (
        ((Wt = 0),
        (b = Z = V = null),
        (Vn = !1),
        (or = 0),
        (lo.current = null),
        n === null || n.return === null)
      ) {
        ((J = 1), (cr = t), (Y = null));
        break;
      }
      e: {
        var i = e,
          u = n.return,
          o = n,
          s = t;
        if (
          ((t = re),
          (o.flags |= 32768),
          s !== null && typeof s == 'object' && typeof s.then == 'function')
        ) {
          var a = s,
            h = o,
            p = h.tag;
          if (!(h.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var v = h.alternate;
            v
              ? ((h.updateQueue = v.updateQueue),
                (h.memoizedState = v.memoizedState),
                (h.lanes = v.lanes))
              : ((h.updateQueue = null), (h.memoizedState = null));
          }
          var m = cs(u);
          if (m !== null) {
            ((m.flags &= -257),
              fs(m, u, o, i, t),
              m.mode & 1 && as(i, a, t),
              (t = m),
              (s = a));
            var y = t.updateQueue;
            if (y === null) {
              var g = new Set();
              (g.add(s), (t.updateQueue = g));
            } else y.add(s);
            break e;
          } else {
            if (!(t & 1)) {
              (as(i, a, t), ao());
              break e;
            }
            s = Error(S(426));
          }
        } else if (B && o.mode & 1) {
          var x = cs(u);
          if (x !== null) {
            (!(x.flags & 65536) && (x.flags |= 256),
              fs(x, u, o, i, t),
              Wu(Cn(s, o)));
            break e;
          }
        }
        ((i = s = Cn(s, o)),
          J !== 4 && (J = 2),
          Kn === null ? (Kn = [i]) : Kn.push(i),
          (i = u));
        do {
          switch (i.tag) {
            case 3:
              ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
              var f = Oc(i, s, t);
              rs(i, f);
              break e;
            case 1:
              o = s;
              var c = i.type,
                d = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof c.getDerivedStateFromError == 'function' ||
                  (d !== null &&
                    typeof d.componentDidCatch == 'function' &&
                    (St === null || !St.has(d))))
              ) {
                ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
                var w = Nc(i, o, t);
                rs(i, w);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      qc(n);
    } catch (C) {
      ((t = C), Y === n && n !== null && (Y = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function Hc() {
  var e = yl.current;
  return ((yl.current = ml), e === null ? ml : e);
}
function ao() {
  ((J === 0 || J === 3 || J === 2) && (J = 4),
    ee === null || (!(Vt & 268435455) && !(jl & 268435455)) || ft(ee, re));
}
function Sl(e, t) {
  var n = z;
  z |= 2;
  var r = Hc();
  (ee !== e || re !== t) && ((Ge = null), $t(e, t));
  do
    try {
      jp();
      break;
    } catch (l) {
      Vc(e, l);
    }
  while (!0);
  if ((Hu(), (z = n), (yl.current = r), Y !== null)) throw Error(S(261));
  return ((ee = null), (re = 0), J);
}
function jp() {
  for (; Y !== null; ) Kc(Y);
}
function Ip() {
  for (; Y !== null && !sd(); ) Kc(Y);
}
function Kc(e) {
  var t = Yc(e.alternate, e, xe);
  ((e.memoizedProps = e.pendingProps),
    t === null ? qc(e) : (Y = t),
    (lo.current = null));
}
function qc(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = Rp(n, t)), n !== null)) {
        ((n.flags &= 32767), (Y = n));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((J = 6), (Y = null));
        return;
      }
    } else if (((n = Fp(n, t, xe)), n !== null)) {
      Y = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      Y = t;
      return;
    }
    Y = t = e;
  } while (t !== null);
  J === 0 && (J = 5);
}
function Mt(e, t, n) {
  var r = j,
    l = Le.transition;
  try {
    ((Le.transition = null), (j = 1), Up(e, t, n, r));
  } finally {
    ((Le.transition = l), (j = r));
  }
  return null;
}
function Up(e, t, n, r) {
  do vn();
  while (pt !== null);
  if (z & 6) throw Error(S(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(S(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var i = n.lanes | n.childLanes;
  if (
    (gd(e, i),
    e === ee && ((Y = ee = null), (re = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      jr ||
      ((jr = !0),
      Xc(tl, function () {
        return (vn(), null);
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    ((i = Le.transition), (Le.transition = null));
    var u = j;
    j = 1;
    var o = z;
    ((z |= 4),
      (lo.current = null),
      Tp(e, n),
      Qc(n, e),
      lp(Ki),
      (rl = !!Hi),
      (Ki = Hi = null),
      (e.current = n),
      Mp(n),
      ad(),
      (z = o),
      (j = u),
      (Le.transition = i));
  } else e.current = n;
  if (
    (jr && ((jr = !1), (pt = e), (wl = l)),
    (i = e.pendingLanes),
    i === 0 && (St = null),
    dd(n.stateNode),
    Se(e, q()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest }));
  if (gl) throw ((gl = !1), (e = du), (du = null), e);
  return (
    wl & 1 && e.tag !== 0 && vn(),
    (i = e.pendingLanes),
    i & 1 ? (e === pu ? qn++ : ((qn = 0), (pu = e))) : (qn = 0),
    Nt(),
    null
  );
}
function vn() {
  if (pt !== null) {
    var e = Oa(wl),
      t = Le.transition,
      n = j;
    try {
      if (((Le.transition = null), (j = 16 > e ? 16 : e), pt === null))
        var r = !1;
      else {
        if (((e = pt), (pt = null), (wl = 0), z & 6)) throw Error(S(331));
        var l = z;
        for (z |= 4, P = e.current; P !== null; ) {
          var i = P,
            u = i.child;
          if (P.flags & 16) {
            var o = i.deletions;
            if (o !== null) {
              for (var s = 0; s < o.length; s++) {
                var a = o[s];
                for (P = a; P !== null; ) {
                  var h = P;
                  switch (h.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Hn(8, h, i);
                  }
                  var p = h.child;
                  if (p !== null) ((p.return = h), (P = p));
                  else
                    for (; P !== null; ) {
                      h = P;
                      var v = h.sibling,
                        m = h.return;
                      if ((Uc(h), h === a)) {
                        P = null;
                        break;
                      }
                      if (v !== null) {
                        ((v.return = m), (P = v));
                        break;
                      }
                      P = m;
                    }
                }
              }
              var y = i.alternate;
              if (y !== null) {
                var g = y.child;
                if (g !== null) {
                  y.child = null;
                  do {
                    var x = g.sibling;
                    ((g.sibling = null), (g = x));
                  } while (g !== null);
                }
              }
              P = i;
            }
          }
          if (i.subtreeFlags & 2064 && u !== null) ((u.return = i), (P = u));
          else
            e: for (; P !== null; ) {
              if (((i = P), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Hn(9, i, i.return);
                }
              var f = i.sibling;
              if (f !== null) {
                ((f.return = i.return), (P = f));
                break e;
              }
              P = i.return;
            }
        }
        var c = e.current;
        for (P = c; P !== null; ) {
          u = P;
          var d = u.child;
          if (u.subtreeFlags & 2064 && d !== null) ((d.return = u), (P = d));
          else
            e: for (u = c; P !== null; ) {
              if (((o = P), o.flags & 2048))
                try {
                  switch (o.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Dl(9, o);
                  }
                } catch (C) {
                  K(o, o.return, C);
                }
              if (o === u) {
                P = null;
                break e;
              }
              var w = o.sibling;
              if (w !== null) {
                ((w.return = o.return), (P = w));
                break e;
              }
              P = o.return;
            }
        }
        if (
          ((z = l), Nt(), He && typeof He.onPostCommitFiberRoot == 'function')
        )
          try {
            He.onPostCommitFiberRoot(Ol, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      ((j = n), (Le.transition = t));
    }
  }
  return !1;
}
function Es(e, t, n) {
  ((t = Cn(n, t)),
    (t = Oc(e, t, 1)),
    (e = wt(e, t, 1)),
    (t = fe()),
    e !== null && (hr(e, 1, t), Se(e, t)));
}
function K(e, t, n) {
  if (e.tag === 3) Es(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Es(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == 'function' ||
          (typeof r.componentDidCatch == 'function' &&
            (St === null || !St.has(r)))
        ) {
          ((e = Cn(n, e)),
            (e = Nc(t, e, 1)),
            (t = wt(t, e, 1)),
            (e = fe()),
            t !== null && (hr(t, 1, e), Se(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function $p(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = fe()),
    (e.pingedLanes |= e.suspendedLanes & n),
    ee === e &&
      (re & n) === n &&
      (J === 4 || (J === 3 && (re & 130023424) === re && 500 > q() - uo)
        ? $t(e, 0)
        : (io |= n)),
    Se(e, t));
}
function Gc(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = _r), (_r <<= 1), !(_r & 130023424) && (_r = 4194304))
      : (t = 1));
  var n = fe();
  ((e = tt(e, t)), e !== null && (hr(e, t, n), Se(e, n)));
}
function Ap(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), Gc(e, n));
}
function Qp(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(S(314));
  }
  (r !== null && r.delete(t), Gc(e, n));
}
var Yc;
Yc = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || ge.current) ye = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((ye = !1), Np(e, t, n));
      ye = !!(e.flags & 131072);
    }
  else ((ye = !1), B && t.flags & 1048576 && ba(t, cl, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (Kr(e, t), (e = t.pendingProps));
      var l = yn(t, se.current);
      (hn(t, n), (l = bu(null, t, r, e, l, n)));
      var i = eo();
      return (
        (t.flags |= 1),
        typeof l == 'object' &&
        l !== null &&
        typeof l.render == 'function' &&
        l.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            we(r) ? ((i = !0), sl(t)) : (i = !1),
            (t.memoizedState =
              l.state !== null && l.state !== void 0 ? l.state : null),
            Gu(t),
            (l.updater = zl),
            (t.stateNode = l),
            (l._reactInternals = t),
            tu(t, r, e, n),
            (t = lu(null, t, r, !0, i, n)))
          : ((t.tag = 0), B && i && Qu(t), ce(null, t, l, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Kr(e, t),
          (e = t.pendingProps),
          (l = r._init),
          (r = l(r._payload)),
          (t.type = r),
          (l = t.tag = Wp(r)),
          (e = je(r, e)),
          l)
        ) {
          case 0:
            t = ru(null, t, r, e, n);
            break e;
          case 1:
            t = hs(null, t, r, e, n);
            break e;
          case 11:
            t = ds(null, t, r, e, n);
            break e;
          case 14:
            t = ps(null, t, r, je(r.type, e), n);
            break e;
        }
        throw Error(S(306, r, ''));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : je(r, l)),
        ru(e, t, r, l, n)
      );
    case 1:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : je(r, l)),
        hs(e, t, r, l, n)
      );
    case 3:
      e: {
        if ((Tc(t), e === null)) throw Error(S(387));
        ((r = t.pendingProps),
          (i = t.memoizedState),
          (l = i.element),
          ic(e, t),
          pl(t, r, null, n));
        var u = t.memoizedState;
        if (((r = u.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: u.cache,
              pendingSuspenseBoundaries: u.pendingSuspenseBoundaries,
              transitions: u.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            ((l = Cn(Error(S(423)), t)), (t = vs(e, t, r, n, l)));
            break e;
          } else if (r !== l) {
            ((l = Cn(Error(S(424)), t)), (t = vs(e, t, r, n, l)));
            break e;
          } else
            for (
              ke = gt(t.stateNode.containerInfo.firstChild),
                Ee = t,
                B = !0,
                Ue = null,
                n = rc(t, null, r, n),
                t.child = n;
              n;

            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((gn(), r === l)) {
            t = nt(e, t, n);
            break e;
          }
          ce(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        uc(t),
        e === null && Ji(t),
        (r = t.type),
        (l = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (u = l.children),
        qi(r, l) ? (u = null) : i !== null && qi(r, i) && (t.flags |= 32),
        Lc(e, t),
        ce(e, t, u, n),
        t.child
      );
    case 6:
      return (e === null && Ji(t), null);
    case 13:
      return Mc(e, t, n);
    case 4:
      return (
        Yu(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = wn(t, null, r, n)) : ce(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : je(r, l)),
        ds(e, t, r, l, n)
      );
    case 7:
      return (ce(e, t, t.pendingProps, n), t.child);
    case 8:
      return (ce(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (ce(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (l = t.pendingProps),
          (i = t.memoizedProps),
          (u = l.value),
          I(fl, r._currentValue),
          (r._currentValue = u),
          i !== null)
        )
          if (Qe(i.value, u)) {
            if (i.children === l.children && !ge.current) {
              t = nt(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null; ) {
              var o = i.dependencies;
              if (o !== null) {
                u = i.child;
                for (var s = o.firstContext; s !== null; ) {
                  if (s.context === r) {
                    if (i.tag === 1) {
                      ((s = Je(-1, n & -n)), (s.tag = 2));
                      var a = i.updateQueue;
                      if (a !== null) {
                        a = a.shared;
                        var h = a.pending;
                        (h === null
                          ? (s.next = s)
                          : ((s.next = h.next), (h.next = s)),
                          (a.pending = s));
                      }
                    }
                    ((i.lanes |= n),
                      (s = i.alternate),
                      s !== null && (s.lanes |= n),
                      bi(i.return, n, t),
                      (o.lanes |= n));
                    break;
                  }
                  s = s.next;
                }
              } else if (i.tag === 10) u = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((u = i.return), u === null)) throw Error(S(341));
                ((u.lanes |= n),
                  (o = u.alternate),
                  o !== null && (o.lanes |= n),
                  bi(u, n, t),
                  (u = i.sibling));
              } else u = i.child;
              if (u !== null) u.return = i;
              else
                for (u = i; u !== null; ) {
                  if (u === t) {
                    u = null;
                    break;
                  }
                  if (((i = u.sibling), i !== null)) {
                    ((i.return = u.return), (u = i));
                    break;
                  }
                  u = u.return;
                }
              i = u;
            }
        (ce(e, t, l.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (l = t.type),
        (r = t.pendingProps.children),
        hn(t, n),
        (l = Te(l)),
        (r = r(l)),
        (t.flags |= 1),
        ce(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (l = je(r, t.pendingProps)),
        (l = je(r.type, l)),
        ps(e, t, r, l, n)
      );
    case 15:
      return Fc(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : je(r, l)),
        Kr(e, t),
        (t.tag = 1),
        we(r) ? ((e = !0), sl(t)) : (e = !1),
        hn(t, n),
        _c(t, r, l),
        tu(t, r, l, n),
        lu(null, t, r, !0, e, n)
      );
    case 19:
      return zc(e, t, n);
    case 22:
      return Rc(e, t, n);
  }
  throw Error(S(156, t.tag));
};
function Xc(e, t) {
  return ka(e, t);
}
function Bp(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function Re(e, t, n, r) {
  return new Bp(e, t, n, r);
}
function co(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function Wp(e) {
  if (typeof e == 'function') return co(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Fu)) return 11;
    if (e === Ru) return 14;
  }
  return 2;
}
function xt(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Re(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Yr(e, t, n, r, l, i) {
  var u = 2;
  if (((r = e), typeof e == 'function')) co(e) && (u = 1);
  else if (typeof e == 'string') u = 5;
  else
    e: switch (e) {
      case Jt:
        return At(n.children, l, i, t);
      case Nu:
        ((u = 8), (l |= 8));
        break;
      case Pi:
        return (
          (e = Re(12, n, t, l | 2)),
          (e.elementType = Pi),
          (e.lanes = i),
          e
        );
      case _i:
        return ((e = Re(13, n, t, l)), (e.elementType = _i), (e.lanes = i), e);
      case Oi:
        return ((e = Re(19, n, t, l)), (e.elementType = Oi), (e.lanes = i), e);
      case ua:
        return Il(n, l, i, t);
      default:
        if (typeof e == 'object' && e !== null)
          switch (e.$$typeof) {
            case la:
              u = 10;
              break e;
            case ia:
              u = 9;
              break e;
            case Fu:
              u = 11;
              break e;
            case Ru:
              u = 14;
              break e;
            case ot:
              ((u = 16), (r = null));
              break e;
          }
        throw Error(S(130, e == null ? e : typeof e, ''));
    }
  return (
    (t = Re(u, n, t, l)),
    (t.elementType = e),
    (t.type = r),
    (t.lanes = i),
    t
  );
}
function At(e, t, n, r) {
  return ((e = Re(7, e, r, t)), (e.lanes = n), e);
}
function Il(e, t, n, r) {
  return (
    (e = Re(22, e, r, t)),
    (e.elementType = ua),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function gi(e, t, n) {
  return ((e = Re(6, e, null, t)), (e.lanes = n), e);
}
function wi(e, t, n) {
  return (
    (t = Re(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function Vp(e, t, n, r, l) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = bl(0)),
    (this.expirationTimes = bl(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = bl(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = l),
    (this.mutableSourceEagerHydrationData = null));
}
function fo(e, t, n, r, l, i, u, o, s) {
  return (
    (e = new Vp(e, t, n, o, s)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = Re(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Gu(i),
    e
  );
}
function Hp(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Zt,
    key: r == null ? null : '' + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Zc(e) {
  if (!e) return Pt;
  e = e._reactInternals;
  e: {
    if (qt(e) !== e || e.tag !== 1) throw Error(S(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (we(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(S(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (we(n)) return Za(e, n, t);
  }
  return t;
}
function Jc(e, t, n, r, l, i, u, o, s) {
  return (
    (e = fo(n, r, !0, e, l, i, u, o, s)),
    (e.context = Zc(null)),
    (n = e.current),
    (r = fe()),
    (l = Ct(n)),
    (i = Je(r, l)),
    (i.callback = t ?? null),
    wt(n, i, l),
    (e.current.lanes = l),
    hr(e, l, r),
    Se(e, r),
    e
  );
}
function Ul(e, t, n, r) {
  var l = t.current,
    i = fe(),
    u = Ct(l);
  return (
    (n = Zc(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Je(i, u)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = wt(l, t, u)),
    e !== null && (Ae(e, l, u, i), Wr(e, l, u)),
    u
  );
}
function Cl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Ps(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function po(e, t) {
  (Ps(e, t), (e = e.alternate) && Ps(e, t));
}
function Kp() {
  return null;
}
var bc =
  typeof reportError == 'function'
    ? reportError
    : function (e) {
        console.error(e);
      };
function ho(e) {
  this._internalRoot = e;
}
$l.prototype.render = ho.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(S(409));
  Ul(e, t, null, null);
};
$l.prototype.unmount = ho.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (Ht(function () {
      Ul(null, e, null, null);
    }),
      (t[et] = null));
  }
};
function $l(e) {
  this._internalRoot = e;
}
$l.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Ra();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < ct.length && t !== 0 && t < ct[n].priority; n++);
    (ct.splice(n, 0, e), n === 0 && Ta(e));
  }
};
function vo(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Al(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== ' react-mount-point-unstable '))
  );
}
function _s() {}
function qp(e, t, n, r, l) {
  if (l) {
    if (typeof r == 'function') {
      var i = r;
      r = function () {
        var a = Cl(u);
        i.call(a);
      };
    }
    var u = Jc(t, r, e, 0, null, !1, !1, '', _s);
    return (
      (e._reactRootContainer = u),
      (e[et] = u.current),
      nr(e.nodeType === 8 ? e.parentNode : e),
      Ht(),
      u
    );
  }
  for (; (l = e.lastChild); ) e.removeChild(l);
  if (typeof r == 'function') {
    var o = r;
    r = function () {
      var a = Cl(s);
      o.call(a);
    };
  }
  var s = fo(e, 0, !1, null, null, !1, !1, '', _s);
  return (
    (e._reactRootContainer = s),
    (e[et] = s.current),
    nr(e.nodeType === 8 ? e.parentNode : e),
    Ht(function () {
      Ul(t, s, n, r);
    }),
    s
  );
}
function Ql(e, t, n, r, l) {
  var i = n._reactRootContainer;
  if (i) {
    var u = i;
    if (typeof l == 'function') {
      var o = l;
      l = function () {
        var s = Cl(u);
        o.call(s);
      };
    }
    Ul(t, u, e, l);
  } else u = qp(n, t, e, l, r);
  return Cl(u);
}
Na = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = In(t.pendingLanes);
        n !== 0 &&
          (Mu(t, n | 1), Se(t, q()), !(z & 6) && ((xn = q() + 500), Nt()));
      }
      break;
    case 13:
      (Ht(function () {
        var r = tt(e, 1);
        if (r !== null) {
          var l = fe();
          Ae(r, e, 1, l);
        }
      }),
        po(e, 1));
  }
};
zu = function (e) {
  if (e.tag === 13) {
    var t = tt(e, 134217728);
    if (t !== null) {
      var n = fe();
      Ae(t, e, 134217728, n);
    }
    po(e, 134217728);
  }
};
Fa = function (e) {
  if (e.tag === 13) {
    var t = Ct(e),
      n = tt(e, t);
    if (n !== null) {
      var r = fe();
      Ae(n, e, t, r);
    }
    po(e, t);
  }
};
Ra = function () {
  return j;
};
La = function (e, t) {
  var n = j;
  try {
    return ((j = e), t());
  } finally {
    j = n;
  }
};
Ii = function (e, t, n) {
  switch (t) {
    case 'input':
      if ((Ri(e, n), (t = n.name), n.type === 'radio' && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            'input[name=' + JSON.stringify('' + t) + '][type="radio"]'
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = Ll(r);
            if (!l) throw Error(S(90));
            (sa(r), Ri(r, l));
          }
        }
      }
      break;
    case 'textarea':
      ca(e, n);
      break;
    case 'select':
      ((t = n.value), t != null && cn(e, !!n.multiple, t, !1));
  }
};
ya = oo;
ga = Ht;
var Gp = { usingClientEntryPoint: !1, Events: [mr, nn, Ll, va, ma, oo] },
  zn = {
    findFiberByHostInstance: zt,
    bundleType: 0,
    version: '18.3.1',
    rendererPackageName: 'react-dom',
  },
  Yp = {
    bundleType: zn.bundleType,
    version: zn.version,
    rendererPackageName: zn.rendererPackageName,
    rendererConfig: zn.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: rt.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = Ca(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: zn.findFiberByHostInstance || Kp,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: '18.3.1-next-f1338f8080-20240426',
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
  var Ir = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Ir.isDisabled && Ir.supportsFiber)
    try {
      ((Ol = Ir.inject(Yp)), (He = Ir));
    } catch {}
}
_e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Gp;
_e.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!vo(t)) throw Error(S(200));
  return Hp(e, t, null, n);
};
_e.createRoot = function (e, t) {
  if (!vo(e)) throw Error(S(299));
  var n = !1,
    r = '',
    l = bc;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
    (t = fo(e, 1, !1, null, null, n, !1, r, l)),
    (e[et] = t.current),
    nr(e.nodeType === 8 ? e.parentNode : e),
    new ho(t)
  );
};
_e.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == 'function'
      ? Error(S(188))
      : ((e = Object.keys(e).join(',')), Error(S(268, e)));
  return ((e = Ca(t)), (e = e === null ? null : e.stateNode), e);
};
_e.flushSync = function (e) {
  return Ht(e);
};
_e.hydrate = function (e, t, n) {
  if (!Al(t)) throw Error(S(200));
  return Ql(null, e, t, !0, n);
};
_e.hydrateRoot = function (e, t, n) {
  if (!vo(e)) throw Error(S(405));
  var r = (n != null && n.hydratedSources) || null,
    l = !1,
    i = '',
    u = bc;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (l = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (u = n.onRecoverableError)),
    (t = Jc(t, null, e, 1, n ?? null, l, !1, i, u)),
    (e[et] = t.current),
    nr(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (l = n._getVersion),
        (l = l(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, l])
          : t.mutableSourceEagerHydrationData.push(n, l));
  return new $l(t);
};
_e.render = function (e, t, n) {
  if (!Al(t)) throw Error(S(200));
  return Ql(null, e, t, !1, n);
};
_e.unmountComponentAtNode = function (e) {
  if (!Al(e)) throw Error(S(40));
  return e._reactRootContainer
    ? (Ht(function () {
        Ql(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[et] = null));
        });
      }),
      !0)
    : !1;
};
_e.unstable_batchedUpdates = oo;
_e.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Al(n)) throw Error(S(200));
  if (e == null || e._reactInternals === void 0) throw Error(S(38));
  return Ql(e, t, n, !1, r);
};
_e.version = '18.3.1-next-f1338f8080-20240426';
function ef() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ef);
    } catch (e) {
      console.error(e);
    }
}
(ef(), (ea.exports = _e));
var tf = ea.exports;
const Xp = Bs(tf);
var Os = tf;
((ki.createRoot = Os.createRoot), (ki.hydrateRoot = Os.hydrateRoot));
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function fr() {
  return (
    (fr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    fr.apply(this, arguments)
  );
}
var ht;
(function (e) {
  ((e.Pop = 'POP'), (e.Push = 'PUSH'), (e.Replace = 'REPLACE'));
})(ht || (ht = {}));
const Ns = 'popstate';
function Zp(e) {
  e === void 0 && (e = {});
  function t(r, l) {
    let { pathname: i, search: u, hash: o } = r.location;
    return mu(
      '',
      { pathname: i, search: u, hash: o },
      (l.state && l.state.usr) || null,
      (l.state && l.state.key) || 'default'
    );
  }
  function n(r, l) {
    return typeof l == 'string' ? l : xl(l);
  }
  return bp(t, n, null, e);
}
function X(e, t) {
  if (e === !1 || e === null || typeof e > 'u') throw new Error(t);
}
function nf(e, t) {
  if (!e) {
    typeof console < 'u' && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function Jp() {
  return Math.random().toString(36).substr(2, 8);
}
function Fs(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function mu(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    fr(
      { pathname: typeof e == 'string' ? e : e.pathname, search: '', hash: '' },
      typeof t == 'string' ? _n(t) : t,
      { state: n, key: (t && t.key) || r || Jp() }
    )
  );
}
function xl(e) {
  let { pathname: t = '/', search: n = '', hash: r = '' } = e;
  return (
    n && n !== '?' && (t += n.charAt(0) === '?' ? n : '?' + n),
    r && r !== '#' && (t += r.charAt(0) === '#' ? r : '#' + r),
    t
  );
}
function _n(e) {
  let t = {};
  if (e) {
    let n = e.indexOf('#');
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf('?');
    (r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e));
  }
  return t;
}
function bp(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: l = document.defaultView, v5Compat: i = !1 } = r,
    u = l.history,
    o = ht.Pop,
    s = null,
    a = h();
  a == null && ((a = 0), u.replaceState(fr({}, u.state, { idx: a }), ''));
  function h() {
    return (u.state || { idx: null }).idx;
  }
  function p() {
    o = ht.Pop;
    let x = h(),
      f = x == null ? null : x - a;
    ((a = x), s && s({ action: o, location: g.location, delta: f }));
  }
  function v(x, f) {
    o = ht.Push;
    let c = mu(g.location, x, f);
    a = h() + 1;
    let d = Fs(c, a),
      w = g.createHref(c);
    try {
      u.pushState(d, '', w);
    } catch (C) {
      if (C instanceof DOMException && C.name === 'DataCloneError') throw C;
      l.location.assign(w);
    }
    i && s && s({ action: o, location: g.location, delta: 1 });
  }
  function m(x, f) {
    o = ht.Replace;
    let c = mu(g.location, x, f);
    a = h();
    let d = Fs(c, a),
      w = g.createHref(c);
    (u.replaceState(d, '', w),
      i && s && s({ action: o, location: g.location, delta: 0 }));
  }
  function y(x) {
    let f = l.location.origin !== 'null' ? l.location.origin : l.location.href,
      c = typeof x == 'string' ? x : xl(x);
    return (
      (c = c.replace(/ $/, '%20')),
      X(
        f,
        'No window.location.(origin|href) available to create URL for href: ' +
          c
      ),
      new URL(c, f)
    );
  }
  let g = {
    get action() {
      return o;
    },
    get location() {
      return e(l, u);
    },
    listen(x) {
      if (s) throw new Error('A history only accepts one active listener');
      return (
        l.addEventListener(Ns, p),
        (s = x),
        () => {
          (l.removeEventListener(Ns, p), (s = null));
        }
      );
    },
    createHref(x) {
      return t(l, x);
    },
    createURL: y,
    encodeLocation(x) {
      let f = y(x);
      return { pathname: f.pathname, search: f.search, hash: f.hash };
    },
    push: v,
    replace: m,
    go(x) {
      return u.go(x);
    },
  };
  return g;
}
var Rs;
(function (e) {
  ((e.data = 'data'),
    (e.deferred = 'deferred'),
    (e.redirect = 'redirect'),
    (e.error = 'error'));
})(Rs || (Rs = {}));
function eh(e, t, n) {
  return (n === void 0 && (n = '/'), th(e, t, n));
}
function th(e, t, n, r) {
  let l = typeof t == 'string' ? _n(t) : t,
    i = mo(l.pathname || '/', n);
  if (i == null) return null;
  let u = rf(e);
  nh(u);
  let o = null;
  for (let s = 0; o == null && s < u.length; ++s) {
    let a = hh(i);
    o = fh(u[s], a);
  }
  return o;
}
function rf(e, t, n, r) {
  (t === void 0 && (t = []),
    n === void 0 && (n = []),
    r === void 0 && (r = ''));
  let l = (i, u, o) => {
    let s = {
      relativePath: o === void 0 ? i.path || '' : o,
      caseSensitive: i.caseSensitive === !0,
      childrenIndex: u,
      route: i,
    };
    s.relativePath.startsWith('/') &&
      (X(
        s.relativePath.startsWith(r),
        'Absolute route path "' +
          s.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          'must start with the combined path of all its parent routes.'
      ),
      (s.relativePath = s.relativePath.slice(r.length)));
    let a = kt([r, s.relativePath]),
      h = n.concat(s);
    (i.children &&
      i.children.length > 0 &&
      (X(
        i.index !== !0,
        'Index routes must not have child routes. Please remove ' +
          ('all child routes from route path "' + a + '".')
      ),
      rf(i.children, t, h, a)),
      !(i.path == null && !i.index) &&
        t.push({ path: a, score: ah(a, i.index), routesMeta: h }));
  };
  return (
    e.forEach((i, u) => {
      var o;
      if (i.path === '' || !((o = i.path) != null && o.includes('?'))) l(i, u);
      else for (let s of lf(i.path)) l(i, u, s);
    }),
    t
  );
}
function lf(e) {
  let t = e.split('/');
  if (t.length === 0) return [];
  let [n, ...r] = t,
    l = n.endsWith('?'),
    i = n.replace(/\?$/, '');
  if (r.length === 0) return l ? [i, ''] : [i];
  let u = lf(r.join('/')),
    o = [];
  return (
    o.push(...u.map(s => (s === '' ? i : [i, s].join('/')))),
    l && o.push(...u),
    o.map(s => (e.startsWith('/') && s === '' ? '/' : s))
  );
}
function nh(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : ch(
          t.routesMeta.map(r => r.childrenIndex),
          n.routesMeta.map(r => r.childrenIndex)
        )
  );
}
const rh = /^:[\w-]+$/,
  lh = 3,
  ih = 2,
  uh = 1,
  oh = 10,
  sh = -2,
  Ls = e => e === '*';
function ah(e, t) {
  let n = e.split('/'),
    r = n.length;
  return (
    n.some(Ls) && (r += sh),
    t && (r += ih),
    n
      .filter(l => !Ls(l))
      .reduce((l, i) => l + (rh.test(i) ? lh : i === '' ? uh : oh), r)
  );
}
function ch(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, l) => r === t[l])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function fh(e, t, n) {
  let { routesMeta: r } = e,
    l = {},
    i = '/',
    u = [];
  for (let o = 0; o < r.length; ++o) {
    let s = r[o],
      a = o === r.length - 1,
      h = i === '/' ? t : t.slice(i.length) || '/',
      p = dh(
        { path: s.relativePath, caseSensitive: s.caseSensitive, end: a },
        h
      ),
      v = s.route;
    if (!p) return null;
    (Object.assign(l, p.params),
      u.push({
        params: l,
        pathname: kt([i, p.pathname]),
        pathnameBase: gh(kt([i, p.pathnameBase])),
        route: v,
      }),
      p.pathnameBase !== '/' && (i = kt([i, p.pathnameBase])));
  }
  return u;
}
function dh(e, t) {
  typeof e == 'string' && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = ph(e.path, e.caseSensitive, e.end),
    l = t.match(n);
  if (!l) return null;
  let i = l[0],
    u = i.replace(/(.)\/+$/, '$1'),
    o = l.slice(1);
  return {
    params: r.reduce((a, h, p) => {
      let { paramName: v, isOptional: m } = h;
      if (v === '*') {
        let g = o[p] || '';
        u = i.slice(0, i.length - g.length).replace(/(.)\/+$/, '$1');
      }
      const y = o[p];
      return (
        m && !y ? (a[v] = void 0) : (a[v] = (y || '').replace(/%2F/g, '/')),
        a
      );
    }, {}),
    pathname: i,
    pathnameBase: u,
    pattern: e,
  };
}
function ph(e, t, n) {
  (t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    nf(
      e === '*' || !e.endsWith('*') || e.endsWith('/*'),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, '/*') + '" because the `*` character must ') +
        'always follow a `/` in the pattern. To get rid of this warning, ' +
        ('please change the route path to "' + e.replace(/\*$/, '/*') + '".')
    ));
  let r = [],
    l =
      '^' +
      e
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (u, o, s) => (
            r.push({ paramName: o, isOptional: s != null }),
            s ? '/?([^\\/]+)?' : '/([^\\/]+)'
          )
        );
  return (
    e.endsWith('*')
      ? (r.push({ paramName: '*' }),
        (l += e === '*' || e === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : n
        ? (l += '\\/*$')
        : e !== '' && e !== '/' && (l += '(?:(?=\\/|$))'),
    [new RegExp(l, t ? void 0 : 'i'), r]
  );
}
function hh(e) {
  try {
    return e
      .split('/')
      .map(t => decodeURIComponent(t).replace(/\//g, '%2F'))
      .join('/');
  } catch (t) {
    return (
      nf(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ('encoding (' + t + ').')
      ),
      e
    );
  }
}
function mo(e, t) {
  if (t === '/') return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith('/') ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== '/' ? null : e.slice(n) || '/';
}
function vh(e, t) {
  t === void 0 && (t = '/');
  let {
    pathname: n,
    search: r = '',
    hash: l = '',
  } = typeof e == 'string' ? _n(e) : e;
  return {
    pathname: n ? (n.startsWith('/') ? n : mh(n, t)) : t,
    search: wh(r),
    hash: Sh(l),
  };
}
function mh(e, t) {
  let n = t.replace(/\/+$/, '').split('/');
  return (
    e.split('/').forEach(l => {
      l === '..' ? n.length > 1 && n.pop() : l !== '.' && n.push(l);
    }),
    n.length > 1 ? n.join('/') : '/'
  );
}
function Si(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ('`to.' +
      t +
      '` field [' +
      JSON.stringify(r) +
      '].  Please separate it out to the ') +
    ('`to.' + n + '` field. Alternatively you may provide the full path as ') +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function yh(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0)
  );
}
function uf(e, t) {
  let n = yh(e);
  return t
    ? n.map((r, l) => (l === n.length - 1 ? r.pathname : r.pathnameBase))
    : n.map(r => r.pathnameBase);
}
function of(e, t, n, r) {
  r === void 0 && (r = !1);
  let l;
  typeof e == 'string'
    ? (l = _n(e))
    : ((l = fr({}, e)),
      X(
        !l.pathname || !l.pathname.includes('?'),
        Si('?', 'pathname', 'search', l)
      ),
      X(
        !l.pathname || !l.pathname.includes('#'),
        Si('#', 'pathname', 'hash', l)
      ),
      X(!l.search || !l.search.includes('#'), Si('#', 'search', 'hash', l)));
  let i = e === '' || l.pathname === '',
    u = i ? '/' : l.pathname,
    o;
  if (u == null) o = n;
  else {
    let p = t.length - 1;
    if (!r && u.startsWith('..')) {
      let v = u.split('/');
      for (; v[0] === '..'; ) (v.shift(), (p -= 1));
      l.pathname = v.join('/');
    }
    o = p >= 0 ? t[p] : '/';
  }
  let s = vh(l, o),
    a = u && u !== '/' && u.endsWith('/'),
    h = (i || u === '.') && n.endsWith('/');
  return (!s.pathname.endsWith('/') && (a || h) && (s.pathname += '/'), s);
}
const kt = e => e.join('/').replace(/\/\/+/g, '/'),
  gh = e => e.replace(/\/+$/, '').replace(/^\/*/, '/'),
  wh = e => (!e || e === '?' ? '' : e.startsWith('?') ? e : '?' + e),
  Sh = e => (!e || e === '#' ? '' : e.startsWith('#') ? e : '#' + e);
function Ch(e) {
  return (
    e != null &&
    typeof e.status == 'number' &&
    typeof e.statusText == 'string' &&
    typeof e.internal == 'boolean' &&
    'data' in e
  );
}
const sf = ['post', 'put', 'patch', 'delete'];
new Set(sf);
const xh = ['get', ...sf];
new Set(xh);
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function dr() {
  return (
    (dr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    dr.apply(this, arguments)
  );
}
const yo = _.createContext(null),
  kh = _.createContext(null),
  Gt = _.createContext(null),
  Bl = _.createContext(null),
  Yt = _.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  af = _.createContext(null);
function Eh(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  gr() || X(!1);
  let { basename: r, navigator: l } = _.useContext(Gt),
    { hash: i, pathname: u, search: o } = ff(e, { relative: n }),
    s = u;
  return (
    r !== '/' && (s = u === '/' ? r : kt([r, u])),
    l.createHref({ pathname: s, search: o, hash: i })
  );
}
function gr() {
  return _.useContext(Bl) != null;
}
function Wl() {
  return (gr() || X(!1), _.useContext(Bl).location);
}
function cf(e) {
  _.useContext(Gt).static || _.useLayoutEffect(e);
}
function Ph() {
  let { isDataRoute: e } = _.useContext(Yt);
  return e ? Uh() : _h();
}
function _h() {
  gr() || X(!1);
  let e = _.useContext(yo),
    { basename: t, future: n, navigator: r } = _.useContext(Gt),
    { matches: l } = _.useContext(Yt),
    { pathname: i } = Wl(),
    u = JSON.stringify(uf(l, n.v7_relativeSplatPath)),
    o = _.useRef(!1);
  return (
    cf(() => {
      o.current = !0;
    }),
    _.useCallback(
      function (a, h) {
        if ((h === void 0 && (h = {}), !o.current)) return;
        if (typeof a == 'number') {
          r.go(a);
          return;
        }
        let p = of(a, JSON.parse(u), i, h.relative === 'path');
        (e == null &&
          t !== '/' &&
          (p.pathname = p.pathname === '/' ? t : kt([t, p.pathname])),
          (h.replace ? r.replace : r.push)(p, h.state, h));
      },
      [t, r, u, i, e]
    )
  );
}
function ff(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = _.useContext(Gt),
    { matches: l } = _.useContext(Yt),
    { pathname: i } = Wl(),
    u = JSON.stringify(uf(l, r.v7_relativeSplatPath));
  return _.useMemo(() => of(e, JSON.parse(u), i, n === 'path'), [e, u, i, n]);
}
function Oh(e, t) {
  return Nh(e, t);
}
function Nh(e, t, n, r) {
  gr() || X(!1);
  let { navigator: l } = _.useContext(Gt),
    { matches: i } = _.useContext(Yt),
    u = i[i.length - 1],
    o = u ? u.params : {};
  u && u.pathname;
  let s = u ? u.pathnameBase : '/';
  u && u.route;
  let a = Wl(),
    h;
  if (t) {
    var p;
    let x = typeof t == 'string' ? _n(t) : t;
    (s === '/' || ((p = x.pathname) != null && p.startsWith(s)) || X(!1),
      (h = x));
  } else h = a;
  let v = h.pathname || '/',
    m = v;
  if (s !== '/') {
    let x = s.replace(/^\//, '').split('/');
    m = '/' + v.replace(/^\//, '').split('/').slice(x.length).join('/');
  }
  let y = eh(e, { pathname: m }),
    g = Mh(
      y &&
        y.map(x =>
          Object.assign({}, x, {
            params: Object.assign({}, o, x.params),
            pathname: kt([
              s,
              l.encodeLocation
                ? l.encodeLocation(x.pathname).pathname
                : x.pathname,
            ]),
            pathnameBase:
              x.pathnameBase === '/'
                ? s
                : kt([
                    s,
                    l.encodeLocation
                      ? l.encodeLocation(x.pathnameBase).pathname
                      : x.pathnameBase,
                  ]),
          })
        ),
      i,
      n,
      r
    );
  return t && g
    ? _.createElement(
        Bl.Provider,
        {
          value: {
            location: dr(
              {
                pathname: '/',
                search: '',
                hash: '',
                state: null,
                key: 'default',
              },
              h
            ),
            navigationType: ht.Pop,
          },
        },
        g
      )
    : g;
}
function Fh() {
  let e = Ih(),
    t = Ch(e)
      ? e.status + ' ' + e.statusText
      : e instanceof Error
        ? e.message
        : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    l = { padding: '0.5rem', backgroundColor: 'rgba(200,200,200, 0.5)' };
  return _.createElement(
    _.Fragment,
    null,
    _.createElement('h2', null, 'Unexpected Application Error!'),
    _.createElement('h3', { style: { fontStyle: 'italic' } }, t),
    n ? _.createElement('pre', { style: l }, n) : null,
    null
  );
}
const Rh = _.createElement(Fh, null);
class Lh extends _.Component {
  constructor(t) {
    (super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      }));
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== 'idle' && t.revalidation === 'idle')
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      'React Router caught the following error during render',
      t,
      n
    );
  }
  render() {
    return this.state.error !== void 0
      ? _.createElement(
          Yt.Provider,
          { value: this.props.routeContext },
          _.createElement(af.Provider, {
            value: this.state.error,
            children: this.props.component,
          })
        )
      : this.props.children;
  }
}
function Th(e) {
  let { routeContext: t, match: n, children: r } = e,
    l = _.useContext(yo);
  return (
    l &&
      l.static &&
      l.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (l.staticContext._deepestRenderedBoundaryId = n.route.id),
    _.createElement(Yt.Provider, { value: t }, r)
  );
}
function Mh(e, t, n, r) {
  var l;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    e == null)
  ) {
    var i;
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (
      (i = r) != null &&
      i.v7_partialHydration &&
      t.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      e = n.matches;
    else return null;
  }
  let u = e,
    o = (l = n) == null ? void 0 : l.errors;
  if (o != null) {
    let h = u.findIndex(
      p => p.route.id && (o == null ? void 0 : o[p.route.id]) !== void 0
    );
    (h >= 0 || X(!1), (u = u.slice(0, Math.min(u.length, h + 1))));
  }
  let s = !1,
    a = -1;
  if (n && r && r.v7_partialHydration)
    for (let h = 0; h < u.length; h++) {
      let p = u[h];
      if (
        ((p.route.HydrateFallback || p.route.hydrateFallbackElement) && (a = h),
        p.route.id)
      ) {
        let { loaderData: v, errors: m } = n,
          y =
            p.route.loader &&
            v[p.route.id] === void 0 &&
            (!m || m[p.route.id] === void 0);
        if (p.route.lazy || y) {
          ((s = !0), a >= 0 ? (u = u.slice(0, a + 1)) : (u = [u[0]]));
          break;
        }
      }
    }
  return u.reduceRight((h, p, v) => {
    let m,
      y = !1,
      g = null,
      x = null;
    n &&
      ((m = o && p.route.id ? o[p.route.id] : void 0),
      (g = p.route.errorElement || Rh),
      s &&
        (a < 0 && v === 0
          ? ($h('route-fallback'), (y = !0), (x = null))
          : a === v &&
            ((y = !0), (x = p.route.hydrateFallbackElement || null))));
    let f = t.concat(u.slice(0, v + 1)),
      c = () => {
        let d;
        return (
          m
            ? (d = g)
            : y
              ? (d = x)
              : p.route.Component
                ? (d = _.createElement(p.route.Component, null))
                : p.route.element
                  ? (d = p.route.element)
                  : (d = h),
          _.createElement(Th, {
            match: p,
            routeContext: { outlet: h, matches: f, isDataRoute: n != null },
            children: d,
          })
        );
      };
    return n && (p.route.ErrorBoundary || p.route.errorElement || v === 0)
      ? _.createElement(Lh, {
          location: n.location,
          revalidation: n.revalidation,
          component: g,
          error: m,
          children: c(),
          routeContext: { outlet: null, matches: f, isDataRoute: !0 },
        })
      : c();
  }, null);
}
var df = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      e
    );
  })(df || {}),
  pf = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseLoaderData = 'useLoaderData'),
      (e.UseActionData = 'useActionData'),
      (e.UseRouteError = 'useRouteError'),
      (e.UseNavigation = 'useNavigation'),
      (e.UseRouteLoaderData = 'useRouteLoaderData'),
      (e.UseMatches = 'useMatches'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      (e.UseRouteId = 'useRouteId'),
      e
    );
  })(pf || {});
function zh(e) {
  let t = _.useContext(yo);
  return (t || X(!1), t);
}
function Dh(e) {
  let t = _.useContext(kh);
  return (t || X(!1), t);
}
function jh(e) {
  let t = _.useContext(Yt);
  return (t || X(!1), t);
}
function hf(e) {
  let t = jh(),
    n = t.matches[t.matches.length - 1];
  return (n.route.id || X(!1), n.route.id);
}
function Ih() {
  var e;
  let t = _.useContext(af),
    n = Dh(),
    r = hf();
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
function Uh() {
  let { router: e } = zh(df.UseNavigateStable),
    t = hf(pf.UseNavigateStable),
    n = _.useRef(!1);
  return (
    cf(() => {
      n.current = !0;
    }),
    _.useCallback(
      function (l, i) {
        (i === void 0 && (i = {}),
          n.current &&
            (typeof l == 'number'
              ? e.navigate(l)
              : e.navigate(l, dr({ fromRouteId: t }, i))));
      },
      [e, t]
    )
  );
}
const Ts = {};
function $h(e, t, n) {
  Ts[e] || (Ts[e] = !0);
}
function Ah(e, t) {
  (e == null || e.v7_startTransition, e == null || e.v7_relativeSplatPath);
}
function ut(e) {
  X(!1);
}
function Qh(e) {
  let {
    basename: t = '/',
    children: n = null,
    location: r,
    navigationType: l = ht.Pop,
    navigator: i,
    static: u = !1,
    future: o,
  } = e;
  gr() && X(!1);
  let s = t.replace(/^\/*/, '/'),
    a = _.useMemo(
      () => ({
        basename: s,
        navigator: i,
        static: u,
        future: dr({ v7_relativeSplatPath: !1 }, o),
      }),
      [s, o, i, u]
    );
  typeof r == 'string' && (r = _n(r));
  let {
      pathname: h = '/',
      search: p = '',
      hash: v = '',
      state: m = null,
      key: y = 'default',
    } = r,
    g = _.useMemo(() => {
      let x = mo(h, s);
      return x == null
        ? null
        : {
            location: { pathname: x, search: p, hash: v, state: m, key: y },
            navigationType: l,
          };
    }, [s, h, p, v, m, y, l]);
  return g == null
    ? null
    : _.createElement(
        Gt.Provider,
        { value: a },
        _.createElement(Bl.Provider, { children: n, value: g })
      );
}
function Bh(e) {
  let { children: t, location: n } = e;
  return Oh(yu(t), n);
}
new Promise(() => {});
function yu(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    _.Children.forEach(e, (r, l) => {
      if (!_.isValidElement(r)) return;
      let i = [...t, l];
      if (r.type === _.Fragment) {
        n.push.apply(n, yu(r.props.children, i));
        return;
      }
      (r.type !== ut && X(!1), !r.props.index || !r.props.children || X(!1));
      let u = {
        id: r.props.id || i.join('-'),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      (r.props.children && (u.children = yu(r.props.children, i)), n.push(u));
    }),
    n
  );
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function gu() {
  return (
    (gu = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    gu.apply(this, arguments)
  );
}
function Wh(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    l,
    i;
  for (i = 0; i < r.length; i++)
    ((l = r[i]), !(t.indexOf(l) >= 0) && (n[l] = e[l]));
  return n;
}
function Vh(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function Hh(e, t) {
  return e.button === 0 && (!t || t === '_self') && !Vh(e);
}
const Kh = [
    'onClick',
    'relative',
    'reloadDocument',
    'replace',
    'state',
    'target',
    'to',
    'preventScrollReset',
    'viewTransition',
  ],
  qh = '6';
try {
  window.__reactRouterVersion = qh;
} catch {}
const Gh = 'startTransition',
  Ms = $f[Gh];
function Yh(e) {
  let { basename: t, children: n, future: r, window: l } = e,
    i = _.useRef();
  i.current == null && (i.current = Zp({ window: l, v5Compat: !0 }));
  let u = i.current,
    [o, s] = _.useState({ action: u.action, location: u.location }),
    { v7_startTransition: a } = r || {},
    h = _.useCallback(
      p => {
        a && Ms ? Ms(() => s(p)) : s(p);
      },
      [s, a]
    );
  return (
    _.useLayoutEffect(() => u.listen(h), [u, h]),
    _.useEffect(() => Ah(r), [r]),
    _.createElement(Qh, {
      basename: t,
      children: n,
      location: o.location,
      navigationType: o.action,
      navigator: u,
      future: r,
    })
  );
}
const Xh =
    typeof window < 'u' &&
    typeof window.document < 'u' &&
    typeof window.document.createElement < 'u',
  Zh = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Jh = _.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: l,
        reloadDocument: i,
        replace: u,
        state: o,
        target: s,
        to: a,
        preventScrollReset: h,
        viewTransition: p,
      } = t,
      v = Wh(t, Kh),
      { basename: m } = _.useContext(Gt),
      y,
      g = !1;
    if (typeof a == 'string' && Zh.test(a) && ((y = a), Xh))
      try {
        let d = new URL(window.location.href),
          w = a.startsWith('//') ? new URL(d.protocol + a) : new URL(a),
          C = mo(w.pathname, m);
        w.origin === d.origin && C != null
          ? (a = C + w.search + w.hash)
          : (g = !0);
      } catch {}
    let x = Eh(a, { relative: l }),
      f = bh(a, {
        replace: u,
        state: o,
        target: s,
        preventScrollReset: h,
        relative: l,
        viewTransition: p,
      });
    function c(d) {
      (r && r(d), d.defaultPrevented || f(d));
    }
    return _.createElement(
      'a',
      gu({}, v, { href: y || x, onClick: g || i ? r : c, ref: n, target: s })
    );
  });
var zs;
(function (e) {
  ((e.UseScrollRestoration = 'useScrollRestoration'),
    (e.UseSubmit = 'useSubmit'),
    (e.UseSubmitFetcher = 'useSubmitFetcher'),
    (e.UseFetcher = 'useFetcher'),
    (e.useViewTransitionState = 'useViewTransitionState'));
})(zs || (zs = {}));
var Ds;
(function (e) {
  ((e.UseFetcher = 'useFetcher'),
    (e.UseFetchers = 'useFetchers'),
    (e.UseScrollRestoration = 'useScrollRestoration'));
})(Ds || (Ds = {}));
function bh(e, t) {
  let {
      target: n,
      replace: r,
      state: l,
      preventScrollReset: i,
      relative: u,
      viewTransition: o,
    } = t === void 0 ? {} : t,
    s = Ph(),
    a = Wl(),
    h = ff(e, { relative: u });
  return _.useCallback(
    p => {
      if (Hh(p, n)) {
        p.preventDefault();
        let v = r !== void 0 ? r : xl(a) === xl(h);
        s(e, {
          replace: v,
          state: l,
          preventScrollReset: i,
          relative: u,
          viewTransition: o,
        });
      }
    },
    [a, s, h, r, l, n, e, i, u, o]
  );
}
function wu(e, t) {
  return (
    (wu = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, r) {
          return ((n.__proto__ = r), n);
        }),
    wu(e, t)
  );
}
function Vl(e, t) {
  ((e.prototype = Object.create(t.prototype)),
    (e.prototype.constructor = e),
    wu(e, t));
}
var Hl = (function () {
  function e() {
    this.listeners = [];
  }
  var t = e.prototype;
  return (
    (t.subscribe = function (r) {
      var l = this,
        i = r || function () {};
      return (
        this.listeners.push(i),
        this.onSubscribe(),
        function () {
          ((l.listeners = l.listeners.filter(function (u) {
            return u !== i;
          })),
            l.onUnsubscribe());
        }
      );
    }),
    (t.hasListeners = function () {
      return this.listeners.length > 0;
    }),
    (t.onSubscribe = function () {}),
    (t.onUnsubscribe = function () {}),
    e
  );
})();
function D() {
  return (
    (D = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    D.apply(null, arguments)
  );
}
var vf = typeof window > 'u';
function ae() {}
function ev(e, t) {
  return typeof e == 'function' ? e(t) : e;
}
function tv(e) {
  return typeof e == 'number' && e >= 0 && e !== 1 / 0;
}
function kl(e) {
  return Array.isArray(e) ? e : [e];
}
function nv(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function Ci(e, t, n) {
  return Kl(e)
    ? typeof t == 'function'
      ? D({}, n, { queryKey: e, queryFn: t })
      : D({}, t, { queryKey: e })
    : e;
}
function at(e, t, n) {
  return Kl(e) ? [D({}, t, { queryKey: e }), n] : [e || {}, t];
}
function rv(e, t) {
  if ((e === !0 && t === !0) || (e == null && t == null)) return 'all';
  if (e === !1 && t === !1) return 'none';
  var n = e ?? !t;
  return n ? 'active' : 'inactive';
}
function js(e, t) {
  var n = e.active,
    r = e.exact,
    l = e.fetching,
    i = e.inactive,
    u = e.predicate,
    o = e.queryKey,
    s = e.stale;
  if (Kl(o)) {
    if (r) {
      if (t.queryHash !== go(o, t.options)) return !1;
    } else if (!El(t.queryKey, o)) return !1;
  }
  var a = rv(n, i);
  if (a === 'none') return !1;
  if (a !== 'all') {
    var h = t.isActive();
    if ((a === 'active' && !h) || (a === 'inactive' && h)) return !1;
  }
  return !(
    (typeof s == 'boolean' && t.isStale() !== s) ||
    (typeof l == 'boolean' && t.isFetching() !== l) ||
    (u && !u(t))
  );
}
function Is(e, t) {
  var n = e.exact,
    r = e.fetching,
    l = e.predicate,
    i = e.mutationKey;
  if (Kl(i)) {
    if (!t.options.mutationKey) return !1;
    if (n) {
      if (It(t.options.mutationKey) !== It(i)) return !1;
    } else if (!El(t.options.mutationKey, i)) return !1;
  }
  return !(
    (typeof r == 'boolean' && (t.state.status === 'loading') !== r) ||
    (l && !l(t))
  );
}
function go(e, t) {
  var n = (t == null ? void 0 : t.queryKeyHashFn) || It;
  return n(e);
}
function It(e) {
  var t = kl(e);
  return lv(t);
}
function lv(e) {
  return JSON.stringify(e, function (t, n) {
    return Su(n)
      ? Object.keys(n)
          .sort()
          .reduce(function (r, l) {
            return ((r[l] = n[l]), r);
          }, {})
      : n;
  });
}
function El(e, t) {
  return mf(kl(e), kl(t));
}
function mf(e, t) {
  return e === t
    ? !0
    : typeof e != typeof t
      ? !1
      : e && t && typeof e == 'object' && typeof t == 'object'
        ? !Object.keys(t).some(function (n) {
            return !mf(e[n], t[n]);
          })
        : !1;
}
function yf(e, t) {
  if (e === t) return e;
  var n = Array.isArray(e) && Array.isArray(t);
  if (n || (Su(e) && Su(t))) {
    for (
      var r = n ? e.length : Object.keys(e).length,
        l = n ? t : Object.keys(t),
        i = l.length,
        u = n ? [] : {},
        o = 0,
        s = 0;
      s < i;
      s++
    ) {
      var a = n ? s : l[s];
      ((u[a] = yf(e[a], t[a])), u[a] === e[a] && o++);
    }
    return r === i && o === r ? e : u;
  }
  return t;
}
function Su(e) {
  if (!Us(e)) return !1;
  var t = e.constructor;
  if (typeof t > 'u') return !0;
  var n = t.prototype;
  return !(!Us(n) || !n.hasOwnProperty('isPrototypeOf'));
}
function Us(e) {
  return Object.prototype.toString.call(e) === '[object Object]';
}
function Kl(e) {
  return typeof e == 'string' || Array.isArray(e);
}
function iv(e) {
  return new Promise(function (t) {
    setTimeout(t, e);
  });
}
function $s(e) {
  Promise.resolve()
    .then(e)
    .catch(function (t) {
      return setTimeout(function () {
        throw t;
      });
    });
}
function gf() {
  if (typeof AbortController == 'function') return new AbortController();
}
var uv = (function (e) {
    Vl(t, e);
    function t() {
      var r;
      return (
        (r = e.call(this) || this),
        (r.setup = function (l) {
          var i;
          if (!vf && (i = window) != null && i.addEventListener) {
            var u = function () {
              return l();
            };
            return (
              window.addEventListener('visibilitychange', u, !1),
              window.addEventListener('focus', u, !1),
              function () {
                (window.removeEventListener('visibilitychange', u),
                  window.removeEventListener('focus', u));
              }
            );
          }
        }),
        r
      );
    }
    var n = t.prototype;
    return (
      (n.onSubscribe = function () {
        this.cleanup || this.setEventListener(this.setup);
      }),
      (n.onUnsubscribe = function () {
        if (!this.hasListeners()) {
          var l;
          ((l = this.cleanup) == null || l.call(this), (this.cleanup = void 0));
        }
      }),
      (n.setEventListener = function (l) {
        var i,
          u = this;
        ((this.setup = l),
          (i = this.cleanup) == null || i.call(this),
          (this.cleanup = l(function (o) {
            typeof o == 'boolean' ? u.setFocused(o) : u.onFocus();
          })));
      }),
      (n.setFocused = function (l) {
        ((this.focused = l), l && this.onFocus());
      }),
      (n.onFocus = function () {
        this.listeners.forEach(function (l) {
          l();
        });
      }),
      (n.isFocused = function () {
        return typeof this.focused == 'boolean'
          ? this.focused
          : typeof document > 'u'
            ? !0
            : [void 0, 'visible', 'prerender'].includes(
                document.visibilityState
              );
      }),
      t
    );
  })(Hl),
  Xr = new uv(),
  ov = (function (e) {
    Vl(t, e);
    function t() {
      var r;
      return (
        (r = e.call(this) || this),
        (r.setup = function (l) {
          var i;
          if (!vf && (i = window) != null && i.addEventListener) {
            var u = function () {
              return l();
            };
            return (
              window.addEventListener('online', u, !1),
              window.addEventListener('offline', u, !1),
              function () {
                (window.removeEventListener('online', u),
                  window.removeEventListener('offline', u));
              }
            );
          }
        }),
        r
      );
    }
    var n = t.prototype;
    return (
      (n.onSubscribe = function () {
        this.cleanup || this.setEventListener(this.setup);
      }),
      (n.onUnsubscribe = function () {
        if (!this.hasListeners()) {
          var l;
          ((l = this.cleanup) == null || l.call(this), (this.cleanup = void 0));
        }
      }),
      (n.setEventListener = function (l) {
        var i,
          u = this;
        ((this.setup = l),
          (i = this.cleanup) == null || i.call(this),
          (this.cleanup = l(function (o) {
            typeof o == 'boolean' ? u.setOnline(o) : u.onOnline();
          })));
      }),
      (n.setOnline = function (l) {
        ((this.online = l), l && this.onOnline());
      }),
      (n.onOnline = function () {
        this.listeners.forEach(function (l) {
          l();
        });
      }),
      (n.isOnline = function () {
        return typeof this.online == 'boolean'
          ? this.online
          : typeof navigator > 'u' || typeof navigator.onLine > 'u'
            ? !0
            : navigator.onLine;
      }),
      t
    );
  })(Hl),
  Zr = new ov();
function sv(e) {
  return Math.min(1e3 * Math.pow(2, e), 3e4);
}
function Pl(e) {
  return typeof (e == null ? void 0 : e.cancel) == 'function';
}
var wf = function (t) {
  ((this.revert = t == null ? void 0 : t.revert),
    (this.silent = t == null ? void 0 : t.silent));
};
function xi(e) {
  return e instanceof wf;
}
var Sf = function (t) {
    var n = this,
      r = !1,
      l,
      i,
      u,
      o;
    ((this.abort = t.abort),
      (this.cancel = function (v) {
        return l == null ? void 0 : l(v);
      }),
      (this.cancelRetry = function () {
        r = !0;
      }),
      (this.continueRetry = function () {
        r = !1;
      }),
      (this.continue = function () {
        return i == null ? void 0 : i();
      }),
      (this.failureCount = 0),
      (this.isPaused = !1),
      (this.isResolved = !1),
      (this.isTransportCancelable = !1),
      (this.promise = new Promise(function (v, m) {
        ((u = v), (o = m));
      })));
    var s = function (m) {
        n.isResolved ||
          ((n.isResolved = !0),
          t.onSuccess == null || t.onSuccess(m),
          i == null || i(),
          u(m));
      },
      a = function (m) {
        n.isResolved ||
          ((n.isResolved = !0),
          t.onError == null || t.onError(m),
          i == null || i(),
          o(m));
      },
      h = function () {
        return new Promise(function (m) {
          ((i = m), (n.isPaused = !0), t.onPause == null || t.onPause());
        }).then(function () {
          ((i = void 0),
            (n.isPaused = !1),
            t.onContinue == null || t.onContinue());
        });
      },
      p = function v() {
        if (!n.isResolved) {
          var m;
          try {
            m = t.fn();
          } catch (y) {
            m = Promise.reject(y);
          }
          ((l = function (g) {
            if (
              !n.isResolved &&
              (a(new wf(g)), n.abort == null || n.abort(), Pl(m))
            )
              try {
                m.cancel();
              } catch {}
          }),
            (n.isTransportCancelable = Pl(m)),
            Promise.resolve(m)
              .then(s)
              .catch(function (y) {
                var g, x;
                if (!n.isResolved) {
                  var f = (g = t.retry) != null ? g : 3,
                    c = (x = t.retryDelay) != null ? x : sv,
                    d = typeof c == 'function' ? c(n.failureCount, y) : c,
                    w =
                      f === !0 ||
                      (typeof f == 'number' && n.failureCount < f) ||
                      (typeof f == 'function' && f(n.failureCount, y));
                  if (r || !w) {
                    a(y);
                    return;
                  }
                  (n.failureCount++,
                    t.onFail == null || t.onFail(n.failureCount, y),
                    iv(d)
                      .then(function () {
                        if (!Xr.isFocused() || !Zr.isOnline()) return h();
                      })
                      .then(function () {
                        r ? a(y) : v();
                      }));
                }
              }));
        }
      };
    p();
  },
  av = (function () {
    function e() {
      ((this.queue = []),
        (this.transactions = 0),
        (this.notifyFn = function (n) {
          n();
        }),
        (this.batchNotifyFn = function (n) {
          n();
        }));
    }
    var t = e.prototype;
    return (
      (t.batch = function (r) {
        var l;
        this.transactions++;
        try {
          l = r();
        } finally {
          (this.transactions--, this.transactions || this.flush());
        }
        return l;
      }),
      (t.schedule = function (r) {
        var l = this;
        this.transactions
          ? this.queue.push(r)
          : $s(function () {
              l.notifyFn(r);
            });
      }),
      (t.batchCalls = function (r) {
        var l = this;
        return function () {
          for (var i = arguments.length, u = new Array(i), o = 0; o < i; o++)
            u[o] = arguments[o];
          l.schedule(function () {
            r.apply(void 0, u);
          });
        };
      }),
      (t.flush = function () {
        var r = this,
          l = this.queue;
        ((this.queue = []),
          l.length &&
            $s(function () {
              r.batchNotifyFn(function () {
                l.forEach(function (i) {
                  r.notifyFn(i);
                });
              });
            }));
      }),
      (t.setNotifyFunction = function (r) {
        this.notifyFn = r;
      }),
      (t.setBatchNotifyFunction = function (r) {
        this.batchNotifyFn = r;
      }),
      e
    );
  })(),
  ne = new av(),
  Cf = console;
function xf() {
  return Cf;
}
function cv(e) {
  Cf = e;
}
var fv = (function () {
    function e(n) {
      ((this.abortSignalConsumed = !1),
        (this.hadObservers = !1),
        (this.defaultOptions = n.defaultOptions),
        this.setOptions(n.options),
        (this.observers = []),
        (this.cache = n.cache),
        (this.queryKey = n.queryKey),
        (this.queryHash = n.queryHash),
        (this.initialState = n.state || this.getDefaultState(this.options)),
        (this.state = this.initialState),
        (this.meta = n.meta),
        this.scheduleGc());
    }
    var t = e.prototype;
    return (
      (t.setOptions = function (r) {
        var l;
        ((this.options = D({}, this.defaultOptions, r)),
          (this.meta = r == null ? void 0 : r.meta),
          (this.cacheTime = Math.max(
            this.cacheTime || 0,
            (l = this.options.cacheTime) != null ? l : 5 * 60 * 1e3
          )));
      }),
      (t.setDefaultOptions = function (r) {
        this.defaultOptions = r;
      }),
      (t.scheduleGc = function () {
        var r = this;
        (this.clearGcTimeout(),
          tv(this.cacheTime) &&
            (this.gcTimeout = setTimeout(function () {
              r.optionalRemove();
            }, this.cacheTime)));
      }),
      (t.clearGcTimeout = function () {
        this.gcTimeout &&
          (clearTimeout(this.gcTimeout), (this.gcTimeout = void 0));
      }),
      (t.optionalRemove = function () {
        this.observers.length ||
          (this.state.isFetching
            ? this.hadObservers && this.scheduleGc()
            : this.cache.remove(this));
      }),
      (t.setData = function (r, l) {
        var i,
          u,
          o = this.state.data,
          s = ev(r, o);
        return (
          (i = (u = this.options).isDataEqual) != null && i.call(u, o, s)
            ? (s = o)
            : this.options.structuralSharing !== !1 && (s = yf(o, s)),
          this.dispatch({
            data: s,
            type: 'success',
            dataUpdatedAt: l == null ? void 0 : l.updatedAt,
          }),
          s
        );
      }),
      (t.setState = function (r, l) {
        this.dispatch({ type: 'setState', state: r, setStateOptions: l });
      }),
      (t.cancel = function (r) {
        var l,
          i = this.promise;
        return (
          (l = this.retryer) == null || l.cancel(r),
          i ? i.then(ae).catch(ae) : Promise.resolve()
        );
      }),
      (t.destroy = function () {
        (this.clearGcTimeout(), this.cancel({ silent: !0 }));
      }),
      (t.reset = function () {
        (this.destroy(), this.setState(this.initialState));
      }),
      (t.isActive = function () {
        return this.observers.some(function (r) {
          return r.options.enabled !== !1;
        });
      }),
      (t.isFetching = function () {
        return this.state.isFetching;
      }),
      (t.isStale = function () {
        return (
          this.state.isInvalidated ||
          !this.state.dataUpdatedAt ||
          this.observers.some(function (r) {
            return r.getCurrentResult().isStale;
          })
        );
      }),
      (t.isStaleByTime = function (r) {
        return (
          r === void 0 && (r = 0),
          this.state.isInvalidated ||
            !this.state.dataUpdatedAt ||
            !nv(this.state.dataUpdatedAt, r)
        );
      }),
      (t.onFocus = function () {
        var r,
          l = this.observers.find(function (i) {
            return i.shouldFetchOnWindowFocus();
          });
        (l && l.refetch(), (r = this.retryer) == null || r.continue());
      }),
      (t.onOnline = function () {
        var r,
          l = this.observers.find(function (i) {
            return i.shouldFetchOnReconnect();
          });
        (l && l.refetch(), (r = this.retryer) == null || r.continue());
      }),
      (t.addObserver = function (r) {
        this.observers.indexOf(r) === -1 &&
          (this.observers.push(r),
          (this.hadObservers = !0),
          this.clearGcTimeout(),
          this.cache.notify({
            type: 'observerAdded',
            query: this,
            observer: r,
          }));
      }),
      (t.removeObserver = function (r) {
        this.observers.indexOf(r) !== -1 &&
          ((this.observers = this.observers.filter(function (l) {
            return l !== r;
          })),
          this.observers.length ||
            (this.retryer &&
              (this.retryer.isTransportCancelable || this.abortSignalConsumed
                ? this.retryer.cancel({ revert: !0 })
                : this.retryer.cancelRetry()),
            this.cacheTime ? this.scheduleGc() : this.cache.remove(this)),
          this.cache.notify({
            type: 'observerRemoved',
            query: this,
            observer: r,
          }));
      }),
      (t.getObserversCount = function () {
        return this.observers.length;
      }),
      (t.invalidate = function () {
        this.state.isInvalidated || this.dispatch({ type: 'invalidate' });
      }),
      (t.fetch = function (r, l) {
        var i = this,
          u,
          o,
          s;
        if (this.state.isFetching) {
          if (this.state.dataUpdatedAt && l != null && l.cancelRefetch)
            this.cancel({ silent: !0 });
          else if (this.promise) {
            var a;
            return (
              (a = this.retryer) == null || a.continueRetry(),
              this.promise
            );
          }
        }
        if ((r && this.setOptions(r), !this.options.queryFn)) {
          var h = this.observers.find(function (c) {
            return c.options.queryFn;
          });
          h && this.setOptions(h.options);
        }
        var p = kl(this.queryKey),
          v = gf(),
          m = { queryKey: p, pageParam: void 0, meta: this.meta };
        Object.defineProperty(m, 'signal', {
          enumerable: !0,
          get: function () {
            if (v) return ((i.abortSignalConsumed = !0), v.signal);
          },
        });
        var y = function () {
            return i.options.queryFn
              ? ((i.abortSignalConsumed = !1), i.options.queryFn(m))
              : Promise.reject('Missing queryFn');
          },
          g = {
            fetchOptions: l,
            options: this.options,
            queryKey: p,
            state: this.state,
            fetchFn: y,
            meta: this.meta,
          };
        if ((u = this.options.behavior) != null && u.onFetch) {
          var x;
          (x = this.options.behavior) == null || x.onFetch(g);
        }
        if (
          ((this.revertState = this.state),
          !this.state.isFetching ||
            this.state.fetchMeta !==
              ((o = g.fetchOptions) == null ? void 0 : o.meta))
        ) {
          var f;
          this.dispatch({
            type: 'fetch',
            meta: (f = g.fetchOptions) == null ? void 0 : f.meta,
          });
        }
        return (
          (this.retryer = new Sf({
            fn: g.fetchFn,
            abort: v == null || (s = v.abort) == null ? void 0 : s.bind(v),
            onSuccess: function (d) {
              (i.setData(d),
                i.cache.config.onSuccess == null ||
                  i.cache.config.onSuccess(d, i),
                i.cacheTime === 0 && i.optionalRemove());
            },
            onError: function (d) {
              ((xi(d) && d.silent) || i.dispatch({ type: 'error', error: d }),
                xi(d) ||
                  (i.cache.config.onError == null ||
                    i.cache.config.onError(d, i),
                  xf().error(d)),
                i.cacheTime === 0 && i.optionalRemove());
            },
            onFail: function () {
              i.dispatch({ type: 'failed' });
            },
            onPause: function () {
              i.dispatch({ type: 'pause' });
            },
            onContinue: function () {
              i.dispatch({ type: 'continue' });
            },
            retry: g.options.retry,
            retryDelay: g.options.retryDelay,
          })),
          (this.promise = this.retryer.promise),
          this.promise
        );
      }),
      (t.dispatch = function (r) {
        var l = this;
        ((this.state = this.reducer(this.state, r)),
          ne.batch(function () {
            (l.observers.forEach(function (i) {
              i.onQueryUpdate(r);
            }),
              l.cache.notify({ query: l, type: 'queryUpdated', action: r }));
          }));
      }),
      (t.getDefaultState = function (r) {
        var l =
            typeof r.initialData == 'function'
              ? r.initialData()
              : r.initialData,
          i = typeof r.initialData < 'u',
          u = i
            ? typeof r.initialDataUpdatedAt == 'function'
              ? r.initialDataUpdatedAt()
              : r.initialDataUpdatedAt
            : 0,
          o = typeof l < 'u';
        return {
          data: l,
          dataUpdateCount: 0,
          dataUpdatedAt: o ? (u ?? Date.now()) : 0,
          error: null,
          errorUpdateCount: 0,
          errorUpdatedAt: 0,
          fetchFailureCount: 0,
          fetchMeta: null,
          isFetching: !1,
          isInvalidated: !1,
          isPaused: !1,
          status: o ? 'success' : 'idle',
        };
      }),
      (t.reducer = function (r, l) {
        var i, u;
        switch (l.type) {
          case 'failed':
            return D({}, r, { fetchFailureCount: r.fetchFailureCount + 1 });
          case 'pause':
            return D({}, r, { isPaused: !0 });
          case 'continue':
            return D({}, r, { isPaused: !1 });
          case 'fetch':
            return D(
              {},
              r,
              {
                fetchFailureCount: 0,
                fetchMeta: (i = l.meta) != null ? i : null,
                isFetching: !0,
                isPaused: !1,
              },
              !r.dataUpdatedAt && { error: null, status: 'loading' }
            );
          case 'success':
            return D({}, r, {
              data: l.data,
              dataUpdateCount: r.dataUpdateCount + 1,
              dataUpdatedAt: (u = l.dataUpdatedAt) != null ? u : Date.now(),
              error: null,
              fetchFailureCount: 0,
              isFetching: !1,
              isInvalidated: !1,
              isPaused: !1,
              status: 'success',
            });
          case 'error':
            var o = l.error;
            return xi(o) && o.revert && this.revertState
              ? D({}, this.revertState)
              : D({}, r, {
                  error: o,
                  errorUpdateCount: r.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: r.fetchFailureCount + 1,
                  isFetching: !1,
                  isPaused: !1,
                  status: 'error',
                });
          case 'invalidate':
            return D({}, r, { isInvalidated: !0 });
          case 'setState':
            return D({}, r, l.state);
          default:
            return r;
        }
      }),
      e
    );
  })(),
  dv = (function (e) {
    Vl(t, e);
    function t(r) {
      var l;
      return (
        (l = e.call(this) || this),
        (l.config = r || {}),
        (l.queries = []),
        (l.queriesMap = {}),
        l
      );
    }
    var n = t.prototype;
    return (
      (n.build = function (l, i, u) {
        var o,
          s = i.queryKey,
          a = (o = i.queryHash) != null ? o : go(s, i),
          h = this.get(a);
        return (
          h ||
            ((h = new fv({
              cache: this,
              queryKey: s,
              queryHash: a,
              options: l.defaultQueryOptions(i),
              state: u,
              defaultOptions: l.getQueryDefaults(s),
              meta: i.meta,
            })),
            this.add(h)),
          h
        );
      }),
      (n.add = function (l) {
        this.queriesMap[l.queryHash] ||
          ((this.queriesMap[l.queryHash] = l),
          this.queries.push(l),
          this.notify({ type: 'queryAdded', query: l }));
      }),
      (n.remove = function (l) {
        var i = this.queriesMap[l.queryHash];
        i &&
          (l.destroy(),
          (this.queries = this.queries.filter(function (u) {
            return u !== l;
          })),
          i === l && delete this.queriesMap[l.queryHash],
          this.notify({ type: 'queryRemoved', query: l }));
      }),
      (n.clear = function () {
        var l = this;
        ne.batch(function () {
          l.queries.forEach(function (i) {
            l.remove(i);
          });
        });
      }),
      (n.get = function (l) {
        return this.queriesMap[l];
      }),
      (n.getAll = function () {
        return this.queries;
      }),
      (n.find = function (l, i) {
        var u = at(l, i),
          o = u[0];
        return (
          typeof o.exact > 'u' && (o.exact = !0),
          this.queries.find(function (s) {
            return js(o, s);
          })
        );
      }),
      (n.findAll = function (l, i) {
        var u = at(l, i),
          o = u[0];
        return Object.keys(o).length > 0
          ? this.queries.filter(function (s) {
              return js(o, s);
            })
          : this.queries;
      }),
      (n.notify = function (l) {
        var i = this;
        ne.batch(function () {
          i.listeners.forEach(function (u) {
            u(l);
          });
        });
      }),
      (n.onFocus = function () {
        var l = this;
        ne.batch(function () {
          l.queries.forEach(function (i) {
            i.onFocus();
          });
        });
      }),
      (n.onOnline = function () {
        var l = this;
        ne.batch(function () {
          l.queries.forEach(function (i) {
            i.onOnline();
          });
        });
      }),
      t
    );
  })(Hl),
  pv = (function () {
    function e(n) {
      ((this.options = D({}, n.defaultOptions, n.options)),
        (this.mutationId = n.mutationId),
        (this.mutationCache = n.mutationCache),
        (this.observers = []),
        (this.state = n.state || hv()),
        (this.meta = n.meta));
    }
    var t = e.prototype;
    return (
      (t.setState = function (r) {
        this.dispatch({ type: 'setState', state: r });
      }),
      (t.addObserver = function (r) {
        this.observers.indexOf(r) === -1 && this.observers.push(r);
      }),
      (t.removeObserver = function (r) {
        this.observers = this.observers.filter(function (l) {
          return l !== r;
        });
      }),
      (t.cancel = function () {
        return this.retryer
          ? (this.retryer.cancel(), this.retryer.promise.then(ae).catch(ae))
          : Promise.resolve();
      }),
      (t.continue = function () {
        return this.retryer
          ? (this.retryer.continue(), this.retryer.promise)
          : this.execute();
      }),
      (t.execute = function () {
        var r = this,
          l,
          i = this.state.status === 'loading',
          u = Promise.resolve();
        return (
          i ||
            (this.dispatch({
              type: 'loading',
              variables: this.options.variables,
            }),
            (u = u
              .then(function () {
                r.mutationCache.config.onMutate == null ||
                  r.mutationCache.config.onMutate(r.state.variables, r);
              })
              .then(function () {
                return r.options.onMutate == null
                  ? void 0
                  : r.options.onMutate(r.state.variables);
              })
              .then(function (o) {
                o !== r.state.context &&
                  r.dispatch({
                    type: 'loading',
                    context: o,
                    variables: r.state.variables,
                  });
              }))),
          u
            .then(function () {
              return r.executeMutation();
            })
            .then(function (o) {
              ((l = o),
                r.mutationCache.config.onSuccess == null ||
                  r.mutationCache.config.onSuccess(
                    l,
                    r.state.variables,
                    r.state.context,
                    r
                  ));
            })
            .then(function () {
              return r.options.onSuccess == null
                ? void 0
                : r.options.onSuccess(l, r.state.variables, r.state.context);
            })
            .then(function () {
              return r.options.onSettled == null
                ? void 0
                : r.options.onSettled(
                    l,
                    null,
                    r.state.variables,
                    r.state.context
                  );
            })
            .then(function () {
              return (r.dispatch({ type: 'success', data: l }), l);
            })
            .catch(function (o) {
              return (
                r.mutationCache.config.onError == null ||
                  r.mutationCache.config.onError(
                    o,
                    r.state.variables,
                    r.state.context,
                    r
                  ),
                xf().error(o),
                Promise.resolve()
                  .then(function () {
                    return r.options.onError == null
                      ? void 0
                      : r.options.onError(
                          o,
                          r.state.variables,
                          r.state.context
                        );
                  })
                  .then(function () {
                    return r.options.onSettled == null
                      ? void 0
                      : r.options.onSettled(
                          void 0,
                          o,
                          r.state.variables,
                          r.state.context
                        );
                  })
                  .then(function () {
                    throw (r.dispatch({ type: 'error', error: o }), o);
                  })
              );
            })
        );
      }),
      (t.executeMutation = function () {
        var r = this,
          l;
        return (
          (this.retryer = new Sf({
            fn: function () {
              return r.options.mutationFn
                ? r.options.mutationFn(r.state.variables)
                : Promise.reject('No mutationFn found');
            },
            onFail: function () {
              r.dispatch({ type: 'failed' });
            },
            onPause: function () {
              r.dispatch({ type: 'pause' });
            },
            onContinue: function () {
              r.dispatch({ type: 'continue' });
            },
            retry: (l = this.options.retry) != null ? l : 0,
            retryDelay: this.options.retryDelay,
          })),
          this.retryer.promise
        );
      }),
      (t.dispatch = function (r) {
        var l = this;
        ((this.state = vv(this.state, r)),
          ne.batch(function () {
            (l.observers.forEach(function (i) {
              i.onMutationUpdate(r);
            }),
              l.mutationCache.notify(l));
          }));
      }),
      e
    );
  })();
function hv() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    isPaused: !1,
    status: 'idle',
    variables: void 0,
  };
}
function vv(e, t) {
  switch (t.type) {
    case 'failed':
      return D({}, e, { failureCount: e.failureCount + 1 });
    case 'pause':
      return D({}, e, { isPaused: !0 });
    case 'continue':
      return D({}, e, { isPaused: !1 });
    case 'loading':
      return D({}, e, {
        context: t.context,
        data: void 0,
        error: null,
        isPaused: !1,
        status: 'loading',
        variables: t.variables,
      });
    case 'success':
      return D({}, e, {
        data: t.data,
        error: null,
        status: 'success',
        isPaused: !1,
      });
    case 'error':
      return D({}, e, {
        data: void 0,
        error: t.error,
        failureCount: e.failureCount + 1,
        isPaused: !1,
        status: 'error',
      });
    case 'setState':
      return D({}, e, t.state);
    default:
      return e;
  }
}
var mv = (function (e) {
  Vl(t, e);
  function t(r) {
    var l;
    return (
      (l = e.call(this) || this),
      (l.config = r || {}),
      (l.mutations = []),
      (l.mutationId = 0),
      l
    );
  }
  var n = t.prototype;
  return (
    (n.build = function (l, i, u) {
      var o = new pv({
        mutationCache: this,
        mutationId: ++this.mutationId,
        options: l.defaultMutationOptions(i),
        state: u,
        defaultOptions: i.mutationKey
          ? l.getMutationDefaults(i.mutationKey)
          : void 0,
        meta: i.meta,
      });
      return (this.add(o), o);
    }),
    (n.add = function (l) {
      (this.mutations.push(l), this.notify(l));
    }),
    (n.remove = function (l) {
      ((this.mutations = this.mutations.filter(function (i) {
        return i !== l;
      })),
        l.cancel(),
        this.notify(l));
    }),
    (n.clear = function () {
      var l = this;
      ne.batch(function () {
        l.mutations.forEach(function (i) {
          l.remove(i);
        });
      });
    }),
    (n.getAll = function () {
      return this.mutations;
    }),
    (n.find = function (l) {
      return (
        typeof l.exact > 'u' && (l.exact = !0),
        this.mutations.find(function (i) {
          return Is(l, i);
        })
      );
    }),
    (n.findAll = function (l) {
      return this.mutations.filter(function (i) {
        return Is(l, i);
      });
    }),
    (n.notify = function (l) {
      var i = this;
      ne.batch(function () {
        i.listeners.forEach(function (u) {
          u(l);
        });
      });
    }),
    (n.onFocus = function () {
      this.resumePausedMutations();
    }),
    (n.onOnline = function () {
      this.resumePausedMutations();
    }),
    (n.resumePausedMutations = function () {
      var l = this.mutations.filter(function (i) {
        return i.state.isPaused;
      });
      return ne.batch(function () {
        return l.reduce(function (i, u) {
          return i.then(function () {
            return u.continue().catch(ae);
          });
        }, Promise.resolve());
      });
    }),
    t
  );
})(Hl);
function yv() {
  return {
    onFetch: function (t) {
      t.fetchFn = function () {
        var n,
          r,
          l,
          i,
          u,
          o,
          s =
            (n = t.fetchOptions) == null || (r = n.meta) == null
              ? void 0
              : r.refetchPage,
          a =
            (l = t.fetchOptions) == null || (i = l.meta) == null
              ? void 0
              : i.fetchMore,
          h = a == null ? void 0 : a.pageParam,
          p = (a == null ? void 0 : a.direction) === 'forward',
          v = (a == null ? void 0 : a.direction) === 'backward',
          m = ((u = t.state.data) == null ? void 0 : u.pages) || [],
          y = ((o = t.state.data) == null ? void 0 : o.pageParams) || [],
          g = gf(),
          x = g == null ? void 0 : g.signal,
          f = y,
          c = !1,
          d =
            t.options.queryFn ||
            function () {
              return Promise.reject('Missing queryFn');
            },
          w = function (ze, lt, ve, qe) {
            return (
              (f = qe ? [lt].concat(f) : [].concat(f, [lt])),
              qe ? [ve].concat(ze) : [].concat(ze, [ve])
            );
          },
          C = function (ze, lt, ve, qe) {
            if (c) return Promise.reject('Cancelled');
            if (typeof ve > 'u' && !lt && ze.length) return Promise.resolve(ze);
            var k = {
                queryKey: t.queryKey,
                signal: x,
                pageParam: ve,
                meta: t.meta,
              },
              F = d(k),
              L = Promise.resolve(F).then(function (G) {
                return w(ze, ve, G, qe);
              });
            if (Pl(F)) {
              var U = L;
              U.cancel = F.cancel;
            }
            return L;
          },
          E;
        if (!m.length) E = C([]);
        else if (p) {
          var O = typeof h < 'u',
            N = O ? h : As(t.options, m);
          E = C(m, O, N);
        } else if (v) {
          var Q = typeof h < 'u',
            T = Q ? h : gv(t.options, m);
          E = C(m, Q, T, !0);
        } else
          (function () {
            f = [];
            var Ce = typeof t.options.getNextPageParam > 'u',
              ze = s && m[0] ? s(m[0], 0, m) : !0;
            E = ze ? C([], Ce, y[0]) : Promise.resolve(w([], y[0], m[0]));
            for (
              var lt = function (k) {
                  E = E.then(function (F) {
                    var L = s && m[k] ? s(m[k], k, m) : !0;
                    if (L) {
                      var U = Ce ? y[k] : As(t.options, F);
                      return C(F, Ce, U);
                    }
                    return Promise.resolve(w(F, y[k], m[k]));
                  });
                },
                ve = 1;
              ve < m.length;
              ve++
            )
              lt(ve);
          })();
        var he = E.then(function (Ce) {
            return { pages: Ce, pageParams: f };
          }),
          Ft = he;
        return (
          (Ft.cancel = function () {
            ((c = !0), g == null || g.abort(), Pl(E) && E.cancel());
          }),
          he
        );
      };
    },
  };
}
function As(e, t) {
  return e.getNextPageParam == null
    ? void 0
    : e.getNextPageParam(t[t.length - 1], t);
}
function gv(e, t) {
  return e.getPreviousPageParam == null
    ? void 0
    : e.getPreviousPageParam(t[0], t);
}
var wv = (function () {
    function e(n) {
      (n === void 0 && (n = {}),
        (this.queryCache = n.queryCache || new dv()),
        (this.mutationCache = n.mutationCache || new mv()),
        (this.defaultOptions = n.defaultOptions || {}),
        (this.queryDefaults = []),
        (this.mutationDefaults = []));
    }
    var t = e.prototype;
    return (
      (t.mount = function () {
        var r = this;
        ((this.unsubscribeFocus = Xr.subscribe(function () {
          Xr.isFocused() &&
            Zr.isOnline() &&
            (r.mutationCache.onFocus(), r.queryCache.onFocus());
        })),
          (this.unsubscribeOnline = Zr.subscribe(function () {
            Xr.isFocused() &&
              Zr.isOnline() &&
              (r.mutationCache.onOnline(), r.queryCache.onOnline());
          })));
      }),
      (t.unmount = function () {
        var r, l;
        ((r = this.unsubscribeFocus) == null || r.call(this),
          (l = this.unsubscribeOnline) == null || l.call(this));
      }),
      (t.isFetching = function (r, l) {
        var i = at(r, l),
          u = i[0];
        return ((u.fetching = !0), this.queryCache.findAll(u).length);
      }),
      (t.isMutating = function (r) {
        return this.mutationCache.findAll(D({}, r, { fetching: !0 })).length;
      }),
      (t.getQueryData = function (r, l) {
        var i;
        return (i = this.queryCache.find(r, l)) == null ? void 0 : i.state.data;
      }),
      (t.getQueriesData = function (r) {
        return this.getQueryCache()
          .findAll(r)
          .map(function (l) {
            var i = l.queryKey,
              u = l.state,
              o = u.data;
            return [i, o];
          });
      }),
      (t.setQueryData = function (r, l, i) {
        var u = Ci(r),
          o = this.defaultQueryOptions(u);
        return this.queryCache.build(this, o).setData(l, i);
      }),
      (t.setQueriesData = function (r, l, i) {
        var u = this;
        return ne.batch(function () {
          return u
            .getQueryCache()
            .findAll(r)
            .map(function (o) {
              var s = o.queryKey;
              return [s, u.setQueryData(s, l, i)];
            });
        });
      }),
      (t.getQueryState = function (r, l) {
        var i;
        return (i = this.queryCache.find(r, l)) == null ? void 0 : i.state;
      }),
      (t.removeQueries = function (r, l) {
        var i = at(r, l),
          u = i[0],
          o = this.queryCache;
        ne.batch(function () {
          o.findAll(u).forEach(function (s) {
            o.remove(s);
          });
        });
      }),
      (t.resetQueries = function (r, l, i) {
        var u = this,
          o = at(r, l, i),
          s = o[0],
          a = o[1],
          h = this.queryCache,
          p = D({}, s, { active: !0 });
        return ne.batch(function () {
          return (
            h.findAll(s).forEach(function (v) {
              v.reset();
            }),
            u.refetchQueries(p, a)
          );
        });
      }),
      (t.cancelQueries = function (r, l, i) {
        var u = this,
          o = at(r, l, i),
          s = o[0],
          a = o[1],
          h = a === void 0 ? {} : a;
        typeof h.revert > 'u' && (h.revert = !0);
        var p = ne.batch(function () {
          return u.queryCache.findAll(s).map(function (v) {
            return v.cancel(h);
          });
        });
        return Promise.all(p).then(ae).catch(ae);
      }),
      (t.invalidateQueries = function (r, l, i) {
        var u,
          o,
          s,
          a = this,
          h = at(r, l, i),
          p = h[0],
          v = h[1],
          m = D({}, p, {
            active:
              (u = (o = p.refetchActive) != null ? o : p.active) != null
                ? u
                : !0,
            inactive: (s = p.refetchInactive) != null ? s : !1,
          });
        return ne.batch(function () {
          return (
            a.queryCache.findAll(p).forEach(function (y) {
              y.invalidate();
            }),
            a.refetchQueries(m, v)
          );
        });
      }),
      (t.refetchQueries = function (r, l, i) {
        var u = this,
          o = at(r, l, i),
          s = o[0],
          a = o[1],
          h = ne.batch(function () {
            return u.queryCache.findAll(s).map(function (v) {
              return v.fetch(
                void 0,
                D({}, a, {
                  meta: { refetchPage: s == null ? void 0 : s.refetchPage },
                })
              );
            });
          }),
          p = Promise.all(h).then(ae);
        return ((a != null && a.throwOnError) || (p = p.catch(ae)), p);
      }),
      (t.fetchQuery = function (r, l, i) {
        var u = Ci(r, l, i),
          o = this.defaultQueryOptions(u);
        typeof o.retry > 'u' && (o.retry = !1);
        var s = this.queryCache.build(this, o);
        return s.isStaleByTime(o.staleTime)
          ? s.fetch(o)
          : Promise.resolve(s.state.data);
      }),
      (t.prefetchQuery = function (r, l, i) {
        return this.fetchQuery(r, l, i).then(ae).catch(ae);
      }),
      (t.fetchInfiniteQuery = function (r, l, i) {
        var u = Ci(r, l, i);
        return ((u.behavior = yv()), this.fetchQuery(u));
      }),
      (t.prefetchInfiniteQuery = function (r, l, i) {
        return this.fetchInfiniteQuery(r, l, i).then(ae).catch(ae);
      }),
      (t.cancelMutations = function () {
        var r = this,
          l = ne.batch(function () {
            return r.mutationCache.getAll().map(function (i) {
              return i.cancel();
            });
          });
        return Promise.all(l).then(ae).catch(ae);
      }),
      (t.resumePausedMutations = function () {
        return this.getMutationCache().resumePausedMutations();
      }),
      (t.executeMutation = function (r) {
        return this.mutationCache.build(this, r).execute();
      }),
      (t.getQueryCache = function () {
        return this.queryCache;
      }),
      (t.getMutationCache = function () {
        return this.mutationCache;
      }),
      (t.getDefaultOptions = function () {
        return this.defaultOptions;
      }),
      (t.setDefaultOptions = function (r) {
        this.defaultOptions = r;
      }),
      (t.setQueryDefaults = function (r, l) {
        var i = this.queryDefaults.find(function (u) {
          return It(r) === It(u.queryKey);
        });
        i
          ? (i.defaultOptions = l)
          : this.queryDefaults.push({ queryKey: r, defaultOptions: l });
      }),
      (t.getQueryDefaults = function (r) {
        var l;
        return r
          ? (l = this.queryDefaults.find(function (i) {
              return El(r, i.queryKey);
            })) == null
            ? void 0
            : l.defaultOptions
          : void 0;
      }),
      (t.setMutationDefaults = function (r, l) {
        var i = this.mutationDefaults.find(function (u) {
          return It(r) === It(u.mutationKey);
        });
        i
          ? (i.defaultOptions = l)
          : this.mutationDefaults.push({ mutationKey: r, defaultOptions: l });
      }),
      (t.getMutationDefaults = function (r) {
        var l;
        return r
          ? (l = this.mutationDefaults.find(function (i) {
              return El(r, i.mutationKey);
            })) == null
            ? void 0
            : l.defaultOptions
          : void 0;
      }),
      (t.defaultQueryOptions = function (r) {
        if (r != null && r._defaulted) return r;
        var l = D(
          {},
          this.defaultOptions.queries,
          this.getQueryDefaults(r == null ? void 0 : r.queryKey),
          r,
          { _defaulted: !0 }
        );
        return (
          !l.queryHash && l.queryKey && (l.queryHash = go(l.queryKey, l)),
          l
        );
      }),
      (t.defaultQueryObserverOptions = function (r) {
        return this.defaultQueryOptions(r);
      }),
      (t.defaultMutationOptions = function (r) {
        return r != null && r._defaulted
          ? r
          : D(
              {},
              this.defaultOptions.mutations,
              this.getMutationDefaults(r == null ? void 0 : r.mutationKey),
              r,
              { _defaulted: !0 }
            );
      }),
      (t.clear = function () {
        (this.queryCache.clear(), this.mutationCache.clear());
      }),
      e
    );
  })(),
  Sv = Xp.unstable_batchedUpdates;
ne.setBatchNotifyFunction(Sv);
var Cv = console;
cv(Cv);
var Qs = Ut.createContext(void 0),
  xv = Ut.createContext(!1);
function kv(e) {
  return e && typeof window < 'u'
    ? (window.ReactQueryClientContext || (window.ReactQueryClientContext = Qs),
      window.ReactQueryClientContext)
    : Qs;
}
var Ev = function (t) {
  var n = t.client,
    r = t.contextSharing,
    l = r === void 0 ? !1 : r,
    i = t.children;
  Ut.useEffect(
    function () {
      return (
        n.mount(),
        function () {
          n.unmount();
        }
      );
    },
    [n]
  );
  var u = kv(l);
  return Ut.createElement(
    xv.Provider,
    { value: l },
    Ut.createElement(u.Provider, { value: n }, i)
  );
};
const Pv = ({ children: e }) =>
    R.jsx('div', { className: 'min-h-screen bg-gray-50 p-8', children: e }),
  _v = () =>
    R.jsxs('div', {
      className: 'text-center',
      children: [
        R.jsx('h1', {
          className: 'text-4xl font-bold text-gray-900 mb-4',
          children: 'Welcome to Asture FMS',
        }),
        R.jsx('p', {
          className: 'text-xl text-gray-600 mb-6',
          children: 'Your Finance Management System',
        }),
        R.jsx('p', {
          className: 'text-gray-500',
          children: 'Manage your finances with ease and efficiency.',
        }),
      ],
    }),
  Ov = () =>
    R.jsxs('div', {
      children: [
        R.jsx('h1', {
          className: 'text-3xl font-bold text-gray-900',
          children: 'Dashboard',
        }),
        R.jsx('p', {
          className: 'text-gray-600 mt-2',
          children: 'Hello World - Dashboard Page',
        }),
      ],
    }),
  Nv = () =>
    R.jsxs('div', {
      children: [
        R.jsx('h1', {
          className: 'text-3xl font-bold text-gray-900',
          children: 'Transactions',
        }),
        R.jsx('p', {
          className: 'text-gray-600 mt-2',
          children: 'Hello World - Transactions Page',
        }),
      ],
    }),
  Fv = () =>
    R.jsxs('div', {
      children: [
        R.jsx('h1', {
          className: 'text-3xl font-bold text-gray-900',
          children: 'Budget',
        }),
        R.jsx('p', {
          className: 'text-gray-600 mt-2',
          children: 'Hello World - Budget Page',
        }),
      ],
    }),
  Rv = () =>
    R.jsxs('div', {
      children: [
        R.jsx('h1', {
          className: 'text-3xl font-bold text-gray-900',
          children: 'Reports',
        }),
        R.jsx('p', {
          className: 'text-gray-600 mt-2',
          children: 'Hello World - Reports Page',
        }),
      ],
    }),
  Lv = () =>
    R.jsxs('div', {
      children: [
        R.jsx('h1', {
          className: 'text-3xl font-bold text-gray-900',
          children: 'Settings',
        }),
        R.jsx('p', {
          className: 'text-gray-600 mt-2',
          children: 'Hello World - Settings Page',
        }),
      ],
    }),
  Tv = () =>
    R.jsxs('div', {
      className: 'text-center',
      children: [
        R.jsx('h1', {
          className: 'text-4xl font-bold text-gray-900 mb-4',
          children: '404',
        }),
        R.jsx('p', {
          className: 'text-xl text-gray-600 mb-6',
          children: 'Page Not Found',
        }),
        R.jsx('p', {
          className: 'text-gray-500 mb-8',
          children: "The page you're looking for doesn't exist.",
        }),
        R.jsx(Jh, {
          to: '/',
          className: 'text-primary-600 hover:text-primary-800 underline',
          children: 'Go back to Dashboard',
        }),
      ],
    }),
  Mv = () =>
    R.jsx('div', {
      className: 'min-h-screen bg-gray-50',
      children: R.jsx(Pv, {
        children: R.jsxs(Bh, {
          children: [
            R.jsx(ut, { path: '/', element: R.jsx(Ov, {}) }),
            R.jsx(ut, { path: '/home', element: R.jsx(_v, {}) }),
            R.jsx(ut, { path: '/transactions', element: R.jsx(Nv, {}) }),
            R.jsx(ut, { path: '/budget', element: R.jsx(Fv, {}) }),
            R.jsx(ut, { path: '/reports', element: R.jsx(Rv, {}) }),
            R.jsx(ut, { path: '/settings', element: R.jsx(Lv, {}) }),
            R.jsx(ut, { path: '*', element: R.jsx(Tv, {}) }),
          ],
        }),
      }),
    }),
  zv = new wv({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: !1, staleTime: 5 * 60 * 1e3 },
    },
  });
ki.createRoot(document.getElementById('root')).render(
  R.jsx(Ut.StrictMode, {
    children: R.jsx(Ev, {
      client: zv,
      children: R.jsx(Yh, { children: R.jsx(Mv, {}) }),
    }),
  })
);
//# sourceMappingURL=index-CHvUQTRG.js.map
