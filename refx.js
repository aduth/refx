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
			if ( effects.hasOwnProperty( key ) ) {
				if ( Array.isArray( effects ) ) {
					flattenIntoMap( map, effects[ key ] );
				} else {
					map[ key ] = ( map[ key ] || [] ).concat( effects[ key ] );
				}
			}
		}
	}

	return function() {
		var map = Object.create( null );

		flattenIntoMap( map, [].slice.call( arguments ) );

		return function( store ) {
			return function( next ) {
				return function( action ) {
					var e, el;
					if ( !! map[ action.type ] ) {
						for ( e = 0, el = map[ action.type ].length; e < el; e++ ) {
							map[ action.type ][ e ]( store, action );
						}
					}

					return next( action );
				};
			};
		};
	};
} );
