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

  // Crear nota y añadirla al body (se moverá luego)
  const noteEl = document.createElement('div');
  noteEl.id = 'note';
  noteEl.textContent = 'Cargando nota...';
  document.body.appendChild(noteEl);

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

  // Mover la nota dentro del contenedor de Google Street View
  google.maps.event.addListenerOnce(panorama, 'status_changed', () => {
    const container = document.querySelector('#street-view .gm-style');
    const note = document.getElementById('note');
    if (container && note) {
      container.appendChild(note); // CLAVE para mantenerla visible en fullscreen
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

// Asegurar visibilidad en fullscreen (fallback)
document.addEventListener('fullscreenchange', () => {
  const note = document.getElementById('note');
  if (note) {
    note.style.display = 'block';
  }
});

document.addEventListener('webkitfullscreenchange', () => {
  const note = document.getElementById('note');
  if (note) {
    note.style.display = 'block';
  }
});
