# rollup-pluginutils

A set of functions commonly used by Rollup plugins.


## Installation

```bash
npm install --save rollup-pluginutils
```


## Usage

### createFilter

So far, this is the only exported function.

```js
import { createFilter } from 'rollup-pluginutils';

export default function myPlugin ( options = {} ) {
  // `options.include` and `options.exclude` can each be a minimatch
  // pattern, or an array of minimatch patterns, relative to process.cwd()
  var filter = createFilter( options.include, options.exclude );

  return {
    transform ( code, id ) {
      // if `options.include` is omitted or has zero length, filter
      // will return `true` by default. Otherwise, an ID must match
      // one or more of the minimatch patterns, and must not match
      // any of the `options.exclude` patterns.
      if ( !filter( id ) ) return;

      // proceed with the transformation...
    }
  };
}
```


## License

MIT
