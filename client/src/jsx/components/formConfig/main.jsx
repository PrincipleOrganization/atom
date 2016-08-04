import React from 'react';

class FormConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    operationId: null,
    recordData: {
      name: '',
      port: {
        prod: '4001',
      },
      db: {
        vendor: 'flow',
        host: '127.0.0.1',
        port: '30000',
        base: {
          prod: 'local'
        },
        maxCount: '1000000'
      },
      sockets: {
        use: true,
        port: '4002'
      },
      intervalCommands: {
        use: true,
        interval: '1000'
      },
      use: false
    }
  };

  name = '';
  port = {
    prod: '4001'
  };
  db = {
    vendor: 'flow',
    host: '127.0.0.1',
    port: '30000',
    base: {
      prod: 'local'
    },
    maxCount: '1000000'
  };
  sockets = {
    use: true,
    port: '4002'
  };
  intervalCommands= {
    use: true,
    interval: '1000'
  };
  use = false;

  operationId;

  updateForm() {
    this.forceUpdate();
  }

  handleNameOnChange(event) {
    this.name = event.target.value;
    this.updateForm();
  }

  handleCheckboxUseOnChange(event) {
    this.use = !this.state.use;
    this.updateForm();
  }

  handlePortOnChange(event) {
    this.port.port = event.target.value;
    this.updateForm();
  }

  handleVendorOnChange(event) {
    this.db.vendor = event.target.value;
    this.updateForm();
  }

  handleHostOnChange(event) {
    this.db.host = event.target.value;
    this.updateForm();
  }

  handleDBPortOnChange(event) {
    this.db.port = event.target.value;
    this.updateForm();
  }

  handleBaseOnChange(event) {
    this.db.base.prod = event.target.value;
    this.updateForm();
  }

  handleCountOnChange(event) {
    this.db.maxCount = event.target.value;
    this.updateForm();
  }

  handleSocketsUseOnChange(event) {
    this.sockets.use = event.target.checked;
    this.updateForm();
  }

  handleSocketsPortOnChange(event) {
    this.sockets.port = event.target.value;
    this.updateForm();
  }

  handleIntervalUseOnChange(event) {
    this.intervalCommands.use = event.target.checked;
    this.updateForm();
  }

  handleIntervalOnChange(event) {
    this.intervalCommands.interval = event.target.value;
    this.updateForm();
  }

  render() {
    if (this.operationId != this.props.operationId) {
      this.name = '';
      this.port = {
        prod: '4001'
      };
      this.db = {
        vendor: 'flow',
        host: '127.0.0.1',
        port: '30000',
        base: {
          prod: 'local'
        },
        maxCount: '1000000'
      };
      this.sockets = {
        use: true,
        port: '4002'
      };
      this.intervalCommands= {
        use: true,
        interval: '1000'
      };
      this.use = false;

      Object.assign(this, this.props.recordData);
      this.operationId = this.props.operationId;
    }

    const { name, use } = this;
    const port = this.port.prod;
    const vendor = this.db.vendor;
    const host = this.db.host;
    const dbPort = this.db.port;
    const base = this.db.base.prod;
    const maxCount = this.db.maxCount;
    const socketsUse = this.sockets.use;
    const socketsPort = this.sockets.port;
    const intervalUse = this.intervalCommands.use;
    const interval = this.intervalCommands.interval;

    return (
      <form class="form-horizontal">

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_name">Name</label>

          <div class="col-sm-8">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="name" id="input_use" checked={!!use} onChange={this.handleCheckboxUseOnChange.bind(this)} />
              </span>
              <input type="text" class="form-control" aria-label="name" id="input_name" value={name} onChange={this.handleNameOnChange.bind(this)} />
            </div>
          </div>

          <label class="col-sm-1 control-label" for="input_port">Port</label>
          <div class="col-sm-2">
            <input type="text" class="form-control" id="input_port" value={port} onChange={this.handlePortOnChange.bind(this)} />
          </div>

        </div>

        <div class="well well-sm">Database</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_host">Host</label>
          <div class="col-sm-3">
            <input type="text" class="form-control" id="input_host" value={host} onChange={this.handleHostOnChange.bind(this)} />
          </div>

          <label class="col-sm-2 control-label" for="input_dbport">Port</label>
          <div class="col-sm-2">
            <input type="text" class="form-control" id="input_dbport" value={dbPort} onChange={this.handleDBPortOnChange.bind(this)} />
          </div>

          <label class="col-sm-2 control-label" for="input_base_name">Base name</label>
          <div class="col-sm-2">
            <input type="text" class="form-control" id="input_base_name" value={base} onChange={this.handleBaseOnChange.bind(this)} />
          </div>

        </div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_vendor">Vendor</label>
          <div class="col-sm-3">
            <input type="text" class="form-control" id="input_vendor" value={vendor} onChange={this.handleVendorOnChange.bind(this)} />
          </div>

          <label class="col-sm-2 control-label" for="input_count">Max. count</label>
          <div class="col-sm-2">
            <input type="text" class="form-control" id="input_count" value={maxCount} onChange={this.handleCountOnChange.bind(this)} />
          </div>

        </div>

        <div class="well well-sm">Sockets</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_name">Port</label>

          <div class="col-sm-2">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="sockets" id="input_sockets_use" checked={!!socketsUse} onChange={this.handleSocketsUseOnChange.bind(this)} />
              </span>
              <input type="text" class="form-control" aria-label="sockets" id="input_sockets_interval" value={socketsPort} onChange={this.handleSocketsPortOnChange.bind(this)} />
            </div>
          </div>

        </div>

        <div class="well well-sm">Interval commands</div>

        <div class="form-group">

          <label class="col-sm-1 control-label" for="input_sockets_interval">Interval</label>

          <div class="col-sm-2">
            <div class="input-group">
              <span class="input-group-addon">
                <input type="checkbox" aria-label="interval" id="input_sockets_use" checked={!!intervalUse} onChange={this.handleIntervalUseOnChange.bind(this)} />
              </span>
              <input type="text" class="form-control" aria-label="interval" value={interval} onChange={this.handleIntervalOnChange.bind(this)} />
            </div>
          </div>

        </div>

      </form>
    );
  }
}

export default FormConfig;
