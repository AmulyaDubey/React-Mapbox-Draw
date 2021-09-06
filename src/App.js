import React, { Component } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZmFrZXVzZXJnaXRodWIiLCJhIjoiY2pwOGlneGI4MDNnaDN1c2J0eW5zb2ZiNyJ9.mALv0tCpbYUPtzT7YysA2g",
});

export default class App extends Component {
  state = {
    coordinates: {},
  };

  getCoordinatesArray = (featuresArray) => {
    var coordinatesArray = featuresArray.map((feature) => {
      return feature.geometry.coordinates;
    });
    const arr = coordinatesArray[0][0];
    return arr.slice(0, arr.length - 1);
  };

  updateCoordinates = (id, coord) => {
    var { coordinates } = this.state;
    coordinates[id] = coord;
    this.setState({ coordinates });
  };

  onDrawCreate = ({ features }) => {
    const coord = this.getCoordinatesArray(features);
    const featureId = features[0].id;
    this.updateCoordinates(featureId, coord);
  };

  onDrawUpdate = ({ features }) => {
    const coord = this.getCoordinatesArray(features);
    const featureId = features[0].id;
    this.updateCoordinates(featureId, coord);
  };

  render() {
    const { coordinates } = this.state;

    return (
      <div>
        <h2>Welcome to react-mapbox-gl-draw</h2>
        <Map
          style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
          containerStyle={{
            height: "600px",
            width: "85vw",
          }}
        >
          <DrawControl
            onDrawCreate={this.onDrawCreate}
            onDrawUpdate={this.onDrawUpdate}
          />
        </Map>
        <h2>Figures drawn on map:</h2>
        {Object.values(coordinates).map((arr, i) => (
          <div>
            <h4> Feature {i + 1} coordinates </h4>
            <ol>
              {arr.map((pair) => (
                <li>
                  x: {pair[0]} &nbsp; y: {pair[1]}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  }
}
