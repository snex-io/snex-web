# SNEX Controller Events

The SNEX controllers emit events in JSON and will contain the key (name) of the event as well as its current state.

```json
{"key":"UP","state":1}
```

Buttons only have two states; `1` for when it is pressed, `0` for when it is released.

Event keys are uppercase strings. For NES they are `UP`, `DOWN`, `LEFT`, `RIGHT`. `SELECT`, `START`, `A`, `B`.
