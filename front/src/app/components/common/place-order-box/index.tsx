// TODO: css not work. why?
import * as React from 'react';
import * as cn from 'classnames';
import { FormField } from '../form';
import { Input } from 'app/components/common/input';
import { IChangeParams } from 'app/components/common/types';
import { Button } from 'app/components/common/button';
import { MyProfilesStore } from 'app/stores/my-profiles';
import { WalletStore } from 'app/stores/wallet';
import { Password } from 'app/components/common/password';
// import { validatePositiveNumber } from 'app/utils/validation/validate-positive-number';

import * as sonmApi from 'sonm-api';
const { createSonmFactory } = sonmApi;

export interface ITestProps {
    nameTest?: string;
    contentTest?: string;
    className?: string;
    updateStateProp?: any;
    myProfilesStore: MyProfilesStore;
    walletStore: WalletStore;
}

export interface OrderData {
    price: string;
    duration: string;
    ram: string;
    cpucore: string;
    gpucnt: string;
    addr: string;
    passwd: string;
}

// TODO: should be deleted and find a place to locate config.
const ZERO_ADDRESS = '0x' + Array(41).join('0');
export class PlaceOrderBox extends React.Component<ITestProps, any> {
    constructor(props: any) {
        super(props);
        this.placeOrderData = {
            price: '',
            duration: '',
            ram: '',
            cpucore: '',
            gpucnt: '',
            addr: '',
            passwd: '',
        };
        this.myProfilesStore = props.myProfilesStore;
        this.walletStore = props.walletStore;
        this.benchmarks = Array(15).fill(0);
        this.URL_PRIVATE_CHAIN = props.walletStore.sidechainNodeUrl;
    }
    private URL_PRIVATE_CHAIN: string;

    protected myProfilesStore: MyProfilesStore;
    protected walletStore: WalletStore;

    protected benchmarks: Array<number>;

    protected placeOrderData: OrderData;
    // protected validateErr: string | undefined;

    protected placeOrder = async (event: any) => {
        let str = this.checkValid();
        if (str != undefined) {
            alert(str);
            return;
        }
        // console.log(this.placeOrderData);
        // console.log(this.myProfilesStore.accountList[0].json);
        const vasyaSidechainClient = createSonmFactory(
            this.URL_PRIVATE_CHAIN,
            'livenet',
            true,
        );
        const passwd = this.placeOrderData.passwd;
        let useraddr = this.placeOrderData.addr;
        const addr =
            useraddr == ''
                ? this.myProfilesStore.currentProfileAddress
                : useraddr;
        let pk;
        try {
            pk = await this.myProfilesStore.getPrivateKey(passwd, addr);
        } catch (err) {
            alert(err);
            return;
        }
        const price =
            this.placeOrderData.price == '' ? 0 : this.placeOrderData.price;
        const duration =
            this.placeOrderData.duration == ''
                ? 0
                : parseInt(this.placeOrderData.duration) * 60 * 60;

        // var sidechainVASYA = await vasyaSidechainClient.createAccount("5c865774723bf00895b3620700998906e58085fe");
        // vasyaSidechainClient.setPrivateKey("4dcfde06f6c12ad57eaeb968ff52dc810678a99e85bc2b2379e25bd4b67d5f65");
        try {
            var sidechainVASYA = await vasyaSidechainClient.createAccount(addr);
            vasyaSidechainClient.setPrivateKey(pk);
        } catch (err) {
            alert(err);
            return;
        }

        // console.log(this.benchmarks);

        const placeOrderObj = {
            orderType: 1,
            price: price,
            counterPartyId: ZERO_ADDRESS,
            duration: duration, // in second!
            identityLevel: 1, // how to match?
            blacklist: ZERO_ADDRESS,
            netflags: [true, true, true],
            // tag: 'app',
            benchmarks: this.benchmarks,
        };

        console.log(placeOrderObj);
        try {
            const res = await sidechainVASYA.createOrder(placeOrderObj);
            if (res.status != '0x0') {
                console.log(res);
                alert(`Successfully place order! tx is ${res.transactionHash}`);
            } else {
                console.log(`fail, res is ${res}`);
            }
        } catch (err) {
            alert(err);
        }
    };

    protected checkValid(): string | undefined {
        if (this.placeOrderData.price == '') {
            return 'price is empty!';
        }
        if (this.placeOrderData.passwd == '') {
            return 'password is empty!';
        }
        return undefined;
    }

    protected handleChangeInput = (params: IChangeParams<string>) => {
        // this.validate();

        const key = params.name as keyof OrderData;
        const value: OrderData[keyof OrderData] = params.value;
        console.log(`field ${key} change to ${value}`);
        this.placeOrderData[key] = value;
        // console.log(this.placeOrderData);
        if (value != '') {
            if (key == 'ram') {
                this.benchmarks[3] = parseFloat(value);
            }
            if (key == 'cpucore') {
                this.benchmarks[2] = parseFloat(value);
            }
            if (key == 'gpucnt') {
                this.benchmarks[7] = parseFloat(value);
            }
        }
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
                        <Password
                            name="passwd"
                            prefix="Pass"
                            onChange={this.handleChangeInput}
                        />

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

                        <Input
                            name="addr"
                            prefix="Address(Optional)"
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
