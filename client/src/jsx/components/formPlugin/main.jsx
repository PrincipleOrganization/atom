import React from 'react';

class FormPlugin extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    operationId: null,
    recordData: {
      id: '',
      tableName: '',
      model: '',
      vendor: '',
      executeFunction: '',
      params: ''
    }
  };

  id;
  tableName;
  model;
  vendor;
  executeFunction;
  params;

  operationId;

  updateForm() {
    this.forceUpdate();
  }

  handleInputOnChange(event) {
    this[event.target.id] = event.target.value;
    this.updateForm();
  }

  render() {
    if (this.operationId != this.props.operationId) {
      this.id = '';
      this.tableName = '';
      this.model = '';
      this.vendor = '';
      this.executeFunction = '';
      this.params = '';

      Object.assign(this, this.props.recordData);
      this.operationId = this.props.operationId;
    }

    const { id, tableName, model, vendor, executeFunction, params } = this;

    return (
      <form class="form-horizontal">

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_name">Vendor</label>
          <div class="col-sm-3">
            <input type="text" class="form-control" id="vendor" value={vendor} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_name">Model</label>
          <div class="col-sm-3">
            <input type="text" class="form-control" id="model" value={model} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_name">Table</label>
          <div class="col-sm-3">
            <select id="tableName" value={tableName} onChange={this.handleInputOnChange.bind(this)} class="form-control">
              <option value='weight'>Weight</option>
              <option value='sensor'>Sensor</option>
            </select>
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_params">Function</label>
          <div class="col-sm-11">
            <textarea class="form-control" rows="10" id="executeFunction" value={executeFunction} onChange={this.handleInputOnChange.bind(this)}></textarea>
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_params">Params</label>
          <div class="col-sm-11">
            <textarea class="form-control" rows="10" id="params" value={params} onChange={this.handleInputOnChange.bind(this)}></textarea>
          </div>

        </div>

      </form>
    );
  }
}

export default FormPlugin;
