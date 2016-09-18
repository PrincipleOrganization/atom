import React from 'react';

class FormConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    operationId: null,
    recordData: {
      id: '',
      name: '',
      portProd: '4001',
      dbVendor: 'flow',
      dbHost: '127.0.0.1',
      dbPort: '30000',
      dbBaseProd: 'local',
      dbMaxCount: '1000000',
      socketsUse: true,
      socketsPort: '4002',
      intervalCommandsUse: true,
      intervalCommandsInterval: '1000',
      use: false
    }
  };

  id;
  name = '';
  portProd = '4001';
  dbVendor = 'flow';
  dbHost = '127.0.0.1';
  dbPort = '30000';
  dbBaseProd = 'local';
  dbMaxCount = '1000000';
  socketsUse = true;
  socketsPort = '4002';
  intervalCommandsUse = true;
  intervalCommandsInterval = '1000';
  use = false;

  operationId;

  updateForm() {
    this.forceUpdate();
  }

  handleInputOnChange(event) {
    if (event.target.id == 'use' || event.target.id == 'socketsUse' || event.target.id == 'intervalCommandsUse') {
      this[event.target.id] = !this[event.target.id];
    } else {
      this[event.target.id] = event.target.value;
    }
    this.updateForm();
  }

  render() {
    if (this.operationId != this.props.operationId) {
      const recordData = this.props.recordData;
      if (recordData.id) {
        this.id = recordData.id;
        this.name = recordData.name;
        this.portProd = recordData.port.prod;
        this.dbVendor = recordData.db.vendor;
        this.dbHost = recordData.db.host;
        this.dbPort = recordData.db.port;
        this.dbBaseProd = recordData.db.base.prod;
        this.dbMaxCount = recordData.db.maxCount;
        this.socketsUse = recordData.sockets.use;
        this.socketsPort = recordData.sockets.port;
        this.intervalCommandsUse = recordData.intervalCommands.use;
        this.intervalCommandsInterval = recordData.intervalCommands.interval;
        this.use = recordData.use;
      } else {
        this.id = '';
        this.name = '';
        this.portProd = '4001';
        this.dbVendor = 'flow';
        this.dbHost = '127.0.0.1';
        this.dbPort = '30000';
        this.dbBaseProd = 'local';
        this.dbmaxCount = '1000000';
        this.socketsUse = true;
        this.socketsPort = '4002';
        this.intervalCommandsUse = true;
        this.intervalCommandsInterval = '1000';
        this.use = false;
      }

      this.operationId = this.props.operationId;
    }

    const { id, name, use, portProd, dbVendor, dbHost, dbPort, dbBaseProd, dbMaxCount, socketsUse, socketsPort, intervalCommandsUse, intervalCommandsInterval } = this;

    return (
      <form class="form-horizontal">

        <div class="form-group">

          <label class="col-sm-1 control-label" for="name">Name</label>

          <div class="col-sm-8">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="name" id="use" checked={!!use} onChange={this.handleInputOnChange.bind(this)} />
              </span>
              <input type="text" class="form-control" aria-label="name" id="name" value={name} onChange={this.handleInputOnChange.bind(this)} />
            </div>
          </div>

          <label class="col-sm-1 control-label" for="portProd">Port</label>
          <div class="col-sm-2">
            <input type="number" class="form-control" id="portProd" value={portProd} onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>

        <div class="well well-sm">Database</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="dbHost">Host</label>
          <div class="col-sm-3">
            <input type="text" class="form-control" id="dbHost" value={dbHost} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-2 control-label" for="dbPort">Port</label>
          <div class="col-sm-2">
            <input type="number" class="form-control" id="dbPort" value={dbPort} onChange={this.handleInputOnChange.bind(this)} />
          </div>

          <label class="col-sm-2 control-label" for="dbBaseProd">Base name</label>
          <div class="col-sm-2">
            <input type="text" class="form-control" id="dbBaseProd" value={dbBaseProd} onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="dbVendor">Vendor</label>
          <div class="col-sm-3">
            <select id="dbVendor" value={dbVendor} onChange={this.handleInputOnChange.bind(this)} class="form-control">
              <option value='flow'>Flow</option>
              <option value='mongodb'>MongoDB</option>
              <option value='rethinkdb'>RethinkDB</option>
            </select>
          </div>

          <label class="col-sm-2 control-label" for="dbMaxCount">Max. count</label>
          <div class="col-sm-2">
            <input type="number" class="form-control" id="dbMaxCount" value={dbMaxCount} onChange={this.handleInputOnChange.bind(this)} />
          </div>

        </div>

        <div class="well well-sm">Sockets</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="socketsPort">Port</label>

          <div class="col-sm-2">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="sockets" id="socketsUse" checked={!!socketsUse} onChange={this.handleInputOnChange.bind(this)} />
              </span>
              <input type="number" class="form-control" aria-label="sockets" id="socketsPort" value={socketsPort} onChange={this.handleInputOnChange.bind(this)} />
            </div>
          </div>

        </div>

        <div class="well well-sm">Interval commands</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="intervalCommandsInterval">Interval</label>

          <div class="col-sm-2">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="interval" id="intervalCommandsUse" checked={!!intervalCommandsUse} onChange={this.handleInputOnChange.bind(this)} />
              </span>
              <input type="number" class="form-control" aria-label="interval" id="intervalCommandsInterval" value={intervalCommandsInterval} onChange={this.handleInputOnChange.bind(this)} />
            </div>
          </div>

        </div>

      </form>
    );
  }
}

export default FormConfig;
