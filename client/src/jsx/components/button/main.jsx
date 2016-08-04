import React from 'react';

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    cssClass: 'btn-default',
    id: Math.random().toString(),
    text: 'Button'
  }

  static propTypes = {
    cssClass: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired
  }

  handleOnClick() {
    if (this.props.onClick) {
      this.props.onClick(this);
    } else {
      console.log(`Button ${this.props.id} was cliked.`);
    }
  }

  render() {
    const cssClass = `btn ${this.props.cssClass}`;

    return (
      <button id={this.props.id} class={cssClass} onClick={this.handleOnClick.bind(this)}>
        {this.props.text}
        {this.props.children}
      </button>
    );
  }
}

export default Button;
