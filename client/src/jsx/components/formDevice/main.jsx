import React from 'react';

class FormDevice extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    operationId: null,
    recordData: {
      name: '',
      path: '',
      tableName: '',
      vendor: '',
      model: '',
      units: '',
      baudRate: '9600',
      dataBits: '8',
      stopBits: '1',
      parity: 'none',
      rtscts: '0',
      xon: '0',
      xoff: '0',
      xany: '0',
      flowControl: '0',
      bufferSize: '65536',
      use: false
    }
  };

  name;
  path;
  tableName;
  vendor;
  model;
  units;
  baudRate;
  dataBits;
  stopBits;
  parity;
  rtscts;
  xon;
  xoff;
  xany;
  flowControl;
  bufferSize;
  use;

  operationId;

  updateForm() {
    this.forceUpdate();
  }

  handleCheckboxUseOnChange(event) {
    this.use = !this.use;
    this.updateForm();
  }

  handleNameOnChange(event) {
    this.name = event.target.value;
    this.updateForm();
  }

  handlePathOnChange(event) {
    this.path = event.target.value;
    this.updateForm();
  }

  handleTableOnChange(event) {
    this.tableName = event.target.value;
    this.updateForm();
  }

  handleVendorOnChange(event) {
    this.vendor = event.target.value;
    this.updateForm();
  }

  handleModelOnChange(event) {
    this.model = event.target.value;
    this.updateForm();
  }

  handleUnitsOnChange(event) {
    this.units = event.target.value;
    this.updateForm();
  }

  handleBaudRateOnChange(event) {
    this.baudRate = event.target.value;
    this.updateForm();
  }

  handleDataBitsOnChange(event) {
    this.dataBits = event.target.value;
    this.updateForm();
  }

  handleStopBitsOnChange(event) {
    this.stopBits = event.target.value;
    this.updateForm();
  }

  handleParityOnChange(event) {
    this.parity = event.target.value;
    this.updateForm();
  }

  handleRTSCTSOnChange(event) {
    this.rtscts = event.target.value;
    this.updateForm();
  }

  handleXONOnChange(event) {
    this.xon = event.target.value;
    this.updateForm();
  }

  handleXOFFOnChange(event) {
    this.xoff = event.target.value;
    this.updateForm();
  }

  handleXANYOnChange(event) {
    this.xany = event.target.value;
    this.updateForm();
  }

  handleFlowControlOnChange(event) {
    this.flowControl = event.target.value;
    this.updateForm();
  }

  handleBufferSizeOnChange(event) {
    this.bufferSize = event.target.value;
    this.updateForm();
  }

  render() {
    if (this.operationId != this.props.operationId) { // if 'true' then init 'this'
      this.name = "";
      this.path = "";
      this.tableName = "";
      this.vendor = "";
      this.model = "";
      this.units = "";
      this.baudRate = "9600";
      this.dataBits = "8";
      this.stopBits = "1";
      this.parity = "none";
      this.rtscts = "0";
      this.xon = "0";
      this.xoff = "0";
      this.xany = "0";
      this.flowControl = "0";
      this.bufferSize = "65536";
      this.use = "";

      Object.assign(this, this.props.recordData);
      this.operationId = this.props.operationId;
    }

    const { name, path, tableName, vendor, model, units, baudRate, dataBits, stopBits, parity, rtscts, xon, xoff, xany, flowControl, bufferSize, use, operationId } = this;

    return (
      <form class="form-horizontal">

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_name">Name</label>

          <div class="col-sm-11">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="name" id="input_use" checked={!!use} onChange={this.handleCheckboxUseOnChange.bind(this)} />
              </span>
              <input type="text" class="form-control" aria-label="name" id="input_name" value={name} onChange={this.handleNameOnChange.bind(this)} />
            </div>
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_host">Path</label>

          <div class="col-sm-5">
            <input type="text" class="form-control" id="input_path" value={path} onChange={this.handlePathOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_table">Table</label>

          <div class="col-sm-5">
            <input type="text" class="form-control" id="input_table" value={tableName} onChange={this.handleTableOnChange.bind(this)} />
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_vendor">Vendor</label>

          <div class="col-sm-5">
            <input type="text" class="form-control" id="input_vendor" value={vendor} onChange={this.handleVendorOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_model">Model</label>

          <div class="col-sm-5">
            <input type="text" class="form-control" id="input_model" value={model} onChange={this.handleModelOnChange.bind(this)} />
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_units">Units</label>

          <div class="col-sm-2">
            <input type="text" class="form-control" id="input_units" value={units} onChange={this.handleUnitsOnChange.bind(this)} />
          </div>

        </div>

        <div class="well well-sm">Serial Port Settings</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_baud_rate">Baud rate</label>

          <div class="col-sm-2">
            <input type="text" class="form-control" id="input_baud_rate" value={baudRate} onChange={this.handleBaudRateOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_data_bits">Data bits</label>

          <div class="col-sm-1">
            <input type="text" class="form-control" id="input_data_bits" value={dataBits} onChange={this.handleDataBitsOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_stop_bits">Stop bits</label>

          <div class="col-sm-1">
            <input type="text" class="form-control" id="input_stop_bits" value={stopBits} onChange={this.handleStopBitsOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_parity">Parity</label>

          <div class="col-sm-2">
            <input type="text" class="form-control" id="input_parity" value={parity} onChange={this.handleParityOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_rtscts">RSTSCTS</label>

          <div class="col-sm-1">
            <input type="text" class="form-control" id="input_rtscts" value={rtscts} onChange={this.handleRTSCTSOnChange.bind(this)} />
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_buffer_size">Buffer size</label>

          <div class="col-sm-2">
            <input type="text" class="form-control" id="inpup_buffer_size" value={bufferSize} onChange={this.handleBufferSizeOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_xon">XON</label>

          <div class="col-sm-1">
            <input type="text" class="form-control" id="input_xon" value={xon} onChange={this.handleXONOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_xoff">XOFF</label>

          <div class="col-sm-1">
            <input type="text" class="form-control" id="input_xoff" value={xoff} onChange={this.handleXOFFOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="input_xany">XANY</label>

          <div class="col-sm-1">
            <input type="text" class="form-control" id="input_xany" value={xany} onChange={this.handleXANYOnChange.bind(this)} />
          </div>

          <label class="col-sm-2 control-label" for="input_flow_control">Flow control</label>

          <div class="col-sm-1">
            <input type="text" class="form-control" id="input_flow_control" value={flowControl} onChange={this.handleFlowControlOnChange.bind(this)} />
          </div>

        </div>

      </form>
    );
  }
}

export default FormDevice;
