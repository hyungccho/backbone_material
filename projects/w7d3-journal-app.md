# Journal

Design a Journal App using Rails on the backend and Backbone on the frontend.
Try to do this without referring to the tutorial. Do the following to get
started:

* Add `gem 'backbone-on-rails'` to your Gemfile.
* Run `bundle install`
* Run `rails generate backbone:install --javascript`
* Remove the line `//= require turbolinks` from your `application.js` file

## Phase I: Build a `Post` model

* Build a `Post` rails model. Give it columns for title and body.
* **Don't worry about users or login right now**.
* Make a `Posts` controller too. It will handle our API communication.
* We will need to render one page of HTML. Let's create a separate
  controller to handle this. You can call it `RootController` or
  `StaticPagesController`. In your Rails routes, set the root page
  of the app to the controller's `root` action.
* Create a view for the `root` controller action. All it needs is an `<h1>` 
  with the name of your app so that we know it's working. This will be the 
  only page that rails will ever render i.e. the only time we won't 
  `render :json => ...`. From here on out, Rails' only duty will be 
  communicating with our Backbone javascript client side application using 
  the API.
* Next, write a Backbone.Model called `Post`.
    * Set up the `urlRoot` property.
    * You don't need to give it any other attributes or methods, merely 
      extending `Backbone.Model` will be enough because our api will 
      exhibit default *restful* behavior and our model will not require 
      any custom functionality.
* Next, write a Backbone.Collection named `Posts`. We need to give it just 
  a couple small pieces of information so that it knows how to communicate 
  with the server. By default, backbone collections trust that the api they 
  are communicating with follows the default *restful* conventions. If this 
  is true, merely giving them a `url` property pointing to the root of the 
  resources, `posts` in our case, will be adequate. This is why Backbone.js 
  is great! No more tedious AJAXing! Backbone can take care of all of that 
  for us. 
    * set the `model` property so the collection knows what kind of
      objects it contains.
    * set the `url` property so it knows where to fetch/post `Post`s.
* Visit the rails view we created earlier. If we do not visit one of our 
  own pages, Backbone will not be loaded. Did Backbone load? By default it 
  should have popped up a message that says: 'hello from backbone'.
* Open up the javascript console on the chrome debugger. Type `Backbone` 
  and press enter. Is it undefined? If so you might have skipped a step.
* Create a new instance of the collection we created. The constructor doesn't 
  need any arguments. Call `create` on this instance, passing in a javascript 
  object with a `title` and a `body`. If everything is working you should 
  have a new `Post` created in your database! Thanks backbone! If it didn't 
  work, perhaps you don't have a `create` action in your `PostsController`?

## Phase II: Build a `PostsIndex` class

* Build a `PostsIndex` view class.
* Create a template in the `assets/templates` folder. Assign it to the 
  `template` property of the view. Now we can call `this.template()` and 
  it will return the rendered template. Templates are nothing to fear. 
  Calling `this.template` merely builds the html, just like rendering an 
  `html.erb` in Rails! We can also pass in a javascript object as an argument 
  to the call to `this.template`. The keys will be available as local 
  variables during the render. Just like rendering a partial in rails!
   * Remember that you don't want to put semicolons inside `<%= %>` tags, 
  but you do want to include them in `<% %>` tags. There are a million 
  different things which can cause the "undefined: JST" error: please ask 
  your TA if you're stuck on it.
* The render function should populate the `$el` property of the view with 
  an un ordered list `<ul>` of our post titles.
* Manually instantiate the `PostIndexView` and render it onto the
  page; you don't need a `Router` yet.
    * Go ahead and make an AJAX call on page load to get the `Post`s.  
      This AJAX call will happen outside the view (usually would happen 
      in your router). **NOTE:** You don't need to do this manually with 
      `$.ajax()`. Instead, use your `Posts` collection's `fetch()` method 
      to do the dirty work for you.
* Add a delete button next to each.
    * Button should have a data-id attribute to store the id of the
      `Post` it deletes.
    * Set a CSS class for the delete button.
    * In the `events` attribute of the View, install a click handler
      on the delete button.
* Use `listenTo` to listen for the `"remove"` event that will be fired 
  from the underlying collection. Rerender the view in this case.
* Also go ahead and `listenTo`:
    * `"add"`
    * `"change:title"`
    * `"remove"`
    * `"reset"`

## Phase III: Build a `PostShow` class; write the Router

* Build a view class and template to show a post.
* Just show the title/body.
* Add a `Posts` Router class. You should have two routes:
    * `""`(empty string) : install the `PostsIndex` with all the `Posts`.
    * `posts/:id` to display a single `Post`.
* Instantiate the router in the `initialize` method of your app's namespace.
* When constructing the router, you should pass in the DOM
  element that it controls. It should swap content in and out of this
  element.
* After the router instantiation, call `Backbone.history.start()` so
  Backbone will start listening for changes in the URL.
* In the show route of the Router, you'll need to provide the appropriate
  Post model instance as the `model` for your Show view instance. Write and
  use a `getOrFetch` method on your `Posts` collection to make it easy
  to retrieve a post by a given ID.
* Throw a "back" link on your `PostShow`.

## Phase IV: Build a `PostForm`

* Write a form for editing a post. You'll need:
    * A `PostForm` Backbone view.
    * A `post_form` EJS template.
* In the router, get the `Post` object and pass it as the `model`
  property of the `PostForm`.
* On submit button click:
    * Set the attributes of the `Post`. Check out the
      [jQuery serialization][jquery-serialize] docs to extract values
      from the form.
    * Call `Model#save` with the attributes as the first argument, and an 
      [options-hash][model-save] as the second argument.
    * On success, redirect back to the index page. Use
      `Backbone.history.navigate(url, {trigger: true})`.
      * **Note:** You'll have issues if you forget `{trigger: true}`.
    * On failure, re-render the form with errors.
      * Note that since you don't want to lose the user input, you may
      want to parameterize your form template with an attributes
      object.

[model-save]: http://backbonejs.org/#Model-save
[jquery-serialize]: https://github.com/appacademy/js-curriculum/blob/master/w6d5/ajax-remote-forms.md
[router-docs]: http://backbonejs.org/#Router-navigate

### Phase IV and a half: build new objects with `PostForm`

* Add a `#/posts/new` route.
* In the route, build a new, blank `Post` object.
* Pass the new `Post` model to the `PostForm` view.
* Also pass the `Posts` collection to the `PostForm` (as attribute
  `collection`).
* On save, add the model to the collection use the `{ merge: true }`
  option then use `Backbone.history.navigate` to redirect to
  the posts index.

## Phase V: `listenTo`

* Right now we have one area which presents all the content.
* I would like to put a sidebar on the left that displays the index.
* Clicking on the links should swap out the content on the right.
* Probably want two divs: `sidebar` and `content`.
* On initialization, install a `PostsIndex` in the sidebar div;
  this view should never be removed by the Router. The sidebar is
  constant.
* There is one major thing to fix: when we create a new `Post` through
  the form, we need to update the `PostsIndex` to show the new
  `Post`.
* The way to accomplish this is to call `listenTo` to get the View to
  monitor the `PostsCollection` for events. Check the
  [Backbone.Collection docs][backbone-collection] for the collection
  events you can listen for.
* When one of these events fires, re-render the index view.

[backbone-collection]: http://backbonejs.org/#Collection

## Phase VI: Fancy edit

* Add the ability to edit an article from the show view. The user double 
  clicks a particular section (like 'title' or 'body'). Double clicking 
  the attribute should replace it with an input box containing the attribute's
  content. On blur of that input box, you should save the recently 
  edited attribute. [Here's a list of events!][js-events] you can bind to.
* You shouldn't just be rendering a whole edit form
  again. Instead, it should appear as if you are making changes
  in place.

[js-events]: https://developer.mozilla.org/en-US/docs/Web/Reference/Events
