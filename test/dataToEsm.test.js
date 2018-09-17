const assert = require( 'assert' );
const {dataToEsm} = require( '..' );

describe( 'dataToEsm', function () {
	it( 'outputs treeshakeable data', function () {
		assert.equal( dataToEsm( { some: 'data', another: 'data' } ), 'export var some = "data";\nexport var another = "data";\nexport default {\n\tsome: some,\n\tanother: another\n};\n' );
	});

	it( 'handles illegal identifiers, object shorthand, preferConst', function () {
		assert.equal( dataToEsm( { '1': 'data', 'default': 'data' }, { objectShorthand: true, preferConst: true } ), 'export default {\n\t"1": "data",\n\t"default": "data"\n};\n' );
	});

	it( 'supports non-JSON data', function () {
		var date = new Date();
		assert.equal( dataToEsm( { inf: Infinity, date: date, number: NaN, regexp: /.*/ } ), 'export var inf = Infinity;\nexport var date = new Date(' + date.getTime() + ');\nexport var number = NaN;\nexport var regexp = /.*/;\nexport default {\n\tinf: inf,\n\tdate: date,\n\tnumber: number,\n\tregexp: regexp\n};\n' );
	});

	it( 'supports a compact argument', function () {
		assert.equal( dataToEsm( { some: 'data', another: 'data' }, { compact: true, objectShorthand: true } ), 'export var some="data";export var another="data";export default{some,another};' );
		assert.equal( dataToEsm( { some: { deep: { object: 'definition', here: 'here' } }, another: 'data' }, { compact: true, objectShorthand: false } ), 'export var some={deep:{object:"definition",here:"here"}};export var another="data";export default{some:some,another:another};' );
	});

	it( 'supports nested objects', function () {
		var obj = { a: { b: 'c', d: ['e', 'f'] } };
		assert.equal( dataToEsm( { obj: obj } ), 'export var obj = {\n\ta: {\n\t\tb: "c",\n\t\td: [\n\t\t\t"e",\n\t\t\t"f"\n\t\t]\n\t}\n};\nexport default {\n\tobj: obj\n};\n' );
	});

	it ( 'supports nested arrays', function () {
		var arr = ['a', 'b'];
		assert.equal( dataToEsm( { arr: arr } ), 'export var arr = [\n\t"a",\n\t"b"\n];\nexport default {\n\tarr: arr\n};\n' );
	});

	it ( 'supports null serialize', function () {
		assert.equal( dataToEsm( { null: null } ), 'export default {\n\t"null": null\n};\n' );
	});

	it ( 'supports default only', function () {
		var arr = ['a', 'b'];
		assert.equal( dataToEsm( { arr: arr }, { namedExports: false } ), 'export default {\n\tarr: [\n\t\t"a",\n\t\t"b"\n\t]\n};' );
	});

	it ( 'default only for non-objects', function () {
		var arr = ['a', 'b'];
		assert.equal( dataToEsm( arr ), 'export default [\n\t"a",\n\t"b"\n];' );
	});
});
