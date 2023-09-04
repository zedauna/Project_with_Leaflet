
/**
 * todo Arrondir à N chiffres
 * @param {*} nombre 
 * @param {*} precision 
 * @returns 
 */
function roundDecimal(nombre, precision){
    var precision = precision || 2;
    var tmp = Math.pow(10, precision);
    return Math.round( nombre*tmp )/tmp;
}


/**
 *TODO les variables
 */ 
var positions = [];
var apiUrl = "https://wxs.ign.fr/choisirgeoportail/itineraire/rest/route.json";

/**
 * TODO coordonnees
 */ 
//let centre =[48.9070,2.2468]; 
let centre = {
    lat: 43.2135705,
    lng: 2.3514002
};
let zoom = 12;

/**
 * todo appelle de la carte
*/
// var map = L.map('map').setView(centre, zoom);


let coucheOSM = {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

/**
 * TODO couche openstreetMap avec obligation des contributeurs
*/
var couche=L.tileLayer(coucheOSM.url, {attribution: coucheOSM.attribution});


var map = L.map('map', {
    center: centre,
    zoom:zoom,
    layers: [couche]
});

var baseMaps = {
    "couche": couche
};

var layer_routing='';


//fonction de récuperation des coordonnées
    /**
     *TODO récuperation des coordonnées par clique sur la carte
    * @param {*} e 
    */
    function onMapClick(e) {
        positions.push({
            'lat': e.latlng.lat,
            'lng': e.latlng.lng
        });
        var marker = L.marker({
            'lat': e.latlng.lat,
            'lng': e.latlng.lng
        }).addTo(map);
        // console.log(positions);


    }
map.on('click', onMapClick);

/**
 * TODO chargement des fichiers depuis geoportail
 */
function routing() {
//Mise en place de l'url de la couche
    var indexMax = positions.length - 1;
    var origin = `${positions[0].lng},${positions[0].lat}`;
    var destination = `${positions[indexMax].lng},${positions[indexMax].lat}`;

    var waypoints = "";
    if (positions.length > 2) {
        for (var i = 1; i < indexMax; i++) {
            waypoints += `${positions[i].lng},${positions[i].lat};`;
        }
    }
    // console.log( waypoints);

    var url = `${apiUrl}?origin=${origin}&destination=${destination}`;

    if (waypoints !== "") {
        url += `&waypoints=${waypoints}`;
    }
    // console.log(url);

/**
 * todo calcul de la distance cote client avec turf.js
*/
    var from = turf.point([positions[0].lng,positions[0].lat]);
    var to = turf.point([positions[indexMax].lng,positions[indexMax].lat]);
    var options = {units: 'kilometers'};

    var distance = turf.distance(from, to,options);
    var distance_rhumb = turf.rhumbDistance(from, to, options);

    document.querySelector('#distance_turf').value=`${roundDecimal(distance)} KM`;
    document.querySelector('#distance_rhumb').value=`${roundDecimal(distance_rhumb)} KM`;

/**
 * todo calcul de la distance cote client avec geolib.js
 */
    var start={longitude:positions[0].lng,latitude:positions[0].lat};
    var end={longitude:positions[indexMax].lng,latitude:positions[indexMax].lat};

    var distance_geolib=window.geolib.getDistance(start,end)/1000;

    document.querySelector('#distance_geolib').value=`${distance_geolib} KM`;


/**
 * todo affiche les requetes sql
 */

    var sql=`
        ----PostgreSQL(Postgis)----------
        -- Distance (pas efficace)
        SELECT ST_Distance(
        ST_GeometryFromText('POINT(${positions[0].lng} ${positions[0].lat})', 4326), 
        ST_GeometryFromText('POINT(${positions[indexMax].lng} ${positions[indexMax].lat})', 4326) 
        ) AS distance ; --m
        
        --Distance selon sphere
        SELECT ST_Distance(
        ST_GeometryFromText('POINT(${positions[0].lng} ${positions[0].lat})', 4326), 
        ST_GeometryFromText('POINT(${positions[indexMax].lng} ${positions[indexMax].lat})', 4326) ,
        true)/1000 AS distance ; --m
        

        --Distance (efficace)
        SELECT ST_DistanceSphere(
        ST_GeometryFromText('POINT( ${positions[0].lng} ${positions[0].lat})', 4326), 
        ST_GeometryFromText('POINT(${positions[indexMax].lng} ${positions[indexMax].lat})', 4326) 
        )/1000 as distanceSphere; --km 
        `;

    document.querySelector('#sql').value=sql;

/**
 * TODo Calcul de la longueur 
 */
    let tab=[];
    for(let i=0;i<positions.length;i++){
        tab+=`[${positions[i].lng},${positions[i].lat}],`;
    }
    let tabls=`[${tab}]`;
    console.log(tab);
    // var line = turf.lineString([tab]);
    // var longueur = turf.length(line);
    // document.querySelector('#distance_turf').value=longueur;


/**
 * TODO Chargement de la couche json depuis l'url par methode fetch 
*/
    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log(data['geometryWkt']);
            var wkt = data['geometryWkt'];

/**
 * todo 1er technique pour tracer l'itineaire sur la carte
*/
        // var geojson = Terraformer.WKT.parse(wkt);
        // var layer = L.geoJson(geojson, {}).addTo(map);

/**
 * TODO 2eme technique pour tracer l'itineaire sur la carte
*/
    geojsonOm = omnivore.wkt.parse(wkt);
     // geojsonOm.addTo(map);
    layer_routing=L.featureGroup([geojsonOm]).addTo(map);

/**
 * TODo Calcul de la longueur 
 * 
 * /
    // console.log(geojsonOm._layers.feature);
    // var line = turf.lineString([geojsonOm]);
    // var longueur = turf.length(line);
    // document.querySelector('#distance_turf').value=longueur;


/**
 * todo Par le composant L.control de leaflet
*/
        //     var overlayMaps = {
            //         "Itineraire": geojsonOm
            //     };
            
            // L.control.layers(baseMaps, overlayMaps).addTo(map);

/**
 * TODO autre technique d'ajouter et suppression de couches
*/
            // document.querySelector('#itineraire').addEventListener('click',function(){
            //     let state=this.checked;
            //     console.log(state);
            //     if(state==true){
            //         geojsonOm.addTo(map);
            //     }
            //     else {
            //         map.removeLayer(geojsonOm);
            //     }
            // }

/**
 *todo aficher de la distance et de la duréé
*/
        document.querySelector('#distance').value = data['distance'];
        document.querySelector('#duration').value = data['duration'];

/**
 * todo afficher la liste des infos des l'itineaire
 */
            var parcours = data['legs'];
            for (let i = 0; i < parcours.length; i++) {
                var steps = data['legs'][i].steps;
                // console.log(steps);
                for (let a = 0; a < steps.length; a++) {
                    var texte = `Distance : ${steps[a].distance},  Durée : ${steps[a].duration},  Instruction : ${steps[a].navInstruction}`;
                    var t = document.createTextNode(texte);
                    let li = document.createElement("li");
                    li.appendChild(t);
                    document.querySelector('#maListe').appendChild(li);
                }
            }
        })

/**
 * todo affichage des points depart et destination
 */ 
    var p = 0;
    positions.forEach(function (position) {
        p += 1;
        var tepoints = ` Points n° ${p}: Lng : ${position.lng},lat : ${position.lat}`;
        // console.log(tepoints);
        var tpoin = document.createTextNode(tepoints);
        let li = document.createElement("li");
        li.appendChild(tpoin);
        // console.log(li);
        document.querySelector('#points').appendChild(li);
    })

}

/**
 * TODO afficher et masque l'itinéraire selon l'opacité
*/
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#itineraire').addEventListener('click',function(){
        let state=this.checked;
        // console.log(state);
        if(state==true){
            layer_routing.setStyle({'opacity':1});
        }
        else {
            layer_routing.setStyle({'opacity':0});
        }
    })
            
});

