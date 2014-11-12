# w7d1 Backbone Pokedex, or "Gotta Fetch 'em All"

First, run `rake db:create db:migrate db:seed` for the initial
database setup.

## Phase 0: Jbuilder

Write the API for your Pokedex. Add routes and create `PokemonController` 
actions for `show` and `index`, namespaced under API.  

NB: Make sure to include `defaults: { format: :json }` for the API 
namespace. Once your specs are passing, try to navigate to one of these
actions in your browser without specifying these defaults. What happens?

In `app/views/pokemon/` create three jbuilder files - one each for `show` 
and `index`, and a partial called `_pokemon`. Your `show` and `index` files 
should both call the partial to render individual Pokemon.  

Run `rspec` to make sure your JSON passes muster!

## Phase 1: `listPokemon` and `createPokemon`

### Jasmine Specs

For this phase of the project, you will be writing your first Backbone 
models and collections. From this point you will be doing most of your work 
in `app/javascripts/pokedex.js`. There are Jasmine specs that test the methods
in this file. To run the test suite, run `rake jasmine` from the command line, 
then navigate to `localhost:8888` in your browser.

Your client-side application will live under the namespace `Pokedex`. When you create a `new Pokedex()`, it should create a new Pokemon collection. Fill out `listPokemon`

 * Fill out the Pokemon model. This should have at least a `urlRoot` property.
 * Fill out the Pokemon collection. This should have a pointer to its `model`, as well as a `url` property.
     * Once these are filled out correctly, you can test them by starting your server and making them in the browser console. Try fetching, creating, and updating models this way.
 * Fill out `listPokemon`. This method will be passed a callback as the only argument. 
     * In the constructor function for `Pokedex`, set an instance variable pointing to a new Pokemon collection.
     * `listPokemon` should call fetch on this collection, and call the callback once it hears back from the server and fills the collection.
     * Since fetching the collection is an asynchronous event, how do we make sure that we don't call the callback too early?
 * Fill out `createPokemon`. This method will be passed two arguments: An object containing the attributes of the Pokemon-to-be, and a callback to be invoked once the Pokemon is saved to the server.
     * After being saved, add the new Pokemon to the Pokemon collection.
     * Just like in `listPokemon`, how can we make sure to only call the callback function once the Pokemon has been successfully saved? 

### User Interface

Now that your specs are passing, let's make use of these methods and render your Pokemon on the page.

In your Pokedex constructor, set up instance variables that point to the various important sections of your page: `.pokemon-list`, `.pokemon-detail`, `.new-pokemon`.

Write a method `addPokemonToList`. This method should accept one `pokemon` model, render its (basic - no picture) attributes in an `li`, and append it to the `.pokemon-list`.

Write a method `addAllPokemonToList`. This method should simply iterate over the `pokemon` collection, calling `addPokemonToList` on each one. You may also want to make sure to `empty` the list of its current contents.

Write a method `showPokemonDetail`. This method should:
 * Accept one `pokemon` model, and `fetch` it.
 * Remove any content from `.pokemon-detail`.
 * Build an `img` tag with the `pokemon`'s `image_url`, append this to `.pokemon-detail`.
 * Add the rest of the `pokemon`'s attributes to `.pokemon-detail`, displaying more detailed information than the list item.

#### Listen for events:

Write a method `selectPokemonFromList` that will be called on `click` of one of the `.pokemon-list` `li`s. This should take a single `event` as an argument. In this method:
 * Get the `data-id` of your `pokemon` from its `li`. (You may have to include this in your `addPokemonToList` method).
 * Using this `id`, use `get` on your `pokemon` collection to find the corresponding model.
 * Call `showPokemonDetail`, passing in this model.

Write a method `submitNewPokemonForm` that will be called on `submit` of your new Pokemon form. It should take a single `event` as an argument. In this method:
 * Use serializeJSON to get the form data. Make sure you key into the returned data object with 'pokemon' to get the correct information.
 * Call `createPokemon`, passing in the attributes and an anonymous callback function that will both `addPokemonToList` and `showPokemonDetail`.
 
## Phase II: `updatePokemon`

Now we're listing Pokemon! You're on the path to becoming a true master! In this phase, lets add the capability to update your `pokemon`'s information. 

Write the method `updatePokemon` - this should take a `pokemon` model and a set of attributes, as well as a callback to be executed on successful update. Set the new attributes on the `pokemon` and `save` it to update the database. Make the appropriate routes and controller actions.

Now we will convert our Pokemon Detail view into a form that we can use to update our Pokemon.

 0. Edit your `showPokemonDetail` method. Instead of rendering the `pokemon`'s attributes as text, render a form with pre-filled `input`s for each attribute. 
 0. Continue to show the picture, but show the `image_url` field as well.
 0. Write a method `submitUpdatePokemonForm` that will be passed an event object as an argument. Serialize the form data and call `updatePokemon`, passing in the right `pokemon` model. As a callback, pass in `showPokemonDetail`.
 0. Add a jQuery event listener on `submit` that calls `submitUpdatePokemonForm`.
   * What is the best time to attach this listener? If you do it on initialization of your Pokedex, the form won't exist yet. How can you account for this?
   
### Avoid Poke-info mis-match

Now our Pokemon are updating and re-rendering, cool! But what about the Pokemon list? This list may now be showing out-of-date information. Let's make sure that any updates that we make in our Detail view are reflected in the list of Pokemon. 

 0. Add a "refresh list" button to your `.pokemon-list` `div`.
 0. Set up a listener that calls `addAllPokemonToList` when this button is clicked. Now, when you update your Pokemon, you should be able to click this button, and see its updated details.

### Listen to Backbone `trigger`s

As we are saving, updating, and fetching our Backbone Models and Collections, these objects are firing `trigger`s silently in the background. Similar to binding jQuery events, we can bind callbacks that listen for when these `trigger`s are called. 

In our `Pokedex` constructor, after we build our `this.pokes` collection, set up a listener like so: `this.pokes.on(...)`

 * The first argument we pass to `on` is the `trigger` event to listen for. Take a look at the [full list of trigger events](http://backbonejs.org/#Events-catalog) to see what events we can listen to. In this case, we're going to listen to the _change_ event.
 * The second argument to pass in is the callback function - lets use our `addAllPokemonToList` function here.

Now update a Pokemon from the web form - any changes you make should be immediately reflected in the Pokemon list!

## Phase III: Work Hard Play Hard

Relationships between models in Backbone is a little trickier than in Rails. We don't have access to ActiveRecord methods like `belongs_to` or `has_many`, but we can build our own functions to model these relationships.

### Jbuilder

Extend your current Jbuilder templates to include Toys. We want to deliver the associated models when we call the `show` action, but not the `index`.

 * In `pokemon/show.json.jbuilder`, pass another local variable to the `_pokemon` template - `toys: @pokemon.toys`
 * In `pokemon/_pokemon.json.jbuilder`, check to see if `toys` exists, and if so, include an array of all of a pokemon's toys in the JSON response.
   * You may have to call `toys = toys || nil`, to avoid a reference error when calling the `index` action.
   * Write another partial for `_toy` to fill out this array.
   
### Backbone

Create a model and collection for toys in Backbone. For now, don't worry about adding a `urlRoot` or `url`. We will rely on `Pokemon#Show` to deliver the JSON data.

The JSON data returned for a Pokemon should now look something like this:
```
{
  id: 1,
  name: 'Pikachu',
  poke_type: 'Electric',
  ...
  toys: [
    ...
  ]
}
```
