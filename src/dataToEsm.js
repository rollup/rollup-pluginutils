import makeLegalIdentifier from './makeLegalIdentifier';
import tosource from 'tosource';

// convert data object into separate named exports (and default)
export default function dataToNamedExports ( obj, compact ) {
  const _ = compact ? '' : ' ';
  const nl = compact ? '' : '\n';
  let output = '';
  let defaultExports = compact ? '' : nl;
  const usedLegalKeys = Object.create( null );
  let index = 0;
  const keys = Object.keys( obj );
  for ( let i = 0; i < keys.length; i++ ) {
    const key = keys[i];
    const legalKey = makeLegalIdentifier( key );
    let serialized = tosource( obj[key], null, compact ? false : '  ' );
    output += `export const ${ legalKey }${ _ }=${ _ }${ serialized };${ nl }`;
    while ( usedLegalKeys[legalKey + (index || '')] )
      index++;
    index = 0;
    usedLegalKeys[legalKey + ( index || '' )] = true;
    if ( defaultExports.length > 1 )
      defaultExports += `,${ nl }`;
    if ( key === legalKey )
      defaultExports += `${ _ }${ _ }${ key }`;
    else
      defaultExports += `${ _ }${ _ }${ `'${ key }'` }:${ _ }${ legalKey }`;
  }
  if ( defaultExports.length > 3 )
    defaultExports += nl;
  output += `export default${_}{${ defaultExports }};`;
  return output;
};