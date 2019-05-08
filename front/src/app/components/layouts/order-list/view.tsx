import * as React from 'react';
import { Map } from 'app/components/common/map';
// TODO move from common
import { OrdersListItem } from 'app/components/common/orders-list-item';
//import Axios from 'axios';
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
        this.myProfilesStore = prop.myProfilesStore;
        this.walletStore = prop.walletStore;
    }

    public render() {
        const p = this.props;
        return (
            <div>
                <Map className="map" />

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
