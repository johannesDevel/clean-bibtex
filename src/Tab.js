import React, { Component } from "react";
import ErrorIcon from '../src/icons/Error';
import OKIcon from '../src/icons/Exito';

// import PropTypes from 'prop-types';

class Tab extends Component {
  onClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  };

  render() {
    const {
      onClick,
      props: { activeTab, label, status }
    } = this;

    let className = "tab-list-item";

    if (activeTab === label) {
      className += " tab-list-active";
    }

    return (
      <li className={className} onClick={onClick}>
        {`${label} `}
        {status
        ? <OKIcon width="20px" height="20px" />
        : <ErrorIcon width="20px" height="20px" />
        }
      </li>
    );
  }
}

export default Tab;
