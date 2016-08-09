window.addEventListener('load', function() {
  const controller = document.getElementById('controller');

  const eventMap = {
    'touchstart': 'keydown',
    'touchend': 'keyup',
  };

  let conn = null;
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
    console.log(payload);
    if (conn) {
      conn.send(payload);
    }
  }

  function handleTouch(event) {
    //console.log(event);
    event.preventDefault();
    const touches = [...event.touches];
    if (touches.length) {
      touches.forEach(touch => {
        areas.forEach(area => {
          const intersects = circlesIntersect(area.radius, touch.radiusX,
            area.pos.x, area.pos.y, touch.clientX, touch.clientY);
          sendEvent(area.id, intersects && event.type !== 'touchend');
        });
      });
    } else {
      Object.keys(states).forEach(key => {
        sendEvent(key, false);
      });
    }
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
      // Receive messages
      conn.on('data', function(data) {
        console.log('Received', data);
      });
    });
  }
});
