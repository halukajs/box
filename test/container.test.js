'use strict'
require('jest')

const { Container } = require('../src/index')

describe('Container', () => {

	test('register and resolve the provider', () => {
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
		expect(c.get('test', { yahoo: 'overridden' })).toBe('overridden')

		// Directly using the Name [Proxy at use]
		expect(c.hasOwnProperty('test')).toBe(false)
        expect(c.test).toBe('i was called')
	})

	test('save and reolve the instance', () => {
		const c = new Container()

		const myObj = {
			something: 'Fun is going on'
		}

		c.save('fun', myObj)

		expect(c.use('fun').something).toBe('Fun is going on')
	})

})
