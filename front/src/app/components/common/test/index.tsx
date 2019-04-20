import * as React from 'react';

export interface ITestProps {
    data?: string;
    className?: string;
    updateStateProp?: any;
}

export class Test extends React.Component<ITestProps, any> {
    protected testClick = (event: any) => {
        alert(this.props.data);
    };

    public render() {
        return (
            <div>
                <input
                    type="text"
                    className={this.props.className}
                    value={this.props.data}
                    onChange={this.props.updateStateProp}
                />
                <button onClick={this.testClick}> Test</button>
            </div>
        );
    }
}
