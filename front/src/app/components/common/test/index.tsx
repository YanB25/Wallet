import * as React from 'react';

export interface ITestProps {
    data?: any;
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
                    value={this.props.data.name}
                    onChange={this.props.updateStateProp}
                />
                <span> name</span>
                <input
                    type="text"
                    className={this.props.className}
                    value={this.props.data.content}
                    onChange={this.props.updateStateProp}
                />
                <span> content</span>
                <button onClick={this.testClick}> Test</button>
            </div>
        );
    }
}
