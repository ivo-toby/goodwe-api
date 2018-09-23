
# Boilerplate Node project with Babel support and proposed TC39 features

You can use this project to create your own nodeJS based daemon or NodeJS based backend (Express or alike). 

## Usage

- `npm run dev`  start _nodemon_ and executes _babel-cli_. Used for development.

- `npm run start` will build and start the project (for production environments)

- `npm run build` will only build/transpile your code and generate the output in _./dist_

- `npm run test` will run _eslint_ against the _./src_ directory. Currently no other tests are included.


# Arguments & env-vars

I've created a very basic Config-class that acts as singleton. You can import it into your modules an use it to get cli-arguments, environment-variables and store instance variables. 

The order in which values are retrieved is as follows;

1. Instance variables (those you've set earlier during runtime)
2. Argument variables (those you've set using CLI-arguments)
3. Environment variables (those available through ENV and/or dotenv (.env-file)).

Please note; values are mutable by default! If you want the singleton to maintain immutable state the very first call should be
``` Config(true)```

#### Arguments in CLI:

```
    npm run start -- --someArg somevalue
```

#### Getting a value 

```
import Config from './lib/classes/Config';

const someValue = Config().get("someArg"); // someArg is an CLI-argument, but can be ENV-var or instance var

```

#### Setting a value

```
import Config from './lib/classes/Config';

Config().set("someArg", "someValue"); 

console.log(Config().get('someArg')); 
// should produce "someValue"

```

#### Changing a value

When started like this ` npm run start -- --someArg valueFromCli `

```
import Config from './lib/classes/Config';

console.log(Config().get('someArg')); 
// should produce "valueFromCli"

Config().set("someArg", "someValue"); 

console.log(Config().get('someArg')); 
// should now produce "someValue"

```

#### Immutability

You can protect values by setting the immutable boolean the first time you call `Config

```
import Config from './lib/classes/Config';
Config(true);

console.log(Config().get('someArg'));  // NOTE the boolean
// should produce "valueFromCli"

Config().set("someArg", "someValue"); 

console.log(Config().get('someArg')); 
// should throw an error

```

# Preinstalled TC39 Features #


# proposal-logical-assignment
===========================

A Stage 1 proposal to combine Logical Operators and Assignment Expressions:

```js
// "Or Or Equals" (or, the Mallet operator :wink:)
a ||= b;
a || (a = b);

// "And And Equals"
a &&= b;
a && (a = b);

// Eventually....
// "QQ Equals"
a ??= b;
a ?? (a = b);
```

Motivation
----------

Convenience operators, inspired by [Ruby's](https://docs.ruby-lang.org/en/2.5.0/syntax/assignment_rdoc.html#label-Abbreviated+Assignment). We already have a dozen [mathematical assignment operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators), but we don't have ones for the often used logical operators.

```js
function example(a = b) {
  // Default assignment only works for `undefined`.
  // But I want any falsey to default
  if (!a) {
    a = b;
  }
}

function numeric(a = b) {
  // Maybe I want to keep numeric 0, but default nullish
  if (a == null) {
    a = b;
  }
}
```

If statements work, but terseness would be nice.

```js
function example(a = b) {
  // Ok, but it triggers setter.
  a = a || b;

  // No setter, but sometimes flagged as a lint error!
  a || (a = b);
}
```

With this, we get terseness and we don't have to suffer from setter calls.

Semantics
---------

The logical assignment operators function a bit differently than their mathematical assignment friends. While math assignment operators _always_ trigger a set operation, logical assignment embraces their short-circuiting semantics to avoid it when possible.

```js
let x = 0;
const obj = {
  get x() {
    return x;
  },
  
  set x(value) {
    console.log('setter called');
    x = value;
  }
};

// This always logs "setter called"
obj.x += 1;
assert.equal(obj.x, 1);

// Logical operators do not call setters unnecessarily
// This will not log.
obj.x ||= 2;
assert.equal(obj.x, 1);

// But setters are called if the operator does not short circuit
// "setter called"
obj.x &&= 3;
assert.equal(obj.x, 3);
```

Related
-------

- [Ruby's logical operators](https://docs.ruby-lang.org/en/2.5.0/syntax/assignment_rdoc.html#label-Abbreviated+Assignment)
  - [Explainer on no-set semantics](http://www.rubyinside.com/what-rubys-double-pipe-or-equals-really-does-5488.html)
- [CoffeeScript](http://coffeescript.org/#try:a%20%3D%201%0Ab%20%3D%202%0A%0A%0A%23%20%22Or%20Or%20Equals%22%20(or%2C%20the%20Mallet%20operator%20%3Awink%3A)%0Aa%20%7C%7C%3D%20b%3B%0Aa%20%7C%7C%20(a%20%3D%20b)%3B%0A%0A%23%20%22And%20And%20Equals%22%0Aa%20%26%26%3D%20b%3B%0Aa%20%26%26%20(a%20%3D%20b)%3B%0A%0A%23%20Eventually....%0A%23%20%22QQ%20Equals%22%0A%23a%20%3F%3F%3D%20b%3B%0A%23a%20%3F%3F%20(a%20%3D%20b)%3B%0A)
- My very first [Babel PR](https://github.com/babel/babel/pull/516) (back when it was still [6to5](https://github.com/babel/babel/tree/ecd85f53b4764ada862537aa767699814f1f1fe2)). 😄


# Optional Chaining for JavaScript

## Status
Current Stage:
* Stage 1

## Authors
* Claude Pache (@claudepache)
* Gabriel Isenberg (@the_gisenberg)

## Overview and motivation
When looking for a property value that's deep in a tree-like structure, one often has to check whether intermediate nodes exist:

```javascript
var street = user.address && user.address.street;
```

Also, many API return either an object or null/undefined, and one may want to extract a property from the result only when it is not null:

```javascript
var fooInput = myForm.querySelector('input[name=foo]')
var fooValue = fooInput ? fooInput.value : undefined
```

The Optional Chaining Operator allows a developer to handle many of those cases without repeating themselves and/or assigning intermediate results in temporary variables:

```javascript
var street = user.address?.street
var fooValue = myForm.querySelector('input[name=foo]')?.value
```

The call variant of Optional Chaining is useful for dealing with interfaces that have optional methods:

```js
iterator.return?.() // manually close an iterator
```
or with methods not universally implemented:
```js
if (myForm.checkValidity?.() === false) { // skip the test in older web browsers
    // form validation fails
    return;
}
```

## Prior Art
The following languages implement the operator with the same general semantics as this proposal (i.e., 1) guarding against a null base value, and 2) short-circuiting application to the whole chain):
* C#: [Null-conditional operator](https://msdn.microsoft.com/en-us/library/dn986595.aspx) — null-conditional member access or index, in read access.
* Swift: [Optional Chaining](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/OptionalChaining.html#//apple_ref/doc/uid/TP40014097-CH21-ID245) — optional property, method, or subscript call, in read and write access.
* CoffeeScript: [Existential operator](http://coffeescript.org/#existential-operator) — existential operator variant for property accessor, function call, object construction. Also applies to assignment and deletion.

The following languages have a similar feature. We haven’t checked whether they have significant differences in semantics with this proposal:
* Groovy: [Safe navigation operator](http://groovy-lang.org/operators.html#_safe_navigation_operator)
* Ruby: [Safe navigation operator](http://mitrev.net/ruby/2015/11/13/the-operator-in-ruby/)

## Syntax

The Optional Chaining operator is spelled `?.`. It may appear in three positions:
```javascript
obj?.prop       // optional static property access
obj?.[expr]     // optional dynamic property access
func?.(...args) // optional function or method call
```

### Notes
* In order to allow `foo?.3:0` to be parsed as `foo ? .3 : 0` (as required for backward compatibility), a simple lookahead is added at the level of the lexical grammar, so that the sequence of characters `?.` is not interpreted as a single token in that situation (the `?.` token must not be immediately followed by a decimal digit).

## Semantics

### Base case
If the operand at the left-hand side of the `?.` operator evaluates to undefined or null, the expression evaluates to undefined. Otherwise the targeted property access, method or function call is triggered normally.

Here are basic examples, each one followed by its desugaring. (The desugaring is not exact in the sense that the LHS should be evaluated only once.)
```js
a?.b                          // undefined if `a` is null/undefined, `a.b` otherwise.
a == null ? undefined : a.b

a?.[x]                        // undefined if `a` is null/undefined, `a[x]` otherwise.
a == null ? undefined : a[x]

a?.b()                        // undefined if `a` is null/undefined
a == null ? undefined : a.b() // throws a TypeError if `a.b` is not a function
                              // otherwise, evaluates to `a.b()`

a?.()                        // undefined if `a` is null/undefined
a == null ? undefined : a()  // throws a TypeError if `a` is neither null/undefined, nor a function
                             // invokes the function `a` otherwise
```

### Short-circuiting

If the expression on the LHS of `?.` evaluates to null/undefined, the RHS is not evaluated. This concept is called *short-circuiting*.

```js
a?.[++x]         // `x` is incremented if and only if `a` is not null/undefined
a == null ? undefined : a[++x]
```

### Long short-circuiting

In fact, short-circuiting, when triggered, skips not only the current property access, method or function call, but also the whole chain of property accesses, method or function calls directly following the Optional Chaining operator.

```js
a?.b.c(++x).d  // if `a` is null/undefined, evaluates to undefined. Variable `x` is not incremented.
               // otherwise, evaluates to `a.b.c(++x).d`.
a == null ? undefined : a.b.c(++x).d
```

Note that the check for nullity is made on `a` only. If, for example, `a` is not null, but `a.b` is null, a TypeError will be thrown when attempting to access the property `"c"` of `a.b`.

This feature is implemented by, e.g., C# and CoffeeScript [TODO: provide precise references].

### Stacking

Let’s call *Optional Chain* an Optional Chaining operator followed by a chain of property accesses, method or function calls.

An Optional Chain may be followed by another Optional Chain.

```js
a?.b[3].c?.(x).d
a == null ? undefined : a.b[3].c == null ? undefined : a.b[3].c(x).d
  // (as always, except that `a` and `a.b[3].c` are evaluated only once)
```

### Edge case: grouping

Parentheses limit the scope of short-circuiting:

```js
(a?.b).c
(a == null ? undefined : a.b).c
```

That follows from the design choice of specifying the scope of short-circuiting by syntax (like the `&&` operator), rather than propagation of a Completion (like the `break` instruction) or an adhoc Reference (like an [earlier version of this proposal](https://github.com/claudepache/es-optional-chaining)). In general, syntax cannot be arbitrarly split by parentheses: for example, `({x}) = y` is not destructuring assignment, but an attempt to assign a value to an object literal.

Note that, whatever the semantics are, there is no practical reason to use parentheses in that position anyway.

### Optional deletion

Because the `delete` operator is very liberal in what it accepts, we have that feature for free:
```js
delete a?.b
// delete (a == null ? undefined : a.b) // that *would* work if `? :` could return a Reference...
a == null ? undefined : delete a.b      // this is what we get, really
```

## Not supported

Although they could be included for completeness, the following are not supported due to lack of real-world use cases or other compelling reasons; see [Issue # 22](https://github.com/tc39/proposal-optional-chaining/issues/22) and [Issue #54](https://github.com/tc39/proposal-optional-chaining/issues/54) for discussion:

* optional construction: `new a?.()`
* optional template literal: ``a?.`{b}` ``
* constructor or template literals in/after an Optional Chain: `new a?.b()`, ``a?.b`{c}` ``

The following is not supported, although it has some use cases; see [Issue #18](//github.com/tc39/proposal-optional-chaining/issues/18) for discussion:

* optional property assignment: `a?.b = c`

All the above cases will be forbidden by the grammar or by static semantics so that support might be added later.

## FAQ

[TODO: to be completed. In particular, discuss specific criticisms around long short-circuiting.]


<dl>


<dt>obj?.[expr]  and  func?.(arg)  look ugly. Why not use  obj?[expr]  and  func?(arg)  as does &lt;language X>?

<dd>

We don’t use the `obj?[expr]` and `func?(arg)` syntax, because of the difficulty for the parser to efficiently distinguish those forms from the conditional operator, e.g., `obj?[expr].filter(fun):0` and `func?(x - 2) + 3 :1`.

Alternative syntaxes for those two cases each have their own flaws; and deciding which one looks the least bad is mostly a question of personal taste. Here is how we made our choice:

* pick the best syntax for the `obj?.prop` case, which is expected to occur most often;
* extend the use of the recognisable `?.` sequence of characters to other cases: `obj?.[expr]`, `func?.(arg)`.

As for &lt;language X>, it has different syntactical constraints than JavaScript because of &lt;some construct not supported by X or working differently in X>.



<dt>Why does (null)?.b evaluate to undefined rather than null?

<dd>

Neither `a.b` nor `a?.b` is intended to preserve arbitrary information on the base object `a`, but only to give information about the property `"b"` of that object. If a property `"b"` is absent from `a`, this is reflected by `a.b === undefined` and `a?.b === undefined`.

In particular, the value `null` is considered to have no properties; therefore, `(null)?.b` is undefined.



<dt>Why do you want long short-circuiting?</dt>

<dd>

See [Issue #3 (comment)](https://github.com/tc39/proposal-optional-chaining/issues/3#issuecomment-306791812).



<dt>In a?.b.c, if a.b is null, then a.b.c will evaluate to undefined, right?

<dd>

No. It will throw a TypeError when attempting to fetch the property `"c"` of `a.b`.

The opportunity of short-circuiting happens only at one time, just after having evaluated the LHS of the Optional Chaining operator. If the result of that check is negative, evaluation proceeds normally.

In other words, the `?.` operator has an effect only at the very moment it is evaluated. It does not change the semantics of subsequent property accesses, method or function calls.



<dt>In a deeply nested chain like `a?.b?.c`, why should I write `?.` at each level? Should I not be able to write the operator only once for the whole chain?</dt>

<dd>

By design, we want the developer to be able to mark each place that they expect to be null/undefined, and only those. Indeed, we believe that an unexpected null/undefined value, being a symptom of a probable bug, should be reported as a TypeError rather than swept under the rug.


<dt>... but, in the case of a deeply nested chain, we almost always want to test for null/undefined at each level, no?

<dd>

Deeply nested tree-like structures is not the sole use case of Optional Chaining.

See also [Usage statistics on optional chaining in CoffeeScript](https://github.com/tc39/proposal-optional-chaining/issues/17) and compare “Total soak operations” with “Total soak operations chained on top of another soak”.

</dl>

## Specification
See: https://tc39.github.io/proposal-optional-chaining/


## TODO
Per the [TC39 process document](https://tc39.github.io/process-document/), here is a high level list of work that needs to happen across the various proposal stages.

* [x] Identify champion to advance addition (stage-1)
* [x] Prose outlining the problem or need and general shape of the solution (stage-1)
* [x] Illustrative examples of usage (stage-1)
* [x] High-level API (stage-1)
* [x] [Initial spec text](https://tc39.github.io/proposal-optional-chaining/) (stage-2)
* [x] [Babel plugin](https://github.com/babel/babel/pull/5813) (stage-2)
* [ ] Finalize and reviewer signoff for spec text (stage-3)
* [ ] Test262 acceptance tests (stage-4)
* [ ] tc39/ecma262 pull request with integrated spec text (stage-4)
* [ ] Reviewer signoff (stage-4)

## References
* [TC39 Slide Deck: Null Propagation Operator](https://docs.google.com/presentation/d/11O_wIBBbZgE1bMVRJI8kGnmC6dWCBOwutbN9SWOK0fU/edit?usp=sharing)
* [es-optional-chaining](https://github.com/claudepache/es-optional-chaining) (@claudepache)
*  [ecmascript-optionals-proposal](https://github.com/davidyaha/ecmascript-optionals-proposal) (@davidyaha)

## Related issues
* [Babylon implementation](https://github.com/babel/babylon/issues/328)
* [estree: Null Propagation Operator](https://github.com/estree/estree/issues/146)
* [TypeScript: Suggestion: "safe navigation operator"](https://github.com/Microsoft/TypeScript/issues/16)
* [Flow: Syntax for handling nullable variables](https://github.com/facebook/flow/issues/607)

## Prior discussion
* https://esdiscuss.org/topic/existential-operator-null-propagation-operator
* https://esdiscuss.org/topic/optional-chaining-aka-existential-operator-null-propagation
* https://esdiscuss.org/topic/specifying-the-existential-operator-using-abrupt-completion


# Nullish Coalescing for JavaScript

## Status
Current Stage:
* Stage 1

## Authors
* Gabriel Isenberg ([github](https://github.com/gisenberg), [twitter](https://twitter.com/the_gisenberg))
* Daniel Ehrenberg ([github](https://github.com/littledan), [twitter](https://twitter.com/littledan))

## Overview and motivation
When performing optional property access in a nested structure in conjunction with the [optional chaining operator](https://github.com/TC39/proposal-optional-chaining), it is often desired to provide a default value if the result of that property access is `null` or `undefined`. At present, a typical way to express this intent in JavaScript is by using the `||` operator.

```javascript
const response = {
  settings: {
    nullValue: null,
    height: 400,
    animationDuration: 0,
    headerText: '',
    showSplashScreen: false
  }
};

const undefinedValue = response.settings?.undefinedValue || 'some other default'; // result: 'some other default'
const nullValue = response.settings?.nullValue || 'some other default'; // result: 'some other default'
```

This works well for the common case of `null` and `undefined` values, but there are a number of falsy values that might produce surprising results:
```javascript
const headerText = response.settings?.headerText || 'Hello, world!'; // Potentially unintended. '' evaluates to false, result: 'Hello, world!'
const animationDuration = response.settings?.animationDuration || 300; // Potentially unintended. 0 evaluates to false, result: 300
const showSplashScreen = response.settings?.showSplashScreen || true; // Potentially unintended. False evaluates to false, result: true
```

The nullary coalescing operator is intended to handle these cases better and serves as an equality check against nullary values (`null` or `undefined`). 

## Syntax
*Base case*. If the expression at the left-hand side of the `??` operator evaluates to undefined or null, its right-hand side is returned.

```javascript
const response = {
  settings: {
    nullValue: null,
    height: 400,
    animationDuration: 0,
    headerText: '',
    showSplashScreen: false
  }
};

const undefinedValue = response.settings?.undefinedValue ?? 'some other default'; // result: 'some other default'
const nullValue = response.settings?.nullValue ?? 'some other default'; // result: 'some other default'
const headerText = response.settings?.headerText ?? 'Hello, world!'; // result: ''
const animationDuration = response.settings?.animationDuration ?? 300; // result: 0
const showSplashScreen = response.settings?.showSplashScreen ?? true; // result: false
```

## Notes
While this proposal specifically calls out `null` and `undefined` values, the intent is to provide a complementary operator to the [optional chaining operator](https://github.com/TC39/proposal-optional-chaining). This proposal will update to match the sementics of that operator.

## Prior Art
* [Null coalescing operator](https://en.wikipedia.org/wiki/Null_coalescing_operator)

## Specification
* https://tc39.github.io/proposal-nullish-coalescing/

## TODO
Per the [TC39 process document](https://tc39.github.io/process-document/), here is a high level list of work that needs to happen across the various proposal stages.

* [x] Identify champion to advance addition (stage-1)
* [x] Prose outlining the problem or need and general shape of the solution (stage-1)
* [x] Illustrative examples of usage (stage-1)
* [x] High-level API (stage-1)
* [x] Initial spec text (stage-2)
* [ ] Babel plugin (stage-2)
* [ ] Finalize and reviewer signoff for spec text (stage-3)
* [ ] Test262 acceptance tests (stage-4)
* [ ] tc39/ecma262 pull request with integrated spec text (stage-4)
* [ ] Reviewer signoff (stage-4)

## References
* [TC39 Slide Deck: Null Coalescing Operator](https://docs.google.com/presentation/d/1m5nxTH8ifcmOlyaTmTuMAa1bawiGUyKJzQGlw-EVSKM/edit?usp=sharing)

## Prior discussion
* https://stackoverflow.com/questions/476436/is-there-a-null-coalescing-operator-in-javascript
* https://esdiscuss.org/topic/proposal-for-a-null-coalescing-operator


# Decorators for JavaScript

Daniel Ehrenberg, Yehuda Katz, and Brian Terlson

This proposal adds decorators to JavaScript, building on earlier class fields and private methods proposals.

This introductory document proposes a combined vision for how the proposed class features could work together--decorators, [class fields](https://tc39.github.io/proposal-class-fields/) and [private methods](https://github.com/tc39/proposal-private-methods), drawing on the earlier [Orthogonal Classes](https://github.com/erights/Orthogonal-Classes) and [Class Evaluation Order](https://onedrive.live.com/view.aspx?resid=A7BBCE1FC8EE16DB!442046&app=PowerPoint&authkey=!AEeXmhZASk50KjA) proposals.

This page is an overview of the features and their interaction from a user perspective. For detailed semantics, see [DETAILS.md](https://github.com/tc39/proposal-decorators/blob/master/DETAILS.md). Decorators were previously developed [in this repository](https://github.com/tc39/proposal-decorators-previous/).

## A guiding example: Custom elements with classes

To define a counter widget which increments when clicked, you can define the following with ES2015:

```js
class Counter extends HTMLElement {
  clicked() {
    this.x++;
    window.requestAnimationFrame(this.render.bind(this));
  }

  constructor() {
    super();
    this.onclick = this.clicked.bind(this);
    this.x = 0;
  }

  connectedCallback() { this.render(); }

  render() {
    this.textContent = this.x.toString();
  }
}
window.customElements.define('num-counter', Counter);
```

## Field declarations

With the ESnext [field declarations proposal](https://github.com/tc39/proposal-class-fields), the above example can be written as


```js
class Counter extends HTMLElement {
  x = 0;

  clicked() {
    this.x++;
    window.requestAnimationFrame(this.render.bind(this));
  }

  constructor() {
    super();
    this.onclick = this.clicked.bind(this);
  }

  connectedCallback() { this.render(); }

  render() {
    this.textContent = this.x.toString();
  }
}
window.customElements.define('num-counter', Counter);
```

In the above example, you can see a field declared with the syntax `x = 0`. You can also declare a field without an initializer as `x`. By declaring fields up-front, class definitions become more self-documenting; instances go through fewer state transitions, as declared fields are always present.

## Private methods and fields

The above example has some implementation details exposed to the world that might be better kept internal. Using ESnext [private fields and methods](https://github.com/tc39/proposal-private-methods), the definition can be refined to:

```js
class Counter extends HTMLElement {
  #x = 0;

  #clicked() {
    this.#x++;
    window.requestAnimationFrame(this.render.bind(this));
  }

  constructor() {
    super();
    this.onclick = this.#clicked.bind(this);
  }

  connectedCallback() { this.render(); }

  render() {
    this.textContent = this.#x.toString();
  }
}
window.customElements.define('num-counter', Counter);
```

To make methods and fields private, just give them a name starting with `#`. A shorthand for `this.#x` is simply `#x`.

By defining things which are not visible outside of the class, ESnext provides stronger encapsulation, ensuring that your classes' users don't accidentally trip themselves up by depending on internals, which may change version to version.

Note that ESnext provides private fields only as declared up-front in a field declaration; private fields cannot be created as expandos.

## Decorators

ESnext provides decorators to let frameworks and libraries implement part of the behavior of classes, as seen in the next version of the example:

```js
@defineElement('num-counter')
class Counter extends HTMLElement {
  @observed #x = 0;

  @bound
  #clicked() {
    this.#x++;
  }

  constructor() {
    super();
    this.onclick = this.#clicked;
  }

  connectedCallback() { this.render(); }

  @bound
  render() {
    this.textContent = this.#x.toString();
  }
}
```

Here, decorators are used for:
- `@defineElement` defines the custom element, allowing the name of the element to be at the beginning of the class
- `@bound` makes `#clicked` into an auto-bound method, replacing the explicit `bind` call later. See also [rationale for the `@bound` decorator](bound-decorator-rationale.md).
- `@observed` automatically schedules a call to the `render()` method when the `#x` field is changed

You can decorate the whole class, as well as declarations of fields, getters, setters and methods. Arguments and function declarations cannot be decorated.

To learn how to define your own decorators, see [METAPROGRAMMING.md](https://github.com/littledan/proposal-unified-class-features/blob/master/METAPROGRAMMING.md). To see how each form looks syntactically and how it's represented in decorators, see [TAXONOMY.md](https://github.com/littledan/proposal-unified-class-features/blob/master/TAXONOMY.md).


## Generator function.sent Meta Property ##
Allen Wirfs-Brock  
May 13, 2015

### The Problem
When the `next` method is invoked on a generator objects,  the value passed as the first argument to `next` is "sent" to the generator object and becomes available  within the body of the generator function as the value of the `yield` expression that most recently suspended the generator function. This supports two-way communications between the a generator object and its consumer.

However, the first `next` that a generator's consumer invokes to start a generator object does not correspond to any `yield` within the body of the generator function. Instead, the first `next` simply causes execution of the generator function body to begin at the top of the body.

Because there the first `next` call does not correspond to a `yield` within the generator function body there is currently no way for the code with the body to access the initial `next` argument.  For example:

```js
function *adder(total=0) {
   let increment=1;
   while (true) {
       switch (request = yield total += increment) {
          case undefined: break;
          case "done": return total;
          default: increment = Number(request);
       }
   }
}

let tally = adder();
tally.next(0.1); // argument will be ignored
tally.next(0.1);
tally.next(0.1);
let last=tally.next("done");
console.log(last.value);  //1.2 instead of 0.3
```
In the above example, the argument to the `next` method  normally supplies the value to added to a running tally. Except that the increment value supplied to the first next is ignored.

This proposal provides an alternative way to access the `next` parameter that works on the first and all subsequent invocations of a generator's `next` method.
### The Proposal

###A new meta-property: `function.sent`
#####Value and Context
The value of `function.sent` within the body of a Generator Function is the value passed to the generator by the `next` method that most recently resumed execution of the generator.  In particular,  referencing `function.sent` prior to the first evaluation of a `yield` operator returns the argument value passed by the `next` call that started evaluation of the *GeneratorBody*. 

 `function.sent` can appear anywhere a *YieldExpress* would be legal. Referencing `function.sent` outside of a *GeneratorBody* is a Syntax Error. 
#####Usage Example
Here is how the above example might be rewritten using `function.sent`
```js
function *adder(total=0) {
   let increment=1;
   do {
       switch (request = function.sent){
          case undefined: break;
          case "done": return total;
          default: increment = Number(request);
       }
       yield total += increment;
   } while (true)
}

let tally = adder();
tally.next(0.1); // argument no longer ignored
tally.next(0.1);
tally.next(0.1);
let last=tally.next("done");
console.log(last.value);  //0.3
```

###Specification Updates
The following are deltas to the ECMAScript 2015 Language Specification
#### 8.3 Execution Contests
The following row is added to **Table 24**:<br>

| Component | Description   
|------------------|-------------------------------------------------------------------
|   LastYieldValue  |  The value of the most recently evaluated *YieldExpression*  

#### 12.3 Left-Hand-Side Expression
##### Syntax

*MemberExpression*<sub>[Yield]</sub> &nbsp;:  <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;... <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*MetaProperty*<sub>[?Yield]</sub> <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...

*MetaProperty*<sub>[Yield]</sub> &nbsp;:  <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*NewTarget* <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [+Yield] *FunctionSent*

#### 14.4 Generator Function Definitions
##### Syntax
*FunctionSent* &nbsp;: <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**function . sent**
#### 14.4.14 Evaluation
*FunctionSent*&nbsp;:&nbsp;**function . sent**<br>
&nbsp;&nbsp;&nbsp;&nbsp;1.&nbsp;&nbsp;Assert:  the running execution context is a Generator Context.<br>
&nbsp;&nbsp;&nbsp;&nbsp;2.&nbsp;&nbsp;Let *genContext* be the running execution context.<br>
&nbsp;&nbsp;&nbsp;&nbsp;3.&nbsp;&nbsp;Return the value of the LastYieldValue component of *genContext* .<br>
#### 25.3.3.1 GeneratorStart(generator, generatorBody)

Between lines 3 and 4 of the ES6 algorithm add the following step:

&nbsp;&nbsp;&nbsp;&nbsp;3.5.&nbsp;&nbsp;Set the LastYieldValue component of *genContext* to **undefined**.

#### 25.3.3.3 GeneratorResume(generator, value)
Between lines 8 and 9 of the ES6 algorithm add the following step:

&nbsp;&nbsp;&nbsp;&nbsp;8.5.&nbsp;&nbsp;Set the LastYieldValue component of *genContext* to *value*.

#### 25.3.3.5 GeneratorYield(iterNextObj)
Between lines 5 and 6 of the ES6 algorithm add the following step:

&nbsp;&nbsp;&nbsp;&nbsp;5.5.&nbsp;&nbsp;Set the LastYieldValue component of *genContext* to **undefined**.


# ECMAScript `throw` expressions

This proposal defines new syntax to throw exceptions from within an expression context.

## Status

**Stage:** 2  
**Champion:** Ron Buckton (@rbuckton)

_For more information see the [TC39 proposal process](https://tc39.github.io/process-document/)._

## Authors

* Ron Buckton (@rbuckton)

# Proposal

A `throw` expression allows you to throw exceptions in expression contexts. For example:

* Parameter initializers
  ```js
  function save(filename = throw new TypeError("Argument required")) {
  }
  ```
* Arrow function bodies
  ```js
  lint(ast, { 
    with: () => throw new Error("avoid using 'with' statements.")
  });
  ```
* Conditional expressions
  ```js
  function getEncoder(encoding) {
    const encoder = encoding === "utf8" ? new UTF8Encoder() 
                  : encoding === "utf16le" ? new UTF16Encoder(false) 
                  : encoding === "utf16be" ? new UTF16Encoder(true) 
                  : throw new Error("Unsupported encoding");
  }
  ```
* Logical operations
  ```js
  class Product {
    get id() { return this._id; }
    set id(value) { this._id = value || throw new Error("Invalid value"); }
  }
  ```

A `throw` expression *does not* replace a `throw` statement due to the difference 
in the precedence of their values. To maintain the precedence of the `throw` statement,
we must add a lookahead restriction to `ExpressionStatement` to avoid ambiguity.

# Grammar

```grammarkdown
UnaryExpression[Yield, Await]:
  `throw` UnaryExpression[?Yield, ?Await]

ExpressionStatement[Yield, Await]:
  [lookahead ∉ {`{`, `function`, `async` [no |LineTerminator| here] `function`, `class`, `let [`, `throw`}] Expression[+In, ?Yield, ?Await] `;`
```

# Other Notes

A `throw` expression can be approximated in ECMAScript using something like the following definition:

```js
const __throw = err => { throw err; };

// via helper...
function getEncoder1(encoding) {
  const encoder = encoding === "utf8" ? new UTF8Encoder() 
                : encoding === "utf16le" ? new UTF16Encoder(false) 
                : encoding === "utf16be" ? new UTF16Encoder(true) 
                : __throw(new Error("Unsupported encoding"));
}

// via arrow...
function getEncoder2(encoding) {
  const encoder = encoding === "utf8" ? new UTF8Encoder() 
                : encoding === "utf16le" ? new UTF16Encoder(false) 
                : encoding === "utf16be" ? new UTF16Encoder(true) 
                : (() => { throw new Error("Unsupported encoding"); })();
}
```

However, this has several downsides compared to a native implementation:
* The `__throw` helper will appear in `err.stack` in a host environment.
  * This can be mitigated in *some* hosts that have `Error.captureStackTrace`
* Hosts require more information for optimization/deoptimization decisions as the `throw` is not local to the function.
* Not ergonomic for debugging as the frame where the exception is raised is inside of the helper.
* Inline invoked arrow not ergonomic (at least 10 more symbols compared to native).

# Resources

- [Overview Slides](https://tc39.github.io/proposal-throw-expressions/ThrowExpressions-tc39.pptx)

# TODO

The following is a high-level list of tasks to progress through each stage of the [TC39 proposal process](https://tc39.github.io/process-document/):

### Stage 1 Entrance Criteria

* [x] Identified a "[champion][Champion]" who will advance the addition.  
* [x] [Prose][Prose] outlining the problem or need and the general shape of a solution.  
* [x] Illustrative [examples][Examples] of usage.  
* [x] ~High-level API~ _(proposal does not introduce an API)_.  

### Stage 2 Entrance Criteria

* [x] [Initial specification text][Specification].  
* [x] _Optional_. [Transpiler support][Transpiler].  

### Stage 3 Entrance Criteria

* [x] [Complete specification text][Specification].  
* [x] Designated reviewers have [signed off][Stage3ReviewerSignOff] on the current spec text.  
* [x] The ECMAScript editor has [signed off][Stage3EditorSignOff] on the current spec text.  

### Stage 4 Entrance Criteria

* [ ] [Test262](https://github.com/tc39/test262) acceptance tests have been written for mainline usage scenarios and [merged][Test262PullRequest].  
* [ ] Two compatible implementations which pass the acceptance tests: [\[1\]][Implementation1], [\[2\]][Implementation2].  
* [ ] A [pull request][Ecma262PullRequest] has been sent to tc39/ecma262 with the integrated spec text.  
* [ ] The ECMAScript editor has signed off on the [pull request][Ecma262PullRequest].  

<!-- The following are shared links used throughout the README: -->

[Champion]: #status
[Prose]: #proposal
[Examples]: #proposal
[Specification]: https://tc39.github.io/proposal-throw-expressions
[Transpiler]: https://github.com/Microsoft/TypeScript/pull/18798
[Stage3ReviewerSignOff]: https://github.com/tc39/proposal-throw-expressions/issues/7
[Stage3EditorSignOff]: https://github.com/tc39/proposal-throw-expressions/issues/8
[Test262PullRequest]: #todo
[Implementation1]: #todo
[Implementation2]: #todo
[Ecma262PullRequest]: #todo


# import() (Dynamic Import)

This repository contains a proposal for adding a "function-like" `import()` module loading syntactic form to JavaScript. It is currently in stage 3 of [the TC39 process](https://tc39.github.io/process-document/). Previously it was discussed with the module-loading community in [whatwg/loader#149](https://github.com/whatwg/loader/issues/149).

You can view the in-progress [spec draft](https://tc39.github.io/proposal-dynamic-import/) and take part in the discussions on the [issue tracker](https://github.com/tc39/proposal-dynamic-import/issues).

## Motivation and use cases

The existing syntactic forms for importing modules are static declarations. They accept a string literal as the module specifier, and introduce bindings into the local scope via a pre-runtime "linking" process. This is a great design for the 90% case, and supports important use cases such as static analysis, bundling tools, and tree shaking.

However, it's also desirable to be able to dynamically load parts of a JavaScript application at runtime. This could be because of factors only known at runtime (such as the user's language), for performance reasons (not loading code until it is likely to be used), or for robustness reasons (surviving failure to load a non-critical module). Such dynamic code-loading has a long history, especially on the web, but also in Node.js (to delay startup costs). The existing `import` syntax does not support such use cases.

Truly dynamic code loading also enables advanced scenarios, such as racing multiple modules against each other and choosing the first to successfully load.

## Proposed solution

This proposal adds an `import(specifier)` syntactic form, which acts in many ways like a function (but see below). It returns a promise for the module namespace object of the requested module, which is created after fetching, instantiating, and evaluating all of the module's dependencies, as well as the module itself.

Here `specifier` will be interpreted the same way as in an `import` declaration (i.e., the same strings will work in both places). However, while `specifier` is a string it is not necessarily a string literal; thus code like `` import(`./language-packs/${navigator.language}.js`) `` will work—something impossible to accomplish with the usual `import` declarations.

`import()` is proposed to work in both scripts and modules. This gives script code an easy asynchronous entry point into the module world, allowing it to start running module code.

Like the existing JavaScript module specification, the exact mechanism for retrieving the module is left up to the host environment (e.g., web browsers or Node.js). This is done by introducing a new host-environment-implemented abstract operation, HostPrepareImportedModule, in addition to reusing and slightly tweaking the existing HostResolveImportedModule.

(This two-tier structure of host operations is in place to preserve the semantics where HostResolveImportedModule always returns synchronously, using its argument's [[RequestedModules]] field. In this way, HostPrepareImportedModule can be seen as a mechanism for dynamically populating the [[RequestedModules]] field. This is similar to how some host environments already fetch and evaluate the module tree in ahead of time, to ensure all HostResolveImportedModule calls during module evaluation are able to find the requested module.)

## Example

Here you can see how `import()` enables lazy-loading modules upon navigation in a very simple single-page application:

```html
<!DOCTYPE html>
<nav>
  <a href="books.html" data-entry-module="books">Books</a>
  <a href="movies.html" data-entry-module="movies">Movies</a>
  <a href="video-games.html" data-entry-module="video-games">Video Games</a>
</nav>

<main>Content will load here!</main>

<script>
  const main = document.querySelector("main");
  for (const link of document.querySelectorAll("nav > a")) {
    link.addEventListener("click", e => {
      e.preventDefault();

      import(`./section-modules/${link.dataset.entryModule}.js`)
        .then(module => {
          module.loadPageInto(main);
        })
        .catch(err => {
          main.textContent = err.message;
        });
    });
  }
</script>
```

Note the differences here compared to the usual `import` declaration:

* `import()` can be used from scripts, not just from modules.
* If `import()` is used in a module, it can occur anywhere at any level, and is not hoisted.
* `import()` accepts arbitrary strings (with runtime-determined template strings shown here), not just static string literals.
* The presence of `import()` in the module does not establish a dependency which must be fetched and evaluated before the containing module is evaluated.
* `import()` does not establish a dependency which can be statically analyzed. (However, implementations may still be able to perform speculative fetching in simpler cases like `import("./foo.js")`.)

## Alternative solutions explored

There are a number of other ways of potentially accomplishing the above use cases. Here we explain why we believe `import()` is the best possibility.

### Using host-specific mechanisms

It's possible to dynamically load modules in certain host environments, such as web browsers, by abusing host-specific mechanisms for doing so. Using HTML's `<script type="module">`, the following code would give similar functionality to `import()`:

```js

function importModule(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const tempGlobal = "__tempModuleLoadingVariable" + Math.random().toString(32).substring(2);
    script.type = "module";
    script.textContent = `import * as m from "${url}"; window.${tempGlobal} = m;`;

    script.onload = () => {
      resolve(window[tempGlobal]);
      delete window[tempGlobal];
      script.remove();
    };

    script.onerror = () => {
      reject(new Error("Failed to load module script with URL " + url));
      delete window[tempGlobal];
      script.remove();
    };

    document.documentElement.appendChild(script);
  });
}
```

However, this has a number of deficiencies, apart from the obvious ugliness of creating a temporary global variable and inserting a `<script>` element into the document tree only to remove it later.

The most obvious is that it takes a URL, not a module specifier; furthermore, that URL is relative to the document's URL, and not to the script executing. This introduces a needless impedance mismatch for developers, as they need to switch contexts when using the different ways of importing modules, and it makes relative URLs a potential bug-farm.

Another clear problem is that this is host-specific. Node.js code cannot use the above function, and would have to invent its own, which probably would have different semantics (based, likely, on filenames instead of URLs). This leads to non-portable code.

Finally, it isn't standardized, meaning people will need to pull in or write their own version each time they want to add dynamic code loading to their app. This could be fixed by adding it as a standard method in HTML (`window.importModule`), but if we're going to standardize something, let's instead standardize `import()`, which is nicer for the above reasons.

### An actual function

Drafts of the [Loader](https://whatwg.github.io/loader/) ideas collection have at various times had actual functions (not just function-like syntactic forms) named `System.import()` or `System.loader.import()` or similar, which accomplish the same use cases.

The biggest problem here, as previously noted by the spec's editors, is how to interpret the specifier argument to these functions. Since these are just functions, which are the same across the entire Realm and do not vary per script or module, the function must interpret its argument the same no matter from where it is called. (Unless something truly weird like stack inspection is implemented.) So likely this runs into similar problems as the document base URL issue for the `importModule` function above, where relative module specifiers become a bug farm and mismatch any nearby `import` declarations.

### A new binding form

At the July 2016 TC39 meeting, in a [discussion](https://github.com/benjamn/reify/blob/master/PROPOSAL.md) of a proposal for [nested `import` declarations](https://github.com/benjamn/reify/blob/master/PROPOSAL.md), the original proposal was rejected, but an alternative of `await import` was proposed as a potential path forward. This would be a new binding form (i.e. a new way of introducing names into the given scope), which would work only inside async functions.

`await import` has not been fully developed, so it is hard to tell to what extent its goals and capabilities overlap with this proposal. However, my impression is that it would be complementary to this proposal; it's a sort of halfway between the static top-level `import` syntax, and the full dynamism enabled by `import()`.

For example, it was explicitly stated at TC39 that the promise created by `await import` is never reified. This creates a simpler programming experience, but the reified promises returned by `import()` allow powerful techniques such as using promise combinators to race different modules or load modules in parallel. This explicit promise creation allows `import()` to be used in non-async-function contexts, whereas (like normal `await` expressions) `await import` would be restricted. It's also unclear whether `await import` would allow arbitrary strings as module specifiers, or would stick with the existing top-level `import` grammar which only allows string literals.

My understanding is that `await import` is for more of a static case, allowing it to be integrated with bundling and tree-shaking tools while still allowing some lazy fetching and evaluation. `import()` can then be used as the lowest-level, most-powerful building block.

## Relation to existing work

So far module work has taken place in three spaces:

- [The JavaScript specification](https://tc39.github.io/ecma262/#sec-modules), which mostly defines the syntax of modules, deferring to the host environment via [HostResolveImportedModule](https://tc39.github.io/ecma262/#sec-hostresolveimportedmodule);
- [The HTML Standard](https://html.spec.whatwg.org/multipage/), which defines [`<script type="module">`](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element), how to [fetch modules](https://html.spec.whatwg.org/multipage/webappapis.html#fetching-scripts), and fulfills its duties as a host environment by specifying [HostResolveImportedModule](https://html.spec.whatwg.org/multipage/webappapis.html#hostresolveimportedmodule(referencingmodule,-specifier)) on top of those foundations;
- [The Loader specification](https://whatwg.github.io/loader/), which is a collection of interesting ideas prototyping ways of creating a runtime-configurable loading pipeline and creating modules reflectively (i.e. not from source text)

This proposal would be a small expansion of the existing JavaScript and HTML capabilities, using the same framework of specifying syntactic forms in the JavaScript specification, which delegate to the host environment for their heavy lifting. HTML's infrastructure for fetching and resolving modules would be leveraged to define its side of the story. Similarly, Node.js would supply its own definitions for HostPrepareImportedModule and HostResolveImportedModule to make this proposal work there.

The ideas in the Loader specification would largely stay the same, although probably this would either supplant the current `System.loader.import()` proposal or make `System.loader.import()` a lower-level version that is used in specialized circumstances. The Loader specification would continue to work on prototyping more general ideas for pluggable loading pipelines and reflective modules, which over time could be used to generalize HTML and Node's host-specific pipelines.

Concretely, this repository is intended as a TC39 proposal to advance through the stages process, specifying the `import()` syntax and the relevant host environment hooks. It also contains [an outline of proposed changes to the HTML Standard](HTML%20Integration.md) that would integrate with this proposal.

Also check out; [Babel dynamic import](https://github.com/airbnb/babel-plugin-dynamic-import-node/blob/master/README.md)


# Import meta
See this article by [Alex Rauschmayer](http://2ality.com/2017/11/import-meta.html)

# Class properties
See this [proposal](https://tc39.github.io/proposal-class-public-fields/)
Or check out this [reference](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html)

# Subsume JSON - plugin-proposal-json-strings

A proposal to extend ECMA-262 syntax into a superset of JSON.

## Status
This proposal is at stage 4 of [the TC39 Process](https://tc39.github.io/process-document/) and is scheduled to be included in ES2019.

## Champions
* Mark Miller
* Mathias Bynens

## Motivation
ECMAScript claims JSON as a subset in [`JSON.parse`](https://tc39.github.io/ecma262/#sec-json.parse), but (as has been well-documented) that is not true because JSON strings can contain unescaped U+2028 LINE SEPARATOR and U+2029 PARAGRAPH SEPARATOR characters while ECMAScript strings cannot.

These exceptions add unnecessary complexity to the specification and increase the cognitive burden on both implementers and users, allowing for the introduction of subtle bugs.
Also, as a lesser but concrete corrolary problem, certain source concatenation and construction tasks currently require additional steps to process valid JSON into valid ECMAScript before embedding it.

## Proposed Solution
JSON syntax is defined by [ECMA-404](http://www.ecma-international.org/publications/standards/Ecma-404.htm) and permanently fixed by [RFC 7159](https://tools.ietf.org/html/rfc7159), but the <i>DoubleStringCharacter</i> and <i>SingleStringCharacter</i> productions of ECMA-262 can be extended to allow unescaped U+2028 LINE SEPARATOR and U+2029 PARAGRAPH SEPARATOR characters.

## Examples
```js
const LS = " ";
const PS = eval("'\u2029'");
```

## Discussion
### Backwards Compatibility
This change is backwards-compatible.
User-visible effects will be limited to the elimination of SyntaxError completions when parsing strings that include unescaped LINE SEPARATOR or PARAGRAPH SEPARATOR characters, which in practice are extremely uncommon (we also hope to [collect data](https://bugs.chromium.org/p/v8/issues/detail?id=6827) for the related question of how often those characters are used as line terminators _outside_ of strings).

### Regular Expression Literals
Unescaped LINE SEPARATOR and PARAGRAPH SEPARATOR characters are not currently allowed in regular expression literals either, but that restriction has been left in place because regular expression literals are not part of JSON.

### Template Literals
Unescaped LINE SEPARATOR and PARAGRAPH SEPARATOR characters are already allowed in template literals.

### Validity
Encompassing JSON syntax does not imply the _semantic_ validity of all JSON text.
For example, `({ "__proto__": 1, "__proto__": 2 })` triggers an early SyntaxError under Annex B, and will continue to do so.
However, it will become possible to generate a parse tree from `({ "LineTerminators": "\n\r  " })`.

### Objections
Allen Wirfs-Brock [argues](https://esdiscuss.org/topic/json-text-is-not-a-subset-of-primaryexpression#content-3) that ECMAScript and JSON are distinct and don't need an easily-described relationship, and is concerned that acceptance of this proposal would be used as leverage by others attempting to "fix JSON".

The latter is addressed by this proposal explicitly acknowledging JSON syntax as a fixed point.
As for the former, it is clear from the definition of `JSON.parse` that ECMAScript benefits from the similarity (e.g., step 4 includes "parsing and evaluating <i>scriptText</i> as if it was the source text of an ECMAScript <i>Script</i>").
This proposal argues that eliminating the need for an alternate <i>DoubleStringCharacter</i> production and the associated cognitive burden in reasoning about the two languages is sufficiently beneficial to justify such a change.

## Conformance tests

Test262 tests are here: <https://github.com/tc39/test262/pull/1544>

## Implementations

- [V8](https://bugs.chromium.org/p/v8/issues/detail?id=7418), shipping in Chrome 66
- JavaScriptCore, shipping in [Safari Technology Preview 49+](https://developer.apple.com/safari/technology-preview/release-notes/#release-49)
- [Babel](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-json-strings)

## Specification
The specification is available in [ecmarkup](spec.emu) or [rendered HTML](https://tc39.github.io/proposal-json-superset/).
