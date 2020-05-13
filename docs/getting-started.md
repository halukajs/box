# Getting Started
> This article is for v1 or newer.

<hr>

**Haluka Box** is a  is a powerful tool for managing class dependencies and performing dependency injection for Javascript.
It helps you manage your components and dependencies by providing a seamless and consistent container along with dependency injection.

Dependency injection is a fancy term that essentially means: class dependencies are "injected" into the class via the constructor.
Haluka Box is a component of [Haluka](https://haluka.dev) framework, but can be used independently with any other project or frameworks.

## Installing Box

Haluka Box is available in NPM. Run following command in your project directory to install the latest stable version:

```bash
npm install @haluka/box
```
or, if you use `yarn`
```bash
yarn add @haluka/box
```

### For browsers:
From jsDelivr:
```js
<script src="https://cdn.jsdelivr.net/npm/@haluka/box@1.0.0/src/index.min.js"></script>
```

## Basic Example


The concept behind using containers is to store and assemble components into a cohesive application. So, the state of your components are stored in the container.

The components are resistered and resolved in a Container object. The dependencies of the component, if already registered, gets injected automatically. For injection to work, there shall be single parameter in the constructor or, constructor parameters shall be destructured.

That's it.

```js
const { Container } = require('@haluka/box');

const box = new Container();
// Container is created. Simple? I know, right.

// Let's suppose we have a component `Chicken`.

/**
 * Chicken Class, sounds tasty.
 **/
class Chicken {

    container () {
        // Cook Tasty Chicken
    }

    isTasty() {
        return true;
    }
}

box.register('chicken', Chicken);

// Now, to resolve a new instance of chicken.
let chicken = box.resolve('chicken')

// Or, instance of chicken can now directly be accesed as a property too.
console.log(box.chicken.isTasty())  // Output: true

```
This is just a basic usage of Box. Need more Power? We got you! See the example given below for dependency injection.

## Dependency Injection

To see dependency injection in action, let's suppose our `Chicken` has two dependencies `Spices` and `Onions`.

```js
class Spices{
	/* your methods and properties */
}

class Onions{
	/* your methods and properties */
}

class Chicken{ /* Chicken Provider */

	constructor ({ Spices, Onions}) {
		/* if you smell what the box is cooking... */
	}

	eggs () {
		/* lay some eggs */
		console.log('Eggs in the frying pan!')
	}

	/* other methods and properties */
}
```
First, registering all the components into `box`:

```js
box.register('Spices', Spices)
box.register('Onions', Onions)
box.register('Chicken', Chicken)
```

Now, wherever the chicken is required, just resolve it or access it as a property of box.

```js
let chicken = box.Chicken  // Returns a new instance of Chicken auto-injecting it's dependencies
// This chicken can be made consistent, by regisering it as a `singleton`. Read more on `Registration` part.

chicken.eggs() // Outputs: Eggs in the frying pan!

```
Here, we injected `Spices` and `Onions` behind the scenes. Now, `Chicken` consumer shall not worry about passing `Spices` or `Onions`.
Due to this, the developer doesn't need to worry about managing dependencies everywhere and add buch of require statements everywhere.

Working code is good, beautiful code is even better.

## Digging Deeper

Haluka Box has other features and capabilities like managing life, registration as singleton, registration and resolution options. This section just covers the basic things required to get started using Box. There are other topic-wise documentations to understand more on the usages. For digging deeper, use the list to the left to check them out.

Everything else is documented in [API Reference](https://haluka.dev/box/api), and feel free to ask question on [GitHub](https://github.com/halukajs/box).

