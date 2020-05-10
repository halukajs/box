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

	test('save and resolve the instance', () => {
		const c = new Container()

		const myObj = {
			something: 'Fun is going on'
		}

		c.save('fun', myObj)

		expect(c.use('fun').something).toBe('Fun is going on')
	})

})
