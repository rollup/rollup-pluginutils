import blacklisted from './utils/blacklisted';

export default function makeLegalIdentifier ( str ) {
	str = str
		.replace( /-(\w)/g, ( _, letter ) => letter.toUpperCase() )
		.replace( /[^$_a-zA-Z0-9]/g, '_' );

	if ( /\d/.test( str[0] ) || blacklisted[ str ] === 1 ) str = `_${str}`;

	return str;
}
