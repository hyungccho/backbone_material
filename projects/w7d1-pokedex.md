# w6d1 Backbone Pokedex

First, run `rake db:create db:migrate db:seed` for the initial
database setup.

## Phase 0: `jbuilder`

Write the API for your Pokedex. Add routes and create `PokemonController` actions for `show` and `index`, namespaced under API.  

NB: Make sure to include `defaults: { format: :json }` for the API namespace. We will see why!  

In `app/views/pokemon/` create three jbuilder files - one each for `show` and `index`, and a partial called `_pokemon`. Your `show` and `index` files should both call the partial to render individual Pokemon.  

Run `rspec` to make sure your JSON passes muster!

## Phase 1: `listPokemon` and `createPokemon`

