<template>
  <div
    class="font-mono bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-slate-800 dark:to-stone-800 text-white min-h-screen flex items-center justify-center"
  >
    <div class="w-full max-w-4xl p-8 rounded-xl shadow-2xl"> 
      <div class="max-h-[90vh] overflow-y-auto p-8 space-y-8">
        <h1 class="text-4xl font-extrabold text-center text-white">Work Hours Calculator</h1>
        <div id="sessions" class="space-y-8">
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
            <div class="time-wrapper flex items-center space-x-4">
              <label
                :for="`session${index + 1}-start`"
                class="font-semibold text-lg text-slate-800 dark:text-slate-300"
                >Session {{ index + 1 }} - Kommen:</label
              >
              <LucideClock class="text-slate-600 dark:text-slate-400" />
              <input
                type="time"
                :id="`session${index + 1}-start`"
                v-model="session.start"
                @input="calculateWorkHours"
                @paste="handlePaste($event, index, 'start')"
                class="w-full p-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-md transition-transform transform hover:scale-105"
              />
            </div>
            <div class="time-wrapper flex items-center space-x-4 mt-6">
              <label
                :for="`session${index + 1}-end`"
                class="font-semibold text-lg text-slate-800 dark:text-slate-300"
                >Session {{ index + 1 }} - Gehen:</label
              >
              <LucideClock class="text-slate-600 dark:text-slate-400" />
              <input
                type="time"
                :id="`session${index + 1}-end`"
                v-model="session.end"
                @input="calculateWorkHours"
                @paste="handlePaste($event, index, 'end')"
                class="w-full p-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-md transition-transform transform hover:scale-105"
              />
            </div>
          </div>
        </div>
        <div class="buttons-container flex flex-wrap justify-center gap-6">
          <button
            @click="addSession"
            class="dark:bg-transparent bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full shadow-lg flex items-center space-x-3 transition-transform transform hover:scale-105"
          >
            <LucidePlus class="text-white" />
            <span>Add Session</span>
          </button>
          <button
            @click="addBreak"
            class="dark:bg-transparent bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full shadow-lg flex items-center space-x-3 transition-transform transform hover:scale-105"
          >
            <LucideCalculator class="text-white" />
            <span>Add Break</span>
          </button>
          <button
            @click="exportSchedule"
            class="dark:bg-transparent bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-full shadow-lg flex items-center space-x-3 transition-transform transform hover:scale-105"
          >
            <LucideDownload class="text-white" />
            <span>Export Schedule</span>
          </button>
          <button
            class="theme-toggle p-4 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 transition-transform transform hover:scale-105 absolute top-0 right-0 size-16 m-6"
            :class="{ 'theme-toggle--toggled': isDarkMode }"
            @click="toggleTheme"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <LucideSun class="theme-toggle__expand text-slate-800 dark:text-yellow-300" />
          </button>
        </div>
        <div
          id="result"
          class="result-container mt-6 p-6 rounded-lg bg-red-600 dark:bg-slate-600 text-white text-center shadow-md"
        >
          {{ resultMessage }}
        </div>
        <div
          id="result"
          @click="copySchedule"
          class="result-container mt-6 p-6 rounded-lg bg-red-600 dark:bg-slate-600 text-white text-center shadow-md flex gap-1 justify-center cursor-pointer"
        >
          <LucideClipboard v-if="!copied" class="text-white" />
          <CheckCheck v-if="copied" class="text-white" />
          {{ scheduleText }}
        </div>
      </div>
    </div>
  </div>
  <div class="fixed bottom-0 left-0 m-4 text-white flex flex-col space-y-2">
    <OnlineTracker />
    <TimeCounter />
    FPS: {{ fps }}
    <div v-if="isSupported">Battery: {{ level }}</div>
  </div>
   <div class="absolute bottom-4 right-4 dark:text-gray-600 font-serif text-lg italic opacity-70">
    <span>Masri</span>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSessionStorage, useFps, useBattery, useClipboard } from '@vueuse/core'
import TimeCounter from './components/TimeCounter.vue'
import OnlineTracker from './components/OnlineTracker.vue'
import {
  LucideClock,
  LucidePlus,
  LucideX,
  LucideCalculator,
  LucideDownload,
  LucideClipboard,
  CheckCheck,
  LucideSun,
} from 'lucide-vue-next'

const { isSupported, level } = useBattery()
const fps = useFps()
const isDarkMode = ref(false)
const sessions = useSessionStorage('sessions',[{ start: '08:00', end: '12:00' }])
const resultMessage = useSessionStorage('resultMessage')
const { copy, copied } = useClipboard()

const scheduleText = computed(() => {
  return sessions.value
    .map((session, index) => `Session ${index + 1}: ${session.start} - ${session.end}`)
    .join('\n')
})

const addSession = () => {
  const lastSession = sessions.value[sessions.value.length - 1]
  const newStartTime = lastSession ? lastSession.end : '08:00'
  const newEndTime = addMinutesToTime(newStartTime, 240)
  sessions.value.push({ start: newStartTime, end: newEndTime })
}

const addBreak = () => {
  const lastSession = sessions.value[sessions.value.length - 1]
  const breakStartTime = lastSession ? lastSession.end : '12:00'
  const breakEndTime = addMinutesToTime(breakStartTime, 30)
  sessions.value.push({ start: breakStartTime, end: breakEndTime })
}

const addMinutesToTime = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60)
  const newMinutes = totalMinutes % 60
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

const deleteSession = (index) => {
  sessions.value.splice(index, 1)
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

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    sessionStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    sessionStorage.removeItem('darkMode')
  }
}

onMounted(() => {
  const storedTheme = sessionStorage.getItem('darkMode')
  if (storedTheme === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

const timeToSeconds = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 3600 + minutes * 60
}

const handlePaste = (event, index, type) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const timeRegex = /^(\d{2}):(\d{2})$/
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
</script>

<style scoped>
.theme-toggle--toggled .theme-toggle__expand {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>

<style>
.buttons-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  .lucide {
    margin: 5px 5px;
  }
}
</style>
