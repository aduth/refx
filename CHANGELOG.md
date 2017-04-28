### 2.0.0 (2017-04-28)

- Breaking: Effect handler argument order has been reversed, with `action` as the first argument
- Breaking: The middleware must be initialized with a single argument, either an object or array of objects
- New: If an effect handler returns an action object, it will be dispatched

These changes are being made in an effort to discourage relying on the store instance and dispatching directly, instead preferring a synchronous flow where effect handlers can return actions in response to other actions, but aren't encouraged to perform ad hoc dispatches. In the future, support may be added to optionally omit the effect handler's store argument altogether.

### 1.0.0 (2016-12-15)

- Initial release