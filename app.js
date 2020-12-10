/* Created by Julian Davis December 2020 https://digitallearningsolutions.com.au
A simple demo on how to use geoLocation with xAPI*/

var currentLocation;
var geolocation = {};

$(document).ready(function () {


    //Connect to LRS
    var conf = {
        "endpoint": "https://yourlrs.com/data/xAPI/",
        "auth": "Basic " + toBase64('username:password'),
    };
    ADL.XAPIWrapper.changeConfig(conf);



    $('#mdlLogin').modal('show');

    var locationPromise = getLocation();
    locationPromise
        .then(function (loc) {

            // Initialize and add the map

            currentLocation = {
                lat: geolocation["lat"],
                lng: geolocation["long"]
            };

            map = new google.maps.Map(
                document.getElementById('map'), {
                    zoom: 13,
                    center: currentLocation
                });
            new google.maps.Marker({
                position: currentLocation,
                map,
                title: "This is where I am!"
            });
        })
        .catch(function (err) {
            console.log("No location");
        });



    $('#btnStart').on('click', function () {

        var stmt = {
            "actor": {
                "objectType": "Agent",
                "mbox": "mailto:" + $('#email').val(),
                "name": $('#email').val()
            },
            "verb": {
                "id": "http://activitystrea.ms/schema/1.0/checkin",
                "display": {
                    "en-US": "checked in"
                }
            },
            "object": {
                "id": "https://xapi-geo-demo",
                "objectType": "Activity",
                "definition": {
                    "type": "http://activitystrea.ms/schema/1.0/application",
                    "name": {
                        "en-US": "xAPI Geolocation Demo"
                    }
                }
            },
            "context": {
                "contextActivities": {
                    "category": {
                        "id": "https://w3id.org/xapi/application"
                    }
                },
                "extensions": {
                    "http://id.tincanapi.com/extension/latitude": geolocation.lat,
                    "http://id.tincanapi.com/extension/longitude": geolocation.long,

                }
            }
        }

        var resp_obj = ADL.XAPIWrapper.sendStatement(stmt);
        $('#mdlLogin').modal('hide');
    })


})



function getLocation(callback) {
    var promise = new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    resolve("@" + position.coords.latitude + "," + position.coords.longitude)
                    geolocation["lat"] = position.coords.latitude;
                    geolocation["long"] = position.coords.longitude;
                    return true;
                }
            );
        } else {
            reject("Unknown");
            return false;
        }
    });

    return promise;
}
