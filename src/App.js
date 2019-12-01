import React from 'react';
import { render } from 'react-dom';
import MapComp from './Map'

import { Tag } from 'antd';
import "antd/dist/antd.css";

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

function App() {
  return (
    <MapComp/>   
  );
}

export default App;
