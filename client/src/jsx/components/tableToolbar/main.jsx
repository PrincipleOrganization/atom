import React from 'react';

import Toolbar from '../toolbar/main.jsx';
import Button from '../button/main.jsx';

class TableToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    addNewRecord: function() {
      console.log('addNewRecord function is blank.');
    }
  }

  static propTypes = {
    table: React.PropTypes.string.isRequired
  }

  addNewRecord(button) {
    this.props.addNewRecord(button);
  }

  render() {
    const addBtnId = `${this.props.table}_AddNewRecord`;

    return (
      <Toolbar>
        <Button id={addBtnId} cssClass='btn-primary' text='Add' onClick={this.addNewRecord.bind(this)}>
          <i class="fa fa-plus icon" aria-hidden="true"></i>
        </Button>
      </Toolbar>
    );
  }
}

export default TableToolbar;
