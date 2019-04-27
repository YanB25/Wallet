// TODO: css not work. why?
import * as React from 'react';
import * as cn from 'classnames';
import { FormField } from '../form';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';
import { Button } from 'app/components/common/button';
import { MyProfilesStore } from 'app/stores/my-profiles';

export interface ITestProps {
    nameTest?: string;
    contentTest?: string;
    className?: string;
    updateStateProp?: any;
    myProfilesStore: MyProfilesStore;
}

export interface OrderData {
    price: string;
    duration: string;
    ram: string;
    cpucore: string;
    gpucnt: string;
}

export class PlaceOrderBox extends React.Component<ITestProps, any> {
    constructor(props: any) {
        super(props);
        this.placeOrderData = {
            price: '',
            duration: '',
            ram: '',
            cpucore: '',
            gpucnt: '',
        };
        this.myProfilesStore = props.myProfilesStore;
    }

    protected myProfilesStore: MyProfilesStore;

    protected placeOrderData: OrderData;

    protected placeOrder = (event: any) => {
        console.log(this.placeOrderData);
        console.log(this.myProfilesStore.accountList[0].json);
    };
    protected handleChangeInput = (params: IChangeParams<string>) => {
        const key = params.name as keyof OrderData;
        const value: OrderData[keyof OrderData] = params.value;
        console.log(`field ${key} change to ${value}`);
        this.placeOrderData[key] = value;
        // console.log(this.placeOrderData);
    };

    public render() {
        let p = this.props;

        return (
            <div className={cn('order-filter-panel-place', p.className)}>
                <div className="order-filter-panel-place__filters">
                    <h3 className="order-filter-panel-place__header">
                        Place Order
                    </h3>
                    <FormField className="order-filter-panel-place__address">
                        <Input
                            name="price"
                            prefix="Price"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="duration"
                            prefix="Duration(h)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="ram"
                            prefix="Ram"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="cpucore"
                            prefix="CPU"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="gpucnt"
                            prefix="GPU"
                            onChange={this.handleChangeInput}
                        />
                    </FormField>
                    <Button square onClick={this.placeOrder}>
                        Place Order
                    </Button>
                </div>
            </div>
        );
    }
}
