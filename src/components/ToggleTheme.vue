<template>
   <div id="theme-toggler" class="theme-toggle" title="Toggle theme">
      <svg
        @click="toggleTheme"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        class="theme-toggle__expand bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 p-3 rounded-full transition-transform transform hover:scale-105 absolute top-0 right-0 size-10 m-3 lg:w-16 lg:h-16 md:w-12 md:h-12 sm:w-10 sm:h-10 sm:m-4 sm:p-4"
        fill="currentColor"
        viewBox="0 0 32 32"
      >
        <clipPath id="theme-toggle__expand__cutout">
          <path d="M0-11h25a1 1 0 0017 13v30H0Z" />
        </clipPath>
        <g clip-path="url(#theme-toggle__expand__cutout)">
          <circle cx="16" cy="16" r="8.4" />
          <path
            d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z"
          />
        </g>
      </svg>
    </div>
</template>

<script setup lang="ts">
import { useSessionStorage } from "@vueuse/core";
import { onMounted } from 'vue'

const isDarkMode = useSessionStorage(
  "darkMode",
  window.matchMedia("(prefers-color-scheme: dark)").matches
);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const element = document.getElementById("theme-toggler");
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    element.classList.add("theme-toggle--toggled");
  } else {
    document.documentElement.classList.remove("dark");
    element.classList.remove("theme-toggle--toggled");
  }
};

onMounted(() => {
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    const element = document.getElementById("theme-toggler");
    if (element) {
      element.classList.add("theme-toggle--toggled");
    }
  }
});
</script>

<style scoped>
.theme-toggle--toggled .theme-toggle__expand {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>