import { resolve, sep } from 'path';
import { Minimatch } from 'minimatch';
import ensureArray from './utils/ensureArray';

const appendResolved = ( matchers, id ) => matchers.concat( id, resolve( id ) );
const createMatcher = id => new Minimatch(id);

export default function createFilter ( include, exclude ) {
	include = ensureArray( include ).reduce( appendResolved, [] ).map( createMatcher );
	exclude = ensureArray( exclude ).reduce( appendResolved, [] ).map( createMatcher );

	return function ( id ) {
		if ( typeof id !== 'string' ) return false;
		if ( /\0/.test( id ) ) return false;

		let included = !include.length;
		id = id.split(sep).join('/');

		include.forEach( minimatch => {
			if ( minimatch.match( id ) ) included = true;
		});

		exclude.forEach( minimatch => {
			if ( minimatch.match( id ) ) included = false;
		});

		return included;
	};
}
