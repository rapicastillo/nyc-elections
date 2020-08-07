import React from 'react';
import MapContainer from './MapContainer';
import ControllerContainer from './ControllerContainer';

class Flushing extends React.Component {

  render = () => {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative'}}>
        <MapContainer />
        <ControllerContainer />
      </div>
    )
  }
}

export default Flushing;