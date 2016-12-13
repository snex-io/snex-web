window.addEventListener('load', function() {
  const args = document.body.attributes;
  const API_KEY = args['data-api-key'].value;
  const controllers = args['data-controllers'].value.split(',');

  const controllerTemplate = document.querySelector('template.controller');
  const controllerPool = document.querySelector('.demo .controllers');

  function createLink(type, channel) {
    return `/${type}/?key=${API_KEY}&id=${channel}`;
  }

  function createController(type, channel) {
    const element = document
      .importNode(controllerTemplate.content, true)
      .children[0];

    const url = createLink(type, channel);

    const link = element.querySelector('a');
    link.href = url;
    link.textContent = link.href;
    link.target = '_blank';
    const iframe = element.querySelector('iframe');
    iframe.src = url;

    controllerPool.appendChild(element);
  }

  function Game(canvas) {
    const ctx = canvas.getContext('2d');

    const SPEED = 3000;
    let canJump = false;

    function Vec(x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.add = (v, m = 1) => {
        this.x += v.x * m;
        this.y += v.y * m;
      }
    }

    const G = new Vec(0, 500);
    const F = new Vec();
    const V = new Vec();
    const P = new Vec();
    const S = new Vec(10, 10);

    const draw = () => {
      ctx.fillStyle = '#5db7ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffbd89';
      ctx.fillRect(0, canvas.height - 40, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      ctx.fillRect(P.x, P.y, S.x, S.y);
    };

    const update = (dt) => {
      F.x = this.dir * SPEED;
      F.y = G.y;

      if (canJump && this.jump) {
        V.y -= 400;
        canJump = false;
      }
      this.jump = false;

      V.add(F, dt);
      P.add(V, dt);

      const ground = canvas.height - 40 - S.y;
      if (P.y > ground) {
        canJump = true;
        P.y = ground;
        V.y = 0;
      }

      if (P.x < -S.x) {
        P.x = canvas.width;
      } else if (P.x > canvas.width) {
        P.x = -S.x;
      }

      V.x = Math.abs(V.x) > 0.1 ? V.x * 0.9 : 0;
    };

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

    timer(1/120, update, draw)();

    this.dir = 0;
    this.jump = 0;
  }

  function resize() {
    canvas.width = canvas.getBoundingClientRect().width;
  }

  const canvas = document.body.querySelector('.demo .game canvas');

  const peer = new Peer({key: 'b0gtzdyp37ffxbt9'});
  peer.on('open', function(id) {
    controllers.forEach(type => {
      const element = createController(type, id);
    });
  });

  peer.on('connection', function(conn) {
    const game = new Game(canvas);

    conn.on('data', function(data) {
      const { key, state } = data;

      if (key === 'LEFT') {
        game.dir += state === 'keydown' ? -1 : 1;
      } else if (key === 'RIGHT') {
        game.dir += state === 'keydown' ? 1 : -1;
      } else if (key === 'A' && state === 'keydown') {
        game.jump = true;
      }
    });
  });

  window.addEventListener('resize', resize);
  resize()
});
