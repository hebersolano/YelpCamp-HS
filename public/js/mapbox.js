mapboxgl.accessToken = "pk.eyJ1IjoiaGViZXJzb2xhbm8iLCJhIjoiY2xwN2pmeDdhMDU4eDJqdWp2cnA3NjdsdyJ9.jmobVM0dano_U2MG2AuaDQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
const popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
  .setLngLat(campground.geometry.coordinates)
  .setHTML("<h1>Hello World!</h1>");
// .addTo(map);

const marker1 = new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).setPopup(popup).addTo(map);
