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
            name: this.props.nameTest,
            content: this.props.contentTest,
        };
        alert(o);
    };

    public render() {
        return (
            <div>
                <input
                    type="text"
                    className={this.props.className}
                    value={this.props.nameTest}
                    name="name"
                    onChange={this.props.updateStateProp}
                />
                <span> name</span>
                <input
                    type="text"
                    className={this.props.className}
                    value={this.props.contentTest}
                    name="content"
                    onChange={this.props.updateStateProp}
                />
                <span> content</span>
                <button onClick={this.testClick}> Test</button>
            </div>
        );
    }
}
