(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    exports = factory();
  } else {
    root.moduleResolver = factory();
  }
})(this, function () {
  // Detects a call to define, require or require.config functions.
  function isDefineOrRequireOrRequireConfig(path) {
    var expr, callee, args, arg, func, obj;

    if (!path.isExpressionStatement()) return false;

    expr = path.get('expression');
    if (expr.isSequenceExpression()) {
      expr = expr.get('expressions')[0];
    }
    if (!expr.isCallExpression()) return false;

    args = expr.get('arguments');
    if (args.length === 0) return false;

    callee = expr.get('callee');
    // namespace.define(...)
    if (callee.isMemberExpression()) {
      obj = callee.get('object');
      if (!obj.isIdentifier()) return false;
      func = callee.get('property');
    } else {
      func = callee;
    }
    if (!func.isIdentifier()) return false;

    // define('name', [deps], factory)
    if (func.node.name === 'define') {
      arg = args.shift();
      if (arg.isStringLiteral()) {
        if (args.length === 0) return false;
        arg = args.shift();
      }
      if (arg.isArrayExpression()) {
        arg = args.shift();
        return arg.isFunctionExpression() || arg.isObjectExpression();
      }
      return arg.isFunctionExpression() || arg.isObjectExpression();
    }

    // require([deps], success, error)
    if (func.node.name === 'require') {
      arg = args.shift();
      if (!arg.isArrayExpression() || args.length === 0) return false;
      arg = args.shift();
      return arg.isFunctionExpression();
    }

    // require.config(object)
    return obj && obj.isIdentifier({ name: 'require' }) &&
      func.isIdentifier({ name: 'config' });
  }

  // Thrown to abort the transpilation of an already AMD module.
  function AmdDetected() {}
  AmdDetected.prototype = Object.create(Error.prototype)

  // Throws if the module is an AMD module, otherwise does nothing.
  function checkAmd(path) {
    var body = path.get('body');
    var length = body.length;
    var i, node;
    for (i = 0; i < length; ++i) {
      node = body[i];
      // If import or export is detected, transform right away.
      if (node.isImportDeclaration() ||
          node.isExportDeclaration()) break;
      // If define or require is detected, abort right away.
      if (isDefineOrRequireOrRequireConfig(node)) {
        throw new AmdDetected();
      }
    }
  }

  // Throws if the module is an AMD module, otherwise does nothing.
  function amdChecker() {
    return {
      name: 'amd-checker',

      visitor: {
        Program: { enter: checkAmd }
      }
    };
  }

  // Export the error class to be able to catch it in the build pipeline.
  amdChecker.AmdDetected = AmdDetected;

  return amdChecker;
});
