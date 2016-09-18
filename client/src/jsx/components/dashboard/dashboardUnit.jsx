import React from 'react';

import DashboardChart from './chart.jsx';

export default class DashboardUnit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, name, path, data, currentData } = this.props;

    return(
      <div class='row'>
        <div class='dashboard-unit col-lg-12 col-md-12 col-sm-12 col-xs-12'>
          <div class='dashboard-unit-header'>
            <div class='row'>
              <div class='col-lg-10 col-md-10 col-sm-6 col-xs-6'>
                <p class='device-title'>{name}</p>
                <p class='text-muted device-path'>{path}</p>
              </div>
              <div class='col-lg-1 col-md-1 col-sm-3 col-xs-3'>
                <p class='text-center special-header'>value</p>
                <p class='text-center device-current-value'>{currentData}</p>
              </div>
              <div class='col-lg-1 col-md-1 col-sm-2 col-xs-2'>
                <button class='pull-right btn btn-default btn-width'>Details</button>
              </div>
            </div>
          </div>
          <div class='dashboard-unit-body'>
            <DashboardChart id={id} data={data} />
          </div>
        </div>
      </div>
    );
  }
}
