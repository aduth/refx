( function( factory ) {
	if ( 'object' === typeof module ) {
		module.exports = factory();
	} else {
		this.refx = factory();
	}
} )( function() {
	function flattenIntoMap( map, effects ) {
		var key;
		for ( key in effects ) {
			if ( Array.isArray( effects ) ) {
				flattenIntoMap( map, effects[ key ] );
			} else {
				map[ key ] = ( map[ key ] || [] ).concat( effects[ key ] );
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
