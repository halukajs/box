# Core Concepts
> This article is for v1 or newer.

<hr>

## Overview

This guide covers the concept of registering the components (and/or dependencies) and different ways of doing it along with their resolutions. 

## Registration

In Box, registration means binding a function or class into the container. It can be done by using the `register` (alias `bind`) method of Container.

### Simple Registration

We can register a binding using the `register` (alias `bind`) method, passing the provider along with a `Function` or a `Class`.

Provider is just the name that we will use to identify it during resolution.

```js
box.register('http', function (box, opts) {
    return express()
});
```

Note that we receive the container itself as the first parameter to the resolver. Second argument `opts` is for resolution options that can be passed to the resolver during resolution for contextual resolutions depending on the options provided.

### Singleton Registration

We can register a binding as a singleton using `singleton` method. Singleton are bindings that should only be resolved one time. Once a singleton binding is resolved, the same object instance will be returned on subsequent calls into the container.

```js
box.singleton('http', function (box, opts) {
    return express()
})

```


### Registration with BindingOptions

We can register a binding with BindingOptions by: 
```js
box.register(BindingOptions)
```
`BindingOptions` is an object that contains the binding options for a registration. It should has the following properties:
*   **provider** : It contains the name of the component to be registered. It can be `string` or `object`.
    *   **name** : Name of the provider
    *   **alias** : Any alias to be set for the provider. (For more about alias, see [Aliasing](/box/docs/other-concepts#aliasing) section.)

*   **content** : It is the content that is to be registered within the provider. It may be a `Function` or a `Class`.

*   **singleton** : *(Optional)* It specifies whether the instance will persist the instance when first resolved and return the same instance on subsequent resolutions. It takes a `boolean`. Default is `false`. 

*   **opts** : *(Optional)* It is the default resolution options. (For more about opts, see [Options](/box/docs/other-concepts#resolutionoptions) part.)



Some examples of BindingOptions:

Example 1:
```js
{
    provider: 'Database',
    content: function (box, opts) {  // content can be either a function or a class.
        //
    }
}
```
Example 2:
```js
{
    provider: {
        name: 'Database',
        alias: 'db',
    },
    content: Database  // here Database is considered a class. Can be either a function or a class.
}
```
Example 3:
```js
{
    provider: {
        name: 'Database',
        alias: 'db',
    },
    content: function (box, opts) {
        return new Database({ connString: opts.connString }) 
    },
    singleton: true, // When 'Database' is resolved, a single instance persists on every resolution
    opts: {
        connString: 'Your connection string' // default connString to be used.  
    }
}
```

### Instance Registration

You may also bind an existing object instance into the container using the `save` method. The given instance will always be returned on subsequent calls into the container:

```js
const app = CreateAwesomeApp()
box.save('app', app)
// or, use provider object
box.save({
    provider: 'Application',
    alias: 'app',
}, app)
```

## Resolution

The `resolve` method is used to resolve a registered provider out of the container. `resolve` has two alias methods `get` and `use`. The `resolve` method  accepts the name or alias of the provider you wish to resolve:

```js
let app = box.resolve('app') // or box.resolve('Application')
```

If any unregistered provider is resolved, container throws `BindingResolutionError`.

### Shorthand Resolution

A provider can be resolved by using its provider name or its alias directly as a property of the container. Container uses Proxy handler for handling property lookups and perform resolution if it is registered.

```js
let app = box.app  // Where, app is a provider name or an alias
```

### Injection from BindingOptions

If some registrations dependencies' are not resolvable from container or in any case aren't registered into the container, container tries to inject them from the `opts` property of the `BindingOptions` for that registration.

```js
box.register({
    provider: 'db',
    content: function (box, opts) {
        return new Database({ connString: opts.connString }) 
    },
    opts: {
        connString: 'The default connection string' // default connString to be used.  
    }
}
```

Here, when resolving, `opts.connString` would be `The default connection string`.

<div class="note-warn">
The dependency provided in <code>opts</code> property of <code>BindingOptions</code> is ignored if the dependency is resolvable from the container. See below for more.
</div>

### Automatic Injection

When resolving, the container automatically resolves the dependencies and pass them into content function or Class. The name (or alias) shall be the same for auto-injection to happen.

Injection works by passing the revealing a Proxy to the content functions or constructors, which looks like a regular object but has a `get` handler that resolves from the container.

For example: If a class, suppose Database, has a dependency of `connString`, and connString is registered, it is auto injected into the content function or constructor:

```js
class Database {
    constructor ({ connString }) {
        // connString is resolved from the container
    }
}
```

<div class="note-info">
The dependency provided in <code>opts</code> property of <code>BindingOptions</code> is ignored if the injection is done as mentioned above.
</div>


### Resolution Options

Dependencies can also be injected by passing them as second parameter during resolution:

```js
let db = box.resolve('db', { connString: 'your conn. string here' })
```
This has the highest priority in injecting of the dependencies among the three ways.

### Priority of Injection

Below is the summary of priority on which injection is done : 

*   1) Resolution Options
*   2) Auto-injection from Container
*   3) From BindingOptions

When the dependency cannot be injected from any of the above, finally the `InjectionError` is thrown.

## Aliasing

Occasionally, you may want to be able to resolve a registration with multiple names due to many reasons, one being the different taste of names of the collaborators of your project. In such cases, Box has got your back. You can define any number of aliases for a provider and that alias can be used for resolution.

<div class="note-info">
An alias may even be aliased to an alias.
</div>

There are two ways of defining aliases:

### Aliasing during registration with BindingOptions

As you might have seen aliasing in the registration part, let's go over it again. The `provider` property of `BingingOptions` can either be a string or an object. In case it is an object, it further has two properties, namely, `name` and `alias`. Any string supplied to the alias property gets registered as an alias aliasing to the `name` of the provider.

Example:

```js
box.register({
    provider: {
        name: 'Database',
        alias: 'db',
    },
    content: Database  // here Database is considered a class.
})
```
This can be resolved as:
```js
box.resolve('Database') // or, box.Database
box.resolve('db')       // or, box.db
```

### Aliasing with `alias` method

The `alias` method can be used for defining alias for a provider:

```js
// box.alias('your alias', 'provider to be aliased')
box.alias('db', 'Database')

```

<div class="note-info">
As per our style guide, it is preferable to define alias that adhere to variable naming conventions for use in shorthand resolutions.
</div>