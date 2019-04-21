import * as React from 'react';

export interface ITestProps {
    nameTest?: string;
    contentTest?: string;
    className?: string;
    updateStateProp?: any;
}

export class Test extends React.Component<ITestProps, any> {
    protected testClick = (event: any) => {
        let o = {
            nameTest: this.props.nameTest,
            contentTest: this.props.contentTest,
        };
        console.log(o);
    };

    public render() {
        return (
            <div>
                <input
                    type="text"
                    className={this.props.className}
                    value={this.props.nameTest}
                    name="nameTest"
                    onChange={this.props.updateStateProp}
                />
                <span> name</span>
                <input
                    type="text"
                    className={this.props.className}
                    value={this.props.contentTest}
                    name="contentTest"
                    onChange={this.props.updateStateProp}
                />
                <span> content</span>
                <button onClick={this.testClick}> Test</button>
            </div>
        );
    }
}
