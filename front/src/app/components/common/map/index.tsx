import * as React from 'react';
import * as Amap from 'react-amap';
import Axios from 'axios';
export interface ImapProps {
    className: string;
    //  markers: Array<object>;
}

export class Map extends React.Component<ImapProps, any> {
    constructor(prop: ImapProps) {
        super(prop);
        this.state = {
            markers: [
                {
                    position: {
                        latitude: 30,
                        longitude: 100,
                    },
                    ip: '44.125.32.12',
                    times: 8,
                },
                {
                    position: {
                        latitude: 23,
                        longitude: 115,
                    },
                    ip: '149.22.55.4',
                    times: 2,
                },
                {
                    position: {
                        latitude: 24,
                        longitude: 116,
                    },
                    ip: '149.22.51.4',
                    times: 2,
                },
                {
                    position: {
                        latitude: 34,
                        longitude: -118,
                    },
                    ip: '42.23.56.45',
                    times: 10,
                },
                {
                    position: {
                        latitude: 34,
                        longitude: -100,
                    },
                    ip: '42.23.11.45',
                    times: 12,
                },
            ],
            serverdatas: [],
        };
        this.getMarkers = this.getMarkers.bind(this);
        this.getMarkers();
        this.regularUpdate = this.regularUpdate.bind(this);
        this.regularUpdate();
    }

    regularUpdate() {
        this.getMarkers();
        setTimeout(this.regularUpdate, 30 * 1000);
    }

    getDatasFromServer() {
        return new Promise((resolve, reject) => {
            Axios.get('http://server.bensyan.top:8080/ip').then(res => {
                if (res.status == 200) {
                    let datas = res.data.data;
                    if (this.equar(datas, this.state.serverdatas)) {
                        reject('no changed');
                    } else {
                        this.setState({
                            serverdatas: datas,
                        });
                        resolve(datas);
                    }
                } else {
                    reject('error');
                }
            });
        });
    }

    getMarkerPositionByData(data: any) {
        return new Promise((resolve, reject) => {
            Axios.get(
                'http://api.ipstack.com/' +
                    data.address +
                    '?access_key=0e4b3fc9bb7012613b5f8b77b422dc20',
            )
                .then(res => {
                    if (res.status == 200) {
                        if (res.data.latitude && res.data.longitude) {
                            let d = {
                                position: {
                                    latitude: res.data.latitude,
                                    longitude: res.data.longitude,
                                },
                                ip: data.address,
                                times: data.times,
                            };
                            resolve(d);
                        } else {
                            let d = {
                                position: {
                                    latitude: 0,
                                    longitude: 0,
                                },
                                ip: data.address,
                                times: data.times,
                            };
                            resolve(d);
                        }
                    } else {
                        reject('error');
                    }
                })
                .catch(rej => {
                    reject(rej);
                });
        });
    }

    setMarkers(datas: any) {
        let promises = datas.map((data: any, idx: any) => {
            return this.getMarkerPositionByData(data);
        });
        Promise.all(promises)
            .then(res => {
                this.setState({
                    markers: res,
                });
            })
            .catch(rej => {
                console.warn(rej);
                this.setState({
                    markers: [],
                });
            });
    }

    getMarkers() {
        return new Promise((res, rej) => {
            setInterval(() => {
                res();
            }, 60000);
        }).then(res => {
            this.getDatasFromServer()
                .then(res => {
                    this.setMarkers(res);
                })
                .catch(rej => {
                    //  console.log('error');
                    //  console.log(rej);
                });
        });

        //   this.setMarkers(["47.96.67.93", "149.248.60.54"]);
    }

    markersEvents = {
        mouseover: (e: any, marker: any) => {
            let extData = marker.getExtData();
            this.setState({
                infoposition: extData.position,
                infovisible: true,
                ip: extData.ip,
                times: extData.times,
            });
        },
        mouseout: (e: any, marker: any) => {
            this.setState({
                infovisible: false,
            });
        },
    };

    equar(a: Array<object>, b: Array<object>) {
        // 判断数组的长度
        if (a.length !== b.length) {
            return false;
        } else {
            if (a.toLocaleString == b.toLocaleString) {
                return true;
            }
            return false;
        }
    }

    componentDidMount() {
        this.getDatasFromServer()
            .then(res => {
                this.setMarkers(res);
            })
            .catch(rej => {
                //  console.log('error');
                //  console.log(rej);
            });
    }

    public render() {
        return (
            <div className={this.props.className}>
                <Amap.Map amapkey={'5f52e2ccb793e9f4b9b79fdc258d78eb'} zoom={2}>
                    <Amap.Markers
                        markers={this.state.markers}
                        useCluster={true}
                        events={this.markersEvents}
                    />
                    <Amap.InfoWindow
                        isCustom={true}
                        position={this.state.infoposition}
                        visible={this.state.infovisible}
                        offset={[0, -20]}
                    >
                        <div className="infowindow">
                            <p>IP Address {this.state.ip}</p>
                            <p>Times {this.state.times}</p>
                        </div>
                    </Amap.InfoWindow>
                </Amap.Map>
            </div>
        );
    }
}
