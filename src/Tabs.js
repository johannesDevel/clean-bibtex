import React, { Component } from "react";
import Tab from "./Tab";

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[0].props.label,
    };
  }

  onClickTab = tab => this.setState({ activeTab: tab });

  render() {
    const {
      onClickTab,
      props: { children },
      state: { activeTab }
    } = this;

    return (
      <div className="tabs">
        <ol className="tab-list">
          {children.map(child => {
            const { label, status } = child.props;
            return (
              <Tab
                activeTab={activeTab}
                key={label}
                label={label}
                onClick={onClickTab}
                status={status}
              />
            );
          })}
        </ol>
        <div className="tab-content">
          {children.map(child => {
            if (child.props.label !== activeTab) {
              return undefined;
            }
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}
export default Tabs;
