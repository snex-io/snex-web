window.addEventListener('load', function() {
  const controller = document.getElementById('controller');

  const eventMap = {
    'touchstart': 'keydown',
    'touchend': 'keyup',
  };

  let conn = null;
  const keys = [];
  const areas = [];
  const states = {};

  function circlesIntersect(r1, r2, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radii = r1 + r2;
    return (dx * dx + dy * dy < radii * radii);
  }

  function sendEvent(key, state) {
    if (states[key] === state) {
      return;
    }
    states[key] = state;
    const payload = {
      key,
      state: state ? 'keydown' : 'keyup',
    };
    console.log('Sending update', payload);
    if (conn) {
      conn.send(payload);
    }
  }

  function handleTouch(event) {
    event.preventDefault();
    //console.log([...event.touches].map(touch => touch.radiusX));

    const filter = {};
    if (event.touches.length) {
      [...event.touches].forEach(touch => {
        areas.forEach(area => {
          console.log(touch);
          const intersects = circlesIntersect(area.radius, 12,
            area.pos.x, area.pos.y, touch.clientX, touch.clientY);
          filter[area.id] = filter[area.id] || intersects;
        });
      });
    }
    keys.forEach(key => sendEvent(key, filter[key] || false));
  }

  const svg = controller.contentDocument;
  const touchables = svg.querySelectorAll('[id]');
  for (let touchable, i = 0; touchable = touchables[i++];) {
    const rect = touchable.getBoundingClientRect();
    const area = {
      id: touchable.id,
      pos: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
      radius: rect.width * .9,
    };
    areas.push(area);
    keys.push(area.id);
    states[area.id] = false;
  }

  svg.addEventListener('touchstart', handleTouch);
  svg.addEventListener('touchend', handleTouch);
  svg.addEventListener('touchmove', handleTouch);

  const id = window.location.hash.split('#')[1];
  if (id) {
    const peer = new Peer({key: 'lwjd5qra8257b9'});
    conn = peer.connect(id);
    conn.on('open', function() {
      console.log('Connection established', conn);
      conn.on('data', function(data) {
        console.log('Received', data);
      });
    });
  }
});
