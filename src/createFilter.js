import { resolve, sep } from 'path';
import mm from 'micromatch';
import ensureArray from './utils/ensureArray';

export default function createFilter ( include, exclude ) {
	include = ensureArray( include ).map( id => resolve( id ) ).map( id => mm.matcher( id ) );
	exclude = ensureArray( exclude ).map( id => resolve( id ) ).map( id => mm.matcher( id ) );

	return function ( id ) {
		if ( typeof id !== 'string' ) return false;
		if ( /\0/.test( id ) ) return false;

		let included = !include.length;
		id = id.split(sep).join('/');

		include.forEach( matcher => {
			if ( matcher( id ) ) included = true;
		});

		exclude.forEach( matcher => {
			if ( matcher( id ) ) included = false;
		});

		return included;
	};
}
