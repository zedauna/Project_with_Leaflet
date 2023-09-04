<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="jerosweb.com / Jeros VIGAN" />
    <meta name="keywords"
        content="HTML, CSS, JavaScript, Leaflet, routing, geolib.js, turf.js, buffer,SIG , SVG, Postgis">
    <meta name="description" content="Application WebMapping sur un fond carte SVG france">

    <!-- Call le fichier CSS Leaflet-->
    <link rel="stylesheet" type="text/css" href="assets/leaflet/leaflet.css" />
    <link rel="stylesheet" type="text/css" href="map.css">
    <title>Leaflet Itinéraire en version PHP</title>
</head>

<body>
    <section>
    <nav><h1>Distance avec API Geoportail , turf.js ,geolib.js, PostgreSQL (Postgis) </h1></nav>
        <div id="map"></div>
        <button type='button' id="routing" onclick="routing()">Calcul itinéraire</button>
        <input type="checkbox" name="itineraire" id="itineraire" checked> Afficher l'itineraire
        <div id="contenu">
            <h2>Information</h2>
            Distance avec geoportail : <input type="text" id="distance" disabled="disabled"> <br /><br />
            Distance avec turf.js: <input type="text" id="distance_turf" disabled="disabled"> <br /><br />
            Distance_rhumb avec turf.js: <input type="text" id="distance_rhumb" disabled="disabled"> <br /><br />
            Distance avec geolib.js: <input type="text" id="distance_geolib" disabled="disabled"> <br /><br />
            Duirée avec geoportail : <input type="text" id="duration" disabled="disabled">
        </div>

        <div id="liste">
            <ul id="maListe">
                <h2> Les routes</h2>

            </ul>

            <ul id="points">
                <h2>Les Points</h2>

            </ul>
            <textarea name="sql" id="sql" cols="70" rows="5"></textarea>
        </div>
    </section>

    <!-- Leaflet.js-->
    <script type="text/javascript" src="assets/leaflet/leaflet.js"></script>
    <script src="assets/terraformer/terraformer.js"></script>
    <script src="assets/terraformer/terraformer-wkt-parser.js"></script>
    <script src="assets/terraformer/leaflet-omnivore.min.js"></script>
    <script src="assets/turf/turf.min.js"></script>
    <script src="assets/geolib/geolib.min.js"></script>
    <script type="text/javascript" src="assets/main.js"></script>

</body>

</html>