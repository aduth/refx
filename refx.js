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
					var effect,
						effectAction;

					if ( map[ action.type ] ) {
						for ( effect in map[ action.type ] ) {
							effectAction = map[ action.type ][ effect ]( action, store );
							if ( effectAction ) {
								store.dispatch( effectAction );
							}
						}
					}

					return next( action );
				};
			};
		};
	};
} );
