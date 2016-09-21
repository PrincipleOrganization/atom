import React from 'react';

class FormDevice extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    operationId: null,
    recordData: {
      id: '',
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

  id;
  name;
  path;
  tableName = 'weight';
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
  use = false;

  operationId;

  updateForm() {
    this.forceUpdate();
  }

  handleInputOnChange(event) {
    if (event.target.id == 'use') {
      this.use = !this.use;
    } else if (event.target.id == 'bufferSize') {
      let value = event.target.value;
      if (value > 65536) {
        value = 65536;
      } else if (value < 1) {
        value = 1;
      }
      this.bufferSize = value;
    } else {
      this[event.target.id] = event.target.value;
    }
    this.updateForm();
  }

  render() {
    if (this.operationId != this.props.operationId) { // if 'true' then init 'this'
      this.id = "";
      this.name = "";
      this.path = "";
      this.tableName = "weight";
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
      this.use = false;

      Object.assign(this, this.props.recordData);
      this.operationId = this.props.operationId;
    }

    const { id, name, path, tableName, vendor, model, units, baudRate, dataBits, stopBits, parity, rtscts, xon, xoff, xany, flowControl, bufferSize, use, operationId } = this;

    return (
      <form class="form-horizontal">

        <div class="form-group">

          <label class="col-sm-1 control-label" for="name">Name</label>

          <div class="col-sm-11">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="name" id="use" checked={!!use} onChange={this.handleInputOnChange.bind(this)} />
              </span>
              <input type="text" class="form-control" aria-label="name" id="name" value={name} onChange={this.handleInputOnChange.bind(this)} />
            </div>
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="path">Path</label>

          <div class="col-sm-5">
            <input type="text" class="form-control" id="path" value={path} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="tableName">Table</label>

          <div class="col-sm-5">
            <select id="tableName" value={tableName} onChange={this.handleInputOnChange.bind(this)} class="form-control">
              <option value='weight'>Weight</option>
              <option value='sensor'>Sensor</option>
            </select>
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="vendor">Vendor</label>

          <div class="col-sm-5">
            <input type="text" class="form-control" id="vendor" value={vendor} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="model">Model</label>

          <div class="col-sm-5">
            <input type="text" class="form-control" id="model" value={model} onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="units">Units</label>

          <div class="col-sm-2">
            <input type="text" class="form-control" id="units" value={units} onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>

        <div class="well well-sm">Serial Port Settings</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="baudRate">Baud rate</label>

          <div class="col-sm-2">
            <select class="form-control" id="baudRate" value={baudRate} onChange={this.handleInputOnChange.bind(this)}>
              <option value="115200">115200</option>
              <option value="57600">57600</option>
              <option value="38400">38400</option>
              <option value="19200">19200</option>
              <option value="14400">14400</option>
              <option value="9600">9600</option>
              <option value="4800">4800</option>
              <option value="2400">2400</option>
              <option value="1200">1200</option>
              <option value="300">300</option>
              <option value="110">110</option>
            </select>
          </div>

          <label class="col-sm-1 control-label" for="dataBits">Data bits</label>

          <div class="col-sm-2">
            <select class="form-control" id="dataBits" value={dataBits} onChange={this.handleInputOnChange.bind(this)}>
              <option value="8">8</option>
              <option value="7">7</option>
              <option value="6">6</option>
              <option value="5">5</option>
            </select>
          </div>

          <label class="col-sm-1 control-label" for="stopBits">Stop bits</label>

          <div class="col-sm-2">
            <select class="form-control" id="stopBits" value={stopBits} onChange={this.handleInputOnChange.bind(this)}>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          <label class="col-sm-1 control-label" for="parity">Parity</label>

          <div class="col-sm-2">
            <select class="form-control" id="parity" value={parity} onChange={this.handleInputOnChange.bind(this)}>
              <option value="none">none</option>
              <option value="even">even</option>
              <option value="mark">mark</option>
              <option value="odd">odd</option>
              <option value="space">space</option>
            </select>
          </div>


        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="flowControl">Flow control</label>

          <div class="col-sm-8">
            <input type="text" class="form-control" id="flowControl" value={flowControl} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="rtscts">RSTSCTS</label>

          <div class="col-sm-2">
            <input type="number" class="form-control" id="rtscts" value={rtscts} onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>


        <div class="form-group">

          <label class="col-sm-1 control-label" for="xon">XON</label>

          <div class="col-sm-3">
            <input type="number" class="form-control" id="xon" value={xon} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="xoff">XOFF</label>

          <div class="col-sm-3">
            <input type="number" class="form-control" id="xoff" value={xoff} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-1 control-label" for="xany">XANY</label>

          <div class="col-sm-3">
            <input type="number" class="form-control" id="xany" value={xany} onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>

        <div class='form-group'>

          <label class="col-sm-1 control-label" for="bufferSize">Buffer size</label>

          <div class="col-sm-2">
            <input type="number" class="form-control" id="bufferSize"
              max="65536"
              min="1"
              value={bufferSize}  onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>

      </form>
    );
  }
}

export default FormDevice;
