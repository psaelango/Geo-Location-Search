import React, { useState, useEffect, useRef } from "react";
import MapboxGl from "mapbox-gl";
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TableWithPagination from "../components/TableWithPagination";
import { getLocationsByScore } from "../store/location/locationService";

export default function NearByLocations() {
  const { user } = useSelector((state) => state.auth);
  
  const [nearByLocations, setNearByLocations] = useState([]);
  const [currentMarkers, setCurrentMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const Mapcontainer = useRef(null);
  
  const initMap = async () => {
    MapboxGl.accessToken = 'pk.eyJ1IjoicHNhZWxhbmdvIiwiYSI6ImNpejV6end5bzA2ZjEzM3A4NTE3NnM5YXMifQ.OH-2rxal0YdBVhJTAab4fg';
    const newMap = new MapboxGl.Map({
      container: Mapcontainer.current,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4512, 43.6568],
      zoom: 8
    });
  
    newMap.on('load', function () {
      newMap.resize();
      setMap(newMap);
    });
  }

  useEffect(() => {
    if (!map) {
      initMap();
    }
    return () => map?.remove();
  }, [map]);

  useEffect(() => {
    if(map) {
      if(nearByLocations && nearByLocations.length > 0) {
        // remove existing markers from map
        currentMarkers.forEach(marker => marker.remove())
        // const mapMarkers = document.getElementsByClassName('mapboxgl-marker');
        // while(mapMarkers.length > 0){
        //   mapMarkers[0].parentNode.removeChild(mapMarkers[0]);
        // }

        // add markers to map
        let bounds = new MapboxGl.LngLatBounds();
        for (let i = 0; i < nearByLocations.length; i++) {
          const { latitude, longitude, name } = nearByLocations[i];
          const coordinates = [longitude, latitude]
          const elem = document.createElement('div');
          elem.className = 'marker map-marker';
          elem.innerHTML = '<span><b>' + (i + 1) + '</b></span>'
  
          const marker = new MapboxGl.Marker(elem)
            .setLngLat(coordinates)
            .setPopup(
              new MapboxGl.Popup({ offset: 25 })
              .setHTML(
                `<pre>${name}</pre>`
              )
            )
            .addTo(map)
          setCurrentMarkers(prevState => [...prevState, marker])
  
          bounds.extend(coordinates);
        }
        map.fitBounds(bounds, {padding: 100});
      }
    }
  }, [map, nearByLocations]);



  const onRowSelect = (row) => {
    if(row?.latitude && row?.longitude) {
        const lat = row.latitude;
        const lng = row.longitude;
        const text = '';
        getLocationsByScore(user, `?q=${text}&latitude=${lat}&longitude=${lng}`)
          .then((locations) => {
            if(locations.length > 0) {
              setNearByLocations(locations);
            } else {
              toast.info('No locations found with search criteria');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            toast.error('Something Went Wrong!!! Check Console...')
          });   
    }
  }

  const tableFields = [
    {
      heading: 'City',
      key: 'city',
    },
    {
      heading: 'County',
      key: 'county',
    },
    {
      heading: 'Country',
      key: 'country',
    },
    {
      heading: 'Zip Code',
      key: 'zip_code',
    }
  ]

  return (
    <div>
      <Alert key='primary' variant='primary'>
        Note: This page displays entire data using server pagination.
        Click on the row to view nearby locations around that lat lng.
      </Alert>
      <div style={{display: 'flex'}}>
        <div style={{margin: '20px', flex: 1}}>
          <TableWithPagination fields={tableFields} onRowSelect={onRowSelect} />
        </div>
        <div style={{position: 'relative', width: '900px', height: '500px', margin: '20px', flex: 2}}>
          <div ref={Mapcontainer} id="map" style={{position: 'relative', width: 'inherit', height: 'inherit'}}/>
        </div>
      </div>
    </div>
  );
}