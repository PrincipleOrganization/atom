import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';

export default class DashboardChart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.chart = undefined;
  }

  componentDidMount() {
    this.renderChart();
  }

  componentWillUnmount() {
		this.chart.destroy();
	}

  componentDidUpdate() {
    this.updateChart();
  }

  generateData() {
    const data = this.props.data;

    const labels = [];
    const values = [];

    for (var i = 0; i < data.length; i++) {
      let currentData = data[i];
      labels.push(currentData.date);
      values.push(currentData.value);
    }

    return {
      labels: labels,
      datasets: [{
        data: values,
        borderWidth: 1,
        lineTension: 0.1,
        fill: false,
        backgroundColor: 'rgb(101, 173, 232)',
        borderColor: 'rgb(66, 158, 235)',
      }]
    };
  }

  renderChart() {
    const id = this.props.id;
    const elementId = `chart_${id}`;
    const data = this.generateData();

    const elementHTML = document.getElementById(elementId).getContext("2d");

    this.chart = new Chart(elementHTML, {
      type: 'line',
      data,
      options: {
        animation: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            display: false
          }]
        }
      }
    });
  }

  updateChart() {
		if (!this.chart) return;

    const data = this.generateData(data);

		this.chart.config.data = {
			...this.chart.config.data,
			...data
		};

		this.chart.update();
	}

  render() {
    const { id } = this.props;
    const elementId = `chart_${id}`;

    return (
      <div class="dashboard-unit-chart">
        <canvas id={elementId}></canvas>
      </div>
    );
  }
}
