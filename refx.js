( function( factory ) {
	if ( 'object' === typeof module ) {
		module.exports = factory();
	} else {
		this.refx = factory();
	}
} )( function() {
	'use strict';

	function flattenIntoMap( map, effects ) {
		var i;
		if ( Array.isArray( effects ) ) {
			for ( i = 0; i < effects.length; i++ ) {
				flattenIntoMap( map, effects[ i ] );
			}
		} else {
			for ( i in effects ) {
				map[ i ] = ( map[ i ] || [] ).concat( effects[ i ] );
			}
		}
	}

	return function( effects ) {
		var map = {};

		flattenIntoMap( map, effects );

		return function( store ) {
			return function( next ) {
				return function( action ) {
					var handlers = map[ action.type ],
						i, handlerAction;

					if ( handlers ) {
						for ( i = 0; i < handlers.length; i++ ) {
							handlerAction = handlers[ i ]( action, store );
							if ( handlerAction ) {
								store.dispatch( handlerAction );
							}
						}
					}

					return next( action );
				};
			};
		};
	};
} );
