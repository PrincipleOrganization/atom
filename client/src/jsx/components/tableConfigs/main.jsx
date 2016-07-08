import React from 'react';
import axios from 'axios';

import TableConfigsRecord from './record.jsx';

class Table extends React.Component {
  constructor() {
    super();

    this.state = {data: []};
  }

  componentDidMount() {
    const href = window.location.href;
    axios.get(`${href}api/settings/configs`)
    .then((response) => {
      const data = response.data.data;
      this.setState({data: data});
    });
  }

  render() {
    return (
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Use</th>
            <th>Name</th>
            <th>Port</th>
            <th>DB vendor</th>
            <th>DB host</th>
            <th>DB port</th>
            <th>DB base</th>
            <th>Max number of records</th>
            <th>Use sockets</th>
            <th>Socket's server port</th>
            <th>Use interval commands</th>
            <th>Time of interval commands</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((rec) => {
            return <TableConfigsRecord key={rec.name} data={rec} />
          })}
        </tbody>
      </table>
    );
  }
}

export default Table;
