(function() {
  const THRUST = 4000;
  const DRAG = 0.95;

  const ship = new Image();
  ship.src = '/images/ship.png';

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
        D = new Vec(1, 0),
        F = new Vec(),
        V = new Vec(),
        P = new Vec(
          canvas.width * Math.random(),
          canvas.height * Math.random()
        );

      this.draw = (ctx) => {
        const angle = Math.atan2(D.y, D.x);
        ctx.translate(P.x, P.y);
        ctx.rotate(angle + (90 * Math.PI / 180));
        ctx.drawImage(ship, -ship.width / 2, -ship.height / 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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

      this.update = (dt) => {
        F.copy(D, THRUST * this.thrust);
        V.add(F, dt);
        P.add(V, dt);

        const sW = ship.width;
        const sH = ship.height;

        const w = canvas.width + sW;
        const h = canvas.height + sH;
        P.x = (((P.x + sW / 2) % w + w) % w) - sW / 2;
        P.y = (((P.y + sH / 2) % h + h) % h) - sH / 2;

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
        ctx.fillRect(P.x, P.y, 6, 6);
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
      const p = new Ship({
        x: canvas.width / 2,
        y: canvas.height / 2,
      });
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