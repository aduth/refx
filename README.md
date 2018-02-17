# refx

_refx_ is a Redux middleware for triggering side effects.

In Redux, actions are dispatched synchronously. However, in many real-world applications you'll find yourself needing to fetch data from an API asynchronously. Other popular solutions in the ecosystem like [redux-thunk](https://github.com/gaearon/redux-thunk) augment your [action creators](http://redux.js.org/docs/Glossary.html#action-creator) and empower them to dispatch whenever and as often as necessary.

_refx_ takes a different approach; like in a plain Redux store, your actions must always be plain objects. To perform side effects, you instead define effects as an object of action type keys whose values are functions which trigger additional effects. Those side effects have access to both the dispatched action and the store instance meaning they — like thunks — can dispatch whenenever and as often as necessary.

Why is this any better than the other solutions? It separates actions which affect change in your store from the side effects that occur as a mere consequence of said actions. Actions as plain objects are also easier to extend, enabling you to compose action creators in ways that would otherwise be not possible with thunks.

Heavily optimized, it weighs in at a paltry 241 bytes gzipped and minified. Browser support follows Redux, including all Node.js versions and browsers Internet Explorer 9 or newer. If you need to support Internet Explorer 8, add [`es5-shim`](https://github.com/es-shims/es5-shim) to your page prior to loading _refx_.

## Example

_refx_ is a function returning a [middleware](http://redux.js.org/docs/advanced/Middleware.html), meaning it should be applied during the creation of your Redux store. The function accepts an object or array of objects mapping action types to the side effect handlers.

```js
import { createStore, applyMiddleware } from 'redux';
import refx from 'refx';
import todos from './reducer';

const effects = {
	TODO_ADD: ( action, store ) => {
		fetch( `/todos`, {
			method: 'POST',
			body: action.todo
		} ).then( ( response ) => {
			return response.json();
		} ).then( ( todo ) => {
			store.dispatch( {
				type: 'TODO_SAVED',
				todo
			} );
		} );
	}
};

export default function configureStore() {
	return createStore( todos, [], applyMiddleware( refx( effects ) ) );
}
```

In this example, we've defined a handler to observe the `TODO_ADD` action. When this action is dispatched, we'll trigger a request to our API to save the todo. Once complete, we'll then dispatch another action to the store to indicate that the request has succeeded.

## Usage

Download [`refx.min.js` from unpkg](https://unpkg.com/refx/dist/refx.min.js) and include in your application, or install from `npm`.

```
npm install refx
```

If included as a script in the browser, it is made available in the global context as `refx`.

The _refx_ function accepts an object of action type keys or an array of objects.

Each effect handler is a function or array of functions, each accepting the dispatched action object and store instance. The effect handler can return an action object to be dispatched.

The returned middleware includes a reference to the normalized `effects` object (where each value is an array of effects), in case you need to manipulate effects after initialization.

## License

Copyright (c) 2018 Andrew Duthie

[The MIT License (MIT)](https://opensource.org/licenses/MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
