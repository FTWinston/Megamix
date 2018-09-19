export class SpotifyPlayer {
    private player: any; // Spotify.SpotifyPlayer;
    private isPaused: boolean = false;

    constructor(
        deviceName: string,
        apiToken: string,
        ready?: () => void,
        stateChanged?: (state: Spotify.PlaybackState) => void,
    ) {
        this.player = new Spotify.Player({
            getOAuthToken: (cb: (val: string) => void) => { cb(apiToken); },
            name: deviceName,
        });

        // error handling
        this.player.addListener('initialization_error', (message: string) => { console.error(message); });
        this.player.addListener('authentication_error', (message: string) => { console.error(message); });
        this.player.addListener('account_error', (message: string) => { console.error(message); });
        this.player.addListener('playback_error', (message: string) => { console.error(message); });

        this.player.addListener('player_state_changed', (state: Spotify.PlaybackState) => {
            this.isPaused = state.paused;

            if (stateChanged !== undefined) {
                stateChanged(state);
            }
        });

        this.player.addListener('ready', (deviceID: string) => {
            console.log('Ready with Device ID', deviceID);

            if (ready !== undefined) {
                ready();
            }
        });

        this.player.addListener('not_ready', (deviceID: string) => {
            console.log('Device ID has gone offline', deviceID);
        });
        
        this.player.connect();
    }
    
    public get paused(): boolean { return this.isPaused; }
    
    public loadTracks(spotifyUris: string[]) {
        this.player._options.getOAuthToken((accessToken: string) => {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.player._options.id}`, {
                body: JSON.stringify({ uris: spotifyUris }),
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
            });
        });
    };

    public seek(position: number) {
        this.player.seek(position);
    }

    public nextTrack() {
        this.player.nextTrack();
    }

    public previousTrack() {
        this.player.previousTrack();
    }

    public pause() {
        this.player.pause();
    }

    public resume() {
        this.player.resume();
    }
}
