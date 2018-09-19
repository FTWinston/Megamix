import { SpotifyPlayer } from './SpotifyPlayer';

export interface ITrackChange {
    track: string | undefined;
    start: number;
    end: number | undefined;
}

/*
interface IPositionData {
    startPos: number;
    startAt: Date;
}

let positionData: IPositionData;
*/

export class TrackHandler {
    public trackChanged?: (name: string) => void;
    public positionChanged?: (position: number) => void;
    private iCurrentTrack: number;
    private currentTrackUri: string;
    private trackTimeout: NodeJS.Timer | undefined;
    private positionInterval: NodeJS.Timer | undefined;
    private player: SpotifyPlayer;
    private tracks: ITrackChange[];
    private currentTrackStartedAt?: Date;

    constructor(
        player: SpotifyPlayer,
        tracks: ITrackChange[],
    ) {
        this.player = player;
        this.tracks = tracks;

        this.reset();

        this.player.stateChanged = state => this.playerStateChanged(state);

        const trackUris = this.tracks
            .map(t => t.track)
            .filter(t => t !== undefined) as string[];

        this.player.loadTracks(trackUris);
    }

    public reset() {
        this.iCurrentTrack = -1;
        this.currentTrackUri = '';

        if (this.trackTimeout !== undefined) {
            clearTimeout(this.trackTimeout);
            this.trackTimeout = undefined;
        }
    }

    public dispose() {
        if (this.trackTimeout !== undefined) {
            clearTimeout(this.trackTimeout);
        }

        if (this.positionInterval !== undefined) {
            clearInterval(this.positionInterval);
        }
    }
    
    private playerStateChanged(state: Spotify.PlaybackState) {
        if (state.paused) {
            return;
        }
        
        if (this.iCurrentTrack === -1 || state.track_window.current_track.uri !== this.currentTrackUri) {
            this.iCurrentTrack ++;
            if (this.iCurrentTrack >= this.tracks.length) {
                return;
            }
            
            if (this.currentTrackStartedAt === undefined) {
                this.currentTrackStartedAt = new Date();

                if (this.positionChanged !== undefined) {
                    this.positionInterval = setInterval(() => this.updatePosition(), 100);
                }
            }
            
            const track = this.tracks[this.iCurrentTrack];
            if (track.start !== 0) {
                this.player.seek(track.start);
            }

            if (this.positionChanged !== undefined) {
                this.positionChanged(track.start);
            }

            if (track.end !== undefined) {
                this.trackTimeout = setTimeout(() => this.endCurrentTrack(), track.end - track.start);
            }

            if (this.trackChanged !== undefined && state.track_window.current_track.uri !== track.track) {
                this.trackChanged(state.track_window.current_track.name);
            }
        }
        
        /*
        positionData = {
            startPos: state.position,
            startAt: new Date(),
        };

        if (positionInterval !== undefined) {
            clearInterval(positionInterval);
        }
        
        // displayPosition.innerText = Math.round(positionData.startPos / 1000).toString();
        positionInterval = setInterval(() => {
            // displayPosition.innerText = Math.round((positionData.startPos + (new Date().getTime() - positionData.startAt.getTime())) / 1000).toString();
        }, 1000);
        // displayNumber.innerText = `#${iCurrentTrack + 1}`;

        */
    }

    private endCurrentTrack() {
        if (this.iCurrentTrack < this.tracks.length) {
            return;
        }

        // always change this once we reach the end of a track
        this.currentTrackStartedAt = new Date();

        const nextTrack = this.tracks[this.iCurrentTrack + 1];
        if (nextTrack.track !== undefined && nextTrack.track !== this.currentTrackUri) {
            this.player.nextTrack();
        }
        else {                
            this.player.seek(nextTrack.start);

            if (this.trackTimeout !== undefined) {
                clearTimeout(this.trackTimeout);
            }

            if (nextTrack.end !== undefined) {
                this.trackTimeout = setTimeout(() => this.endCurrentTrack(), nextTrack.end - nextTrack.start);
            }

            if (this.positionChanged !== undefined) {
                this.positionChanged(nextTrack.start);
            }
        }
    }

    private updatePosition() {
        if (this.positionChanged === undefined) {
            return;
        }

        const trackStartPos = this.tracks[this.iCurrentTrack].start;
        const timePlayed = new Date().getTime() - (this.currentTrackStartedAt as Date).getTime()

        this.positionChanged(trackStartPos + timePlayed);
    }
}
