import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options','chartData'],
  watch: {
    chartData() {
      return this.renderChart({
        labels: this.chartData.labels,
        datasets: this.chartData.datasets.concat([this.chartData.top], [this.chartData.bot])
      }, this.options);
    }
  },
  mounted() {
    // console.log(this.chartData)
    this.chartData ? this.renderChart({
      labels: this.chartData.labels,
      datasets: this.chartData.datasets ? this.chartData.datasets.concat([this.chartData.top], [this.chartData.bot]) : {}
    }, this.options) : {};
  }
};
