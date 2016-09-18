import React from 'react';

class Tab extends React.Component {
  getLiClass() {
    if (this.props.active) {
      return `active`;
    } else {
      return ``;
    }
  }

  render() {
    return (
      <li class={this.getLiClass()}>
        <a role="presentation" id={this.props.id} data-toggle="tab" onClick={this.props.onClick.bind(null, this)}>{this.props.name}</a>
			</li>
    );
  }
}

export default Tab;
