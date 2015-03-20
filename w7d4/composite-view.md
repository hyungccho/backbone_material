# Composite View

Previously, we've seen a lightweight way of managing subviews for a
[collection](../w7d3/collection-view-pattern.md).  For a simple index,
this approach is adequate; in a more complex view, however, we will need
something more sophisticated.

## Setting Up the Class

We're going to write a CompositeView class that inherits from Backbone.View
to house our general logic; then, when we want to use this class, we can
just `extend` this class in the same way we normally `extend` the base View
class. Fortunately, Backbone `extend` is a marvelous method: by writing
```js
// composite_view.js
Backbone.CompositeView = Backbone.View.extend();
```
we can call
```js
// awesome_view.js
MyApp.Views.AwesomeView = Backbone.CompositeView.extend();
```
to set up a composite view just like we have been doing for simple views

## Adding Subviews

To add a subview, we'll need two things: the views themselves and
something to tell us where on the page they belong. Since we're using
jQuery for DOM manipulation, we should probably use CSS selectors to
keep track of where we want the views to go.

From our experience with Collection View, we know that we want to be able
to store any number of child views for a given selector. This sounds like a
job for an array.

We could initialize the `subviews` object in an initialize function, but
since we won't be directly using this class, we would have to make sure that
any child class's initialize method called up to the parent. Instead, we'll
write a reader method. This method will create a subviews object if one
doesn't already exist and then return the object.

```js
// composite_view.js
subviews: function () {
  this._subviews = this._subviews || {};
}
```
But wait a minute; what if we want to get at a specific selector's subviews?
Let's rewrite that method to take an optional argument and return either all
the subviews if no argument is provided or only the subviews for the given
selector if an argument is present.
```js
subviews: function (selector) {
  this._subviews = this._subviews || {};

  if (!selector) {
    return this._subviews;
  } else {
    this._subviews[selector] = this._subviews[selector] || [];
    return this._subviews[selector];
  }
}
```
Note that we have set up the selector-specific branch to initialize a
subviews array if we don't already have one; once again, this lets us
be fearless about asking for subviews in our other code.

Now that we have a way to store subviews, we need to be able to add them
and put them on the page. Adding a subview is pretty simple:
```js
addSubview: function (selector, view) {
  this.subviews(selector).push(view);
}
```
Putting an individual subview on the page is simple: find its selector
and append the `$el`. We'll also use `delegateEvents` to ensure that
event listeners are bound, and we'll check to see whether the child
is a composite view and attach its subviews if necessary.
```js
attachSubview: function (selector, subview) {
  this.$(selector).append(subview.$el);
  // Bind events in case `subview` has previously been removed from
  // DOM.
  subview.delegateEvents();

  if (subview.attachSubviews) {
    subview.attachSubviews();
  }
}
```

To attach all the subviews, we'll need to iterate over the selectors in our
subviews object, then over the array at each selector, using jQuery to
put the views on the page. Vanilla Javascript can do this, but we'll use
the Underscore library for convenience:
```js
attachSubviews: function () {
  var view = this;
  _(this.subviews()).each(function (subviews, selector) {
    view.$(selector).empty();
    _(subviews).each(function (subview) {
      view.attachSubview(selector, subview);
    });
  });
}
```
One thing we haven't done is render the subviews; for the most part, we can
delegate this to the individual views, letting their event handlers deal with
any changes, but it makes sense to render and try to attach the subview when
we first add it:
```js
addSubview: function (selector, view) {
  this.subviews(selector).push(view);
  this.attachSubview(selector, view.render());
}
```

## Removing Subviews

Now we can add subviews to the view and the page, but we also need to be
able to remove them. There are two cases to consider:
1. Removing a specific subview: in this case, we need to find the subview
in the subviews object and remove it from both the page and the object (so
that it won't reappear on the next call to `attachSubviews`).
2. Removing the whole view: right now, when we call `remove` on our parent
view, the children can remain in memory as zombie views. We can fix this by
overriding the `remove` method. Note that, by overriding a piece of the
standard API, we can be indifferent to whether a particular view is simple
or composite: the same method will take both views off the page, recursively
removing subviews in the case of a composite view.

First, removing a particular subview:
```js
removeSubview: function (selector, subview) {
  subview.remove();

  var subviews = this.subviews(selector);
  subviews.splice(subviews.indexOf(subview), 1);
}
```
Then, removing the parent with all its children:
```js
remove: function () {
  Backbone.View.prototype.remove.call(this);
  _(this.subviews()).each(function (subviews) {
    _(subviews).each(function (subview) {
      subview.remove();
    });
  });
}
```

Note that, when we remove the parent view, we don't need to remove views
from the subviews object, as the parent will be discarded when we're done.

## Using CompositeView
When we `extend` our `CompositeView` class, we will have a nice API for
working with numerous subviews associated with multiple areas on the page.
The main thing we will need to do is remember to attach our subviews whenever
we render; my boilerplate render function looks like this:
```js
// some_view.js
render: function () {
  var content = this.template();
  this.$el.html(content);
  this.attachSubviews();
  return this;
}
```
