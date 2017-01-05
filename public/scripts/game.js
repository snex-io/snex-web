(function() {
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
          canJump = false;
        }
        this.jump = false;

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

  window.Game = Game;
})();