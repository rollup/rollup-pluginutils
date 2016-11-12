import { resolve, sep } from 'path';
import { Minimatch } from 'minimatch';
import ensureArray from './utils/ensureArray';

export default function createFilter ( include, exclude ) {
	include = ensureArray( include ).map( id => isRegexp( id ) ? id : new Minimatch( resolve( id ) ) );
	exclude = ensureArray( exclude ).map( id => isRegexp( id ) ? id : new Minimatch( resolve( id ) ) );

	return function ( id ) {

		if ( typeof id !== 'string' ) return false;
		if ( /\0/.test( id ) ) return false;

		id = id.split(sep).join('/');

		let minimatch
		for ( let i = 0; i < exclude.length; ++i ) {
			minimatch = exclude[i]
			if ( isRegexp(minimatch) ) {
				if ( minimatch.test(id) ) {
					return false
				}
				continue
			}
			if ( minimatch.match( id ) ) {
				return false
			}
		}

		for ( let i = 0; i < include.length; ++i ) {
			minimatch = include[i]
			if ( isRegexp(minimatch) ) {
				if ( minimatch.test(id) ) {
					return true
				}
				continue
			}
			if ( minimatch.match( id ) ) {
				return true
			}
		}

		return !include.length
	};
}

function isRegexp ( val ) {
	return val instanceof RegExp
}