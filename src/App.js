import React from "react";
import GoogleMapComp from "./GoogleMapComp";

import "antd/dist/antd.css";
import "leaflet/dist/leaflet.css";


function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GoogleMapComp
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
      />
    </div>
  );
}

export default App;
