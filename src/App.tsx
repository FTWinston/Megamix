import * as React from 'react';
import './App.css';
import { SpotifyPlayer } from './SpotifyPlayer';
import { TrackDisplay } from './TrackDisplay';
import { ITrackChange, TrackHandler } from './TrackHandler';

import logo from './logo.svg';

const trackData: ITrackChange[] = [
    { track: 'spotify:track:1HuAR7RyNWQq6vHwOFHWqx', start:     0, end: 25500 }, // I'm On My Way
    { track: 'spotify:track:2AQZ89Q1ZZWsJNWwXZpLtY', start: 16500, end: 34000 }, // Letter from America
    { track: 'spotify:track:3Vu6IeuO4sZMt8RAO4du7s', start: 14250, end: 28500 }, // Sunshine on Leith
    { track: 'spotify:track:66S14BkJDxgkYxLl5DCqOz', start:     0, end: undefined }, // 500 Miles
];

let player: SpotifyPlayer;
let trackHandler: TrackHandler;

(window as any).onSpotifyWebPlaybackSDKReady = () => {
    player = new SpotifyPlayer(
        'Megamix web player',
        'BQDFSKhZEK0NvovyvmAfhm7K81vIvFgl7-QyQ_RlnSf3q0oFUIg48U18MgFLT9Mdri3ILdMKHXcIAwtJHM73AeltwUKWEcTklAlo0SiQABNOWBRC4CQsjtrY17yhK-YLBWfBK1KJYxE4AyoYVdOsvkt0hv10Maz_ghRgXSNKOA',
        () => {
            trackHandler = new TrackHandler(player, trackData);
            trackHandler.reset(); // This line not actually needed
        }
    );
};

interface IAppState {
  tracks: ITrackChange[];
  currentTrack?: ITrackChange;
}

class App extends React.PureComponent<{}, IAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            tracks: trackData,
        };
    }

    public render() {
        const trackDisplay = this.state.tracks
            .map((t, index) => <TrackDisplay uri={t.track} start={t.start} end={t.end} active={t === this.state.currentTrack} key={index} />);

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Spotify Megamix</h1>
                </header>
                <div className="App-intro">
                  {trackDisplay}
                </div>
            </div>
        );
    }
}

export default App;
