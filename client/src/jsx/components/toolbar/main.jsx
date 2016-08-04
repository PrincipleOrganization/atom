import React from 'react';

class Toolbar extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div class="btn-toolbar" role="toolbar">
        {this.props.children}
      </div>
    );
  }
}

export default Toolbar;
