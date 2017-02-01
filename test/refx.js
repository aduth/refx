var sinon, refx;

sinon = require( 'sinon' );
refx = require( '../' );

describe( 'refx()', function() {
	var effects = {
		TEST: function( store, action ) {
			store.dispatch( {
				type: action.type,
				data: store.getState()
			} );
		}
	};

	function assert( middleware, callCount ) {
		var dispatch, store;

		dispatch = sinon.spy();
		store = {
			dispatch: dispatch,
			getState: function() {
				return true;
			}
		};

		middleware( store )( function() {} )( { type: 'TEST' } );

		// Validate ignoring prototype members
		middleware( store )( function() {} )( { type: 'valueOf' } );

		if ( ! ( callCount > 1 ) ) {
			callCount = 1;
		}

		sinon.assert.callCount( dispatch, callCount );
		sinon.assert.alwaysCalledWith( dispatch, {
			type: 'TEST',
			data: true
		} );
	}

	it( 'should accept an object of keys', function() {
		var middleware = refx( effects );

		assert( middleware );
	} );

	it( 'should accept arguments of objects of keys', function() {
		var middleware = refx( effects, effects );

		assert( middleware, 2 );
	} );

	it( 'should accept an array of objects of keys', function() {
		var middleware = refx( [ effects ] );

		assert( middleware );
	} );

	it( 'should accept arguments of mixed arrays and objects', function() {
		var middleware = refx( {
			TEST: [ effects.TEST, effects.TEST ]
		} );

		assert( middleware, 2 );
	} );
} );
