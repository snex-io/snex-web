(function() {
  const THRUST = 4000;
  const DRAG = 0.95;

  function Game(canvas) {
    const entities = new Set();

    const ctx = canvas.getContext('2d');

    function Vec(x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.add = (v, m = 1) => {
        this.x += v.x * m;
        this.y += v.y * m;
      }
      this.copy = (v, m = 1) => {
        this.x = v.x * m;
        this.y = v.y * m;
      }
      this.multiply = (v) => {
        this.x *= v;
        this.y *= v;
      }
      this.len = (l) => {
        let cl = Math.sqrt(this.x * this.x + this.y * this.y);
        if (l) {
          let s = l / cl;
          this.multiply(s);
          return;
        }
        return cl;
      }
    }

    function Ship() {
      const
        D = new Vec(),
        F = new Vec(),
        V = new Vec(),
        P = new Vec();

      this.draw = (ctx) => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(P.x, P.y, 10, 10);
      }

      this.shoot = () => {
        if (D.x || D.y) {
          const spd = V.len() + 200;
          const vel = new Vec();
          vel.copy(D);
          vel.len(spd);
          const p = new Projectile(P, vel);
          entities.add(p);
        }
      }

      this.steer = (x, y) => {
        if (x) {
          D.x = Math.min(1, Math.max(-1, x));
        }
        if (y) {
          D.y = Math.min(1, Math.max(-1, y));
        }
      }

      this.update = (dt) => {
        F.copy(D, THRUST * this.thrust);
        V.add(F, dt);
        P.add(V, dt);

        const w = canvas.width;
        const h = canvas.height;
        P.x = ((P.x) % w + w) % w;
        P.y = ((P.y) % h + h) % h;

        V.x = Math.abs(V.x) > 0.1 ? V.x * DRAG : 0;
        V.y = Math.abs(V.y) > 0.1 ? V.y * DRAG : 0;
      }

      this.dir = D;
      this.thrust = 0;
    }

    function Projectile(p, v) {
      const
        V = new Vec(),
        P = new Vec();

      V.copy(v);
      P.copy(p);

      this.draw = (ctx) => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(P.x, P.y, 3, 3);
      };

      this.update = (dt) => {
        P.add(V, dt);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      entities.forEach(p => p.draw(ctx));
    }

    function update(dt) {
      entities.forEach(p => {
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
      const p = new Ship();
      entities.add(p);
      return p;
    };

    this.removePlayer = function(p) {
      entities.delete(p);
    }

    timer(1/120, update, draw)();
  }

  window.SpaceGame = Game;
})();