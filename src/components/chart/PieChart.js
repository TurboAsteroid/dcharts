import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options', 'chartData'],
  watch: {
    chartData() {
      return this.renderChart(this.chartData, this.options)
    }
  },
  mounted () {
    this.chartData ? this.renderChart({
      labels: this.chartData.labels,
      datasets: this.chartData.datasets
    }, this.options) : {}
  }
}
