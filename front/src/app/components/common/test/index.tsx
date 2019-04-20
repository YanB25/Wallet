import * as React from 'react';

export interface ITestProps {
    data?: string;
    className?: string;
}

export class Test extends React.Component<ITestProps, never> {
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
                />
                <button onClick={this.testClick}> Test</button>
            </div>
        );
    }
}
