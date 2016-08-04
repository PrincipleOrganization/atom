import React from 'react';

class FormPlugin extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    operationId: null,
    recordData: {
      name: '',
      params: ''
    }
  };

  name;
  params;

  operationId;

  updateForm() {
    this.forceUpdate();
  }

  handleNameOnChange(event) {
    this.name = event.target.value;
    this.updateForm();
  }

  handleParamsOnChange(event) {
    this.params = event.target.value;
    this.updateForm();
  }

  render() {
    if (this.operationId != this.props.operationId) {
      this.name = '';
      this.params = '';

      Object.assign(this, this.props.recordData);
      this.operationId = this.props.operationId;
    }

    const { name, params } = this;

    return (
      <form class="form-horizontal">

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_name">Name</label>
          <div class="col-sm-11">
            <input type="text" class="form-control" id="input_name" value={name} onChange={this.handleNameOnChange.bind(this)} />
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_params">Code</label>
          <div class="col-sm-11">
            <textarea class="form-control" rows="20" id="input_params" value={params} onChange={this.handleParamsOnChange.bind(this)}></textarea>
          </div>

        </div>

      </form>
    );
  }
}

export default FormPlugin;
