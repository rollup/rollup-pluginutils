import { resolve, sep } from 'path';
import mm from 'micromatch';
import ensureArray from './utils/ensureArray';

export default function createFilter ( include, exclude ) {
	const getMatcher = id => ( isRegexp( id ) ? id : { test: mm.matcher( resolve( id ) ) } );
	include = ensureArray( include ).map( getMatcher );
	exclude = ensureArray( exclude ).map( getMatcher );

	return function ( id ) {

		if ( typeof id !== 'string' ) return false;
		if ( /\0/.test( id ) ) return false;

		id = id.split( sep ).join( '/' );
		
		let keep = undefined;

		for ( let i = 0; i < exclude.length; ++i ) {
			const matcher = exclude[i];
			if ( matcher.test( id ) ) keep = false;
		}

		for ( let i = 0; i < include.length; ++i ) {
			const matcher = include[i];
			if ( matcher.test( id ) ) keep = true;
		}
		
		if ( keep !== undefined ) return keep

		return !include.length;
	};
}

function isRegexp ( val ) {
	return val instanceof RegExp;
}
