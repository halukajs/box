'use strict'

/**
 * @name @haluka/box
 * @author Robin Panta
 * @copyright Robin Panta
 * @license MIT
 */

class Container {

	constructor () {
		this._aliases = new Map()
		this._providers = new Map()
		this._options = new Map()
		this._instances = new Map()

		// Proxify self, to allow [this.<name>]
		return proxify(this)
	}

	alias (alias, provider) {
		this._aliases.set(alias, provider)
	}

	register (opts) {

		let bindOpts = {}
		if (arguments.length > 1) {
			bindOpts.provider = arguments[0]
			bindOpts.content = arguments[1]
			if (typeof(arguments[2]) == "boolean") {
				bindOpts.singleton = arguments[2]
			}
		} else {
			bindOpts = opts
		}

		bindOpts.provider = this._provider(bindOpts.provider)

		this._providers.set(bindOpts.provider, bindOpts)
		if (bindOpts.opts !== undefined)
			this._options.set(bindOpts.provider, bindOpts.opts)

	}

	bind () {
		return this.register(...arguments)
	}

	singleton (opts) {
		if (arguments.length > 1) {
			arguments[2] = true
		} else {
			arguments[0].singleton = true
		}
		this.register(...arguments)
	}

	registered (name) {
		return this._providers.has(name)
	}

	save (provider, instance) {
		provider = this._provider(provider)
		this._instances.set(provider, instance)
	}

	saved (name) {
		return this._instances.has(name)
	}

	resolve (name, opts = {}) {
		let provider = this._resolveAlias(name)

		if (this.saved(provider))
			return this._instances.get(provider)
		
		provider = this._providers.get(provider)
		if (!provider) throw new BindingResolutionError(name)

		const Content = provider.content
		if (typeof(Content) !== 'function') throw new InvalidContentError(name)

		const resolution = this._manufacture(Content, opts, provider.opts)

		if (provider.singleton == true) {
			this.save(provider.provider, resolution)
		}
		return resolution
	}

	get () {
		return this.resolve(...arguments)
	}

	use () {
		return this.resolve(...arguments)
	}

	_provider (provider) {
		// set if alias specified
		if (typeof(provider) === 'object') {
			this.alias(provider.alias, provider.name)
			provider = provider.name
		}
		return provider
	}

	_resolveAlias (name) {
		if (this._aliases.has(name)) {
			return this._resolveAlias(this._aliases.get(name))
		}
		return name
	}

	_manufacture (Content, opts, providerOpts = {}) {
		const injector = new Proxy(Object.assign({}, providerOpts, opts) , {
			get: (target, prop) => {
				if (prop in opts) {
					return opts[prop]
				} else if (this.registered(prop) || this.saved(prop)) {
					return this.resolve(prop)
				} else if (prop in providerOpts) {
					return providerOpts[prop]
				} else {
					throw new UnboundInjectionError(prop)
				}

			}})

		return !isClass(Content) ? Content(this, injector) : new Content(injector)
	}

}


class Throwable extends Error {
	constructor (message, code) {
		super(message)
		this.name = this.constructor.name
		this.message = message
		this.code = code
		this.message = message
	}
}


class BindingResolutionError extends Throwable {
	constructor (provider) {
		super(`Provider [${provider}] is not registered.`)
	}
}

class InvalidContentError extends Throwable {
	constructor (provider) {
		super(`Content for provider [${provider}] is not a valid function or class.`)
	}
}

class UnboundInjectionError extends Throwable {
	constructor (provider) {
		super(`Unable to inject provider [${provider}]. Not available.`)
	}
}


function isClass(func) {
	return typeof func === 'function'
		&& /^class\s/.test(Function.prototype.toString.call(func))
}


function proxify (container) {
	return new Proxy(container, {
		get: function (target, prop) {
			if (!(prop in target))
				return target.resolve(prop)
			else
				return Reflect.get(...arguments)
		}
	})
}


exports.Container = Container
exports.BindingResolutionError = BindingResolutionError
exports.InvalidContentError = InvalidContentError
exports.UnboundInjectionError = UnboundInjectionError
