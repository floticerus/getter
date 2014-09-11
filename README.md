Getter
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

### .exec( methodName, [ argument1, argument2, etc ] )

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
