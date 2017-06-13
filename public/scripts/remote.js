window.addEventListener('load', function() {
  if (!snex.isSupported()) {
    document.body.className = 'error';
    document.getElementById('webrtc-support').style.display = 'block';
    return;
  }

  const hasPointerEvents = 'onpointerdown' in document.body;

  document.body.classList.add('ready');


  const params = document.body.attributes;
  const API_KEY = params['data-key'].value;
  const CHANNEL = params['data-id'].value;
  console.info('Setting up using key "%s" and id "%s"', API_KEY, CHANNEL);

  const controller = document.getElementById('controller');
  const conns = new Set();
  const keys = [];
  const areas = [];
  const states = Object.create(null);

  function circlesIntersect(r1, r2, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radii = r1 + r2;
    return (dx * dx + dy * dy < radii * radii);
  }

  function mapKeys() {
    areas.splice(0, areas.length);

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
      areas.push(area);
      keys.push(area.id);
      states[area.id] = false;
    });
  }

  function sendEvent(key, state) {
    if (states[key] === state) {
      return;
    }

    if (state) {
      navigator.vibrate(20);
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

    const filter = Object.create(null);
    if (event.buttons > 0) {
      areas.forEach(area => {
        const intersects = circlesIntersect(area.radius, 12,
          area.pos.x, area.pos.y, event.clientX, event.clientY);
        filter[area.id] = filter[area.id] || intersects;
      });
    }
    keys.forEach(key => sendEvent(key, filter[key] || false));
  }

  const svg = controller.contentDocument;
  if (hasPointerEvents) {
    svg.addEventListener('pointerdown', handleTouch);
    svg.addEventListener('pointerup', handleTouch);
    svg.addEventListener('pointermove', handleTouch);
  } else {
    svg.addEventListener('touchstart', handleTouch);
    svg.addEventListener('touchend', handleTouch);
    svg.addEventListener('touchmove', handleTouch);

    svg.addEventListener('mousedown', handleMouse);
    svg.addEventListener('mouseup', handleMouse);
    svg.addEventListener('mousemove', handleMouse);
  }


  mapKeys();
  window.addEventListener('resize', mapKeys)

  if (API_KEY && CHANNEL) {
    const peer = new Peer({key: API_KEY});
    const conn = peer.connect(CHANNEL);
    conn.on('open', function() {
      conns.add(conn);
      console.info('Connection established on channel "%s"', CHANNEL);

      conn.on('data', function(data) {
        console.info('Received', data);
      });
    });
  }
});
