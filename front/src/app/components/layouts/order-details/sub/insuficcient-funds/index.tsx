import * as React from 'react';
import Button from 'app/components/common/button';

export interface IInsuficcientFundsProps {
    onBack: () => void;
    onDeposit: () => void;
}

export class InsuficcientFunds extends React.Component<
    IInsuficcientFundsProps,
    never
> {
    public render() {
        const p = this.props;
        return (
            <div className="insuficcient-funds">
                <h4 className="insuficcient-funds__header">
                    Insufficient funds for a deal
                </h4>
                <div className="insuficcient-funds__message">
                    Choose another order or replenish your deposit
                </div>
                <Button
                    className="insuficcient-funds__button-deposit"
                    onClick={p.onDeposit}
                >
                    DEPOSIT
                </Button>
                <Button
                    className="insuficcient-funds__button-back"
                    onClick={p.onBack}
                >
                    BACK
                </Button>
            </div>
        );
    }
}
