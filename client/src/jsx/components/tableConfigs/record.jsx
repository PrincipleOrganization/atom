import React from 'react';

class TableConfigsRecord extends React.Component {
  render() {
    const data = this.props.data;

    return (
      <tr>
        <td>{data.use}</td>
        <td>{data.name}</td>
        <td>{data.port.prod}</td>
        <td>{data.db.vendor}</td>
        <td>{data.db.host}</td>
        <td>{data.db.port}</td>
        <td>{data.db.base.prod}</td>
        <td>{data.db.maxCount}</td>
        <td>{data.sockets.use}</td>
        <td>{data.sockets.port}</td>
        <td>{data.intervalCommands.use}</td>
        <td>{data.intervalCommands.interval}</td>
      </tr>
    );
  }
}

export default TableConfigsRecord;
