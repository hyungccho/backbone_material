#SASS (Syntactically Awesome Stylesheets)

##Overview

SASS is a pre-processing language for CSS.  With SASS, you can use variables 
and simplified functions (called mix-ins) to DRY out and modularize your 
CSS.  Once you write the SASS version, the `sass` gem compiles it into 
vanilla CSS for you.

##Setting up SASS

You may already have the `sass` gem installed.  If not; `gem install sass`.

To check that it is installed correctly, try `sass -v` in the terminal.

"To run Sass from the command line, just use

`sass input.scss output.css`

You can also tell Sass to watch the file and update the CSS every time the Sass file changes:

`sass --watch input.scss:output.css`

If you have a directory with many Sass files, you can also tell Sass to watch the entire directory:

`sass --watch app/sass:public/stylesheets`

Use `sass --help` for full documentation."

- [SASS docs on using SASS][sass-docs-using-sass]

##Variables

You might want the same padding on your header element and your content element:

```css
header {
  padding: 1.5em
}

.content {
  padding: 1.5em
}
```

Any reused value can be saved as a variable with SASS, like so:

```scss
//in _variables.scss

$base-padding: 1.5em;

// in style.scss

@include "variables"

header {
  padding: $base-padding;
}

.content {
  padding: $base-padding;
}
```

Now the padding can be changed for the entire app in just one place.  Huzzah!

##Mixins

Just like you can replace repeated values with variables, repeated chunks of CSS 
can be replaced with mixins:

```css
// the old way

header {
  border: solid 1px green;
  margin-bottom: 3em;
  background-color: ivory;
  //... other styles
}

footer {
  border: solid 1px green;
  margin-bottom: 3em;
  background-color: ivory;
  //... other styles
}
```

```scss
// the new way

// in _mixins.scss

@mixin panel-styles {
  border: solid 1px green;
  margin-bottom: 3em;
  background-color: ivory;
}

// in style.scss

header {
  @include panel-styles;
  //... other styles
}

footer {
  @include panel-styles;
  //... other styles
}
```

### CSS3 mixins

When new features are added to CSS, (most recently with the release of CSS3), 
browsers don't support them right away, or in the same ways.  Until full 
support is available, the browser may support a prefixed version of the 
CSS markdown.  This means that to use the feature, a developer must write out 
the CSS rule using each vendor prefix separately.  Here's a monster of an 
example:

```css
.fancy-button {
  background-color: $top-color;
  background-image: -webkit-gradient(linear, left top, left bottom, from($top-color), to($bottom-color)); /* Chrome, Safari 4+ */
  background-image: -webkit-linear-gradient(top, $top-color, $bottom-color); /* Chrome 10-25, iOS 5+, Safari 5.1+ */
  background-image:    -moz-linear-gradient(top, $top-color, $bottom-color); /* Firefox 3.6-15 */
  background-image:      -o-linear-gradient(top, $top-color, $bottom-color); /* Opera 11.10-12.00 */
  background-image:         linear-gradient(to bottom, $top-color, $bottom-color); /* Chrome 26, Firefox 16+, IE 10+, Opera 12.10+ */
}
```

- More examples at [css3please.com][css3please]

If you decide to change the two colors used in this gradient, then there are 10 places to make 
the change.  In order to reuse the style, you have to retype all 6 lines, and then changing the 
colors would require copy-pastes.  Yuck.

Instead, let's rely on mixins to make the use of CSS3 super easy:

```scss
// in _mixins.scss
@mixin gradient($top-color, $bottom-color) {
  background-color: $top-color;
  background-image: -webkit-gradient(linear, left top, left bottom, from($top-color), to($bottom-color)); /* Chrome, Safari 4+ */
  background-image: -webkit-linear-gradient(top, $top-color, $bottom-color); /* Chrome 10-25, iOS 5+, Safari 5.1+ */
  background-image:    -moz-linear-gradient(top, $top-color, $bottom-color); /* Firefox 3.6-15 */
  background-image:      -o-linear-gradient(top, $top-color, $bottom-color); /* Opera 11.10-12.00 */
  background-image:         linear-gradient(to bottom, $top-color, $bottom-color); /* Chrome 26, Firefox 16+, IE 10+, Opera 12.10+ */
}

// in style.scss

.fancy-button {
  @include gradient(#8deb93, #5a56d6);
}
```

##Nesting

SASS allows you to nest rules to further DRY out your CSS.

Example of the old way:

```css
//without nesting

a {
  color: green;
  text-decoration: none;
}

a:hover {
  color: red;
  text-decoration: underline;
}

a.fancy {
  color: pink;
}

a.fancy:hover {
  color: deeppink;
}
```

The following is better:

```scss
// with nesting
a {
  color: green;
  text-decoration: none;
  
  &:hover {
    color: red;
    text-decoration: underline;
  }
  
  &.fancy {
    color: pink;
    
    &:hover {
      color: deeppink;
    }
  }
}
```


##SASS vs. LESS

The alternative to SASS is another CSS pre-processor called LESS.  
LESS uses JavaScript to compile the LESS markup into vanilla CSS, and 
it is virtually the same as SASS. SASS has a few more features - if 
you're interested in a more detailed comparison, check out this 
[article on SASS vs. LESS from css-tricks][sass-vs-less-article].

##Resources
[SASS documentation][sass-docs]

[sass-vs-less-article]: http://css-tricks.com/sass-vs-less/
[css3please]: http://css3please.com/
[sass-docs]: http://sass-lang.com/documentation/
[sass-docs-using-sass]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#using_sass
