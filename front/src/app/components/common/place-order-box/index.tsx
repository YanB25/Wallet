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

export interface BenchmarkDictType {
    [name: string]: {
        // [id: string, ratio: string] : number,
        // [ratio: string] : number,
        id: number;
        ratio: number;
    };
}
export interface ITestProps {
    nameTest?: string;
    contentTest?: string;
    className?: string;
    updateStateProp?: any;
    myProfilesStore: MyProfilesStore;
    walletStore: WalletStore;
    benchmarkDict?: BenchmarkDictType;
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
        this.benchmarkDict = {
            'cpu-sysbench-multi': { id: 0, ratio: 1 },
            'cpu-sysbench-single': { id: 1, ratio: 1 },
            'cpu-cores': { id: 2, ratio: 1 },
            'ram-size': { id: 3, ratio: 1e6 },
            'storage-size': { id: 4, ratio: 1e6 },
            'net-download': { id: 5, ratio: 1e6 },
            'net-upload': { id: 6, ratio: 1e6 },
            'gpu-count': { id: 7, ratio: 1 },
            'gpu-mem': { id: 8, ratio: 1e6 },
            'gpu-eth-hashrate': { id: 9, ratio: 1 },
            'gpu-cash-hashrate': { id: 10, ratio: 1 },
            'gpu-redshift': { id: 11, ratio: 1 },
            'cpu-cryptonight': { id: 12, ratio: 1 },
            'gpu-nvidia': { id: 13, ratio: 1 },
            'gpu-radeon': { id: 14, ratio: 1 },
            // currently do not include below one
            // "gpu-cuckaroo29": {id: 15},
        };
    }
    private URL_PRIVATE_CHAIN: string;

    protected myProfilesStore: MyProfilesStore;
    protected walletStore: WalletStore;

    protected benchmarks: Array<number>;

    protected placeOrderData: OrderData;
    protected benchmarkDict: BenchmarkDictType;
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
            this.placeOrderData.price == ''
                ? 0
                : // int the `market.sol`, rate.mul(_price).mul(_period).div(1e18) is the `lockedSum`,
                  // where rate is 1.
                  (parseFloat(this.placeOrderData.price) * 1e18) / 3600;
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
        console.log(key);
        if (key in this.benchmarkDict) {
            let id: number = this.benchmarkDict[key].id;
            let ratio: number = this.benchmarkDict[key].ratio;
            this.benchmarks[id] = parseFloat(value) * ratio;
            console.log(this.benchmarks);
        } else {
            this.placeOrderData[key] = value;
            console.log(this.placeOrderData);
        }
        // if (key == 'ram') {
        //     this.benchmarks[3] = parseFloat(value);
        // }
        // if (key == 'cpucore') {
        //     this.benchmarks[2] = parseFloat(value);
        // }
        // if (key == 'gpucnt') {
        //     this.benchmarks[7] = parseFloat(value);
        // }
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
                            prefix="Price(USD/h)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="duration"
                            prefix="Duration(h)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="cpu-sysbench-multi"
                            prefix="multiple CPU benchmark"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="cpu-sysbench-single"
                            prefix="single CPU benchmark"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="cpu-cores"
                            prefix="Cores(n)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="ram-size"
                            prefix="Ram(MB)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="storage-size"
                            prefix="Storage(MB)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="net-download"
                            prefix="download(Mbps)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="net-upload"
                            prefix="upload(Mbps)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="gpu-count"
                            prefix="GPUs(n)"
                            onChange={this.handleChangeInput}
                        />
                        <Input
                            name="gpu-mem"
                            prefix="GPU mem(MB)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="gpu-eth-hashrate"
                            prefix="GPU eth(Hz/s)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="gpu-cash-hashrate"
                            prefix="GPU cash(sol/s)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="gpu-redshift"
                            prefix="GPU Redshift(K/Ex.)"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="cpu-cryptonight"
                            prefix="CPU Cryptonight"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="gpu-nvidia"
                            prefix="is Nvidia"
                            onChange={this.handleChangeInput}
                        />

                        <Input
                            name="gpu-radeon"
                            prefix="GPU Radeon"
                            onChange={this.handleChangeInput}
                        />
                        {/* currently do not include below one */}
                        {/* <Input 
                            name="gpu-cuckaroo29"
                            prefix="GPU Cuckaroo29"
                            onChange={this.handleChangeInput}
                            /> */}

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
