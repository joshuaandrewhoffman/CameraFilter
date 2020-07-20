# Camera Filter (Mobile Web)
This is a mobile web project I did as part of an interview process. The prompt was to create a camera filter which adjusts image saturation based on the tilt of a user's smartphone. Testing was done on a Nexus 6 using Chrome.

## Tilt Calculation

The tilt calculation in this app is very much an MVP. When the page loads, the alpha rotation (tilt) of the device is saved into component state. This is used as a "zero" point from which all other alpha rotations are calculated.

The downside of this approach is that if a user holds the device in an unexpected way during page load, then corrects the angle of the device shortly afterwards, we won't get our expected behavior. The alternative to this is performing multi-sensor inference to deduce the phone's orientation relative to the earth, which would be much less fragile.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Running on Mobile

After the app is running locally, access it via mobile either using `adb reverse tcp:3000 tcp:3000` (requires [Android dev tools](https://developer.android.com/)) or setting up an `ngrok` tunnel (requires [downloading ngrok](https://ngrok.com/))

## Gotchas

Note that android apps like twilight and f.lux can cause issues with authorizing the camera permission! The "Draw Over Other Apps" permission will preclude you from clicking Accept in the dialog when prompted for camera access.

## Future Work

I suspect that iOS support is probably only a few css classes away from working, but didn't have an iPhone to test with. Additionally, a big improvement would be to treat the camera orientation the same way that native apps do when the device is tilted i.e. a counter-rotation is performed to compensate for the changing angle of the device. I suspect this would necessitate interacting directly with the underlying APIs and moving away from the react-webcam library (or forking it).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).