import React from 'react';
import axios from 'axios';

import TablePluginRecord from './record.jsx';
import TableToolbar from '../tableToolbar/main.jsx';
import ModalWindow from '../modalDialog/main.jsx';
import FormPlugin from '../formPlugin/main.jsx';

class TablePlugins extends React.Component {
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

  getAllRecords() {
    axios.get(`${this.href}api/settings/plugin`)
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
      tableName: formState.tableName,
      vendor: formState.vendor,
      model: formState.model,
      executeFunction: formState.executeFunction,
      params: formState.params
    };

    if (this.state.modalAction == 'edit') {
      record.id = formState.id;
      axios.put(`${this.href}api/settings/plugin`, record)
        .then((response) => {
          this.afterAPICall(response);
        });
    } else if (this.state.modalAction == 'add') {
      axios.post(`${this.href}api/settings/plugin`, record)
        .then((response) => {
          this.afterAPICall(response);
        });
    }
  }


  handleDeleteModalDialog() {
    const { name, id } = this.refs.form;

    axios.delete(`${this.href}api/settings/plugin`, {params: {id}})
      .then((response) => {
        this.afterAPICall(response);
      });
  }

  addNewRecord(button) {
    this.setState({
      ...this.state,
      recordData: {},
      modalTitle: 'New plugin',
      modalAction: 'add',
      modalIsOpen: !this.state.modalIsOpen,
      operationId: ++this.state.operationId
    });
  }

  openRecord(rec) {
    this.setState({
      ...this.state,
      recordData: rec,
      modalTitle: 'Edit plugin',
      modalAction: 'edit',
      modalIsOpen: !this.state.modalIsOpen,
      operationId: ++this.state.operationId
    });
  }

  render() {
    const { modalIsOpen, modalTitle, modalAction, recordData, operationId } = this.state;

    return (
      <div>
        <TableToolbar table='plugins' addNewRecord={this.addNewRecord.bind(this)} />

        <table class="table table-hover">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Model</th>
              <th>Table</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((rec) => {
              return <TablePluginRecord key={rec.id} data={rec} onClick={this.openRecord.bind(this)} />
            })}
          </tbody>
        </table>

        <ModalWindow
          title={modalTitle}
          isOpen={modalIsOpen}
          handleClose={this.handleCloseModalDialog.bind(this)}
          handleSave={this.handleSaveModalDialog.bind(this)}
          handleDelete={this.handleDeleteModalDialog.bind(this)}
          table='plugins'
          action={modalAction}>
          <FormPlugin ref='form' recordData={recordData} operationId={operationId} />
        </ModalWindow>
      </div>
    );
  }
}

export default TablePlugins;
