<template>
  <header
    class="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600"
  >
    <div class="flex items-center">
      <button
        @click="isOpen = true"
        class="text-gray-500 focus:outline-none lg:hidden"
      >
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

    </div>

    <div class="flex items-center">
      <img alt="ISC logo" class="w-40 h-auto self-center items-center animate-bounce" src="src/imagenes/ITSMOTUL.png">
      
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";

const dropdownOpen = ref(false);
const { isOpen } = useSidebar();
</script>
