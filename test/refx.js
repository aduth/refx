var sinon, refx;

sinon = require( 'sinon' );
refx = require( '../' );

describe( 'refx()', function() {
	var effects = {
		TEST: function( action, store ) {
			store.dispatch( {
				type: action.type + '_EFFECTED',
				data: store.getState(),
			} );
		},
		TEST_RETURN: function( action, store ) {
			return {
				type: action.type + '_EFFECTED',
				data: store.getState(),
			};
		},
	};

	function assert( middleware ) {
		var spy, store;

		spy = sinon.spy();
		store = {
			dispatch: spy,
			getState: function() {
				return true;
			},
		};

		middleware( store )( spy )( { type: 'TEST' } );
		middleware( store )( spy )( { type: 'TEST_RETURN' } );

		// Validate ignoring prototype members
		middleware( store )( function() {} )( { type: 'valueOf' } );

		sinon.assert.callCount( spy, 4 );
		sinon.assert.match( spy.getCall( 0 ).args[ 0 ], {
			type: 'TEST',
		} );
		sinon.assert.match( spy.getCall( 1 ).args[ 0 ], {
			type: 'TEST_EFFECTED',
			data: true,
		} );
		sinon.assert.match( spy.getCall( 2 ).args[ 0 ], {
			type: 'TEST_RETURN',
		} );
		sinon.assert.match( spy.getCall( 3 ).args[ 0 ], {
			type: 'TEST_RETURN_EFFECTED',
			data: true,
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

	it( 'should allow after-the-fact manipulation via effects property', function() {
		var middleware = refx( [] ),
			actionType;

		for ( actionType in effects ) {
			middleware.effects[ actionType ] = [ effects[ actionType ] ];
		}

		assert( middleware );
	} );
} );
