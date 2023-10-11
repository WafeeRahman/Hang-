mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: spot.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});




const marker1 = new mapboxgl.Marker()
    .setLngLat(spot.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h6>${spot.title}<h6><p>${spot.location}</p>`
        )
    )
    .addTo(map)