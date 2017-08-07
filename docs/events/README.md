# SNEX Documentation

SNEX requires two steps to work. 

1) **Create a Session**

A session is basically a unique ID to which controllers can connect and send events. If you created a game, you set up a session using the SNEX lib on your end and your users needs to know the session ID to connect.

```js
const snex = require('snex');

snex.createSession()
.then(session => {
  console.log(session.id); //
});
```

2) **Create a controller URL**

The controller URL is where your users go to see a controller. The SNEX controllers have to know what session to send their signals to. There are two ways to create URLs; manually and via the `session`.

**Manual**
```js
const URL = `http://snex.io/nes?id=${session.id}`;
console.log(`Go to ${URL} to play!`);
```

**Using session**
```js
session.createURL('nes')
.then(link => {
  const URL = link.url;
  console.log(`Go to ${URL} to play!`);
});
```

When you create a URL using the session a short code will be stored with SNEX that contain both the session id and the type of controller so that your users can connect using a short  URL like `snex.io/XAFE`.

Once a user is connected you will receive events when a controller is interacted with. Controllers emit events in JSON and will contain the key (button name) of the event and the button's current state. You don't have to decode the JSON yourself, it is handled by the library.

```json
{"key":"UP","state":1}
```

Buttons only have two states; `1` for when it is pressed, `0` for when it is released.

Event keys are uppercase strings. For [NES](#nes) they are `UP`, `DOWN`, `LEFT`, `RIGHT`. `SELECT`, `START`, `A`, `B`.

## Controllers

We provide three different controllers, [NES](#nes), [Sega Genesis (Sega Mega Drive)](#sega-genesis--sega-mega-drive), [SNES (Famicom)](#snes--super-famicom).

### NES
<img src="https://cdn.snex.io/pads/nes.svg" alt="NES" title="NES" width="400">

#### URL

    http://snex.io/nes?id=[SESSION ID]


#### Events

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
<img src="https://cdn.snex.io/pads/snes-us.svg?v2" alt="SNES" title="SNES" width="400">

#### URL

    http://snex.io/snes?id=[SESSION ID]
    http://snex.io/snes-us?id=[SESSION ID]
    

#### Events

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

#### URL

    http://snex.io/genesis?id=[SESSION ID]
    

#### Events

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
