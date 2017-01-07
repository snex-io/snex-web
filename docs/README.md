# SNEX Docs

[Events](events)

## Create your own controller

SNEX controllers are SVG vectors. Touch sensitive areas are defined by setting the `id` attribute on a node to `snex-[touch type]-[touch name]`.

```xml
<circle id="snex-button-A" cx="1329.6" cy="694" r="74"></circle>
```

This will generate following JSON when pressed.

```json
{"key":"A","state":0}
```

This should be considered the shorthand simple method for defining a button. In the future we intend to support more advanced buttons like analog sticks and pressure sensitive buttons. These might require more elaborate markup.

The vector editor [Sketch](https://www.sketchapp.com/) uses layer name as node id thus you can create touch areas directly from Sketch.
