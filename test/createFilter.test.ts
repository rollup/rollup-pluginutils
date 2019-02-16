import * as path from 'path';
import { createFilter } from '../src/index';

describe('createFilter', function() {
	it('includes by default', function() {
		const filter = createFilter();
		expect(filter(path.resolve('x'))).toBeTruthy();
	});

	it('excludes IDs that are not included, if include.length > 0', function() {
		const filter = createFilter(['y']);
		expect(filter(path.resolve('x'))).toBeFalsy();
		expect(filter(path.resolve('y'))).toBeTruthy();
	});

	it('excludes IDs explicitly', function() {
		const filter = createFilter(null, ['y']);
		expect(filter(path.resolve('x'))).toBeTruthy();
		expect(filter(path.resolve('y'))).toBeFalsy();
	});

	it('handles non-array arguments', function() {
		const filter = createFilter('foo/*', 'foo/baz');
		expect(filter(path.resolve('foo/bar'))).toBeTruthy();
		expect(filter(path.resolve('foo/baz'))).toBeFalsy();
	});

	it('negation patterns', function() {
		const filter = createFilter(['a/!(b)/c']);
		expect(filter(path.resolve('a/d/c'))).toBeTruthy();
		expect(filter(path.resolve('a/b/c'))).toBeFalsy();
	});

	it('excludes non-string IDs', function() {
		const filter = createFilter(null, null);
		expect(filter({})).toBeFalsy();
	});

	it('excludes strings beginning with NUL', function() {
		const filter = createFilter(null, null);
		expect(filter('\0someid')).toBeFalsy();
	});

	it('includes with regexp', function() {
		const filter = createFilter(['a/!(b)/c', /\.js$/]);
		expect(filter(path.resolve('a/d/c'))).toBeTruthy();
		expect(filter(path.resolve('a/b/c'))).toBeFalsy();
		expect(filter(path.resolve('a.js'))).toBeTruthy();
		expect(filter(path.resolve('a/b.js'))).toBeTruthy();
		expect(filter(path.resolve('a/b.jsx'))).toBeFalsy();
	});

	it('excludes with regexp', function() {
		const filter = createFilter(['a/!(b)/c', /\.js$/], /\.js$/);
		expect(filter(path.resolve('a/d/c'))).toBeTruthy();
		expect(filter(path.resolve('a/b/c'))).toBeFalsy();
		expect(filter(path.resolve('a.js'))).toBeFalsy();
		expect(filter(path.resolve('a/b.js'))).toBeFalsy();
		expect(filter(path.resolve('a/b.jsx'))).toBeFalsy();
	});
});
