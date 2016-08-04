import React from 'react';

class TablePluginRecord extends React.Component {
  render() {
    const { data, onClick } = this.props;

    return (
      <tr onClick={onClick.bind(null, data)}>
        <td>{data.name}</td>
      </tr>
    );
  }
}

export default TablePluginRecord;
