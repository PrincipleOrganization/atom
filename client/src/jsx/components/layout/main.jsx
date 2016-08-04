import React from "react";

import Navbar from '../navbar/main.jsx';
import Tabs from '../tabs/main.jsx';

class MainLayout extends React.Component {
  render() {
    return (
      <div>
        <Navbar
          restartApplication={this.restartApplication}
          addNotification={this.props.addNotification}
          removeNotification={this.props.removeNotification}
        />
        <Tabs
          addNotification={this.props.addNotification}
          removeNotification={this.props.removeNotification}
        />
      </div>
    );
  }
}

export default MainLayout;
