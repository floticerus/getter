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
			/* if ( typeof selector === 'undefined' )
			{
				return console.log( 'Getter: selector is not defined' )
			} */

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

			else if ( selector )
			{
				// assume string
				Getter_find.call( this, selector )
			}

			// setup class methods for this instance
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

				fn: function ( id, base )
				{
					var ret = []

					// use querySelector instead of querySelectorAll so we only return one element,
					// since id tag should be unique
					var res = base === DOC ? DOC.getElementById( id.substr( 1 ) ) : base.querySelector( id )

					if ( res )
					{
						ret.push( res )
					}

					return ret
				}
			},

			{
				regex: /^\.[-A-Za-z0-9_:.]*$/,

				fn: function ( cls, base )
				{
					return base.getElementsByClassName( cls.substr( 1 ) )
				}
			},

			{
				regex: /^[A-Za-z][-A-Za-z0-9_:.]*$/,

				fn: function ( tag, base )
				{
					return base.getElementsByTagName( tag )
				}
			},

			// no regex needed for querySelectorAll, just put it last
			{
				fn: function ( selector, base )
				{
					return base.querySelectorAll( selector )
				}
			}
		]

		function Getter_find( selector, base )
		{
			// check for html element
			if ( selector.appendChild )
			{
				this[ this.length++ ] = selector

				return
			}

			base = base || DOC

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

				arr = current.fn( selector, base )

				break
			}

			for ( var l = arr.length; this.length < l; )
			{
				this[ this.length ] = arr[ this.length++ ]
			}
		}

		function splitClasses( classes, fn )
		{
			if ( !Array.isArray( classes ) )
			{
				// assume it's a string
				classes = classes.split( ' ' )
			}

			for ( var i = 0, l = classes.length; i < l; ++i )
			{
				fn( classes[ i ] )
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
							splitClasses( className, function ( cls )
								{
									for ( var i = 0, classes; i < that.length; ++i )
									{
										that[ i ].classList.add( cls )
									}
								}
							)
						},

						// only works on the first element in the instance
						contains: function ( className )
						{
							if ( !that[ 0 ] )
							{
								return false // instance is empty
							}

							// returns boolean
							return that[ 0 ].classList.contains( className )
						},

						remove: function ( className )
						{
							splitClasses( className, function ( cls )
								{
									for ( var i = 0, classes; i < that.length; ++i )
									{
										that[ i ].classList.remove( cls )
									}
								}
							)
						},

						// from MDN:
						// The toggle method has an optional second argument that will force the class name to be added or removed based on the truthiness of the second argument. For example, to remove a class (if it exists or not) you can call element.classList.toggle('classToBeRemoved', false); and to add a class (if it exists or not) you can call element.classList.toggle('classToBeAdded', true);
						toggle: function ( className, force )
						{
							splitClasses( className, function ( cls )
								{
									for ( var i = 0, classes; i < that.length; ++i )
									{
										that[ i ].classList.toggle( cls, force )
									}
								}
							)
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
			return new Getter( this[ index ] ? this[ index ] : undefined )
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

		// finds children elements using provided selector
		Getter.prototype.find = function ( selector )
		{
			if ( this.length === 0 )
			{
				return // instance is empty
			}

			var newGetter = Getter()

			for ( var i = 0; i < this.length; ++i )
			{
				// populate new Getter instance with results
				Getter_find.call( newGetter, selector )
			}

			// return new Getter instance with results
			return newGetter
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
