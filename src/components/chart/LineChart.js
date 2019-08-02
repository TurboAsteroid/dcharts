import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart({
      labels: this.chartData.labels,
      datasets: this.chartData.datasets.concat([this.chartData.top], [this.chartData.bot])
    }, this.options)
  }
}
