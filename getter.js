/** @preserve getter v0.0.2
 * 2014 - kevin von flotow
 * MIT license
 */
 ;( function ( WIN )
	{
		var DOC = WIN.document

		var LOGGING = true

		// determine which matchesSelector to use once on load
		// if else if else compiles smaller than a bunch of ifs
		var MATCHES = ( function ( DOC_ELEMENT )
			{
				if ( DOC_ELEMENT.matches )
				{
					return 'matches'
				}

				else if ( DOC_ELEMENT.matchesSelector )
				{
					return 'matchesSelector'
				}

				else if ( DOC_ELEMENT.webkitMatchesSelector )
				{
					return 'webkitMatchesSelector'
				}

				else if ( DOC_ELEMENT.mozMatchesSelector )
				{
					return 'mozMatchesSelector'
				}

				else if ( DOC_ELEMENT.msMatchesSelector )
				{
					return 'msMatchesSelector'
				}

				else if ( DOC_ELEMENT.oMatchesSelector )
				{
					return 'oMatchesSelector'
				}

				else
				{
					return false
				}
			}
		)( DOC.documentElement );

		/** @constructor */
		function Getter( selector )
		{
			if ( typeof selector === 'undefined' )
			{
				return console.log( 'Getter: selector is not defined' )
			}

			// allow using Getter without 'new'
			if ( !( this instanceof Getter ) )
			{
				return new Getter( selector )
			}

			this.length = 0

			if ( Array.isArray( selector ) )
			{
				// array passed
				for ( var i = 0, l = selector.length; i < l; ++i )
				{
					Getter_find.call( this, selector[ i ] )
				}
			}

			else
			{
				// assume string
				Getter_find.call( this, selector.toString() )
			}

			Getter_classes.call( this )
		}

		// enable/disable logging
		Getter.logging = function ( bool )
		{
			// make sure bool is a boolean
			LOGGING = !!bool
		}

		// define regular expressions
		var regexes = [
			{
				regex: /^#[-A-Za-z0-9_][-A-Za-z0-9_:.]*$/,

				fn: function ( id )
				{
					var ret = []

					var res = DOC.getElementById( id.substr( 1 ) )

					if ( res )
					{
						ret.push( res )
					}

					return ret
				}
			},

			{
				regex: /^\.[-A-Za-z0-9_:.]*$/,

				fn: function ( cls )
				{
					return DOC.getElementsByClassName( cls.substr( 1 ) )
				}
			},

			{
				regex: /^[A-Za-z][-A-Za-z0-9_:.]*$/,

				fn: function ( tag )
				{
					return DOC.getElementsByTagName( tag )
				}
			},

			// no regex needed for querySelectorAll, just put it last
			{
				fn: function ( selector )
				{
					return DOC.querySelectorAll( selector )
				}
			}
		]

		function Getter_find( selector )
		{
			// check for html element
			if ( selector.appendChild )
			{
				this[ this.length++ ] = selector

				return
			}

			// make sure selector is a string
			selector = selector.toString()

			var arr = []

			for ( var i = 0, current; i < 4; ++i )
			{
				current = regexes[ i ]

				if ( current.regex && !current.regex.test( selector ) )
				{
					continue
				}

				arr = current.fn( selector )

				break
			}

			for ( var l = arr.length; this.length < l; )
			{
				this[ this.length ] = arr[ this.length++ ]
			}
		}

		// add class methods to instance
		// depends on classList being available, polyfill required for older browsers
		function Getter_classes()
		{
			// reference this
			var that = this

			// define classList object
			Object.defineProperty( that, 'classList',
				{
					// define methods in an object
					value: {
						add: function ( className )
						{
							for ( var i = 0, classes; i < that.length; ++i )
							{
								that[ i ].classList.add( className )
							}
						},

						// only works on the first element in the instance
						contains: function ( className )
						{
							if ( !that[ 0 ] )
							{
								return false // instance is empty
							}

							// not chainable, returns boolean
							return that[ 0 ].classList.contains( className )
						},

						remove: function ( className )
						{
							for ( var i = 0, classes; i < that.length; ++i )
							{
								that[ i ].classList.remove( className )
							}
						},

						toggle: function ( className )
						{
							for ( var i = 0, classes; i < that.length; ++i )
							{
								that[ i ].classList.toggle( className )
							}
						}
					}
				}
			)
		}

		Getter.prototype.each = function ( fn )
		{
			for ( var i = 0; i < this.length; ++i )
			{
				fn.call( this, this[ i ], i )
			}

			// chainable
			return this
		}

		Getter.prototype.eq = function ( index )
		{

		}

		// executes the given method with provided arguments
		// first argument is the method name (string),
		// additional arguments are passed to method
		Getter.prototype.exec = function ()
		{
			var args = arguments

			if ( args.length === 0 )
			{
				return // must provide at least 1 argument
			}

			var methodName = Array.prototype.shift.call( args )

			if ( this.length === 0 )
			{
				return // this Getter instance is empty
			}

			if ( !this[ 0 ][ methodName ] )
			{
				return console.log( 'getter: method does not exist' )
			}

			for ( var i = 0; i < this.length; ++i )
			{
				this[ i ][ methodName ].apply( this[ i ], args )
			}
		}

		// creates a new Getter instance
		Getter.prototype.filter = function ( selector )
		{
			for ( var i = 0, filtered = []; i < this.length; ++i )
			{
				if ( this[ i ][ MATCHES ]( selector ) )
				{
					filtered.push( this[ i ] )
				}
			}

			// return a new Getter object with filtered elements
			return new Getter( filtered )
		}

		// attempt to return first element, if it doesn't exist, return this
		// creates a new Getter instance if successful
		// returns existing instance if unsuccessful
		Getter.prototype.first = function ()
		{
			return this[ 0 ] ? new Getter( this[ 0 ] ) : this
		}

		// only operates on the first element in the instance
		// does not create a new instance
		// returns boolean
		Getter.prototype.is = function ( selector )
		{
			return this[ 0 ] ? this[ 0 ][ MATCHES ]( selector ) : false
		}

		// attempt to return last element, if it doesn't exist, return this
		// creates a new Getter instance if succesful
		// returns existing instance if unsuccessful
		Getter.prototype.last = function ()
		{
			return this[ 0 ] ? new Getter( this[ this.length - 1 ] ) : this
		}

		// provide convenience remove method
		Getter.prototype.remove = function ()
		{
			for ( var i = 0, current; i < this.length; ++i )
			{
				current = this[ i ]

				if ( current.remove )
				{
					current.remove()
				}

				else if ( current.parentNode && current.parentNode.removeChild )
				{
					current.parentNode.removeChild( current )
				}
			}

			this.length = 0
		}

		// sets propertyName to propertyValue for all elements in the instance
		Getter.prototype.set = function ( propertyName, propertyValue )
		{
			if ( this.length === 0 )
			{
				return // empty
			}

			if ( !this[ 0 ].hasOwnProperty( propertyName ) )
			{
				return console.log( 'getter: property does not exist' )
			}

			for ( var i = 0; i < this.length; ++i )
			{
				this[ i ][ propertyName ] = propertyValue
			}

			// chainable
			return this
		}

		WIN.Getter = Getter

		// make reference as window.$ only if it's undefined
		if ( typeof WIN.$ === 'undefined' )
		{
			WIN.$ = Getter
		}
	}
)( window );
