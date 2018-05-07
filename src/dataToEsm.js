import makeLegalIdentifier from './makeLegalIdentifier';
import tosource from 'tosource';

// convert data object into separate named exports (and default)
export default function dataToNamedExports ( data, options = {} ) {
  const t = options.compact ? '' : 'indent' in options ? options.indent : '\t';
  const _ = options.compact ? '' : ' ';
  const n = options.compact ? '' : '\n';
  const declarationType = options.preferConst ? 'const' : 'var';

  let namedExportCode = '';
  const defaultExportRows = [];
  const dataKeys = Object.keys( data );
  for (let i = 0; i < dataKeys.length; i++) {
    const key = dataKeys[i];
  	if (key === makeLegalIdentifier( key )) {
      if ( options.objectShorthand )
        defaultExportRows.push(key);
      else
  		  defaultExportRows.push( `${ key }:${ _ }${ key }` );
  		namedExportCode += `export ${declarationType} ${key}${ _ }=${ _ }${ tosource( data[key], null, options.compact ? false : t ) };${ n }`;
  	} else {
      defaultExportRows.push( `${ JSON.stringify(key) }: ${ tosource( data[key], null, options.compact ? false : t )}` );
    }
  }
  return namedExportCode + `export default${ _ }{${ n }${ t }${ defaultExportRows.join(`,${ n }${ t }`) }${ n }};${ n }`;
};