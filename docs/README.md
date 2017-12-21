# SNEX Documentation

SNEX requires three steps to work.

1) **Create a Session**

A session is basically a unique id to which controllers can connect and send events. If you create a game and want users to play it using SNEX, you first set up a session using the SNEX library on your end and then your users needs to know the session id to connect to.

```js
const snex = require('snex');

const session = await snex.createSession();
console.log(session.id);
```

2) **Create a controller URL**

The controller URL is where your users go to see a controller. The SNEX controllers have to know what session to send their signals to thus you have to create a unique URL for your session. There are two ways to create URLs; *manually* and via the `session`.

**Manual**
```js
const URL = `https://snex.io/nes?id=${session.id}`;

console.log(`Go to ${URL} to play!`);
```

**Using session**
```js
const link = await session.createURL('nes');

console.log(`Go to ${link.url} to play!`);
```

When you create a URL using the `session`, a short code will be stored with SNEX that contain both the session id and the type of controller so that your users can connect using a short  URL like `snex.io/XAFE`.

3) **Handle events**

Once a user is connected you will receive a `connection` event. Think of this as a human plugging in a new controller. The `connection` event will emit an object representing a connected controller. This object will emit `data` events when a controller is interacted with. Controllers send events in JSON and will contain the key (button name) of the event and the button's current state. You don't have to decode the JSON yourself, it is handled by the library.

When a user leaves the controller page, a `close` event will be emitted on the controller object.

```js
session.on('connection', controller => {

  console.log('Controller was connected.');

  controller.on('data', data => {

    // Prints 'Player pressed {key: "START", state: 1}'
    console.log('Player pressed', data);

  });

  contoller.on('close', () => {
    console.log('Controller was disconnected.');
  });
});
```

Buttons only have two states; `1` for when it is pressed, `0` for when it is released.

Event keys are uppercase strings. For [NES](#nes) they are `UP`, `DOWN`, `LEFT`, `RIGHT`. `SELECT`, `START`, `A`, `B`.


## Full life cycle example
```js
// Your game
const Game = require('my-space-game');

// SNEX library
const snex = require('snex');

// This variable represents a fictional game instance.
const game = new Game();

const session = await snex.createSession();

// Listen to "connection" event.
session.on('connection', controller => {
  // Create a new player everytime a controller is connected.
  const player = game.addPlayer();
  
  // Listen to data from controller.
  controller.on('data', data => {
    if (data.state && data.key === 'A') {
      player.jump();
    }
  }
  
  // Remote player when the controller disconnects.
  controller.on('close', () => {
    game.removePlayer(player);
  });
});

// Create link and display to user.
const link = await session.createURL('nes');

console.log(`Go to ${link.url} to join game!`);
```

## Implementation examples
* [Multiplayer Tetris](https://demo.snex.io/tetris/)
* [Minimal Example](https://demo.snex.io/minimal/) ([source code](https://github.com/snex-io/snex-demos/blob/master/public/minimal/index.html))
* [React Example](https://github.com/snex-io/snex-react-example/)


## Controllers

We provide three different controllers, [NES](#nes), [Sega Genesis (Sega Mega Drive)](#sega-genesis--sega-mega-drive), [SNES (Famicom)](#snes--super-famicom).

### NES
<img src="https://cdn.snex.io/pads/nes.svg" alt="NES" title="NES" width="400">

#### Session link
```js
session.createURL('nes')
```

#### Manual URL
```js
console.log(`https://snex.io/nes?id=${session.id}`);
```

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

#### Session link
```js
session.createURL('snes')
session.createURL('snes-us')
```

#### Manual URL
```js
console.log(`https://snex.io/snes?id=${session.id}`);
console.log(`https://snex.io/snes-us?id=${session.id}`);
```

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

#### Session link
```js
session.createURL('genesis')
```

#### Manual URL
```js
console.log(`https://snex.io/genesis?id=${session.id}`);
```

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
