window.addEventListener('load', function() {
  if (!snex.isSupported()) {
    console.info('SNEX is not supported on this browser. Inline demo cancelled.');
    return;
  }

  function ControllerFactory(session) {
    const template = document.querySelector('template.controller');
    const pool = document.querySelector('.demo .controllers');
    let count = 0;

    return function createController(type, channel) {
      const element = document
        .importNode(template.content, true)
        .children[0];

      if (++count === 1) {
        element.classList.remove('hidden');
      }

      const anchor = document.createElement('a');
      anchor.target = '_blank';

      const iframe = element.querySelector('iframe');
      iframe.allowFullscreen = true;

      pool.appendChild(element);

      session.createURL(type, '')
      .then(link => {
          iframe.src = link.url;
          anchor.href = link.url;
          anchor.textContent = link.url;
      });

      return {
        el: element,
        link: anchor,
      }
    }
  }

  function Carousel(set, link) {
    this.skip = function(skip) {
      let active;
      set.forEach((cont, i) => {
        const el = cont.el;
        if (!el.classList.contains('hidden')) {
          const next = offset(i, skip, set.length);
          active = set[next];
          link.innerHTML = '';
        }
        el.classList.add('hidden');
      });
      active.el.classList.remove('hidden');
      link.appendChild(active.link);
    }
  }

  function offset(input, diff, max) {
      const next = input + diff;
      return (next % max + max) % max;
  }

  function getControllerList() {
    return document.body.attributes['data-controllers'].value.split(',');
  }

  function resize() {
    canvas.width = canvas.parentNode.clientWidth;
    canvas.height = canvas.parentNode.clientHeight;
  }

  function fullscreen() {
    const element = demoElement.querySelector('.screen');
    const requestFullscreen = element.webkitRequestFullScreen
      || element.mozRequestFullScreen
      || element.requestFullscreen;
    requestFullscreen.call(element);
  }

  const demoElement = document.querySelector('.demo');
  demoElement.querySelector('#fullscreen').addEventListener('click', fullscreen);

  const link = document.querySelector('.demo .link');
  const controllers = [];
  const carousel = new Carousel(controllers, link);

  const log = demoElement.querySelector('.log');
  const canvas = demoElement.querySelector('canvas');
  const game = new SpaceGame(canvas);

  snex.createSession()
  .then(session => {
    document.body.classList.add('supported');
    resize();

    const createController = ControllerFactory(session);

    getControllerList().forEach(type => {
      const e = createController(type, session.id);
      controllers.push(e);
    });

    carousel.skip(0);

    session.on('connection', function(conn) {
      const player = game.addPlayer();

      conn.on('data', function(data) {
        log.textContent = JSON.stringify(data);
        const { key, state } = data;
        if (state && key === 'UP') {
          player.dir.x = 0;
          player.dir.y = -1;
        } else if (state && key === 'DOWN') {
          player.dir.x = 0;
          player.dir.y = 1;
        } else if (state && key === 'LEFT') {
          player.dir.x = -1;
          player.dir.y = 0;
        } else if (state && key === 'RIGHT') {
          player.dir.x = 1;
          player.dir.y = 0;
        } else if (key === 'A') {
          player.thrust = state;
        } else if (state) {
          player.shoot();
        }
      });

      conn.on('close', function() {
        game.removePlayer(player);
      });
    });
  });

  window.addEventListener('resize', resize);


  const switches = demoElement.querySelectorAll('.input [data-skip]');
  [...switches].forEach(sw => {
    const skip = parseInt(sw.getAttribute('data-skip'), 10);
    sw.addEventListener('click', () => carousel.skip(skip));
  });

  resize()
});
