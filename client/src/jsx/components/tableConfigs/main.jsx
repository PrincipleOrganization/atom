import React from 'react';
import axios from 'axios';

import TableConfigRecord from './record.jsx';
import TableToolbar from '../tableToolbar/main.jsx';
import ModalWindow from '../modalDialog/main.jsx';
import FormConfig from '../formConfig/main.jsx';

class TableConfigs extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalTitle: '',
      modalAction: '',
      recordData: {},
      data: [],
      operationId: 0
    };
  }

  href = window.location.href;

  componentDidMount() {
    this.getAllRecords();
  }

  getAllRecords() {
    axios.get(`${this.href}api/settings/config`)
    .then((response) => {
      const data = response.data.data;
      this.setState({data: data});
    });
  }

  afterAPICall(response) {
    this.getAllRecords();
    this.toogleModalDialog();
    this.props.addNotification(response.data.data);
  }

  toogleModalDialog() {
    this.setState({...this.state, modalIsOpen: !this.state.modalIsOpen});
  }

  handleCloseModalDialog() {
    this.setState({
      ...this.state,
      modalIsOpen: !this.state.modalIsOpen,
      recordData: {}
    });
  }

  handleSaveModalDialog() {
    const formState = this.refs['form'];

    const record = {
      name: formState.name,
      port: {
        prod: formState.portProd
      },
      db: {
        vendor: formState.dbVendor,
        host: formState.dbHost,
        port: formState.dbPort,
        base: {
          prod: formState.dbBaseProd
        },
        maxCount: formState.dbMaxCount,
      },
      sockets: {
        use: (formState.socketsUse) ? ('1') : ('0'),
        port: formState.socketsPort
      },
      intervalCommands: {
        use: (formState.intervalCommandsUse) ? ('1') : ('0'),
        interval: formState.intervalCommandsInterval
      },
      use: (formState.use) ? (1) : (0)
    };

    const { modalAction } = this.state;
    if (modalAction == 'edit') {
      record.id = formState.id;
      axios.put(`${this.href}api/settings/config`, record)
       .then((response) => {
         this.afterAPICall(response);
       });
    } else if (modalAction == 'add') {
      axios.post(`${this.href}api/settings/config`, record)
       .then((response) => {
         this.afterAPICall(response);
       });
    }
  }

  handleDeleteModalDialog() {
    const { name, id } = this.refs.form;

    axios.delete(`${this.href}api/settings/config`, {params: {id}})
      .then((response) => {
        this.getAllRecords();
        this.toogleModalDialog();
        this.props.addNotification(`Configuration ${name} was deleted.`);
      });
  }

  addNewRecord(button) {
    this.setState({
      ...this.state,
      recordData: {},
      modalTitle: 'New configuration',
      modalAction: 'add',
      modalIsOpen: !this.state.modalIsOpen,
      operationId: ++this.state.operationId
    });
  }

  openRecord(rec) {
    this.setState({
      ...this.state,
      recordData: rec,
      modalTitle: 'Edit device',
      modalAction: 'edit',
      modalIsOpen: !this.state.modalIsOpen,
      operationId: ++this.state.operationId
    });
  }

  render() {
    const { modalIsOpen, modalTitle, modalAction, recordData, operationId } = this.state;

    return (
      <div>
        <TableToolbar table='configs' addNewRecord={this.addNewRecord.bind(this)} />

        <table class="table table-hover">
          <thead>
            <tr>
              <th>Use</th>
              <th>Name</th>
              <th>Port</th>
              <th>DB vendor</th>
              <th>DB host</th>
              <th>DB port</th>
              <th>DB base</th>
              <th>Max number of records</th>
              <th>Use sockets</th>
              <th>Socket's server port</th>
              <th>Use interval commands</th>
              <th>Time of interval commands</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((rec) => {
              return <TableConfigRecord key={rec.id} data={rec} onClick={this.openRecord.bind(this)} />
            })}
          </tbody>
        </table>

        <ModalWindow
          title={modalTitle}
          isOpen={modalIsOpen}
          handleClose={this.handleCloseModalDialog.bind(this)}
          handleSave={this.handleSaveModalDialog.bind(this)}
          handleDelete={this.handleDeleteModalDialog.bind(this)}
          table='configs'
          action={modalAction}>
          <FormConfig ref='form' recordData={recordData} operationId={operationId} />
        </ModalWindow>
      </div>
    );
  }
}

export default TableConfigs;
