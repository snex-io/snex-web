window.addEventListener('load', function() {
  function ControllerFactory() {
    const template = document.querySelector('template.controller');
    const pool = document.querySelector('.demo .controllers');
    let count = 0;

    function createLink(type, channel) {
      return `/${type}/?key=${API_KEY}&id=${channel}`;
    }

    return function createController(type, channel) {
      const element = document
        .importNode(template.content, true)
        .children[0];

      const url = createLink(type, channel);

      const link = element.querySelector('a');
      link.href = url;
      link.textContent = link.href;
      link.target = '_blank';
      const iframe = element.querySelector('iframe');
      iframe.src = url;

      if (++count === 1) {
        element.classList.remove('hidden');
      }

      pool.appendChild(element);

      fetch('/api/v1/link?url=' + encodeURIComponent(link.href))
        .then(res => res.json())
        .then(payload => {
          if (payload.status_code === 200) {
            link.href = payload.data.url;
            link.textContent = payload.data.url;
          }
        });

      return element;
    }
  }

  function Carousel(set) {
    this.skip = function(skip) {
      let active;
      set.forEach((cont, i) => {
        if (!cont.classList.contains('hidden')) {
          const next = offset(i, skip, set.length);
          active = set[next];
        }
        cont.classList.add('hidden');
      });
      active.classList.remove('hidden');
    }
  }

  function Game(canvas) {

    function Vec(x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.add = (v, m = 1) => {
        this.x += v.x * m;
        this.y += v.y * m;
      }
    }

    function Player() {
      let canJump = false;

      const
        COL = COLORS[players.size % COLORS.length],
        S = new Vec(10, 10),
        F = new Vec(),
        V = new Vec(),
        P = new Vec(Math.random() * canvas.width, 0);

      this.draw = (ctx) => {
        ctx.fillStyle = COL;
        ctx.fillRect(P.x, P.y, S.x, S.y);
      };

      this.update = (dt) => {
        F.x = this.dir * SPEED;
        F.y = G.y;

        V.add(F, dt);

        if (P.y > GROUND - S.y) {
          canJump = true;
          P.y = GROUND - S.y;
          V.y = 0;
        }

        if (canJump && this.jump) {
          V.y -= 400;
          this.jump = canJump = false;
        }

        P.add(V, dt);

        if (P.x < -S.x) {
          P.x = canvas.width;
        } else if (P.x > canvas.width) {
          P.x = -S.x;
        }

        V.x = Math.abs(V.x) > 0.1 ? V.x * 0.95 : 0;
      }

      this.dir = 0;
      this.jump = false;
    }

    const ctx = canvas.getContext('2d');

    const COLORS = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
    ];

    const
      GROUND = canvas.height - 10,
      SPEED = 3000,
      G = new Vec(0, 500);

    const players = new Set();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      players.forEach(p => p.draw(ctx));
    }

    function update(dt) {
      players.forEach(p => {
        p.update(dt);
      });
    }

    function timer(step, update, draw) {
      let prev = 0, acc = 0;
      return function onFrame(time = 0) {
        acc = acc + (time - prev) / 1000;
        while (acc > step) {
          update(step);
          acc = acc - step;
        }
        draw();
        prev = time;
        requestAnimationFrame(onFrame);
      }
    }

    this.addPlayer = function() {
      const p = new Player();
      players.add(p);
      return p;
    };

    timer(1/120, update, draw)();
  }

  function offset(input, diff, max) {
      const next = input + diff;
      return (next % max + max) % max;
  }

  function getAPIKey() {
    return document.body.attributes['data-api-key'].value;
  }

  function getControllerList() {
    return document.body.attributes['data-controllers'].value.split(',');
  }

  function resize() {
    canvas.width = canvas.getBoundingClientRect().width;
  }

  const API_KEY = getAPIKey();
  const demoElement = document.querySelector('.demo');

  const controllers = [];
  const carousel = new Carousel(controllers);
  const createController = ControllerFactory();

  const log = demoElement.querySelector('.log');
  const canvas = demoElement.querySelector('canvas');
  const game = new Game(canvas);

  const peer = new Peer({key: API_KEY});
  peer.on('open', function(id) {
    getControllerList().forEach(type => {
      const e = createController(type, id);
      controllers.push(e);
    });
  });

  peer.on('connection', function(conn) {
    const player = game.addPlayer();

    conn.on('data', function(data) {
      log.textContent = JSON.stringify(data);

      const { key, state } = data;

      if (key === 'LEFT') {
        player.dir += state ? -1 : 1;
      } else if (key === 'RIGHT') {
        player.dir += state ? 1 : -1;
      } else if (state && key === 'A') {
        player.jump = true;
      }
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
