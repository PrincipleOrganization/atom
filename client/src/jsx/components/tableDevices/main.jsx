import React from 'react';
import axios from 'axios';

import TableDeviceRecord from './record.jsx';
import TableToolbar from '../tableToolbar/main.jsx';
import ModalWindow from '../modalDialog/main.jsx';
import FormDevice from '../formDevice/main.jsx';

class TableDevices extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalTitle: '',
      modalAction: 'add',
      recordData: {},
      data: [],
      operationId: 0
    };
  }

  href = window.location.href;

  componentDidMount() {
    this.getAllRecords();
  }

  getAllRecords(cb) {
    axios.get(`${this.href}api/settings/device`)
    .then((response) => {
      const data = response.data.data;
      this.setState({data});
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
      path: formState.path,
      tableName: formState.tableName,
      vendor: formState.vendor,
      model: formState.model,
      units: formState.units,
      baudRate: formState.baudRate,
      dataBits: formState.dataBits,
      stopBits: formState.stopBits,
      parity: formState.parity,
      rtscts: formState.rtscts,
      xon: formState.xon,
      xoff: formState.xoff,
      xany: formState.xany,
      flowControl: formState.flowControl,
      bufferSize: formState.bufferSize,
      use: formState.use
    };

    const { modalAction } = this.state;
    if (modalAction == 'edit') {
      record.id = formState.id;
      axios.put(`${this.href}api/settings/device`, record)
        .then((response) => {
          this.afterAPICall(response);
        });
    } else if (modalAction == 'add') {
      axios.post(`${this.href}api/settings/device`, record)
        .then((response) => {
          this.afterAPICall(response);
        });
    }
  }

  handleDeleteModalDialog() {
    const { name, id } = this.refs.form;

    axios.delete(`${this.href}api/settings/device`, {params: {id}})
      .then((response) => {
        this.afterAPICall(response);
      });
  }

  addNewRecord(button) {
    this.setState({
      ...this.state,
      recordData: {},
      modalTitle: 'New device',
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
        <TableToolbar table='devices' addNewRecord={this.addNewRecord.bind(this)} />

        <table class="table table-hover">
          <thead>
            <tr>
              <th>Use</th>
              <th>Name</th>
              <th>Path</th>
              <th>Table name</th>
              <th>Vendor</th>
              <th>Model</th>
              <th>Units</th>
              <th>Baud rate</th>
              <th>Data bits</th>
              <th>Stop bits</th>
              <th>Parity</th>
              <th>RSTSCTS</th>
              <th>XON</th>
              <th>XOFF</th>
              <th>XANY</th>
              <th>Flow control</th>
              <th>Buffer size</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((rec) => {
              return <TableDeviceRecord key={rec.id} data={rec} onClick={this.openRecord.bind(this)} />
            })}
          </tbody>
        </table>

        <ModalWindow
          title={modalTitle}
          isOpen={modalIsOpen}
          handleClose={this.handleCloseModalDialog.bind(this)}
          handleSave={this.handleSaveModalDialog.bind(this)}
          handleDelete={this.handleDeleteModalDialog.bind(this)}
          table='devices'
          action={modalAction}>
          <FormDevice ref='form' recordData={recordData} operationId={operationId} />
        </ModalWindow>
      </div>
    );
  }
}

export default TableDevices;
