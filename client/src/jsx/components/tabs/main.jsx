import React from 'react';

import Tab from './tab.jsx';
import TabContent from './content.jsx';

class Tabs extends React.Component {
  constructor() {
    super();

    this.state = DEFAULT_STATE;
  }

  handleTabOnClick(tab) {
    let tabs = this.state.tabs;
    for (var i in tabs) {
      let curretTab = tabs[i];
      curretTab.active = false;
      if (curretTab.id == tab.props.id) {
        curretTab.active = true;
      }
    }

    let content = this.state.content;
    for (var i in content) {
      let curretContent = content[i];
      curretContent.active = false;
      if (curretContent.id == tab.props.id) {
        curretContent.active = true;
      }
    }

    this.setState({tabs: tabs, content: content});
  }

  render() {
    return (
      <div id="tabs">
        <ul  class="nav nav-tabs">
          {this.state.tabs.map((tab) => {
            return <Tab key={tab.id} name={tab.name} id={tab.id} active={tab.active} onClick={this.handleTabOnClick.bind(this)} />
          })}
        </ul>

        <div class="tab-content clearfix">
          {this.state.content.map((content) => {
            return <TabContent
              key={content.id}
              id={content.id}
              active={content.active}
              addNotification={this.props.addNotification}
              removeNotification={this.props.removeNotification}
            />
          })}
        </div>
      </div>
    );
  }
}

const DEFAULT_STATE = {
  tabs: [
    {
      name: 'Dashboard',
      id: 'dashboard',
      active: true
    },
    {
      name: 'Configurations',
      id: 'configs',
      active: false
    },
    {
      name: 'Devices',
      id: 'devices',
      active: false
    },
    {
      name: 'Plugins',
      id: 'plugins',
      active: false
    }
  ],
  content: [
    {
      id: 'dashboard',
      active: true
    },
    {
      id: 'configs',
      active: false
    },
    {
      id: 'devices',
      active: false
    },
    {
      id: 'plugins',
      active: false
    }
  ]
}

export default Tabs;
