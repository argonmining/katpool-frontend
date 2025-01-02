'use client'

import { useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

interface LineChart01Props {
  data: ChartData<'line'>;
  width: number;
  height: number;
  tooltipFormatter?: (value: number) => string;
  tooltipTitleFormatter?: (title: string) => string;
}

export default function LineChart01({
  data,
  width,
  height,
  tooltipFormatter,
  tooltipTitleFormatter
}: LineChart01Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    const ctx = canvas.current
    if (!ctx) return

    const options: ChartOptions<'line'> = {
      layout: {
        padding: {
          top: 12,
          bottom: 16,
          left: 20,
          right: 20
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true
          },
          ticks: {
            maxTicksLimit: 7
          }
        },
        x: {
          grid: {
            display: true
          },
          ticks: {
            maxTicksLimit: 8
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function(context) {
              return tooltipTitleFormatter ? 
                tooltipTitleFormatter(context[0].label) : 
                context[0].label;
            },
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (tooltipFormatter) {
                label += tooltipFormatter(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
              return label;
            }
          }
        },
        legend: {
          display: false
        }
      },
      interaction: {
        intersect: false,
        mode: 'nearest'
      },
      maintainAspectRatio: false
    }

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    chartRef.current = new ChartJS(ctx, {
      type: 'line',
      data,
      options
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, tooltipFormatter, tooltipTitleFormatter])

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  )
}