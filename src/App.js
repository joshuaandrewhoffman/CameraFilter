import React from 'react';
import './App.css';
import Webcam from "react-webcam";
import _ from 'lodash';
import CameraButton from './Ic_radio_button_on_48px.svg';
import ActivateCameraButton from './camera_alt-24px.svg';

class App extends React.Component {
  constructor() {
    super();
    this.viewHeightFix();
    this.state = { alpha: 0, initialOrientation: null, cameraActivated: false };
    this.webcamRef = React.createRef();

    const onDeviceOrientationChanged = (event) => {
      if (!this.state.initialOrientation) {
        this.setState({ initialOrientation: { alpha: event.alpha } })
      }
      else {
        const orientationDelta = this.getOrientationDelta(event, this.state?.initialOrientation);

        // Another form of throttling, differences of less than 3 degrees result in a very small change in saturation. Avoid rerendering for no reason!
        if (!this.state.orientationDelta?.alpha || Math.abs(orientationDelta.alpha - this.state.orientationDelta.alpha) > 3) {
          this.setState({ alpha: event.alpha, orientationDelta })
        }
      }
    }

    // Throttle to one update every 300ms
    const deviceOrientationListener = _.throttle(onDeviceOrientationChanged, 300);

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", deviceOrientationListener);
    }
    window.addEventListener("resize", this.viewHeightFix);

  }

  viewHeightFix() {
    // Viewheight css fix courtesy of https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  getOrientationDelta(event, initialOrientation) {
    // map from raw sensor data onto an adjusted 360 degree space based on initial offset
    return { alpha: (event.alpha - initialOrientation?.alpha + 360) % 360 };
  }

  capturePhoto() {
    const base64 = this.webcamRef.current.getScreenshot();
    var link = document.createElement("a");
    link.setAttribute("href", base64);
    link.setAttribute("download", `YemboImg${new Date().valueOf()}`);
    link.click();
  }

  getSaturationFilterStyle() {
    // Remap from our adjusted 360 degree space to a value between -180 and 180
    const correctedAlpha = this.state?.orientationDelta?.alpha > 180 ? this.state?.orientationDelta?.alpha - 360 : this.state?.orientationDelta?.alpha;

    // calculate desaturation from 100% to 0% on 0-45 degree counterclockwise turn and saturation
    // from 100% to 200% on the 0-45 degree clockwise turn    
    const saturationPercentageOffset = -4 * (correctedAlpha / 180);

    // Modify our saturation based on offset, then clamp to 0% and 200% saturation
    let saturationPercentage = 1.0 + saturationPercentageOffset;
    if (saturationPercentage > 2) {
      saturationPercentage = 2;
    }
    else if (saturationPercentage < 0) {
      saturationPercentage = 0;
    }
    return { 'filter': `saturate(${saturationPercentage})` };
  }

  activateCamera() {
    this.setState({ cameraActivated: true });
  }

  render() {
    const saturationFilterStyle = this.getSaturationFilterStyle();

    return <div className="App">
      {this.state.cameraActivated ?
        <>
          <Webcam
            className='webcam'
            audio={false}
            height={'100%'}
            screenshotFormat="image/jpeg"
            width={'100%'}
            style={saturationFilterStyle}
            ref={this.webcamRef}
          />
          <div className='photo-button-bg'>
            <img className='photo-button' src={CameraButton} alt="Camera Button" onClick={() => { this.capturePhoto() }} />
          </div></>
        :
        <div className='activate' onClick={() => { this.activateCamera() }}>
          <img className='activateCameraButton' src={ActivateCameraButton} alt="Activate Camera" />
          <div className='activateCameraText'>Activate Camera</div>
        </div>
      }
    </div>
  }
}

export default App;

