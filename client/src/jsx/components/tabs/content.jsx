import React from 'react';

import TableConfigs from '../tableConfigs/main.jsx';

class TabContent extends React.Component {
  getDivClass() {
    if (this.props.active) {
      return "tab-pane active";
    }
    return "tab-pane";
  }

  render() {
    let element = "test";
    if (this.props.id == 'configs') {
      element = <TableConfigs />;
    }

    return (
      <div class={this.getDivClass()} id={this.props.id}>
        {element}
      </div>
    );
  }
}

export default TabContent;
