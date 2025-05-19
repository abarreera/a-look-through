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

  // ⬇️ Esperamos a que se renderice el contenedor de Google
  google.maps.event.addListenerOnce(panorama, 'status_changed', () => {
    // Espera a que el contenedor de Street View esté creado
    const container = document.querySelector('#street-view .gm-style');
    if (container && !document.getElementById('note')) {
      const noteEl = document.createElement('div');
      noteEl.id = 'note';
      noteEl.textContent = 'Cargando nota...';
      container.appendChild(noteEl);
    }
  });

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
      setTimeout(cycleLocations, 10000); // cambia cada 10 segundos
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
