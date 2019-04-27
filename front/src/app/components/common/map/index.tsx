import * as React from 'react';
import * as Amap from 'react-amap';

export interface ImapProps {
    className: string;
    markers: Array<object>;
}

export class Map extends React.Component<ImapProps, any> {
    public render() {
        return (
            <div className={this.props.className}>
                <Amap.Map amapkey={'5f52e2ccb793e9f4b9b79fdc258d78eb'} zoom={1}>
                    <Amap.Markers
                        markers={this.props.markers}
                        useCluster={true}
                    />
                </Amap.Map>
            </div>
        );
    }
}
