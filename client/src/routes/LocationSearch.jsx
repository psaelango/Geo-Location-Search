import React, { useState, useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxGl from "mapbox-gl";
import Alert from "react-bootstrap/Alert";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { forwardGeocoder } from "../utils/mapUtils";
import TableDisplay from "../components/TableDisplay";
import {
  getAllLocations,
  getLocationsByScore,
} from "../store/location/locationService";

export default function LocationSearch() {
  const { user } = useSelector((state) => state.auth);

  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [geoCoderStatus, setGeoCoderStatus] = useState("loading");

  const Mapcontainer = useRef(null);
  const initMap = async () => {
    // try {
    MapboxGl.accessToken =
      "pk.eyJ1IjoicHNhZWxhbmdvIiwiYSI6ImNpejV6end5bzA2ZjEzM3A4NTE3NnM5YXMifQ.OH-2rxal0YdBVhJTAab4fg";
    const map = new MapboxGl.Map({
      container: Mapcontainer.current,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-79.4512, 43.6568],
      zoom: 8,
    });

    const locations = await getAllLocations(user);
    console.log("locations = ", locations);
    const data = locations.map((location) => {
      const { street, city, zip_code, county, country, latitude, longitude } =
        location;
      return {
        type: "Feature",
        properties: {
          title: `${street} ${city} ${county} ${country} ${zip_code}`,
        },
        text: city,
        geometry: {
          coordinates: [longitude, latitude],
          type: "Point",
        },
      };
    });
    const geoCoderData = {
      features: data,
      type: "FeatureCollection",
    };

    const geoCoder = new MapboxGeocoder({
      accessToken: MapboxGl.accessToken,
      localGeocoder: forwardGeocoder(geoCoderData),
      zoom: 4,
      placeholder: "Enter search e.g. Lincoln Park",
      mapboxgl: MapboxGl,
      // reverseGeocode: true
    });
    setGeoCoderStatus("loaded");

    map.addControl(geoCoder);
    map.on("load", function () {
      map.resize();
    });

    geoCoder.on("result", async function (e) {
      if (e.result.center && e.result.center.length === 2) {
        const mapMarkers = document.getElementsByClassName("mapboxgl-marker");
        while (mapMarkers.length > 0) {
          mapMarkers[0].parentNode.removeChild(mapMarkers[0]);
        }

        const lat = e.result.center[1];
        const lng = e.result.center[0];
        const text = e.result.text;
        const scoredLocations = await getLocationsByScore(
          user,
          `?q=${text}&latitude=${lat}&longitude=${lng}`,
        );
        setLocations(scoredLocations);
        if (scoredLocations && scoredLocations.length > 0) {
          // add markers to map
          let bounds = new MapboxGl.LngLatBounds();
          for (let i = 0; i < scoredLocations.length; i++) {
            const { latitude, longitude, name } = scoredLocations[i];
            const coordinates = [longitude, latitude];
            const elem = document.createElement("div");
            elem.className = "marker map-marker";
            elem.innerHTML = "<span><b>" + (i + 1) + "</b></span>";
            elem.addEventListener("click", () => {
              setSelectedMarker(scoredLocations[i]);
            });

            new MapboxGl.Marker(elem)
              .setLngLat(coordinates)
              .setPopup(
                new MapboxGl.Popup({ offset: 25 }).setHTML(
                  `<pre>${name}</pre>`,
                ),
              )
              .addTo(map);

            bounds.extend(coordinates);
          }
          map.fitBounds(bounds, { padding: 100 });
        } else {
          toast.info("No locations found with search criteria");
        }
      }
    });
    // } catch (error) {
    // 	console.log('Error initMap: ', error);
    // 	toast.error('Something Went Wrong!!! Check Console...')
    // 	if(geoCoderStatus === 'loading') setGeoCoderStatus('failed')
    // }
  };

  useEffect(() => {
    initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableFields = [
    {
      heading: "Name",
      key: "name",
    },
    {
      heading: "Latitude",
      key: "latitude",
    },
    {
      heading: "Longitude",
      key: "longitude",
    },
    {
      heading: "Score",
      key: "score",
    },
  ];

  return (
    <div>
      <Alert key="primary" variant="primary">
        Note: This page initially loads entire data for map input search bar.
        Second time it uses cached data from server. You can differentiate our
        data from 🌲 emoji on the search bar.
      </Alert>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "20px", flex: 1 }}>
          {geoCoderStatus === "loading" ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">
                Loading entire geo-location data ....
              </span>
            </Spinner>
          ) : (
            <TableDisplay
              data={locations}
              fields={tableFields}
              highlight={selectedMarker}
            />
          )}
        </div>
        <div
          style={{
            position: "relative",
            width: "900px",
            height: "500px",
            margin: "20px",
            flex: 2,
          }}
        >
          <div
            ref={Mapcontainer}
            id="map"
            style={{
              position: "relative",
              width: "inherit",
              height: "inherit",
            }}
          />
        </div>
      </div>
    </div>
  );
}
