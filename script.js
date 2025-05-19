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

  // Crea el contenedor de nota cuando esté listo el panorama
  google.maps.event.addListenerOnce(panorama, 'status_changed', () => {
    const container = document.querySelector('#street-view .gm-style');
    if (container && !document.getElementById('note')) {
      const noteEl = document.createElement('div');
      noteEl.id = 'note';
      noteEl.textContent = 'Cargando nota...';
      container.appendChild(noteEl);
    }

    // Solo después de asegurarnos de que #note existe, leemos datos
    db.ref("markers").once("value").then(snapshot => {
      snapshot.forEach(child => {
        const data = child.val();
        locations.push({
          lat: data.lat,
          lng: data.lng,
          note: data.note || "Sin nota"
        });
      });

      const noteEl = document.getElementById("note");
      if (locations.length > 0) {
        cycleLocations();
      } else if (noteEl) {
        noteEl.textContent = "No hay ubicaciones aún.";
      }
    });
  });
}
