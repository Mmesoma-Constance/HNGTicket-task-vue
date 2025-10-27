<!-- src/App.vue -->
<script setup>
import { provideAuth } from "@/contexts/AuthContext.js";

// 👇 Call provideAuth() ONCE globally
provideAuth();
</script>

<template>
  <router-view />
</template>
