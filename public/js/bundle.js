// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"alerts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAlert = exports.hideAlert = void 0;

/* eslint-disable */
const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
}; // type is 'success' or 'error'


exports.hideAlert = hideAlert;

const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};

exports.showAlert = showAlert;
},{}],"login.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = exports.logout = exports.login = void 0;

var _alerts = require("./alerts");

const login = async (email, password) => {
  const body = JSON.stringify({
    email,
    password
  }); // local
  // const url = "http://localhost:3000/api/v1/users/login";

  const url = "api/v1/users/login";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.status === "success") {
      (0, _alerts.showAlert)("success", "logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      (0, _alerts.showAlert)("error", data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.login = login;

const logout = async () => {
  // local
  // const url = "http://localhost:3000/api/v1/users/logout";
  const url = "/api/v1/users/logout";
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json"
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.status === "success") {
      location.reload(true);
    } else {
      (0, _alerts.showAlert)("error", data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.logout = logout;

const signup = async data => {
  console.log(data);
  console.log(JSON.stringify(data)); // local
  // const url = "http://localhost:3000/api/v1/users/signup";

  const url = "/api/v1/users/signup";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);

    if (data.status === "success") {
      (0, _alerts.showAlert)("success", "user signup successfully");
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      (0, _alerts.showAlert)("error", (data?.message));
    }
  } catch (error) {
    (0, _alerts.showAlert)("error", (error?.message));
  }
};

exports.signup = signup;
},{"./alerts":"alerts.js"}],"mapbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayMap = void 0;

const displayMap = locations => {
  // 1. تحديد مكان الخريطة (نفس الـ ID المستخدم في Mapbox)
  var map = L.map("map", {
    scrollWheelZoom: false
  }); // 2. إضافة طبقة الخريطة المجانية (OpenStreetMap)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map); // 3. إضافة العلامات (Markers) للمواقع

  const points = [];
  locations.forEach(loc => {
    // إنشاء العلامة (لاحظ ترتيب الإحداثيات في Leaflet هو [lat, lng])
    const [lng, lat] = loc.coordinates;
    const marker = L.marker([lat, lng]).addTo(map); // إضافة Pop-up لكل موقع

    marker.bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      autoClose: false
    }).openPopup();
    points.push([lat, lng]);
  }); // 4. ضبط زوم الخريطة ليشمل كل النقاط

  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);
};

exports.displayMap = displayMap;
},{}],"updateSettings.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateData = void 0;

var _alerts = require("./alerts");

// type will be data or password
const updateData = async (data, type) => {
  let body; // local
  // const url = `http://localhost:3000/api/v1/users/${type === "data" ? "update-me" : "update-my-password"}`;

  const url = `/api/v1/users/${type === "data" ? "update-me" : "update-my-password"}`;
  const options = {
    method: "PATCH"
  };

  if (type === "data") {
    body = new FormData();
    Object.keys(data).forEach(key => body.append(key, data[key]));
  } else {
    body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json"
    };
  }

  options.body = body;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.status === "success") {
      (0, _alerts.showAlert)("success", "update data successfully");
    } else {
      (0, _alerts.showAlert)("error", data.message);
    }
  } catch (error) {
    (0, _alerts.showAlert)("error", error.message);
  }
};

exports.updateData = updateData;
},{"./alerts":"alerts.js"}],"stripe.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bookTour = void 0;
// تأكد من تحميل Stripe.js في الـ HTML أولاً
// <script src="https://js.stripe.com/v3/"></script>
const stripe = Stripe("pk_test_51TUlLkGrPpdYcyLj7VdBTMDUhS1DinSJYqxymc1y5jTd1Nu52jJCIipQJcGMsNEnopJx8WvI7rWCaOiGVPBwedjo00XFYuGGpO");

const bookTour = async tourId => {
  try {
    // local
    // const url = `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`;
    const url = `/api/v1/booking/checkout-session/${tourId}`;
    const response = await fetch(url, {
      method: "GET"
    });
    const data = await response.json(); // التوجيه المباشر

    const {
      error
    } = await stripe.redirectToCheckout({
      sessionId: data.session.id
    });

    if (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

exports.bookTour = bookTour;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _login = require("./login");

var _mapbox = require("./mapbox");

var _updateSettings = require("./updateSettings");

var _stripe = require("./stripe");

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".van__el--logout");
const updateDataForm = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-password");
const signUpForm = document.querySelector(".form--signup");
const bookBtn = document.getElementById("book-tour");

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  (0, _mapbox.displayMap)(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, _login.login)(email, password);
  });
}

if (signUpForm) {
  signUpForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name-signup").value;
    const email = document.getElementById("email-signup").value;
    const password = document.getElementById("password-signup").value;
    const passwordConfirm = document.getElementById("passwordConfirm-signup").value;
    (0, _login.signup)({
      name,
      email,
      password,
      passwordConfirm
    });
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", _login.logout);

if (updateDataForm) {
  updateDataForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const photo = document.querySelector(".form__upload").files[0]; // const form = new FormData();
    // form.append("name", name);
    // form.append("email", email);
    // form.append("photo", photo);

    (0, _updateSettings.updateData)({
      name,
      email,
      photo
    }, "data");
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", e => {
    e.preventDefault();
    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password-new").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    (0, _updateSettings.updateData)({
      currentPassword,
      password,
      passwordConfirm
    }, "password");
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", e => {
    e.target.textContent = "Processing...";
    const {
      tourId
    } = e.target.dataset;
    (0, _stripe.bookTour)(tourId);
  });
}
},{"./login":"login.js","./mapbox":"mapbox.js","./updateSettings":"updateSettings.js","./stripe":"stripe.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46077" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/bundle.js.map