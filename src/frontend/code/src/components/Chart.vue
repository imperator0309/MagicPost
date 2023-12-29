<template>
  <div>
    <canvas ref="monthlyChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue';
import { Chart } from 'chart.js/auto';

export default {
  props: {
    monthlyData: {
      type: Array,
      default: () => [],
    },
    legend: {
      type: String,
      default: 'Default Legend',
    },
  },
  setup(props) {
    const monthlyChart = ref(null);
    let chartInstance = null;

    const renderMonthlyChart = () => {
      if (!monthlyChart.value || !props.monthlyData.length) return;

      if (chartInstance) {
        chartInstance.destroy();
        
      }
      const copiedData = [...props.monthlyData];
      const ctx = monthlyChart.value.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
          ],
          datasets: [
            {
              label: props.legend,
              data: copiedData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'x',
          maintainAspectRatio: false,
          aspectRatio: 1.15,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
            },
          },
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            },
          },
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
      });
    };

    onMounted(renderMonthlyChart);

    watchEffect(() => {
      renderMonthlyChart();
    });

    return {
      monthlyChart,
    };
  },
};
</script>

<style scoped>
</style>
