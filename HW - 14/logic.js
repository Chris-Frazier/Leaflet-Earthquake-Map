// Create a map object
const myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_Key
}).addTo(myMap);

//Earthquake Data
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

(async function(){
    const Earthquakes =  await d3.json(queryUrl);

    console.log(Earthquakes);
    
    Earthquakes.features.forEach(earthquake => {
        const location = earthquake.geometry;
        const magnitude = earthquake.properties.mag
        const coord = [location.coordinates[1], location.coordinates[0]]
        const info = earthquake.properties.title
        let color = "";
            if (magnitude > 6) {
                color = "red";
            }
            else if (magnitude > 5.5) {
                color = "orange";
            }
            else if (magnitude > 5) {
                color = "yellow";
            }
            else {
                color = "green";
            }
        L.circle(coord, {
            fillOpacity: 0.75,
            color: "black",
            fillColor: color,
            radius: magnitude * 30000,
        }).bindPopup(info).addTo(myMap); 
    }) 
    // Add Legend
    const legend = L.control({position: "bottomright"});
    legend.onAdd = function(){
        const div = L.DomUtil.create("div", "info legend");
        //const colors = geojson.options.colors;
        const legendInfo = "<h1>Earthquake Magnitude</h1>";
        div.innerHTML = legendInfo;

        const labels = limits.map((limit, index) => {
            return "<li style=\"background-color: " + "white" + "\"></li>"
        })
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";

        return div

    };
    legend.addTo(myMap);
})()


    
