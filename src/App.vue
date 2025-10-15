<template>
  <div
    class="font-mono bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-slate-800 dark:to-stone-800 text-white min-h-screen flex items-center justify-center"
  >
    <ToggleTheme />
    <div class="w-full sm:max-w-4xl p-1 sm:p-8 rounded-xl shadow-2xl">
      <div class="sm:max-h-[90vh] sm:overflow-y-auto p-4 sm:p-8 space-y-8">
        <h1 class="text-xl sm:text-3xl font-extrabold text-center text-white">
          Work Hours Calculator
        </h1>
        <div id="sessions" class="space-y-4 sm:space-y-8">
          <div
            v-for="(session, index) in sessions"
            :key="index"
            class="session bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-6 rounded-xl shadow-lg relative"
          >
            <button
              @click="deleteSession(index)"
              class="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              title="Delete Session"
            >
              <LucideX class="w-4 h-4" />
            </button>
            <div
              class="time-wrapper flex sm:items-center space-x-4 w-full flex-col sm:flex-row gap-1"
            >
              <label
                :for="`session${index + 1}-start`"
                class="font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-300"
                >Session {{ index + 1 }} - Kommen:</label
              >
              <div class="flex items-center space-x-4 w-full">
                <LucideClock class="text-slate-600 dark:text-slate-400 w-4 h-4" />
                <input
                  type="time"
                  :id="`session${index + 1}-start`"
                  v-model="session.start"
                  @input="calculateWorkHours"
                  @paste="handlePaste($event, index, 'start')"
                  class="w-full p-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm sm:text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-md transition-transform transform hover:scale-105"
                />
              </div>
            </div>
            <div
              class="time-wrapper flex sm:items-center space-x-4 w-full flex-col sm:flex-row gap-1 mt-6"
            >
              <label
                :for="`session${index + 1}-end`"
                class="font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-300"
                >Session {{ index + 1 }} - Gehen:</label
              >
              <div class="flex items-center space-x-4 w-full">
                <LucideClock class="text-slate-600 dark:text-slate-400 w-4 h-4" />
                <input
                  type="time"
                  :id="`session${index + 1}-end`"
                  v-model="session.end"
                  @input="calculateWorkHours"
                  @paste="handlePaste($event, index, 'end')"
                  class="w-full p-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm sm:text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-md transition-transform transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="buttons-container flex flex-wrap justify-center gap-3 sm:gap-6 mt-6">
          <button
            @click="resetSession"
            class="dark:bg-transparent text-xs sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-lg flex items-center space-x-2 sm:space-x-3 transition-transform transform hover:scale-105"
          >
            <LucidePlus class="text-white w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            @click="addSession"
            class="dark:bg-transparent text-xs sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-lg flex items-center space-x-2 sm:space-x-3 transition-transform transform hover:scale-105"
          >
            <LucidePlus class="text-white w-4 h-4" />
            <span>Add</span>
          </button>
          <button
            @click="addBreak"
            class="dark:bg-transparent text-xs sm:text-base bg-green-600 hover:bg-green-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-lg flex items-center space-x-2 sm:space-x-3 transition-transform transform hover:scale-105"
          >
            <LucideCalculator class="text-white w-4 h-4" />
            <span>Add Break</span>
          </button>
          <button
            @click="exportSchedule"
            class="dark:bg-transparent text-xs sm:text-base bg-yellow-600 hover:bg-yellow-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-lg flex items-center space-x-2 sm:space-x-3 transition-transform transform hover:scale-105"
          >
            <LucideDownload class="text-white w-4 h-4" />
            <span>Export Schedule</span>
          </button>
        </div>
        <div
          class="result-container p-3 my-3 sm:mt-6 sm:p-6 rounded-lg bg-red-600 dark:bg-slate-600 text-white text-center shadow-md text-sm sm:text-base"
        >
          {{ resultMessage }}
        </div>
        <div
          id="schedule-copy-area"
          @click="copySchedule"
          class="result-container p-3 my-3 sm:mt-6 sm:p-6 rounded-lg bg-red-600 dark:bg-slate-600 text-white text-center shadow-md text-sm sm:text-base flex gap-1 justify-center cursor-pointer"
        >
          <LucideClipboard v-if="!copied" class="text-white w-4 h-4" />
          <CheckCheck v-if="copied" class="text-white w-4 h-4" />
          <p class="max-w-[90%]">{{ scheduleText }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="hidden sm:fixed bottom-0 left-0 m-4 text-white text-sm sm:flex flex-col space-y-2">
    <OnlineTracker />
    <TimeCounter />
    FPS: {{ fps }}
    <div v-if="isSupported">Battery: {{ (level * 100).toFixed(0) }}%</div>
  </div>
  <div
    class="hidden sm:block absolute bottom-4 right-4 dark:text-gray-600 font-serif text-base sm:text-lg italic opacity-70"
  >
    <span><a href="https://masri-programmer.de" target="_blank">Masri Programmeri</a></span>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSessionStorage, useFps, useBattery, useClipboard } from '@vueuse/core'
import TimeCounter from './components/TimeCounter.vue'
import OnlineTracker from './components/OnlineTracker.vue'
import ToggleTheme from './components/ToggleTheme.vue'
import {
  LucideClock,
  LucidePlus,
  LucideX,
  LucideCalculator,
  LucideDownload,
  LucideClipboard,
  CheckCheck,
} from 'lucide-vue-next'

const { isSupported, level } = useBattery()
const fps = useFps()
const sessions = useSessionStorage('sessions', [])
const resultMessage = useSessionStorage('resultMessage', `Calculating...`)
const { copy, copied } = useClipboard()

const scheduleText = computed(() => {
  return sessions.value
    .map((session, index) => `Session ${index + 1}: ${session.start} - ${session.end}`)
    .join('\n')
})

const addMinutesToTime = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMinutes = totalMinutes % 60
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

const timeToSeconds = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 3600 + minutes * 60
}

const initializeDefaultSchedule = () => {
  const now = new Date()
  let startTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0',
  )}`

  const breakStart = '12:00'
  const breakEnd = '12:30'
  const totalWorkMinutes = 8 * 60

  const startTimeInSeconds = timeToSeconds(startTime)
  const breakStartInSeconds = timeToSeconds(breakStart)
  const breakEndInSeconds = timeToSeconds(breakEnd)

  // If user starts during the break, adjust their start time to the end of the break.
  if (startTimeInSeconds > breakStartInSeconds && startTimeInSeconds < breakEndInSeconds) {
    startTime = breakEnd
  }

  // If the workday starts at or before the fixed break begins.
  if (timeToSeconds(startTime) <= breakStartInSeconds) {
    const morningWorkMinutes = (breakStartInSeconds - timeToSeconds(startTime)) / 60
    const remainingWorkMinutes = totalWorkMinutes - Math.max(0, morningWorkMinutes)
    const finalEndTime = addMinutesToTime(breakEnd, remainingWorkMinutes)

    sessions.value = [
      { start: startTime, end: breakStart },
      { start: breakEnd, end: finalEndTime },
    ]
  } else {
    // If the workday starts after the fixed break is over.
    // The 12:00 break is in the past, so create a new break after 4 hours of work.
    const firstSessionEnd = addMinutesToTime(startTime, 4 * 60)
    const secondSessionStart = addMinutesToTime(firstSessionEnd, 30)
    const secondSessionEnd = addMinutesToTime(secondSessionStart, 4 * 60)

    sessions.value = [
      { start: startTime, end: firstSessionEnd },
      { start: secondSessionStart, end: secondSessionEnd },
    ]
  }
}

const addSession = () => {
  const lastSession = sessions.value[sessions.value.length - 1]
  const newStartTime = lastSession ? lastSession.end : '08:00'
  const newEndTime = addMinutesToTime(newStartTime, 240)
  sessions.value.push({ start: newStartTime, end: newEndTime })
  calculateWorkHours()
}
const resetSession = () => {
  sessions.value = [
    { start: '09:00', end: '12:30' },
    { start: '12:30', end: '13:00' },
    { start: '13:00', end: '17:30' },
  ]
  calculateWorkHours()
}

const addBreak = () => {
  const lastSession = sessions.value[sessions.value.length - 1]
  const breakStartTime = lastSession ? lastSession.end : '12:00'
  const breakEndTime = addMinutesToTime(breakStartTime, 30)
  sessions.value.push({ start: breakStartTime, end: breakEndTime })
  calculateWorkHours()
}

const deleteSession = (index) => {
  sessions.value.splice(index, 1)
  calculateWorkHours()
}

const calculateWorkHours = () => {
  let totalSeconds = 0
  sessions.value.forEach(({ start, end }) => {
    if (start && end) {
      let startSeconds = timeToSeconds(start)
      let endSeconds = timeToSeconds(end)

      if (endSeconds < startSeconds) {
        endSeconds += 24 * 3600
      }

      totalSeconds += endSeconds - startSeconds
    }
  })

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  resultMessage.value = `Total Work Time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`
}

const exportSchedule = () => {
  const schedule = sessions.value
    .map((session, index) => ({ session: `Session ${index + 1}`, ...session }))
    .filter((s) => s.start && s.end)

  const scheduleJSON = JSON.stringify(schedule, null, 2)
  const blob = new Blob([scheduleJSON], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'schedule.json'
  link.click()
}

const handlePaste = (event, index, type) => {
  const pastedData = event.clipboardData.getData('text')
  const timeRegex = /^(\d{2}):(\d{2})(?::\d{2})?$/
  const match = pastedData.match(timeRegex)
  if (match) {
    const formattedTime = `${match[1].padStart(2, '0')}:${match[2].padStart(2, '0')}`
    if (type === 'start') {
      sessions.value[index].start = formattedTime
    } else {
      sessions.value[index].end = formattedTime
    }

    calculateWorkHours()
  }
}

const copySchedule = () => {
  copy(scheduleText.value)
}

onMounted(() => {
  // If sessions are empty in storage (e.g., first visit), set up the default schedule.
  // Otherwise, load the existing schedule from session storage.
  if (!sessions.value || sessions.value.length === 0) {
    initializeDefaultSchedule()
  }
  calculateWorkHours()
})
</script>
