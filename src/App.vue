<template>
  <div>
    <h1>Work Hours Calculator</h1>
    <div id="sessions">
      <div v-for="(session, index) in sessions" :key="index" class="session">
        <div class="time-wrapper">
          <label :for="`session${index + 1}-start`">Session {{ index + 1 }} - Kommen:</label>
          <LucideClock />
          <input
            type="time"
            :id="`session${index + 1}-start`"
            v-model="session.start"
            @input="calculateWorkHours"
            @paste="handlePaste($event, index, 'start')"
          />
        </div>
        <div class="time-wrapper">
          <label :for="`session${index + 1}-end`">Session {{ index + 1 }} - Gehen:</label>
          <LucideClock />
          <input
            type="time"
            :id="`session${index + 1}-end`"
            v-model="session.end"
            @input="calculateWorkHours"
            @paste="handlePaste($event, index, 'end')"
          />
        </div>
      </div>
    </div>
    <div>
      <button @click="addSession">
        <LucidePlus />
        Add Session
      </button>
      <button @click="calculateWorkHours">
        <LucideCalculator />
        Calculate Total Hours
      </button>
      <button @click="exportSchedule">
        <LucideDownload />
        Export Schedule
      </button>
      <button
        class="theme-toggle"
        :class="{ 'theme-toggle--toggled': isDarkMode }"
        @click="toggleTheme"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        <LucideSun class="theme-toggle__expand" />
      </button>
    </div>
    <div id="result" class="result-container bg-red-500">{{ resultMessage }}</div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import {
  LucideClock,
  LucidePlus,
  LucideCalculator,
  LucideDownload,
  LucideSun,
} from 'lucide-vue-next'

const sessions = ref([{ start: '08:00', end: '12:00' }])
const resultMessage = useSessionStorage('')
const isDarkMode = ref(false)

const addSession = () => {
  sessions.value.push({ start: '', end: '' })
}

const calculateWorkHours = () => {
  let totalSeconds = 0

  sessions.value.forEach(({ start, end }) => {
    if (start && end) {
      let startSeconds = timeToSeconds(start)
      let endSeconds = timeToSeconds(end)

      if (endSeconds < startSeconds) {
        endSeconds += 24 * 3600 // Adjust for midnight cross
      }

      totalSeconds += endSeconds - startSeconds
    }
  })

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  console.log(`Total Work Time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`)
  resultMessage.value = `Total Work Time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`
}

const exportSchedule = () => {
  const schedule = sessions.value
    .map((session, index) => ({
      session: `Session ${index + 1}`,
      ...session,
    }))
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
  document.body.classList.toggle('dark-theme', isDarkMode.value)
  document.body.classList.toggle('light-theme', !isDarkMode.value)
}

const timeToSeconds = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 3600 + minutes * 60
}

// Handle paste event on time inputs
const handlePaste = (event, index, type) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')

  // Check if the pasted data matches a valid time format (HH:MM)
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
</script>

<style>
.lucide{
  margin: 5px 5px;
}
</style>