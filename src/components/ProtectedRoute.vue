<!-- src/components/ProtectedRoute.vue -->
<template>
  <component :is="component" v-if="isAuthenticated" />
  <router-view v-else /> <!-- redirect handled programmatically -->
</template>

<script>
import { defineComponent, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ProtectedRoute",
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const auth = inject("auth"); // from AuthContext
    const isAuthenticated = ref(auth?.isAuthenticated || false);

    onMounted(() => {
      if (!isAuthenticated.value) {
        router.replace("/auth/login");
      }
    });

    return {
      isAuthenticated,
      component: props.component,
    };
  },
});
</script>
