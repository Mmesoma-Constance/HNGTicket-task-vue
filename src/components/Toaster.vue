<!-- src/components/Toaster.vue -->
<template>
  <div
    style="
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
    "
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :style="getToastStyle(toast.type)"
    >
      <div>
        <strong v-if="toast.title" style="display: block; margin-bottom: 4px">
          {{ toast.title }}
        </strong>
        <div v-if="toast.description">{{ toast.description }}</div>
      </div>
      <button
        @click="removeToast(toast.id)"
        style="
          margin-left: 10px;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
        "
      >
        ×
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";

export function useToast() {
  const toasts = reactive([]);

  const addToast = ({ title, description, type = "info", duration = 3000 }) => {
    const id = Date.now();
    toasts.push({ id, title, description, type });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) toasts.splice(index, 1);
  };

  return { toasts, addToast, removeToast };
}

export default {
  name: "Toaster",
  props: {
    toasts: { type: Array, default: () => [] },
    removeToast: { type: Function, required: true },
  },
  setup() {
    const getToastStyle = (type) => {
      const background =
        type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#333";
      return {
        padding: "12px 16px",
        background,
        color: "#fff",
        borderRadius: "8px",
        minWidth: "260px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        animation: "slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards",
      };
    };

    return { getToastStyle };
  },
};
</script>

<style>
@keyframes slideIn {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateX(120%);
  }
}
</style>
