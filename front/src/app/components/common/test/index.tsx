// TODO: css not work. why?
import * as React from 'react';
import * as cn from 'classnames';
import { FormField } from '../form';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';
import { Button } from 'app/components/common/button';

export interface ITestProps {
    nameTest?: string;
    contentTest?: string;
    className?: string;
    updateStateProp?: any;
}

export interface OrderData {
    price: string;
    other: string;
}

export class Test extends React.Component<ITestProps, any> {
    constructor(props: any) {
        super(props);
        this.placeOrderData = {
            price: '',
            other: '',
        };
    }

    protected placeOrderData: OrderData;

    protected placeOrder = (event: any) => {
        console.log(this.placeOrderData);
    };
    protected handleChangeInput = (params: IChangeParams<string>) => {
        const key = params.name as keyof OrderData;
        const value: OrderData[keyof OrderData] = params.value;
        console.log(`field ${key} change to ${value}`);
        this.placeOrderData[key] = value;
        console.log(this.placeOrderData);
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
                            name="other"
                            prefix="Other"
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
