var sinon, refx;

sinon = require( 'sinon' );
refx = require( '../' );

describe( 'refx()', function() {
	var effects, middleware;

	beforeEach( function() {
		effects = {
			TEST: function( store, action ) {
				store.dispatch( {
					type: action.type,
					data: store.getState()
				} );
			}
		};
	} );

	function assert( callCount ) {
		var dispatch = sinon.spy();
		var store = {
			dispatch: dispatch,
			getState: function() {
				return true;
			}
		};

		middleware( store )( function() {} )( { type: 'TEST' } );

		if ( callCount > 1 ) {
			sinon.assert.callCount( dispatch, callCount );
		}

		sinon.assert.alwaysCalledWith( dispatch, {
			type: 'TEST',
			data: true
		} );
	}

	it( 'should accept an object of keys', function() {
		middleware = refx( effects );

		assert();
	} );

	it( 'should accept arguments of objects of keys', function() {
		middleware = refx( effects, effects );

		assert( 2 );
	} );

	it( 'should accept an array of objects of keys', function() {
		middleware = refx( [ effects ] );

		assert();
	} );

	it( 'should accept arguments of mixed arrays and objects', function() {
		effects = {
			TEST: [ effects.TEST, effects.TEST ]
		};

		middleware = refx( effects );

		assert( 2 );
	} );
} );
