import makeLegalIdentifier from './makeLegalIdentifier';
import tosource from 'tosource';

// convert data object into separate named exports (and default)
export default function dataToNamedExports ( obj ) {
  let output = '';
  let defaultExports = '\n';
  const usedLegalKeys = Object.create( null );
  let index = 0;
  const keys = Object.keys( obj );
  for ( let i = 0; i < keys.length; i++ ) {
    const key = keys[i];
    const legalKey = makeLegalIdentifier( key );
    output += `export const ${ legalKey } = ${tosource( obj[key] )};\n`;
    while ( usedLegalKeys[legalKey + (index || '')] )
      index++;
    index = 0;
    usedLegalKeys[legalKey + ( index || '' )] = true;
    if ( defaultExports.length > 1 )
      defaultExports += ',\n';
    if ( key === legalKey )
      defaultExports += `  ${ key }`;
    else
      defaultExports += `  ${ `'${ key }'` }: ${ legalKey }`;
  }
  if ( defaultExports.length > 3 )
    defaultExports += '\n';
  output += `export default {${ defaultExports }};`;
  return output;
};