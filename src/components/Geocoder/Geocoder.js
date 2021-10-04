import React, { createContext, useState } from "react";
import useFetch from "react-fetch-hook";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import Button from '@mui/material/Button';

function GeoData(props) {
    let addr = props.address;
    addr = addr.split(" ").join("+");
    console.log(addr);
    const { isLoading, error, data } = useFetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&components=country:EC&key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }`)
  
    if (isLoading)  return "Loading...";
    if (error) return "Error!";
    props.setGjson(data);
    return (
      <pre className="d-none">{JSON.stringify(data, null, 2)}</pre>
    )
}

const libraries = ["places"];
const defaultZoom = 12;
const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};
const defaultCenter = {
  lat: -2.170998, 
  lng: -79.922356
};

function MarkerCard(props) {
    const marker = props.marker;
    return (
        <div className="card w-75">
            <div className="card-body">
                <h5 className="card-title">{marker.addr}</h5>
                <p className="card-text">{marker.lat},{marker.lng}</p>
                <a href="#" class="btn btn-primary">Ver</a>
            </div>
        </div>
    );
}

export default function Geocoder() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });
    const [address, setAddress] = useState("");
    const [gjson, setGjson] = useState({});
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState(defaultCenter);
    const [zoom, setZoom] = useState(defaultZoom);

    const handleSubmit = (e) => {
        e.preventDefault();
        let location = gjson.results[0].geometry.location;
        // console.log(gjson.results[0].geometry.location);
        setMarkers(current => [...current, {
            addr: address,
            lat: location.lat,
            lng: location.lng,
            time: new Date(),
        }]);
        setCenter({
            lat: location.lat,
            lng: location.lng,
        });
        setZoom(14);
    }

    return (
        <React.Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        { 
                            loadError ? "Error loading maps" :
                            !isLoaded ? "Loading..." :
                            <GoogleMap 
                                zoom={zoom}
                                center={center}
                                mapContainerStyle={mapContainerStyle}
                            >
                                {markers.map((marker, index) => (
                                    <Marker 
                                        key={marker.time.toISOString()} 
                                        position={{ lat: marker.lat, lng: marker.lng }}
                                        draggable={true}
                                        onDrag={(e) => {
                                            let newMarkers = [...markers];
                                            marker.lat = e.latLng.lat();
                                            marker.lng = e.latLng.lng();
                                            // console.log(markers);
                                            newMarkers[index] = marker;
                                            setMarkers(newMarkers);
                                        }}
                                    />
                                ))}
                            </GoogleMap>
                        }
                    </div>
                    <div className="col-4">
                        <div className="row">
                        <form onSubmit={handleSubmit}>
                            <label>
                            Direccion:
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)}/>
                            </label>
                            <input type="submit" value="Añadir" />
                        </form>
                        </div>
                        <div className="row">
                            <GeoData address={address} setGjson={setGjson}/>
                            {markers.map(marker => (
                                <MarkerCard marker={marker}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                        <Button 
                        variant="contained" 
                        color="error"
                        onClick={() => {
                            setMarkers([]);
                        }}
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}