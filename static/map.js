
mapboxgl.accessToken = 'pk.eyJ1IjoieWFuZzExMDMiLCJhIjoiY2w5dnd1cmdpMGQ4YjQxbzZncXVubGJ4aSJ9.ca1wlXnOgUYPXcvaJKJu1Q';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center:[-71.0575,42.3655],// longitude, Latitude
    zoom:2.2
});

/* Given a query in the form "lng, lat" or "lat, lng"
* returns the matching geographic coordinate(s)
* as search results in carmen geojson format,
* https://github.com/mapbox/carmen/blob/master/carmen-geojson.md */
const coordinatesGeocoder = function (query) {
    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
    return null;
    }
     
    function coordinateFeature(lng, lat) {
    return {
        center: [lng, lat],
        geometry: {
        type: 'Point',
        coordinates: [lng, lat]
    },
    place_name: 'Lat: ' + lat + ' Lng: ' + lng,
    place_type: ['coordinate'],
    properties: {},
    type: 'Feature'
    };
    }
     
    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];
     
    if (coord1 < -90 || coord1 > 90) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
    }
     
    if (coord2 < -90 || coord2 > 90) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
    }
     
    if (geocodes.length === 0) {
    // else could be either lng, lat or lat, lng
    geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
    }
     
    return geocodes;
};

//full screen control
map.addControl(new mapboxgl.FullscreenControl(),'top-left');


//allow input lat, log to search
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder:coordinatesGeocoder,
        mapboxgl: mapboxgl,
        reverseGeocode:true
    })
);



// Data: UN Human Development Index 2017 Europe extract
// Source: https://ourworldindata.org/human-development-index
const get_data = async () => {
  const query =  await fetch('../static/hdi_index.json', {method : 'GET'});
  const data = await query.json();
  return data;
}


// export const filterdata = async (c_type,c_year) => {
//   const rawdata = await get_data();
//   const data = [];
//   for(const row of data){
//     if(row['crimetype'] == )
//   }

// }



// Build a GL match expression that defines the color for every vector tile feature
// Use the ISO 3166-1 alpha 3 code as the lookup key for the country shape
const matchExpression = ['match', ['get', 'iso_3166_1_alpha_3']];




map.on('load', async () => {
// Add source for country polygons using the Mapbox Countries tileset
// The polygons contain an ISO 3166 alpha-3 code which can be used to for joining the data
// https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
  map.addSource('countries', {
    type: 'vector',
    url: 'mapbox://mapbox.country-boundaries-v1'
  });
  
  const data = await get_data ();

  for (const row of data) {
    if(row['Year'] == 1995 && row['Code'] != ""){;
      const red = row['hdi'] * 255*2;
      const color = `rgb(${red},0,0)`;

      matchExpression.push(row['Code'], color);
    }
  // Convert the range of data values to a suitable color
  }
  
  // Last value is the default, used where there is no data
  matchExpression.push('rgba(0, 0, 0, 0)');

  
  // Add layer from the vector tile source to create the choropleth
  // Insert it below the 'admin-1-boundary-bg' layer in the style
  map.addLayer(
    {
    'id': 'countries-join',
    'type': 'fill',
    'source': 'countries',
    'source-layer': 'country_boundaries',
    'paint': {
    'fill-color': matchExpression
    }
    },
    'admin-1-boundary-bg'
  );
});










