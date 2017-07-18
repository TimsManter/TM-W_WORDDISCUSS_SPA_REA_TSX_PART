# Babel Configuration

## Node
Paste this to `package.json` file into `dependencies` section:
```
"babel-core": "^6.25.0",
"babel-loader": "^7.1.1",
"babel-plugin-transform-class-properties": "^6.24.1",
"babel-plugin-transform-decorators-legacy": "^1.3.4",
"babel-preset-react": "^6.24.1",
```
## Loader
Copy `.babelrc` file to root directory.

## Webpack
Remove `TypeScript` specific configuration and uncomment `Babel` loader code.