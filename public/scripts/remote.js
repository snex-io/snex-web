window.addEventListener('load', function() {
  function abort(error) {
    document.body.className = 'error';
    document.getElementById(error).style.display = 'block';
  }

  if (!snex.isSupported()) {
    abort('webrtc-support');
    return;
  }

  const conns = new Set();

  const controller = document.getElementById('controller');
  const surface = snex.createSensor(controller);
  surface.listen(sendEvent);

  function fullscreen() {
    const element = document.getElementById('controller-screen');
    const requestFullscreen = element.webkitRequestFullScreen
      || element.mozRequestFullScreen
      || element.requestFullscreen;
    requestFullscreen.call(element);
  }
  document.getElementById('fullscreen').addEventListener('click', fullscreen);

  function sendEvent(data) {
    console.log(data);
    console.info('State changed', data);

    if (conns.size) {
      conns.forEach(conn => conn.send(payload));
      console.info('Sent', payload);
    }
  }

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
