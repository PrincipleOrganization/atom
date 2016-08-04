import React from 'react';
import axios from 'axios';

class Navbar extends React.Component {
  constructor() {
    super();

    this.state = {
      data: {
        atom: {
          version: ""
        },
        product: "",
        configuration: ""
      }
    };
  }

  componentDidMount() {
    const href = window.location.href;
    axios.get(`${href}api/info`)
    .then((response) => {
      const newState = {data: response.data.data};
      this.setState(newState);
    });
  }

  restartApplication() {
    const href = window.location.href;
    axios.get(`${href}api/restart`)
      .then((response) => {
        const data = response.data.data;
        if (data === true) {
          this.props.addNotification('Close the page if need.');
        }
      });
  }

  render() {
    const data = this.state.data;
    return (
      <div>
        <nav class="navbar navbar-default">
          <div class="container-fluid navbar-items">
            <div class="navbar-header">
              <p class="navbar-brand">Atom</p>
              <p class="navbar-text">Version: {data.atom.version}; Product: {data.product}; Configuration: {data.configuration}</p>
            </div>
            <div class="pull-right">
              <button class="btn btn-primary" id="btn-restart-server" onClick={this.restartApplication.bind(this)}>Restart</button>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
