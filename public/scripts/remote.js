window.addEventListener('load', function() {
  function abort(error) {
    document.body.className = 'error';
    document.getElementById(error).style.display = 'block';
  }

  if (!snex.isSupported()) {
    abort('webrtc-support');
    return;
  }

  let useTouch = null;
  let mouseState = false;

  const controller = document.getElementById('controller');
  const conns = new Set();
  const keys = [];
  const areas = new Set();
  const states = Object.create(null);

  function fullscreen() {
    const element = document.getElementById('controller-screen');
    const requestFullscreen = element.webkitRequestFullScreen
      || element.mozRequestFullScreen
      || element.requestFullscreen;
    requestFullscreen.call(element);
  }
  document.getElementById('fullscreen').addEventListener('click', fullscreen);

  function vibe(ms) {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  }

  function circlesIntersect(r1, r2, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radii = r1 + r2;
    return (dx * dx + dy * dy < radii * radii);
  }

  function mapKeys() {
    areas.clear();

    const touchables = svg.querySelectorAll('[id^=snex-]');

    [...touchables].forEach(touchable => {
      const [, type, name] = touchable.id.split('-');
      const rect = touchable.getBoundingClientRect();
      const area = {
        id: name,
        pos: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
        radius: rect.width * 0.5,
      };
      areas.add(area);
      keys.push(area.id);
      states[area.id] = false;
    });
  }

  function sendEvent(key, state) {
    if (states[key] === state) {
      return;
    }

    if (state) {
      vibe(20);
    }

    states[key] = state;
    const payload = {
      key,
      state: state ? 1 : 0,
    };

    console.info('State changed %s / %s', key, payload.state);

    if (conns.size) {
      conns.forEach(conn => conn.send(payload));
      console.info('Sent', payload);
    }
  }

  function handleTouch(event) {
    useTouch = true;
    event.preventDefault();

    const filter = Object.create(null);
    if (event.touches.length) {
      [...event.touches].forEach(touch => {
        areas.forEach(area => {
          const intersects = circlesIntersect(area.radius, 12,
            area.pos.x, area.pos.y, touch.clientX, touch.clientY);
          filter[area.id] = filter[area.id] || intersects;
        });
      });
    }
    keys.forEach(key => sendEvent(key, filter[key] || false));
  }

  function handleMouse(event) {
    event.preventDefault();

    if (event.type === 'mousedown') {
      mouseState = true;
    } else if (event.type === 'mouseup') {
      mouseState = false;
    }

    if (useTouch) {
      return;
    }

    const filter = Object.create(null);
    if (mouseState) {
      areas.forEach(area => {
        const intersects = circlesIntersect(area.radius, 12,
          area.pos.x, area.pos.y, event.clientX, event.clientY);
        filter[area.id] = filter[area.id] || intersects;
      });
    }
    keys.forEach(key => sendEvent(key, filter[key] || false));
  }

  const svg = controller.contentDocument;
  svg.addEventListener('touchstart', handleTouch);
  svg.addEventListener('touchend', handleTouch);
  svg.addEventListener('touchmove', handleTouch);

  svg.addEventListener('mousedown', handleMouse);
  svg.addEventListener('mouseup', handleMouse);
  svg.addEventListener('mousemove', handleMouse);

  mapKeys();
  window.addEventListener('resize', mapKeys)

  const params = document.body.attributes;
  const CHANNEL = params['data-id'].value;

  if (CHANNEL) {
    console.info('Connecting to "%s"', CHANNEL);

    snex.joinSession(CHANNEL)
    .then(conn => {
      conns.add(conn);
      console.info('Connection established');

      conn.on('data', function(data) {
        console.info('Remote Received', data);
      });
    })
    .catch(err => {
      console.error(err);
      abort('connection-failed');
    });
  }
});
