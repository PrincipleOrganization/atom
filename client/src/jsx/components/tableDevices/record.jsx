import React from 'react';

class TableDeviceRecord extends React.Component {
  render() {
    const { data, onClick } = this.props;

    let use = '';
    if (data.use) {
      use = <i class="fa fa-check" aria-hidden="true"></i>;
    }

    return (
      <tr onClick={onClick.bind(null, data)}>
        <td>{use}</td>
        <td>{data.name}</td>
        <td>{data.path}</td>
        <td>{data.tableName}</td>
        <td>{data.vendor}</td>
        <td>{data.model}</td>
        <td>{data.units}</td>
        <td>{data.baudRate}</td>
        <td>{data.dataBits}</td>
        <td>{data.stopBits}</td>
        <td>{data.parity}</td>
        <td>{data.rtscts}</td>
        <td>{data.xon}</td>
        <td>{data.xoff}</td>
        <td>{data.xany}</td>
        <td>{data.flowControl}</td>
        <td>{data.bufferSize}</td>
      </tr>
    );
  }
}

export default TableDeviceRecord;
