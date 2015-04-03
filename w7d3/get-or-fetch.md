# Get or Fetch

Backbone collections have a `get` method that will retrieve a model by `id`.
this is convenient if we have the model client-side, but sometimes we want a
model that only exists on the server. In this case, we need to create a model
with the desired `id` and fetch it. We could do this wherever we need the model,
but this would involve a lot of code duplication; instead, we should define
an interface on the collection that will manage this process.

The pattern we will use is `getOrFetch`:

```js
getOrFetch: function (id) {
  var collection = this;

  var model = this.get(id);
  if (!model) {
    model = new App.Models.Model({ id: id });
    model.fetch({
      success: function () {
        collection.add(model);
      }
    });
  } else {
    model.fetch();
  }

  return model;
}
```

Let's go through the code slowly:
```js
var collection = this;
var model = this.get(id);
```
The first two lines set up the rest of the function: we store the value of
`this` for later reference in a callback, and we try to retrieve the model
from the collection.

```js
if (!model) {
  model = new App.Models.Model({ id: id });
  model.fetch({
    success: function () {
      collection.add(model);
    }
  });
}
```

If we don't receive a model from `get`, we need to create the model, fetch it,
and add it to the collection if we receive data from the server.

```js
} else {
  model.fetch();
}
```

Even if we have the model in the collection, it is usually a good idea to fetch
it; there might be updates on the server, and we frequently send more data from
a `show` route than from an `index`. In this case, we don't need to add the
model to the collection on success, since we already have it there.

```js
return model;
```
Since we always return a model, we can always rely on model methods being
available where we call `getOrFetch`. We won't always have all the attributes
until our `fetch` completes, but we can use `listenTo` and other techniques to
ensure that the data is updated when we receive it.
