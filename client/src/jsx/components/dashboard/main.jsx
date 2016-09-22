import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import DashboardUnit from './dashboardUnit.jsx'

export default class Dashboard extends React.Component {
  constructor(params) {
    super(params);

    // this.state = FIXTURE;
    this.state = {
      serialPorts: [],
      data: []
    };
  }

  componentDidMount() {
    const href = window.location.href;
    axios.get(`${href}api/settings/config/use`)
      .then((response) => {
        const config = response.data.data;

        if (config.sockets.use) {
          this.sockets = [];

          axios.get(`${href}api/all?onlyOpened=true`)
            .then((response) => {
              const openedSerialPorts = response.data.data;

              this.setState({ ...this.state, serialPorts: openedSerialPorts });

              const serialPorts = this.state.serialPorts;
              for (var i = 0; i < serialPorts.length; i++) {
                const path = serialPorts[i].comName;

                for (var j = 0; j < openedSerialPorts.length; j++) {
                  if (path == openedSerialPorts[j].comName) {
                    const hostname = window.location.hostname;
                    const protocol = window.location.protocol;
                    const socketAddr = `${protocol}//${hostname}:${config.sockets.port}/${path}`;

                    let socket = io(socketAddr);
                    socket.on(path, message => {
                      // if (message.stable == false) {
                      //   return;
                      // }

                      const newData = {
                        path,
                        createdAt: message.date,
                        value: message.value
                      };

                      let data = this.state.data;
                      if (data.length > 100) {
                        data.splice(0,1);
                      }
                      data.push(newData);

                      this.setState({ ...this.state, data });
                    });

                    this.sockets.push(socket);
                  }
                }
              }
            });
        }
      });
  }

  render() {
    const { data, serialPorts } = this.state;

    return (
      <div class='dashboard-units'>
        {serialPorts.map((serialPort) => {
          let { id, name, comName } = serialPort;
          let serialPortData = [];
          for (var i = 0; i < data.length; i++) {
            let current = data[i];

            if (current.path == comName) {
              serialPortData.push({
                date: current.createdAt,
                value: current.value
              });
            }
          }

          let currentData = 0;
          if (serialPortData.length != 0) {
            currentData = serialPortData[serialPortData.length - 1].value;
          }

          return <DashboardUnit key={comName} id={comName} name={name} path={comName} data={serialPortData} currentData={currentData} />
        })}
      </div>
    );
  }
}

// const FIXTURE = {
//   serialPorts: [
//     {
//       id: 1,
//       name: 'Test 1',
//       path: '/dev/ttyUSB0'
//     },
//     {
//       id: 2,
//       name: 'Test 2',
//       path: '/dev/ttyUSB1'
//     }
//   ],
//   data: []
// }
