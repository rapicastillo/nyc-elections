import React from 'react';
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoicmFwaWNvbGxjIiwiYSI6ImNrOXRhc3ZrMzFlNHgzZG8xZDk3NGJrdnQifQ.stg6zjtXFfOtExoAow_sxA'
});
// const MAPBOX_STYLE = "mapbox://styles/rapicollc/ckddf4rz63ko71io2eg85v28b"
const MAPBOX_STYLE = "mapbox://styles/rapicollc/ckdkaddzd0wtq1ipcyxfzw5ek?fresh=true";

const ED_SOURCE = "ed-4rtct9";

const HIDDEN = ["lngLat", "elect_dist", "shape_area", "shape_leng", "share_real", "share_perc", "total_int", "share", "total"]

class MapContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      popupData: null,
      popupLnglat: null,
      hoveredED: null,
      center: [-74.0060, 40.7128]
    };
  }

  componentDidMount = () => {
  
  }

  onMouseMove = (map, event) => {
    const target = map.queryRenderedFeatures(event.point, {layers: ['202005-cd14']})
    this.setState({ popupLnglat: event.lngLat });
    if (target[0]) {
      this.setState({ popupData: {...target[0].properties } })
    } else {
      this.setState({ popupData: null})
    }
  };

  onLoad = (map, event) => {

    map.addSource("election-districts", {
      type: "vector",
      url: "mapbox://rapicollc.8yrrl6oa"
    });
    
    map.addLayer({
      'id': 'eds',
      'type': 'fill',
      'source-layer': 'ED-4rtct9',
      'source': "election-districts",
      'layout': {},
      'paint': { 
        "fill-color": 'black', 
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.3,
          0
        ]
      }
    });


    map.on('mousemove', 'eds', (e) => {
      if (e.features.length > 0) {
        if (this.state.hoveredStateId) {
          map.setFeatureState(
            { source: 'election-districts', 'sourceLayer': 'ED-4rtct9', id: this.state.hoveredStateId },
            { hover: false }
          );
        }
  
          const hoveredStateId = e.features[0].id
          this.setState({hoveredStateId: hoveredStateId});
          map.setFeatureState(
            { source: 'election-districts', 'sourceLayer': 'ED-4rtct9', id: hoveredStateId },
            { hover: true }
          );
        }
      }
    );

    map.on('mouseleave', 'eds', (e) => {
        if (this.state.hoveredStateId) {
          map.setFeatureState(
            { source: 'election-districts', 'sourceLayer': 'ED-4rtct9', id: this.state.hoveredStateId },
            { hover: false }
          );
        }
    });
  }



  render = () => (
    <Map
      style={MAPBOX_STYLE}
      containerStyle={{
        height: '100%',
        width: '100%'
      }}
      center={this.state.center}

      onStyleLoad={this.onLoad}
      onMouseMove={this.onMouseMove}
     
    >
      {
        this.state.popupData && (
          <Popup
            coordinates={this.state.popupLnglat}
            offset={{
              'bottom': [0, -10]
            }}
          >
            <p>ED {this.state.popupData['elect_dist']}</p>
            <table>
              <tbody>
              {
                Object.keys(this.state.popupData).map((item) => 
                  !HIDDEN.includes(item) && (
                  <tr key={item}>
                    <td>{item}</td><td>{this.state.popupData[item]}</td>
                  </tr>
                )) 
              }
              </tbody>
            </table>
            
          </Popup>
        )
      }


      <Layer 
        id="ed-fill"
        type="fill" 
        source={ED_SOURCE}
        paint={{ "fill-color": '#000000', 'fill-opacity': 0.5 }}>
      </Layer>
    </Map>
  )

}

export default MapContainer;