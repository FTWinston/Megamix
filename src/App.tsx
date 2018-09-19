import * as React from 'react';
import './App.css';
import { SpotifyPlayer } from './SpotifyPlayer';

import logo from './logo.svg';

interface ITrackChange {
    track: string | undefined;
    start: number;
    end: number | undefined;
}

const trackData: ITrackChange[] = [
    { track: 'spotify:track:1HuAR7RyNWQq6vHwOFHWqx', start:     0, end: 25500 }, // I'm On My Way
    { track: 'spotify:track:2AQZ89Q1ZZWsJNWwXZpLtY', start: 15500, end: 33500 }, // Letter from America
    { track: 'spotify:track:3Vu6IeuO4sZMt8RAO4du7s', start: 14250, end: 28500 }, // Sunshine on Leith
    { track: 'spotify:track:66S14BkJDxgkYxLl5DCqOz', start:     0, end: undefined }, // 500 Miles
];

let iCurrentTrack = -1;
/*
interface IPositionData {
    startPos: number;
    startAt: Date;
}

let positionData: IPositionData;
*/
let positionInterval: NodeJS.Timer | undefined;

let player: SpotifyPlayer;

(window as any).onSpotifyWebPlaybackSDKReady = () => {
    const tracks = trackData
        .filter(t => t.track !== undefined)
        .map(t => t.track) as string[];

    player = new SpotifyPlayer(
        'Megamix web player',
        'BQDFSKhZEK0NvovyvmAfhm7K81vIvFgl7-QyQ_RlnSf3q0oFUIg48U18MgFLT9Mdri3ILdMKHXcIAwtJHM73AeltwUKWEcTklAlo0SiQABNOWBRC4CQsjtrY17yhK-YLBWfBK1KJYxE4AyoYVdOsvkt0hv10Maz_ghRgXSNKOA',
        () => player.loadTracks(tracks),
        state => playerStateChanged(state),
    );
};

function playerStateChanged(state: Spotify.PlaybackState) {
    // console.log('state', state);
    if (state.paused) {
        // displayTrack.innerText = displayPosition.innerText = displayNumber.innerText = '';
        return;
    }
    if (iCurrentTrack === -1 || state.track_window.current_track.uri !== trackData[iCurrentTrack].track) {
        iCurrentTrack ++;
        if (iCurrentTrack >= trackData.length) {
            return;
        }
        const track = trackData[iCurrentTrack];
        if (track.start !== 0) {
            player.seek(track.start);
        }
        if (track.end !== undefined) {
            // TODO: if track is undefined, don't skip track, just seek
            setTimeout(() => player.nextTrack(), track.end - track.start);
        }
        // displayTrack.innerText = state.track_window.current_track.name;
    }
    /*
    positionData = {
        startPos: state.position,
        startAt: new Date(),
    };
    */

    if (positionInterval !== undefined) {
        clearInterval(positionInterval);
    }
    
    // displayPosition.innerText = Math.round(positionData.startPos / 1000).toString();
    positionInterval = setInterval(() => {
        // displayPosition.innerText = Math.round((positionData.startPos + (new Date().getTime() - positionData.startAt.getTime())) / 1000).toString();
    }, 1000);
    // displayNumber.innerText = `#${iCurrentTrack + 1}`;
}

class App extends React.PureComponent {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
