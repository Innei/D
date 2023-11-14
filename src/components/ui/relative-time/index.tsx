import dayjs from 'dayjs'
import { defineComponent, onBeforeMount, onMounted, ref, watch } from 'vue'

import { parseDate, relativeTimeFromNow } from '@/utils/time'

export const RelativeTime = defineComponent({
  props: {
    date: {
      type: [String, Date],
      required: true,
    },
    displayAbsoluteTimeAfterDay: {
      type: Number,
      default: 29,
    },
  },
  setup(props) {
    const relative = ref(relativeTimeFromNow(props.date))

    onMounted(() => {
      const timer = setInterval(() => {
        relative.value = relativeTimeFromNow(props.date)
      }, 1000)

      if (
        Math.abs(dayjs(props.date).diff(new Date(), 'd')) >
        props.displayAbsoluteTimeAfterDay
      ) {
        clearInterval(timer)

        relative.value = parseDate(props.date, 'YY 年 M 月 D 日')
      }

      watch(
        () => props.date,
        () => {
          relative.value = relativeTimeFromNow(props.date)
        },
      )

      onBeforeMount(() => {
        clearInterval(timer)
      })
    })

    return () => <span>{relative.value}</span>
  },
})
