import React from 'react';

class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    action: 'add', // add, edit
    isOpen: false,
    title: 'New item',
    handleClose: null,
    handleSave: null,
    table: ''
  }

  handleClose() {
    if (this.props.handleClose) {
      this.props.handleClose();
    } else {
      this.props.isOpen = false;
    }
  }

  handleSave() {
    if (this.props.handleSave) {
      this.props.handleSave();
    } else {
      console.log('Add save method to table class.');
    }
  }

  handleDelete() {
    if (this.props.handleDelete) {
      this.props.handleDelete();
    } else {
      console.log('Add delete method to table class.');
    }
  }

  render() {
    const { isOpen, title, action } = this.props;

    let style = {
      display: 'none'
    };
    if (isOpen) {
      style = {...style, display: 'block'};
    }

    const handleClose  = this.handleClose.bind(this);
    const handleSave   = this.handleSave.bind(this);
    const handleDelete = this.handleDelete.bind(this);

    let modalFooter = (
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" onClick={handleSave}>Save & close</button>
        <button type="button" class="btn btn-default" onClick={handleClose}>Close</button>
      </div>
    );
    if (action == 'edit') {
      modalFooter = (
        <div class="modal-footer">
          <button type="button" class="btn btn-danger pull-left" onClick={handleDelete}>Delete</button>
          <button type="button" class="btn btn-primary" onClick={handleSave}>Save & close</button>
          <button type="button" class="btn btn-default" onClick={handleClose}>Close</button>
        </div>
      );
    }

    return (
      <div class='modal' style={style}>
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">{title}</h4>
            </div>
            <div class="modal-body">
              {this.props.children}
            </div>
            {modalFooter}
          </div>
        </div>
      </div>
    );
  }
}

export default ModalWindow;
