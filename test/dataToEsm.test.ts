import { dataToEsm } from '../src/index';

describe('dataToEsm', function() {
	it('outputs treeshakeable data', function() {
		expect(dataToEsm({ some: 'data', another: 'data' })).toEqual(
			'export var some = "data";\nexport var another = "data";\nexport default {\n\tsome: some,\n\tanother: another\n};\n'
		);
	});

	it('handles illegal identifiers, object shorthand, preferConst', function() {
		expect(
			dataToEsm({ '1': 'data', default: 'data' }, { objectShorthand: true, preferConst: true })
		).toEqual('export default {\n\t"1": "data",\n\t"default": "data"\n};\n');
	});

	it('supports non-JSON data', function() {
		const date = new Date();
		expect(dataToEsm({ inf: Infinity, date, number: NaN, regexp: /.*/ })).toEqual(
			'export var inf = Infinity;\nexport var date = new Date(' +
				date.getTime() +
				');\nexport var number = NaN;\nexport var regexp = /.*/;\nexport default {\n\tinf: inf,\n\tdate: date,\n\tnumber: number,\n\tregexp: regexp\n};\n'
		);
	});

	it('supports a compact argument', function() {
		expect(
			dataToEsm({ some: 'data', another: 'data' }, { compact: true, objectShorthand: true })
		).toEqual('export var some="data";export var another="data";export default{some,another};');
		expect(
			dataToEsm(
				{ some: { deep: { object: 'definition', here: 'here' } }, another: 'data' },
				{ compact: true, objectShorthand: false }
			)
		).toEqual(
			'export var some={deep:{object:"definition",here:"here"}};export var another="data";export default{some:some,another:another};'
		);
	});

	it('supports nested objects', function() {
		const obj = { a: { b: 'c', d: ['e', 'f'] } };
		expect(dataToEsm({ obj })).toEqual(
			'export var obj = {\n\ta: {\n\t\tb: "c",\n\t\td: [\n\t\t\t"e",\n\t\t\t"f"\n\t\t]\n\t}\n};\nexport default {\n\tobj: obj\n};\n'
		);
	});

	it('supports nested arrays', function() {
		const arr = ['a', 'b'];
		expect(dataToEsm({ arr })).toEqual(
			'export var arr = [\n\t"a",\n\t"b"\n];\nexport default {\n\tarr: arr\n};\n'
		);
	});

	it('supports null serialize', function() {
		expect(dataToEsm({ null: null })).toEqual('export default {\n\t"null": null\n};\n');
	});

	it('supports default only', function() {
		const arr = ['a', 'b'];
		expect(dataToEsm({ arr }, { namedExports: false })).toEqual(
			'export default {\n\tarr: [\n\t\t"a",\n\t\t"b"\n\t]\n};'
		);
	});

	it('default only for non-objects', function() {
		const arr = ['a', 'b'];
		expect(dataToEsm(arr)).toEqual('export default [\n\t"a",\n\t"b"\n];');
	});
});
