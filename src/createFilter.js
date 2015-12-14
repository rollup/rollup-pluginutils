import { resolve, sep } from 'path';
import { makeRe } from 'minimatch';
import ensureArray from './utils/ensureArray';

export default function createFilter ( include, exclude ) {
	include = ensureArray( include ).map( id => resolve( id ) ).map( makeRe );
	exclude = ensureArray( exclude ).map( id => resolve( id ) ).map( makeRe );

	return function ( id ) {
		var included = !include.length;
		id = id.split(sep).join('/');

		include.forEach( pattern => {
			if ( pattern.test( id ) ) included = true;
		});

		exclude.forEach( pattern => {
			if ( pattern.test( id ) ) included = false;
		});

		return included;
	};
}
