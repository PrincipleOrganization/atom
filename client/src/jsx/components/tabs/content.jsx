import React from 'react';

import TableConfigs from '../tableConfigs/main.jsx';
import TableDevices from '../tableDevices/main.jsx';
import TablePlugins from '../tablePlugins/main.jsx';
import Dashboard    from '../dashboard/main.jsx';

class TabContent extends React.Component {
  getDivClass() {
    if (this.props.active) {
      return "tab-pane active";
    }
    return "tab-pane";
  }

  render() {
    let element = "test";
    if (this.props.id == 'dashboard') {
      element = <Dashboard />
    } else if (this.props.id == 'configs') {
      element = <TableConfigs
        addNotification={this.props.addNotification}
        removeNotification={this.props.removeNotification}
      />;
    } else if (this.props.id == 'devices') {
      element = <TableDevices
        addNotification={this.props.addNotification}
        removeNotification={this.props.removeNotification}
      />;
    } else if (this.props.id == 'plugins') {
      element = <TablePlugins
        addNotification={this.props.addNotification}
        removeNotification={this.props.removeNotification}
      />;
    }

    return (
      <div class={this.getDivClass()} id={this.props.id}>
        {element}
      </div>
    );
  }
}

export default TabContent;
