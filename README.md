Getter done
======

getter combines numerous methods of getting html elements, and provides an easy way to filter & manipulate them.

## usage

### html
```html
<script src="getter.js"></script>
```

### javascript

returns an array like object containing all div elements. see below for available methods.

```javascript
var divs = Getter( 'div' )
```

Getter is also available as $ if it is undefined

```javascript
var divs = $( 'div' )
```

## methods

### .classList

the classList object contains methods which map to the native classList methods. relies on some implementation of classList, so older browsers will not work without a polyfill.

##### .add( className )

adds the specified class(es) to all elements in the instance. `className` can be a string or array. to specify multiple classes, separate them with spaces or pass an array.

```javascript
// adds foo class to all div elements
Getter( 'div' ).classList.add( 'foo' )

// adds foo and bar class to all div elements
Getter( 'div' ).classList.add( 'foo bar' )

// alternative to above, will execute faster
Getter( 'div' ).classList.add( [ 'foo', 'bar' ] )
```

##### .contains( className )

checks whether the first element in the instance has the specified class.

```javascript
if ( Getter( '#element' ).classList.contains( 'foo' ) )
{
	console.log( 'element has foo class' )
}
```

##### .remove( className )

removes the speicified class from all elements in the instance. `className` can be a string or array. to specify multiple classes, separate them with spaces or pass an array.

```javascript
// removes foo class from all div elements
Getter( 'div.foo' ).classList.remove( 'foo' )

// removes foo and bar class to all div elements
Getter( 'div' ).classList.remove( 'foo bar' )

// alternative to above, will execute faster
Getter( 'div' ).classList.remove( [ 'foo', 'bar' ] )
```

##### .toggle( className, force )

toggles the specified class in all elements in the instance. `className` can be a string or array. to specify multiple classes, separate them with spaces or pass an array. optional parameter `force` is used to force the class name to be added or removed based on the truthiness.

```javascript
// toggles foo class on all div elements
Getter( 'div' ).classList.toggle( 'foo' )

// toggles foo and bar class to all div elements
Getter( 'div' ).classList.toggle( 'foo bar' )

// alternative to above, will execute faster
Getter( 'div' ).classList.toggle( [ 'foo', 'bar' ] )
```

### .each( function )

iterates over all elements in the Getter instance, executing a function for each element. `element` and `index` are passed to function.

```javascript
var divs = Getter( 'div' )

divs.each( function ( element, index )
	{
		// do something
	}
)
```

### .eq( index )

attempts to return the element at the provided index in a new Getter instance. if it does not exist, returns a new empty Getter instance. index starts at 0.

```javascript
// since .eq() is 0 based, 4 is actually the fifth element in the instance
var fifth = Getter( 'div' ).eq( 4 )
```

### .exec( methodName, argument1, argument2, etc )

executes a method on each html element in the Getter instance. Getter checks that the method exists on the first element, then iterates over them all, executing the method with the provided arguments. must provide at least methodName. additional arguments are passed to the method.

```javascript
var divs = Getter( 'div' )

divs.exec( 'setAttribute', 'data-text', 'i am a div' )
```

### .filter( selector )

filter the Getter instance with the provided CSS selector. relies on some implementation of matchesSelector, so this will not work on older browsers unless a polyfill is available.

a few examples:

```javascript
var divs = Getter( 'div' )

// filter by class
var filtered = divs.filter( '.classname' )
```

```javascript
var elems = Getter( '.classname' )

// filter by tag name
var filtered = elems.filter( 'div' )
```

```javascript
var divs = Getter( 'div' )

// filter by attribute
var filtered = divs.filter( '[data-text=needle]' )
```

### .first()

attempt to return the first element, if it doesn't exist, return original instance. creates a new Getter instance if successful. returns existing instance if unsuccessful.

```javascript
// returns only the first div
var div = Getter( 'div' ).first()
```

### .is( selector )

checks the first element in the instance against the provided CSS selector. returns boolean. does not create a new Getter instance.

```javascript
if ( Getter( '#foo' ).is( '.inner' ) )
{
	console.log( 'has inner class' )
}
```

### .last()

attempt to return the last element, if it doesn't exist, return original instance. creates a new Getter instance if successful. returns existing instance if unsuccessful.

```javascript
// returns only the last div
var div = Getter( 'div' ).last()
```

### .remove()

convenience method to remove all elements within the Getter instance. provided as a simple cross-browser solution. executes `element.remove()` if it's available, otherwise it tries `element.parentNode.removeChild( element )`.

note that removing an element might not free memory allocated to it. if adding and removing a large number of elements, consider reusing them instead of removing.

```javascript
var divs = Getter( 'div' )

// removes all div elements from the DOM
divs.remove()
```

### .set( propertyName, propertyValue )

sets the property `propertyName` to `propertyValue` for all elements in the instance. Getter checks that the property exists on the first element, then iterates over them all.

```javascript
var divs = Getter( 'div' )

divs.set( 'innerHTML', 'foo' )
```
