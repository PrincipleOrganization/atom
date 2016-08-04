import React from "react";
import ReactDOM from "react-dom";
import { NotificationStack } from "react-notification";

import MainLayout from "../layout/main.jsx";

class Application extends React.Component {
  constructor() {
    super();

    this.state = {
      notifications: [],
      count: 0
    };

    this.removeNotification = this.removeNotification.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }

  styleFactory(index, style) {
    return Object.assign(
      {},
      style,
      { bottom: `${2 + index * 6}rem` }
    );
  }

  addNotification(message) {
    const { notifications, count } = this.state;
    const newCount = count + 1;

    const newNotification = {
      message,
      key: newCount,
      dismissAfter: 3400,
      onClick: () => this.removeNotification(newCount),
    };

    notifications.push(newNotification);

    this.setState({
      count: newCount,
      notifications
    });
  }

  removeNotification (count) {
    const { notifications } = this.state;
    for (var i=0; i < notifications.length; i++) {
      const currentNotification = notifications[i];
      if (currentNotification.key == count) {
        notifications.splice(i, 1);
      }
    }
    this.setState({ ...this.state, notifications });
  }

  handleNotificationDismiss(notification) {
    this.removeNotification(notification.key);
  }

  render() {
    const { notifications } = this.state;

    return (
    <div>
      <MainLayout
        addNotification={this.addNotification}
        removeNotification={this.removeNotification}
      />

      <NotificationStack
          notifications={notifications}
          onDismiss={this.handleNotificationDismiss.bind(this)}
          barStyleFactory={this.styleFactory}
          activeBarStyleFactory={this.styleFactory}
        />
    </div>
    );
  }
}

const app = document.getElementById("app");
ReactDOM.render(<Application />, app);
