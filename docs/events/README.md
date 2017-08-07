# SNEX Controller Events

The SNEX controllers emit events in JSON and will contain the key (name) of the event and its current state.

```json
{"key":"UP","state":1}
```

Buttons only have two states; `1` for when it is pressed, `0` for when it is released.

Event keys are uppercase strings. For [NES](#nes) they are `UP`, `DOWN`, `LEFT`, `RIGHT`. `SELECT`, `START`, `A`, `B`.

## Controllers

We provide three different controllers, [NES](#nes), [Sega Genesis (Sega Mega Drive)](#sega-genesis--sega-mega-drive), [SNES (Famicom)](#snes--super-famicom).

### <a name="nes"></a>NES
<img src="https://cdn.snex.io/pads/nes.svg" alt="NES" title="NES" width="400">


| Event           | JSON                            |
|-----------------|---------------------------------|
| UP pressed      | `{"key":"UP","state":1}`        |
| UP released     | `{"key":"UP","state":0}`        |
| LEFT pressed    | `{"key":"LEFT","state":1}`      |
| LEFT released   | `{"key":"LEFT","state":0}`      |
| RIGHT pressed   | `{"key":"RIGHT","state":1}`     |
| RIGHT released  | `{"key":"RIGHT","state":0}`     |
| DOWN pressed    | `{"key":"DOWN","state":1}`      |
| DOWN released   | `{"key":"DOWN","state":0}`      |
| SELECT pressed  | `{"key":"SELECT","state":1}`    |
| SELECT released | `{"key":"SELECT","state":0}`    |
| START pressed   | `{"key":"START","state":1}`     |
| START released  | `{"key":"START","state":0}`     |
| B pressed       | `{"key":"B","state":1}`         |
| B released      | `{"key":"B","state":0}`         |
| A pressed       | `{"key":"A","state":1}`         |
| A released      | `{"key":"A","state":0}`         |


### SNES / Super Famicom
<img src="https://cdn.snex.io/pads/snes.svg" alt="SNES" title="SNES" width="400">
<img src="https://cdn.snex.io/pads/snes-us.svg" alt="SNES" title="SNES" width="400">

| Event           | JSON                            |
|-----------------|---------------------------------|
| UP pressed      | `{"key":"UP","state":1}`        |
| UP released     | `{"key":"UP","state":0}`        |
| LEFT pressed    | `{"key":"LEFT","state":1}`      |
| LEFT released   | `{"key":"LEFT","state":0}`      |
| RIGHT pressed   | `{"key":"RIGHT","state":1}`     |
| RIGHT released  | `{"key":"RIGHT","state":0}`     |
| DOWN pressed    | `{"key":"DOWN","state":1}`      |
| DOWN released   | `{"key":"DOWN","state":0}`      |
| SELECT pressed  | `{"key":"SELECT","state":1}`    |
| SELECT released | `{"key":"SELECT","state":0}`    |
| START pressed   | `{"key":"START","state":1}`     |
| START released  | `{"key":"START","state":0}`     |
| X pressed       | `{"key":"X","state":1}`         |
| X released      | `{"key":"X","state":0}`         |
| Y pressed       | `{"key":"Y","state":1}`         |
| Y released      | `{"key":"Y","state":0}`         |
| B pressed       | `{"key":"B","state":1}`         |
| B released      | `{"key":"B","state":0}`         |
| A pressed       | `{"key":"A","state":1}`         |
| A released      | `{"key":"A","state":0}`         |


### Sega Genesis / Sega Mega Drive
<img src="https://cdn.snex.io/pads/genesis.svg" alt="Genesis" title="Sega Genesis / Mega Drive" width="400">

| Event           | JSON                            |
|-----------------|---------------------------------|
| UP pressed      | `{"key":"UP","state":1}`        |
| UP released     | `{"key":"UP","state":0}`        |
| LEFT pressed    | `{"key":"LEFT","state":1}`      |
| LEFT released   | `{"key":"LEFT","state":0}`      |
| RIGHT pressed   | `{"key":"RIGHT","state":1}`     |
| RIGHT released  | `{"key":"RIGHT","state":0}`     |
| DOWN pressed    | `{"key":"DOWN","state":1}`      |
| DOWN released   | `{"key":"DOWN","state":0}`      |
| START pressed   | `{"key":"START","state":1}`     |
| START released  | `{"key":"START","state":0}`     |
| A pressed       | `{"key":"A","state":1}`         |
| A released      | `{"key":"A","state":0}`         |
| B pressed       | `{"key":"B","state":1}`         |
| B released      | `{"key":"B","state":0}`         |
| C pressed       | `{"key":"C","state":1}`         |
| C released      | `{"key":"C","state":0}`         |
