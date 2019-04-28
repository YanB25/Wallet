import * as React from 'react';
import { Map } from 'app/components/common/map';
// TODO move from common
import { OrdersListItem } from 'app/components/common/orders-list-item';
import Axios from 'axios';
import { PlaceOrderBox } from 'app/components/common/place-order-box';
// TODO move from common?
import {
    ListHeader,
    IOrderable,
    IPageLimits,
} from 'app/components/common/list-header';
import { IOrder } from 'app/api/types';
import { MyProfilesStore } from '../../../stores/my-profiles';
import { WalletStore } from '../../../stores/wallet';

export interface IOrdersProps extends IOrderable, IPageLimits {
    className?: string;
    dataSource: Array<IOrder>;
    onClickRow: (orderId: string) => void;
    isListPending: boolean;
    filterPanel: React.ReactElement<any>;
    onRefresh?: () => void;
    myProfilesStore: MyProfilesStore;
    walletStore: WalletStore;
}

export class OrderListView extends React.PureComponent<IOrdersProps, any> {
    protected myProfilesStore: MyProfilesStore;
    protected walletStore: WalletStore;

    constructor(prop: IOrdersProps) {
        super(prop);
        this.state = {
            markers: [
                {
                    position: {
                        latitude: 36,
                        longitude: 117,
                    },
                },
                {
                    position: {
                        latitude: 38,
                        longitude: 118,
                    },
                },
            ],
        };
        this.getMarkers = this.getMarkers.bind(this);
        // automatically get Markers when this page is loaded.
        this.getMarkers();
        this.myProfilesStore = prop.myProfilesStore;
        this.walletStore = prop.walletStore;
    }

    getIPs() {
        return new Promise((resolve, reject) => {
            Axios.get('http://server.bensyan.top:8080/ip').then(res => {
                if (res.status == 200) {
                    let data = res.data.data;
                    let ips = new Array<string>();
                    data.map((obj: any, idx: any) => {
                        // if (obj.address != '127.0.0.1')
                        ips.push(obj.address);
                    });
                    resolve(ips);
                } else {
                    reject('error');
                }
            });
        });
    }

    getMarkerPositionByip(ip: object) {
        return new Promise((resolve, reject) => {
            Axios.get(
                'http://api.ipstack.com/' +
                    ip +
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
                            };
                            resolve(d);
                        } else {
                            let d = {
                                position: {
                                    latitude: 0,
                                    longitude: 0,
                                },
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

    setMarkers(ips: any) {
        let promises = ips.map((ip: any, idx: any) => {
            return this.getMarkerPositionByip(ip);
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
        this.getIPs()
            .then(res => {
                this.setMarkers(res);
            })
            .catch(rej => {
                console.log(rej);
            });
        //   this.setMarkers(["47.96.67.93", "149.248.60.54"]);
    }

    public render() {
        const p = this.props;
        return (
            <div>
                <button onClick={this.getMarkers}>getMarkers</button>
                <Map className="map" markers={this.state.markers} />

                <PlaceOrderBox
                    myProfilesStore={this.myProfilesStore}
                    walletStore={this.walletStore}
                />

                <div className="order-list">
                    <ListHeader
                        className="order-list__header"
                        orderBy={p.orderBy}
                        orderKeys={OrderListView.headerProps.orderKeys}
                        orderDesc={p.orderDesc}
                        onRefresh={p.onRefresh}
                        onChangeLimit={p.onChangeLimit}
                        onChangeOrder={p.onChangeOrder}
                        pageLimit={p.pageLimit}
                        pageLimits={OrderListView.headerProps.pageLimits}
                    />
                    <div className="order-list__list">
                        {p.dataSource.map((order, idx) => {
                            return (
                                <OrdersListItem
                                    order={order}
                                    key={order.id}
                                    className="order-list__list-item"
                                    onClick={this.handleClick}
                                />
                            );
                        })}
                    </div>
                    <div className="order-list__filter-panel">
                        {p.filterPanel}
                    </div>
                </div>
            </div>
        );
    }

    public handleClick = (order: IOrder) => {
        this.props.onClickRow(order.id);
    };

    public static readonly headerProps = {
        orderKeys: {
            redshiftGPU: 'Redshift Benchmark',
            ethHashrate: 'GPU Ethash',
            zcashHashrate: 'GPU Equihash',
            price: 'Price',
            duration: 'Duration',
        },
        pageLimits: [10, 25, 50, 100],
    };
}
