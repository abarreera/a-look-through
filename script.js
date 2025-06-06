firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    let panorama;
    let currentIndex = 0;
    let locations = [];

    function startViewer() {
      panorama = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
          position: { lat: 0, lng: 0 },
          pov: { heading: 160, pitch: 0 },
          zoom: 1
        }
      );

      db.ref("markers").once("value").then(snapshot => {
        snapshot.forEach(child => {
          const data = child.val();
          locations.push({
            lat: data.lat,
            lng: data.lng,
            note: data.note || "Sin nota"
          });
        });

        if (locations.length > 0) {
          cycleLocations();
        } else {
          document.getElementById("note").textContent = "No hay ubicaciones aún.";
        }
      });
    }

    function cycleLocations() {
      const loc = locations[currentIndex];
      panorama.setPosition({ lat: loc.lat, lng: loc.lng });
        document.getElementById("note").textContent = loc.note || "Sin nota";

      currentIndex = (currentIndex + 1) % locations.length;
      setTimeout(cycleLocations, 12000); // cambia cada 10 segundos
    }


    window.onload = startViewer;

document.addEventListener('fullscreenchange', () => {
    const note = document.getElementById('note');
    if (note) {
      note.style.display = 'block'; // vuelve a mostrar la nota si se oculta
    }
  });

  // Por si Google usa prefijos antiguos (algunos navegadores)
  document.addEventListener('webkitfullscreenchange', () => {
    const note = document.getElementById('note');
    if (note) {
      note.style.display = 'block';
    }
  });

document.getElementById('fullscreenBtn').addEventListener('click', () => {
  const el = document.documentElement;

  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('fullscreenBtn');
  if (document.fullscreenElement && btn) {
    btn.style.display = 'none'; // Oculta el botón en fullscreen
  } else if (btn) {
    btn.style.display = 'block'; // Muestra de nuevo al salir de fullscreen
  }
});

