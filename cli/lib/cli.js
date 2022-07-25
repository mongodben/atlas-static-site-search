#!/usr/bin/env node
'use strict';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var React = require('react');

var _require = require('ink'),
    render = _require.render;

var meow = require('meow');

var _require2 = require("ink"),
    Text = _require2.Text;

var _require3 = require("child_process"),
    execSync = _require3.execSync;

var cli = meow("\n\tUsage\n\t  $ atlas-static-site-search-cli\n\n\tOptions\n    --group-id      Your MongoDB Atlas Project ID\n    --cluster-name  Your MongoDB Atlas Cluster name\n    --public-key    Your MongoDB Atlas Public API Key\n    --private-key   Your MongoDB Atlas Private API Key\n    --sitemap-url   Your website's sitemap URL\n\n\tExamples\n\t  $ atlas-static-site-search-cli --group-id=62d9b1228afdfc537e593b9e --cluster-name=Cluster0 --public-key=lkumasst --private-key=736130cc-0b47-4dbf-ae2e-1556be632d78 --sitemap-url=\"https://skunkblog.nlarew.com/sitemap/sitemap-index.xml\"\n\t  Your Docs Search App ID: docs-search-abcde\n"); // const importJsx = require("import-jsx")
// const App = importJsx("./ui")

var App = function App(_ref) {
  var groupId = _ref.groupId,
      clusterName = _ref.clusterName,
      publicKey = _ref.publicKey,
      privateKey = _ref.privateKey,
      sitemapUrl = _ref.sitemapUrl;

  var _React$useState = React.useState(),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      appId = _React$useState2[0],
      setAppId = _React$useState2[1];

  if (!groupId) {
    throw new Error("Please provide a value for --group-id");
  }

  if (!clusterName) {
    throw new Error("Please provide a value for --cluster-name");
  }

  if (!publicKey) {
    throw new Error("Please provide a value for --public-key");
  }

  if (!privateKey) {
    throw new Error("Please provide a value for --private-key");
  }

  if (!sitemapUrl) {
    throw new Error("Please provide a value for --sitemap-url");
  }

  var vars = ["CLI_GROUP_ID=".concat(groupId), "CLI_CLUSTER_NAME=".concat(clusterName), "CLI_PUBLIC_KEY=".concat(publicKey), "CLI_PRIVATE_KEY=".concat(privateKey), "CLI_SITEMAP_URL=".concat(sitemapUrl)].join(" ");
  React.useEffect(function () {
    var stdout = execSync("".concat(vars, " ").concat(__dirname, "/setup.sh"));
    var lines = stdout.toString().trim().split("\n");
    var last = lines[lines.length - 1];
    var id = last.split(":")[1].trim();
    setAppId(id);
  }, []);
  return /*#__PURE__*/React.createElement(Text, null, appId ? "Your App ID: ".concat(appId) : "Setting up search...");
};

render(React.createElement(App, cli.flags));
