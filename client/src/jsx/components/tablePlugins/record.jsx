import React from 'react';

class TablePluginRecord extends React.Component {
  render() {
    const { data, onClick } = this.props;

    return (
      <tr onClick={onClick.bind(null, data)}>
        <td>{data.vendor}</td>
        <td>{data.model}</td>
        <td>{data.tableName}</td>
      </tr>
    );
  }
}

export default TablePluginRecord;
