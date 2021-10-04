// import logo from "./logo.svg";
import "./InteractiveMap.css";
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
  Polyline,
} from "@react-google-maps/api";
import Button from '@mui/material/Button';


const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};
const center = {
  lat: -2.170998, 
  lng: -79.922356
};

const circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 300,
    zIndex: 1
}

const polylineOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
  };

export default function InteractiveMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = useState([]);
  const [circles, setCircles] = useState([]);
  const [linePath, setLinePath] = useState([]);

  return (
    <React.Fragment>
      
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            { 
              loadError ? "Error loading maps" :
              !isLoaded ? "Loading..." :
              <GoogleMap 
                zoom={12}
                center={center}
                mapContainerStyle={mapContainerStyle}
                onClick={(event) => {
                  setMarkers(current => [...current, {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                    time: new Date(),
                  }]);
                }}
              >
                {markers.map(marker => (
                <Marker 
                    key={marker.time.toISOString()} 
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={(event) => {
                    setCircles(current => [...current, {
                        center: {lat: event.latLng.lat(), lng: event.latLng.lng()},
                        time: new Date(),
                    }]);
                    }}
                    onRightClick={(event) => {
                        setLinePath(current => [...current, {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        }])
                    }}
                />
                ))}
                {circles.map(circle => (
                <Circle 
                    key={circle.time.toISOString()} 
                    center={circle.center}
                    options={circleOptions}
                />
                ))
                }
                <Polyline 
                    path={linePath}
                    options={polylineOptions}
                />
              </GoogleMap>
            }
          </div>
        </div>
        <div className="row">
            <div className="col-2">
                <Button 
                variant="contained" 
                color="error"
                onClick={() => {
                    setCircles([]);
                    setMarkers([]);
                    setLinePath([]);
                }}
                >
                    Limpiar
                </Button>
            </div>
        </div>
      </div>
    </React.Fragment>
  );
  
}
