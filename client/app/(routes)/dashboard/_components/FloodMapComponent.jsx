// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import "leaflet.heat";
// import { get, getDatabase, ref } from "firebase/database";
// import { app } from "@/config/FirebaseConfig";
// import { cam_latLong } from "@/app/_components/cam_latLong";

// export default function FloodMapComponent() {
//   const mapRef = useRef(null);
//   // const origin = [11.322670519283392, 75.9365477879981]; // NIT Calicut
//   const origin = [11.250503, 75.781672]; // SM street

//   const db = getDatabase(app);
//   const [latLongPoints, setLatLongPoints] = useState([
//     [11.32261876002703, 75.93654139343259, 0.1],
//   ]);

//   const getLatLong = () => {
//     const dbRef = ref(db, "/data");
//     get(dbRef)
//       .then((snapshot) => {
//         if (snapshot.exists()) {
//           var data = snapshot.val();
//           console.log("latLongPoints: ", data);
//           setLatLongPoints(data); // No idea why this usestate was not working
//         } else {
//           console.log("No data available");
//         }
//         console.log("useeffect", latLongPoints);
//         if (!mapRef.current) {
//           mapRef.current = L.map("map", {
//             // center: [11.322670519283392, 75.9365477879981],
//             center: [11.250503, 75.781672], // SM street

//             crs: L.CRS.EPSG3857,
//             zoom: 17,
//             zoomControl: true,
//             preferCanvas: false,
//           });

//           var tile_layer = L.tileLayer(
//             "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
//             {
//               attribution:
//                 '\u0026copy; \u003ca href="https://www.openstreetmap.org/copyright"\u003eOpenStreetMap\u003c/a\u003e contributors',
//               detectRetina: false,
//               maxNativeZoom: 19,
//               maxZoom: 19,
//               minZoom: 0,
//               noWrap: false,
//               opacity: 1,
//               subdomains: "abc",
//               tms: false,
//             }
//           );

//           tile_layer.addTo(mapRef.current);

//           var heat_map = L.heatLayer(data, {
//             blur: 15,
//             maxZoom: 18,
//             minOpacity: 0.5,
//             radius: 25,
//           }).addTo(mapRef.current);

//           // Define custom marker icon
//           var greenIcon = L.icon({
//             iconUrl: "leaf-green.png",
//             // iconUrl: 'leaf-green.png',
//             // shadowUrl: 'leaf-shadow.png',

//             iconSize: [40, 40], // size of the icon
//             shadowSize: [50, 64], // size of the shadow
//             iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//             shadowAnchor: [4, 62], // the same for the shadow
//             popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
//           });

//           // Function to add markers for all coordinates in cam_latLong
//           const addMarkers = (coordinates) => {
//             coordinates.forEach((coord) => {
//               // 75vw 50vw style="width: 50vw; height: 50vh;""
//               const videoPopupContent = `
//                 <div style="width: 50vw; height: 50vh; display: flex; justify-content: center;">
//                   <div>
//                     <div>
//                       Coordinates: ${coord}
//                     </div>
//                     <video width="100%" height="100%" controls autoplay loop> <!-- Added loop attribute -->
//                       <source src="your-video-url.mp4" type="video/mp4">
//                       Your browser does not support the video tag.
//                     </video>
//                   </div>
//                 </div>
//               `;
//               L.marker(coord, { icon: greenIcon })
//                 .addTo(mapRef.current)
//                 .bindPopup(videoPopupContent, {
//                   maxWidth: "auto",
//                   maxHeight: "auto",
//                   offset: [0,-7]
//                 });
//               // L.marker(coord, { icon: greenIcon }).addTo(mapRef.current).bindPopup("SM Street");
//             });
//           };

//           // Call the function with cam_latLong
//           addMarkers(cam_latLong);

//           // Add custom marker to the origin
//           // L.marker(origin, { icon: greenIcon }).addTo(mapRef.current).bindPopup("SM Street");

//           // Add custom control to go back to origin
//           L.Control.GoToOrigin = L.Control.extend({
//             onAdd: function (map) {
//               const button = L.DomUtil.create("button", "leaflet-bar");
//               button.innerHTML = "Go to Origin";
//               button.style.backgroundColor = "white";
//               button.style.width = "100px";
//               button.style.height = "30px";
//               button.style.cursor = "pointer";

//               L.DomEvent.on(button, "click", function () {
//                 map.setView(origin, 17);
//               });

//               return button;
//             },

//             onRemove: function (map) {
//               // Nothing to do here
//             },
//           });

//           L.control.goToOrigin = function (opts) {
//             return new L.Control.GoToOrigin(opts);
//           };

//           L.control.goToOrigin({ position: "topright" }).addTo(mapRef.current);
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   useEffect(() => {
//     getLatLong();
//   }, []);

//   return (
//     <div className="w-full md:h-screen p-3 md:p-[2%]">
//       <div className="bg-black rounded-2xl pr-1 pb-2 shadow-lg">
//         <div
//           id="map"
//           className="w-full h-[60vh] md:h-[90vh] border border-gray-400 rounded-lg shadow-lg"
//         ></div>
//       </div>
//     </div>
//   );
// }

// /app/dashboard/_components/FloodMapComponent.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useShelters } from "@/context/ShelterContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const labelStyles = {
  textAlign: "end",
  fontSize: "16px",
  fontWeight: "600",
  color: "#333",
};

const center = {
  lat: 11.250761,
  lng: 75.781807,
};

const FloodMapComponent = () => {
  const router = useRouter();
  const { shelters, setShelters } = useShelters();
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMarkerClick = (shelter) => {
    setSelectedShelter(shelter);
  };

  const handleDirectionClick = () => {
    console.log("clicked");
    if (selectedShelter && userLocation) {
      const destination = `${selectedShelter.position.lat},${selectedShelter.position.lng}`;

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination}`;
      window.open(directionsUrl, "_blank");

      setShelters((prevShelters) =>
        prevShelters.map((shelter) =>
          shelter.id === selectedShelter.id
            ? { ...shelter, accommodationLeft: shelter.accommodationLeft - 1 }
            : shelter
        )
      );
      alert(
        `Accommodation in ${selectedShelter.name} has reduced to ${
          selectedShelter.accommodationLeft - 1
        }`
      );
      setSelectedShelter(null);
    }
  };

  const onLoad = (map) => {
    const iconSize = new window.google.maps.Size(40, 40);
    setIcon({
      url: "/shelter.png",
      scaledSize: iconSize,
    });
  };

  return (
    <div className="w-full h-[400px] md:h-full border-2 border-black rounded-md p-2">
      <LoadScript
        googleMapsApiKey="AIzaSyBuYAOyRKmIdCSSlE_4ezp0yL7V2cpMf1c"
        onLoad={onLoad}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
          {shelters.map((shelter) => (
            <Marker
              key={shelter.id}
              position={shelter.position}
              icon={icon}
              label={{
                text: shelter.name,
                ...labelStyles,
              }}
              className="w-10"
              onClick={() => handleMarkerClick(shelter)}
            />
          ))}

          {selectedShelter && (
            <InfoWindow
              position={selectedShelter.position}
              onCloseClick={() => setSelectedShelter(null)}
            >
              <div className="p-1 bg-white rounded shadow-lg pb-8 px-5 z-20">
                <div className="flex justify-center">
                  <h2 className="text-lg font-semibold mb-2 border-b-2 border-black">
                    {selectedShelter.name}
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-4 justify-center items-center">
                  You are about to be redirected to a new page with directions
                  to this shelter. The shelter count will decrease.
                </p>
                <div className="mb-4 flex justify-evenly">
                  <div>
                    <span className="text-black text-xs font-semibold font-['Radio Canada'] tracking-wide">
                      Food:{" "}
                    </span>
                    <span className="text-[#02a000] text-xs font-semibold font-['Radio Canada'] tracking-wide">
                      {selectedShelter.food} days
                      <br />
                    </span>
                  </div>
                  <div>
                    <span className="text-black text-xs font-semibold font-['Radio Canada'] tracking-wide">
                      Water:{" "}
                    </span>
                    <span className="text-[#03a100] text-xs font-semibold font-['Radio Canada'] tracking-wide">
                      {selectedShelter.water} days
                      <br />
                    </span>
                  </div>
                  <div>
                    <span className="text-black text-xs font-semibold font-['Radio Canada'] tracking-wide">
                      Meds:{" "}
                    </span>
                    <span className="text-[#03a100] text-xs font-semibold font-['Radio Canada'] tracking-wide">
                      {selectedShelter.meds} days
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleDirectionClick}
                  >
                    Show Directions
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default FloodMapComponent;
