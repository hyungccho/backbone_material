# w7d1 Backbone Pokedex

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

**Jasmine Specs**

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

**User Interface**

Now that your specs are passing, let's make use of these methods and render your Pokemon on the page.

