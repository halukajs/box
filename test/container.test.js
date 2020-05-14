'use strict'
require('jest')

const { Container } = require('../src/index')

describe('Container', () => {

	test('throws on invalid resolutions', () => {

		const c = new Container()

		// BindingResolutionError when tried resolving unregistered provider
		expect(() => c.resolve('foo')).toThrow('Provider [foo] is not registered.')

		c.bind({
			provider: 'tester',
		})

		// InvalidContentError when tried resolving the provider without content
		expect(c.registered('tester')).toBe(true)
		expect(() => c.tester).toThrow('Content for provider [tester] is not a valid function or class.')

	})

	test('resolves registered function', () => {

		const c = new Container()

		c.bind({
			provider: {
				name: 'TestProvider',
				alias: 'test'
			},
			content: (h, opts) => {
				return opts.yahoo
			},
			opts: {
				yahoo: 'i was called'
			}
		})

		expect(c.registered('TestProvider')).toBe(true)
		expect(c.resolve('test')).toBe('i was called')
	})

	test('throws error when injection unavailable in Class', () => {

		const c = new Container()

		const TestClass = class {
			constructor ({ idontexist }) {
				//
			}
		}

		c.register({
			provider: 'test',
			content: TestClass
		})

		expect(() => c.test).toThrow('Unable to inject provider [idontexist]. Not available.')


	})

	test('resolves registered Class', () => {

		const c = new Container()

		const TestClass = class {
			constructor ({ namaewa, someargs }) {
				this.value = namaewa + someargs
			}
		}

		c.register({
			provider: 'test',
			content: TestClass,
			opts: {
				someargs: "Solo"
			}
		})

		c.save('namaewa', "Tester")

		let t1 = c.resolve('test', { namaewa: 'Robin' })
		let t2 = c.test

		expect(t1.value).toBe('RobinSolo')
		expect(t2.value).toBe('TesterSolo')

		expect(t1).not.toEqual(t2)

	})

	test('resolution options override binding options', () => {

		const c = new Container()

		c.bind({
			provider: {
				name: 'TestProvider',
				alias: 'test'
			},
			content: (h, opts) => {
				return opts.yahoo
			},
			opts: {
				yahoo: 'i was called'
			}
		})

		expect(c.get('test', { yahoo: 'overridden' })).toBe('overridden')

		// Directly using the Name [Proxy at use]
		expect(c.hasOwnProperty('test')).toBe(false)
        expect(c.test).toBe('i was called')
	})

	test('saves and resolves the instance', () => {
		const c = new Container()

		const myObj = {
			something: 'Fun is going on'
		}

		c.save('fun', myObj)

		expect(c.use('fun').something).toBe('Fun is going on')
	})

	//
	test('registers the provider with overloaded method', () => {
		const c = new Container()

		c.register('http', function (c, o) {
			return 'Happy'
		})

	})

	test('registers provider as singleton', () => {
		const c = new Container()

		c.singleton('single', class { })

		c.single
	})
})
