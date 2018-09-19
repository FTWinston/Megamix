import * as React from 'react';
import './TrackDisplay.css';

interface ITrackDisplayProps {
  uri?: string;
  start: number;
  end?: number;
  active: boolean;
}

export class TrackDisplay extends React.PureComponent<ITrackDisplayProps, {}> {
    public render() {
        const classes = this.props.active ? 'trackDisplay trackDisplay--active' : 'trackDisplay';

        return (
            <div className={classes}>
                <div className="trackDisplay__uri">{this.props.uri}</div>
                <div className="trackDisplay__time">{this.props.start}</div>
                <div className="trackDisplay__time">{this.props.end}</div>
            </div>
        );
    }
}
