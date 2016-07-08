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

  render() {
    const data = this.state.data;
    return (
      <div>
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <div class="navbar-header">
              <p class="navbar-brand">Atom</p>
              <p class="navbar-text">Version: {data.atom.version}; Product: {data.product}; Configuration: {data.configuration}</p>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
