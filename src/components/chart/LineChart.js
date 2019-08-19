import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options', 'chartData'],
  watch: {
    chartData() {
      return this.renderChart({
        labels: this.chartData.labels,
        datasets: this.chartData.datasets.concat([this.chartData.top], [this.chartData.bot])
      }, this.options)
    }
  },
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    if(this.chartData) {
      this.renderChart({
        labels: this.chartData.labels,
        datasets: this.chartData.datasets ? this.chartData.datasets.concat([this.chartData.top], [this.chartData.bot]) : {}
      }, this.options);
    }
  }
}
