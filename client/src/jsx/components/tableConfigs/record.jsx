import React from 'react';

class TableConfigRecord extends React.Component {
  render() {
    const { data, onClick } = this.props;

    let use = '';
    if (data.use) {
      use = <i class="fa fa-check" aria-hidden="true"></i>;
    }

    let socketsUse = '';
    if (data.sockets.use) {
      socketsUse = <i class="fa fa-check" aria-hidden="true"></i>;
    }

    let intervalCommandsUse = '';
    if (data.intervalCommands.use) {
      intervalCommandsUse = <i class="fa fa-check" aria-hidden="true"></i>;
    }

    return (
      <tr onClick={onClick.bind(null, data)}>
        <td>{use}</td>
        <td>{data.name}</td>
        <td>{data.port.prod}</td>
        <td>{data.db.vendor}</td>
        <td>{data.db.host}</td>
        <td>{data.db.port}</td>
        <td>{data.db.base.prod}</td>
        <td>{data.db.maxCount}</td>
        <td>{socketsUse}</td>
        <td>{data.sockets.port}</td>
        <td>{intervalCommandsUse}</td>
        <td>{data.intervalCommands.interval}</td>
      </tr>
    );
  }
}

export default TableConfigRecord;
