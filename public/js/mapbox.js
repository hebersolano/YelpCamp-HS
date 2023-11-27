mapboxgl.accessToken = mapBoxToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
const popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
  .setLngLat(campground.geometry.coordinates)
  .setHTML(`<h5>${campground.title}</h5>`);
// .addTo(map);

const marker1 = new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).setPopup(popup).addTo(map);

map.addControl(new mapboxgl.NavigationControl());
