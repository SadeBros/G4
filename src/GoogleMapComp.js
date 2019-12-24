import React, { Component } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Circle
} from "react-google-maps";

import MarkerDrawer from "./Drawers/MarkerDrawer";
import { Button, Modal, Input, message } from "antd";
import axios from "axios";

class Map extends Component {
  state = {
    markers: [],
    selectedPosition: null,
    markerDrawerVisible: false,
    saveFileModalVisible: false,
    textFileName: "",
    textFileContent: null,
    waitingForFileUpload: false,
    randomPointsMarkerCenter: null, // {lat: 40.10083211269787, lng: 30.800708042517158}
    randomPointsClicked: false,
    randomPointsCircleRadius: 100
  };

  randomPointsClickHandler = event => {
    this.setState({ randomPointsClicked: !this.state.randomPointsClicked });

    if (this.state.randomPointsClicked) {
      this.setState({
        randomPointsMarkerCenter: null
      });
    }
  };

  generateRandomPoints = () => {
    if(! this.state.randomPointsClicked){
      alert("RandomPoints button must be clicked.");
      return;
    }

    const markers = [...this.state.markers];
    let radiusInDegree = this.state.randomPointsCircleRadius / 111699;

    let center = this.state.randomPointsMarkerCenter;

    for (let i = 0; i < 10; i++) {
      let latRand = Math.random() * radiusInDegree;
      let lngRand = Math.random() * radiusInDegree;

      let lat =
        Math.random() >= 0.5 ? center.lat + latRand : center.lat - latRand;
      let lng =
        Math.random() >= 0.5 ? center.lng + lngRand : center.lng - lngRand;

      let coordinate = { lat: lat, lng: lng };
      markers.push(coordinate);

      this.setState({ markers: markers });
    }
  };

  // measure = (lat1, lon1, lat2, lon2) => {
  //   var R = 6378.137; // Radius of earth in KM
  //   var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  //   var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  //   var a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos((lat1 * Math.PI) / 180) *
  //       Math.cos((lat2 * Math.PI) / 180) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   var d = R * c;
  //   return d * 1000; // meters
  // };

  addMarker = event => {
    let coordinate = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    if (this.state.randomPointsClicked) {
      this.setState({
        randomPointsMarkerCenter: coordinate
      });
    } else {
      const markers = [...this.state.markers];
      markers.push(coordinate);
      this.setState({ markers: markers });
    }
  };

  deleteMarker = pos => {
    const { markers } = this.state;

    let a = markers.filter(val => val !== pos);

    this.setState({ markers: a });

    this.closeMarkerDrawer();
  };

  showMarkerDrawer = position => {
    this.setState({
      markerDrawerVisible: true,
      selectedPosition: position
    });
  };

  closeMarkerDrawer = () => {
    this.setState({
      markerDrawerVisible: false
    });
  };

  showSaveFileModal = () => {
    this.setState({ saveFileModalVisible: true });
  };

  closeSaveFileModal = () => {
    this.setState({ saveFileModalVisible: false });
  };

  static readUploadedFileAsText = inputFile => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  };

  uploadFile = async event => {
    event.persist();

    if (!event.target || !event.target.files) {
      return;
    }

    this.setState({ waitingForFileUpload: true });

    const fileList = event.target.files;

    // Uploads will push to the file input's `.files` array. Get the last uploaded file.
    const latestUploadedFile = fileList.item(fileList.length - 1);
    this.setState({
      textFileName: latestUploadedFile.name.replace(".txt", "")
    });

    try {
      const fileContents = await Map.readUploadedFileAsText(latestUploadedFile);
      this.setState({
        textFileContent: fileContents,
        waitingForFileUpload: false
      });
      this.readMarkersFromFile();
    } catch (e) {
      console.log(e);
      this.setState({
        waitingForFileUpload: false
      });
    }
  };

  onMarkerPositionChanged = (e, idx, type) => {
    if (type === "markers") {
      const { markers } = this.state;

      markers[idx].lat = e.latLng.lat();
      markers[idx].lng = e.latLng.lng();

      this.setState({ markers: markers });
    } else if (type === "randomPointsMarker") {
      const { randomPointsMarkerCenter } = this.state;

      randomPointsMarkerCenter.lat = e.latLng.lat();
      randomPointsMarkerCenter.lng = e.latLng.lng();

      this.setState({
        randomPointsMarkerCenter: randomPointsMarkerCenter
      });
    }
  };

  readMarkersFromFile = () => {
    const content = this.state.textFileContent;
    const coordinates = content
      .split("\n")
      .filter(el => el !== "lat,lng" && el !== "");

    const markers = coordinates.map(coordinate => {
      let [lat, lng] = coordinate.split(",");
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      return { lat: lat, lng: lng };
    });
    this.setState({ markers: markers });
  };

  saveFileHandler = async () => {
    const markers = [...this.state.markers];
    const textFileName = this.state.textFileName;
    axios
      .post(`http://localhost:5000`, { markers, textFileName })
      .then(res => console.log(res, res.data));
  };

  textFileNameChangeHandler = event => {
    this.setState({ textFileName: event.target.value });
  };

  modalOkHandler = () => {
    this.closeSaveFileModal();
    this.saveFileHandler();
    message.success(
      this.state.textFileName + ".txt is saved under /missions folder."
    );
  };

  modalCancelHandler = () => {
    this.closeSaveFileModal();
  };

  updateRadius = () => {
    const radius = this.map.getRadius();
    this.setState({ randomPointsCircleRadius: radius });
  };

  mapMounted = ref => {
    this.map = ref;
  };

  render() {
    const icon = {
      url:
        //"https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Button_Icon_Red.svg/1024px-Button_Icon_Red.svg.png",
        "./icons/red-circle.png",
      scaledSize: { width: 8, height: 8 }
    };

    return (
      <div>
        <GoogleMap
          defaultZoom={17}
          defaultCenter={{ lat: 40.100056583071414, lng: 30.800300346746894 }}
          onClick={e => this.addMarker(e)}
        >
          {this.state.markers.map((position, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={position}
              icon={icon}
              draggable={true}
              onDrag={e => this.onMarkerPositionChanged(e, idx, "markers")}
              onClick={() => this.showMarkerDrawer(position)}
            />
          ))}

          {this.state.randomPointsMarkerCenter != null ? (
            <div>
              <Marker
                key={`marker-randomPoints`}
                position={this.state.randomPointsMarkerCenter}
                draggable={true}
                onDrag={e =>
                  this.onMarkerPositionChanged(e, 0, "randomPointsMarker")
                }
              />

              <Circle
                ref={this.mapMounted.bind(this)}
                center={this.state.randomPointsMarkerCenter}
                radius={this.state.randomPointsCircleRadius}
                editable={true}
                onRadiusChanged={e => this.updateRadius(e)}
                options={{
                  fillColor: "#f00",
                  strokeColor: "#f00"
                }}
              ></Circle>
            </div>
          ) : null}

          <MarkerDrawer
            close={this.closeMarkerDrawer}
            visible={this.state.markerDrawerVisible}
            deleteMarker={this.deleteMarker}
            selectedPosition={this.state.selectedPosition}
          />

          <Input size="large" type="file" onChange={this.uploadFile} />
          <Button size="large" onClick={this.showSaveFileModal}>
            SAVE FILE
          </Button>

          <Button
            size="large"
            onClick={this.randomPointsClickHandler}
            className={this.state.randomPointsClicked ? "ant-btn-danger" : null}
          >
            RandomPoints
          </Button>

          <Button size="large" onClick={this.generateRandomPoints}>
            Generate Random Points
          </Button>

          <p>{this.state.textFileContent}</p>

          <Modal
            title="Filename"
            visible={this.state.saveFileModalVisible}
            onOk={this.modalOkHandler}
            onCancel={this.modalCancelHandler}
            width={300}
          >
            <Input
              type="text"
              addonAfter=".txt"
              onChange={this.textFileNameChangeHandler}
              value={this.state.textFileName}
            />
          </Modal>
        </GoogleMap>
      </div>
    );
  }
}

const GoogleMapComp = withScriptjs(withGoogleMap(Map));

export default GoogleMapComp;

// https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
// https://stackoverflow.com/questions/58568085/can-not-get-radius-value-from-editable-circle-onradiuschanged-event
// https://stackoverflow.com/questions/53248165/cant-set-state-when-onradiuschanged
// https://gis.stackexchange.com/questions/142326/calculating-longitude-length-in-miles
