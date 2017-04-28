var sinon, refx;

sinon = require( 'sinon' );
refx = require( '../' );

describe( 'refx()', function() {
	var effects = {
		TEST: function( action, store ) {
			store.dispatch( {
				type: action.type,
				data: store.getState()
			} );
		},
		TEST_RETURN: function( action, store ) {
			return {
				type: action.type,
				data: store.getState()
			};
		}
	};

	function assert( middleware ) {
		var dispatch, store, callCount;

		dispatch = sinon.spy();
		store = {
			dispatch: dispatch,
			getState: function() {
				return true;
			}
		};

		middleware( store )( function() {} )( { type: 'TEST' } );
		middleware( store )( function() {} )( { type: 'TEST_RETURN' } );

		// Validate ignoring prototype members
		middleware( store )( function() {} )( { type: 'valueOf' } );

		callCount = Object.keys( effects ).length;
		sinon.assert.callCount( dispatch, callCount );
		sinon.assert.calledWith( dispatch, {
			type: 'TEST',
			data: true
		} );
		sinon.assert.calledWith( dispatch, {
			type: 'TEST_RETURN',
			data: true
		} );
	}

	it( 'should accept an object of keys', function() {
		var middleware = refx( effects );

		assert( middleware );
	} );

	it( 'should accept an array of objects of keys', function() {
		var middleware = refx( [ effects ] );

		assert( middleware );
	} );
} );
