# JBuilder

Backbone is built to communicate with a JSON API. Rails can accept JSON
requests without changing the approach we know; our responses, however,
will require a bit more work.

We can always use `render json: obj` to serialize `obj` and send the resulting
JSON in our response. But this doesn't give us much control; we'll end up
sending all of `obj`'s attributes. For many objects, that will be fine, but
what about a user?

```JSON
{
  "id": 1,
  "name": "andrew",
  "password_digest": "$2a$10$Q/Z28HDXKgjB2ZmHDCc33O7xyrVHEd8uWpddNyJmVZFP4WtedGAl6",
  "session_token": "qB-7GbWRO39Ykl1hUfcRQA", 
  "created_at": "2015-03-13T18:21:52.596Z", 
  "updated_at": "2015-03-13T18:21:52.647Z"
}
```

We definitely don't want to send the `password_digest` and `session_token` 
to anyone who needs to know the `username`. And, while the `created_at`
and `updated_at` probably aren't dangerous to send, we also won't need them
in most cases; we might as well not send them, too. What we need is a tool to
format our JSON and send only what we need; basically, we need ERB for JSON

We'll use a gem (already included in Rails) called JBuilder for this. Jbuilder
views have the extension `.json.jbuilder`, equivalent to `.html.erb`:
`.jbuilder` tells Rails to use jBuilder to evaluate the template, and `.json`
says that the evaluated template will produce JSON.

## Setting Keys

JBuilder exposes an object called `json` that allows us to directly set key-value
pairs in a JSON object:

```ruby
json.key "value"
```

This will produce the JSON:

```json
{
  "key": "value"
}
```

We can also set keys with a block:

```ruby
json.key do 
  "value"
end
```

will produce the same JSON.

JSON naturally supports objects (in the javascript sense), arrays, strings, numbers,
true, false, and null (Ruby `nil`); we can set any of those types of objects as values,
or we can set another object that can be represented as one of those types. Since we're
working with Active Record models, we will want to have a way of serializing them as
JSON objects. Jbuilder exposes a pair of useful methods for working this purpose.

## json.extract!(object, [attr1, attr2, ...])

`extract!` is our primary tool for serializing single objects. It takes the object
as the first argument and any number of symbols as subsequent arguments; for each
symbol, it will call the named method and set the symbol as a key pointing to the
return value. Let's consider our user from above; if we want to send only his
name and id, we can use `extract!` as follows:

```ruby
json.extract!(@user, :name, :id)
```

which will produce the json:

```json
{
  "name": "andrew",
  "id": 1
}
```

Since we are passing symbols that correspond to methods, we aren't restricted to
attributes; if users have a `followers` association, we can call that in `extract!`:

```ruby
json.extract!(@user, :name, :id, :followers)
```

This will give us a third key, `followers`, pointing at an array of json for the
user's followers.

## json.array!(objects)

For collections of objects, we can use `array!` to produce an array, either at the
root level of the json or under a key. So, for a typical index action, we might
write:

```ruby
json.array!(@models)
```

This will use the default `to_json` method for our models; if we want something more
sophisticated, we can pass a block for each element:

```ruby
json.array!(@models) do |model|
  json.id model.id
  json.name model.name
end
```

If we call `json.array!` at the root level, we will set our overall JSON payload to
an array. This is fine if we want to send a simple array, but what if we want to send
an array alongside other data? We might try:

```ruby
# INCORRECT
json.key json.array!(values)
```

but this will throw an error. This is where the block syntax for setting keys
shows its value:

```ruby
json.key do
  json.array!(values)
end
```

will give us an array of the objects in values. This lets us nest our arrays
at arbitrary depths.

## Partials

Just like in ERB, we can include partials in our JBuilder views. 
Let's suppose that we have a `_user.json.jbuilder` that runs:

```ruby
json.extract!(user, :name, :id, :followers)
```

Partials can be rendered in two ways:

## json.partial!(partial, [options])

This works like an ERB partial: it renders the named `partial` file and passes
in some local variables; for example, our `users/show.json.jbuilder` view might
look like:

```ruby
json.partial! 'users/user', user: @user
```

## Partial Collections

For our user collection, we can say:

```ruby
json.array! @users, partial: 'users/user', as: :user
```

This renders an array of users, using the `_user` partial.

There are many options for partial collection syntax; I would find one
you are comfortable with and only worry about the rest if you see them
when reading code.

### Reference

[JBuilder documentation](https://github.com/rails/jbuilder)
