# babel-plugin-amd-checker

[![NPM version](https://badge.fury.io/js/babel-plugin-amd-checker.png)](http://badge.fury.io/js/babel-plugin-amd-checker)
[![devDependency Status](https://david-dm.org/prantlf/babel-plugin-amd-checker/dev-status.svg)](https://david-dm.org/prantlf/babel-plugin-amd-checker#info=devDependencies)

A [Babel] plugin to check the format of your modules when compiling your code using Babel. This plugin allows you to abort the module transformation, if the module source complies with AMD and let the transformation apply only on ESM modules. transform the path of each source module using a custom JavaScript function.

This plugin is supposed to be used with [requirejs-babel7], where the target environment is a web browser using [@babel/standalone]. If if detects an AMD module, it will throw an error of the class `AmdDetected` and abort the module transformation. The error can be caught and ignored in the build pipeline.

### Table of Contents

- [Installation](#installation-and-getting-started)
- [Babel Configuration Examples](#babel-configuration-examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 6 or newer.

```sh
npm i -D babel-plugin-amd-checker
pnpm i -D babel-plugin-amd-checker
yarn add babel-plugin-amd-checker
```

## Babel Configuration Examples

Prepend path to utility modules to be able to import them from `utils/...` without always providing the actual full path:

```js
{
  plugins: ['amd-checker']
}
```

A typical configuration combined with [babel-plugin-module-resolver-standalone] and set within [requirejs-babel7] by default:

```js
{
  plugins: [
    'amd-checker',
    'transform-modules-amd',
    [
      'module-resolver',
      {
        resolvePath: function (sourcePath, currentFile, opts) {
          // Avoid prefixing modules handled by other plugins.
          if (sourcePath.indexOf('!') < 0) {
            return 'es6!' + sourcePath;
          }
        }
      }
    ]
  ]
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (c) 2022 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[RequireJS]: https://requirejs.org/
[Babel]: http://babeljs.io
[@babel/standalone]: https://github.com/babel/babel/tree/master/packages/babel-standalone
[requirejs-babel7]: https://www.npmjs.com/package/requirejs-babel7
[babel-plugin-module-resolver-standalone]: https://www.npmjs.com/package/babel-plugin-module-resolver-standalone
