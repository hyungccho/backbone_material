# Bootstrap Lite
###Bonus Project

In this project we will write a very basic front-end library that includes features
similar to Twitter Bootstrap.  If at any point it is unclear what the final 
product should look like, try modeling it after Twitter Bootstrap.

To test your work, please use the files in the `demo` directory of [the skeleton][bootstrap-lite-skeleton].
(Note that you should **download the skeleton**, not clone it, in order to get the correct branch.)

[bootstrap-lite-skeleton]: https://github.com/appacademy/bootstrap-lite-bonus/tree/skeleton

## The Big Picture

Any popular front-end framework out there, (Bootstrap, Foundation, Gumby), is
composed of a set of default CSS variables and styles paired with a basic set of
javascript components.  The CSS is written using a pre-processing library; either
LESS or SASS.  In Bootstrap, the javascript components are written in the form of
jQuery plugins.  We will be using SASS because it's built into Rails and it's awesome.

## Phase 0: CSS Reset

Browsers each apply their own general styles to elements, and each browser has
"default styles" that vary just enough from the other browsers to potentially
mess up your layout.  For this reason, we always begin with a "CSS Reset", which
resets the basic styles and reduces inconsistencies.  The classic example is
the ["meyerweb reset"][meyerweb-reset], and you may use this in your framework.
[Bootstrap's `_normalize.scss` partial][bootstrap-reset] is a more comprehensive
 example with great comments to explain each part.
Read these two examples; understand what each part does; then, choose and/or tweak
the pieces that make sense for your own framework.

Throughout your styles, you will want to use margin, padding, and font size
consistently.  In the `_variables.scss` partial, set some variables for the base
amount of padding and margin that you want in your styles.
Pick a [CSS font stack][css-font-stack] while you're at it.

(You should be compiling your SASS into `bootstrap_lite.css` in order to 
load your styles in the demo files.)

If you decide to set sizing of fonts, you can also set variables for base font size.

Lets use SASS's `!default` option to conditionally assign these values.  That way,
if a user has defined custom values for these variables, our defaults won't
override their definitions.  Example:

```css
/* user defines their own value for brand-color */
$brand-color: red;
/* ... later in your framework you define that variable */
$brand-color: blue !default;
/* when it is used, it will return 'red' */
h1.branding {
  color: $brand-color;
}
/* Everyone is happy! */
```

[meyerweb-reset]: http://meyerweb.com/eric/tools/css/reset/
[bootstrap-reset]: https://github.com/twbs/bootstrap-sass/blob/master/assets/stylesheets/bootstrap/_normalize.scss
[css-font-stack]: http://cssfontstack.com/

## Phase 1: Form Styles

Frameworks like Bootstrap are like a bigger, better CSS reset in that they provide
good baseline styles that can be built on top of.  In particular, it stands out
like a sore thumb if there are no styles applied to form elements.  Let's use our
[good SASS practices][sass-reading] (variables and nesting) and write default styles for all
the possible parts of a form. Use mixins for any styles that require multiple values
and might be reused in other places, like text or box shadows and gradients.
Make sure to include the following elements:
`<button>`, `<datalist>`, `<fieldset>`, `<input>`, `<label>`, `<legend>`, `<optgroup>`, `<option>`, `<select>`, `<textarea>`, `<checkbox>`

[sass-reading]: ./SASS-intro.md

Suggestions:
 * Check that the `input.button`, `button.button`, and `a.button` in the demo file
all look exactly the same.
 * Don't worry about styling the `select` element too much - these are very
difficult to style.
 * Use the dev. tools to check for styles that the browser is applying, which may
be changing the way your elements appear.
 * Use at least one fancy CSS3 effect - shadows and/or transitions are typical of
bootstrap.  These can be generated with a SASS mix-in.


## Phase 2: Responsive Grid

A responsive grid is simply a set of pre-written CSS classes that give elements
fluid widths. Start by defining variables in the `_variables.scss` partial to store
the number of grid columns and the width of the grid gutters. It is conventional
to use 12 columns, because 12 columns are easily divided into 2, 3, and even 4 column
layouts.

SASS allows the use of basic loops and logic inside of a mix-in.  Use a mix-in
to build the classes for each column width, rather than writing them each out
by hand.  Start by giving each column the right width, and then put gutters
between them.

In the same way, generate classes to add a 'col-offset-__', with left-margin
widths that correspond to the offset number.

The last detail to take into account is the adjustment of the layout for very large
and very small screens.  On a mobile device, any number of columns should really be
changed to be a set of full-width columns that stack.  Try resizing the
[Bootstrap Grid demo][bootstrap-grid-demo] to see this effect in action.

How to actually change the layout at certain screen widths?  Use CSS3 media queries.
These are wrappers that make certain blocks of style conditional on the screen size
or device type.  Example:

```css
// This style will apply to all screen sizes

.sidebar {
  width: 30%;
}

@media (max-width: 600px) {
// This style will only apply when the screen size is
// 600px or less in width.
  .sidebar {
    width: 100%;
  }
}
```

The widths at which you trigger different styles with media queries are called
"breakpoints".  Breakpoints usually correspond to the widths of different
popular devices - Bootstrap defines breakpoints at 480px, 768px, 992px, and 1200px.
CSS-Tricks has a [popular snippet][css-tricks-media-queries]
 that lays out some alternative breakpoints based
on device size.  Using either these examples or your own findings
, define some breakpoints.  Please make them variables and
allow the user to override them if they want!  (Remember how to do this with SASS?)

By the end of this phase, you should have at least some of the functionality shown in the
[Bootstrap Grid demo][bootstrap-grid-demo].

[css-tricks-media-queries]: http://css-tricks.com/snippets/css/media-queries-for-standard-devices/
[bootstrap-grid-demo]: http://getbootstrap.com/examples/grid/

## Phase 3: Modal

Let's start by adding styles to the modal:
 * Create a div for the background that is semi-tranparent and fills the screen.
 * Inside the background div, create a centered div to serve as the container for
 the modal. (To center a div, use `margin: 0 auto`, substituting the desired top and 
bottom margin instead of 0.)
 * Provide optional classes to style the modal header div, the modal body div, and
 a modal footer div.  For example: add thin borders between sections
 and vary the font size so that the header is bold and large and the footer is smaller.

A modal is simply a div that you can show and hide with the click of designated elements.
The show and hide actions will be trivial with javascript, and we will use jQuery to make
the DOM manipulation easier.

Using jQuery means that our little library has a *dependency* on jQuery.  We expect the
user to include jQuery whenever they use our library, because our code depends on jQuery.
 It's good to avoid dependencies as much as possible, but jQuery is common enough that it
is reasonable to assume most users will already include it.  Bootstrap's javascript
components are all written as jQuery plugins, and we will follow that pattern with our modal.

Start with an object oriented approach: Create a `Modal` constructor
that takes an element and saves it as an attribute.  Provide `show` and `hide` instance methods which
show or hide the element.  The `show` method should return early if the element is already
visible, and similarly the `hide` method should return early if the element is already hidden.

For added convenience, let's add a `toggle` method that calls either `show` or `hide`
depending on whether the element is already visible.

To test this out, create a new instance of `Modal`, passing in the element with class `.modal`.
Bind the click of the element with `[data-toggle="modal"]` to trigger the `toggle` method
of your modal. Use event delegation to bind the click event regardless of whether the DOM is
loaded and in cases where the elements are added or changed later.

Ideally, all the user has to do to set up the modal is give their modal element the class
`.modal`, (for styling purposes), and give a trigger element the attributes of
`data-toggle="modal"` and a `data-target` attribute that corresponds to the id of the
modal.  You can write code that simply looks for the element with `data-toggle-"modal"`
and create an instance of your javascript `modal` by passing in the element with the id
specified by the `data-target`.

It's a good idea to trigger some custom events for your users to hook onto - you can fire custom
events on your modal's open and close with jQuery `.trigger()`.  Namespace your event names 
with a dot - like so: `mylibrary.modal.open`.

By now you should have the modal in the demo page working, which means that a user can
set up a modal by simply using the class `.modal` and the `data-toggle` and `data-target`
attributes on a trigger element.

Since we're doing things the jQuery way with this library, let's also make the modal code a
jQuery plugin - that way users only need to call `$('#myModal').modal(options)` to
create a modal, and can open and close it with the modal's `show`, `hide`, and `toggle`
methods.

Follow the pattern in the jQuery plugin demo to create a jQuery method that will bind a new instance
of `Modal` to a data attribute of the given element.  Then, rather than directly creating
an instance of modal in your code, use the jQuery method that you have added, calling it
on the `data-target` element.

## Phase 4: Responsive Navbar

Start by styling the navbar for medium-to-large sized screens.
Aim for something similar to [this Bootstrap example][bootstrap-nav-example].
Hide the button with the `navbar-toggle` class, and style the list of links
of class `nav` to display horizontally without bullets.  Add some nice colors and
hover styles for the links, and style the `navbar-brand` to look like a header
that could be the title of the app.

[bootstrap-nav-example]: http://getbootstrap.com/examples/starter-template/

When your navbar looks like a navbar, it's time to deal with the "collapse"
feature.

You want two separate sets of styles: One for small screens where the navbar appears as a dropdown, and
another with the regular navbar.  Write a CSS media query for screen sizes larger than
your small-screen breakpoint.  (Use the SASS variables that you defined for the breakpoints
in phase 2.)  Put the styles for the regular navbar inside the media query, and then on the
outside (before the media query), write styles to make the navbar appear as a dropdown
by default for smaller screen sizes.  Using the mobile styles as a baseline and
triggering other styles using a media query is a "mobile first" approach - the mobile styles
come first in the stylesheet, so mobile browsers don't even have to load the large screen
styles.

Write another jQuery plugin to manage the show/hide functionality of the navbar in
smaller screen sizes, based on the clicking of the `navbar-toggle` button.  The functionality 
should be very similar to the `Modal` plugin - we are keeping them separate to allow for custom 
options on both later.
Use the `data-` attributes on the button to tell it what it's `target` is, just like we
did with the modal trigger button.

## Things to explore

 * What other JavaScript widgets would you want to add?
 * What types of options could you pass into a modal to make it behave differently?
 * CSS and jQuery UI transitions and animations can be incorporated too.
