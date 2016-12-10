window.addEventListener('load', function() {
  function Game(canvas) {
    const ctx = canvas.getContext('2d');

    function Vec(x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.add = (v, m) => {
        this.x += v.x * m;
        this.y += v.y * m;
      }
    }

    const G = new Vec(0, 200);
    const F = new Vec();
    const V = new Vec();
    const P = new Vec();

    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      ctx.fillRect(P.x, P.y, 10, 10);
    }

    const ground = canvas.height * 0.75;

    function update(dt) {
      V.add(F, dt);
      P.add(V, dt);

      if (P.y > ground) {
        P.y = ground;
        V.y = 0;
      }

      if (P.x < -30 || P.x > canvas.width) {
        P.x = canvas.width / 2;
      }

      F.add(G, dt);
    }

    let last;
    function onFrame(time) {
      if (last && time) {
        update((time - last) / 1000);
        draw();
      }
      last = time;
      requestAnimationFrame(onFrame);
    }

    this.force = F;
    this.velocity = V;

    onFrame();
  }


  const canvas = document.body.querySelector('.demo .game canvas');
  const game = new Game(canvas);

  const iframe = document.body.querySelector('.demo .controller iframe');


  const peer = new Peer({key: 'b0gtzdyp37ffxbt9'});
  peer.on('open', function(id) {
    var url = '/nes/?key=b0gtzdyp37ffxbt9&id=' + id;
    iframe.src = url;
  });

  peer.on('connection', function(conn) {
    conn.on('data', function(data) {
      const { key, state } = data;

      if (key === 'LEFT') {
        game.force.x += state === 'keydown'
          ? -500
          : 500;
      }

      if (key === 'RIGHT') {
        game.force.x += state === 'keydown'
          ? 500
          : -500;
      }

      if (key === 'A' && state === 'keydown') {
        game.velocity.y -= 1000;
      }
    });
  });

  window.game = game;
});
