/** @preserve
 * @namespace getterjs
 * @version 0.0.5
 * @author kevin von flotow
 * 2014 - MIT license */
;( function ( WIN )
	{
		var DOC = WIN.document

		// determine which matchesSelector to use once on load
		// if else if else compiles smaller than a bunch of ifs
		var MATCHES = ( function ( DOC_ELEMENT, m )
			{
				for ( var i = 0; i < 6; ++i )
				{
					if ( DOC_ELEMENT[ m ] )
					{
						return m
					}
				}
			}
		)( DOC.documentElement, [ 'matches', 'matchesSelector', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ] );

		/**
		 * @namespace Getter
		 * @constructor
		 * @this {Getter}
		 * @param {*} selector - selector to search for, or html element(s)
		 * @returns {Getter}
		 */
		function Getter( selector )
		{
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

		Getter.prototype = {
			/**
			 * iterates over all elements in the Getter instance,
			 * executing a function for each element.
			 * element and index are passed to function.
			 * 
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @param {Function} fn - function to run on each iteration. gets element and index parameters
			 * @returns {Getter} new instance. chainable.
			 */
			each: function ( fn )
			{
				for ( var i = 0; i < this.length; ++i )
				{
					fn.call( this, this[ i ], i )
				}

				// chainable
				return this
			},

			/**
			 * attempts to return the element at the provided index in a new Getter instance. if it does not exist, returns a new empty Getter instance. index starts at 0.
			 * 
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @param {Number} index - index of the element to look for
			 * @returns {Getter} new instance
			 */
			eq: function ( index )
			{
				return new Getter( this[ index ] ? this[ index ] : undefined )
			},

			/**
			 * executes the given method on all elements with provided arguments.
			 * 
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @param {String} methodPath - path to the method to execute. space separated to traverse.
			 * @param {*} [arguments] - additional arguments to pass to the method
			 * @returns {*} returns if a truthy value is returned from the method.
			 */
			exec: function ()
			{
				/* if ( this.length === 0 )
				{
					return // this Getter instance is empty
				} */

				var args = arguments

				if ( args.length === 0 )
				{
					return // must provide at least 1 argument
				}

				var arg1 = Array.prototype.shift.call( args )

				var methodPath = arg1.split( ' ' )

				// subtract 1 from length because we're handling the last item after the loop
				var methodLength = methodPath.length - 1

				for ( var i = 0, path, useThis, i2, res; i < this.length; ++i )
				{
					// set initial path
					path = this[ i ]

					// set initial object to use as this
					useThis = path
					
					// set i2 as 0 on each iteration
					for ( i2 = 0; i2 < methodLength; ++i2 )
					{
						if ( typeof path[ methodPath[ i2 ] ] === 'undefined' )
						{
							// path does not exist
							break
						}

						// update useThis if it's not the last item in the array
						path = useThis = path[ methodPath[ i2 ] ]
					}

					// grab the last path
					path = path[ methodPath[ methodLength ] ]

					// return if result is truthy
					if ( path && ( res = path.apply( useThis, args ) ) )
					{
						return res
					}
				}
			},

			/**
			 * filter the Getter instance with the provided CSS selector.
			 * relies on some implementation of matchesSelector,
			 * so this will not work on older browsers unless a polyfill is available.
			 *
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @returns {Getter} new instance.
			 */
			filter: function ( selector )
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
			},

			/**
			 * get children of all elements in this instance that match the selector.
			 * returns a new Getter instance.
			 *
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @param {String} selector - selector to search for
			 * @returns {Getter} this instance. chainable.
			 */
			find: function ( selector )
			{
				/* if ( this.length === 0 )
				{
					return // instance is empty
				} */

				var newGetter = Getter()

				for ( var i = 0; i < this.length; ++i )
				{
					// populate new Getter instance with results
					Getter_find.call( newGetter, selector )
				}

				// return new Getter instance with results
				return newGetter
			},

			/**
			 * attempt to return first element in the instance.
			 *
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @returns {Getter} new instance if successful, existing if unsuccesful.
			 */
			first: function ()
			{
				return this[ 0 ] ? new Getter( this[ 0 ] ) : this
			},

			/**
			 * only operates on the first element in the instance.
			 * does not create a new instance. returns boolean.
			 *
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @param {String} selector - selector to test
			 * @returns {Boolean}
			 */
			is: function ( selector )
			{
				return this[ 0 ] ? this[ 0 ][ MATCHES ]( selector ) : false
			},

			/**
			 * attempt to return last element, if it doesn't exist, return this.
			 *
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @returns {Getter} new instance if successful, existing if unsuccesful.
			 */
			last: function ()
			{
				return this[ 0 ] ? new Getter( this[ this.length - 1 ] ) : this
			},

			/**
			 * provide convenience remove method
			 *
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @returns nothing.
			 */
			remove: function ()
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
			},

			/**
			 * sets the property propertyName to propertyValue for all
			 * elements in the instance. use spaces in propertyName to
			 * traverse the object. for instance, you can pass
			 * 'style display' to access element.style.display.
			 *
			 * @memberof Getter
			 * @instance
			 * @this {Getter}
			 * @param {String} propertyName - property name to set. space separated to traverse.
			 * @param {*} propertyValue - new value to set.
			 * @returns {Getter} this instance.
			 */
			set: function ( propertyName, propertyValue )
			{
				// not sure if it's safe to assume the instance isn't empty, might
				// be a performance hog if it doesn't return immediately
				/* if ( this.length === 0 )
				{
					// chainable
					return this // empty
				} */

				propertyName = propertyName.split( ' ' )

				var propertyLength = propertyName.length - 1

				for ( var i = 0, path, i2; i < this.length; ++i )
				{
					path = this[ i ]

					for ( i2 = 0; i2 < propertyLength; ++i2 )
					{
						if ( typeof path[ propertyName[ i2 ] ] === 'undefined' )
						{
							// path does not exist
							break
						}

						path = path[ propertyName[ i2 ] ]
					}

					path[ propertyName[ propertyLength ] ] = propertyValue
				}

				// chainable
				return this
			}
		}

		WIN.Getter = Getter

		// make reference as window.$ only if it's undefined
		if ( typeof WIN.$ === 'undefined' )
		{
			WIN.$ = Getter
		}
	}
)( window );
