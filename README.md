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

executes a method on each html element in the Getter instance. must provide at least methodName. methodName can be space separated to traverse the object. for instance, you can pass 'classList add' to access element.classList.add(). additional arguments are passed to the method.

```javascript
var divs = Getter( 'div' )

// sets data-text attribute
divs.exec( 'setAttribute', 'data-text', 'i am a div' )

// adds class someclass
divs.exec( 'classList add', 'someclass' )
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

### .find( selector )

get children of all elements in this instance that match the provided selector. returns a new Getter instance.

```javascript
var divs = Getter( 'div' )

// finds all span elements within the divs returned above
var links = divs.find( 'span' )
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

sets the property `propertyName` to `propertyValue` for all elements in the instance. use spaces in `propertyName` to traverse the object. for instance, you can pass 'style display' to access element.style.display

```javascript
var divs = Getter( 'div' )

// sets html to foo
divs.set( 'innerHTML', 'foo' )

// sets display to none
divs.set( 'style display', 'none' )
```

## license

### The MIT License (MIT)

Copyright (c) 2014 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
