window.addEventListener('load', function() {
  const controller = document.getElementById('controller');

  const eventMap = {
    'touchstart': 'keydown',
    'touchend': 'keyup',
  };

  function handleKey(event) {
    const keyName = event.target.id;
    if (!keyName) {
      return;
    }
    const payload = {
      key: keyName,
      state: eventMap[event.type],
    };
    console.log(payload);
    conn.send(payload);
  }

  controller.contentDocument.addEventListener('touchstart', handleKey);
  controller.contentDocument.addEventListener('touchend', handleKey);
  controller.contentDocument.addEventListener('touchmove', event => {
    event.preventDefault();
  });

  const id = window.location.hash.split('#')[1];
  console.log(id);

  const peer = new Peer({key: 'lwjd5qra8257b9'});
  const conn = peer.connect(id);
  conn.on('open', function() {
    // Receive messages
    conn.on('data', function(data) {
      console.log('Received', data);
    });

    // Send messages
    conn.send('Hello!');
  });

});
