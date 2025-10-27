<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7a5c7aa] via-purple-50 to-white p-4 relative"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 relative z-10">
      <h1 class="text-3xl font-bold text-center mb-2">Welcome Back</h1>
      <p class="text-gray-500 text-center mb-6">
        Login to your TicketHub account
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            v-model="formData.email"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11791]',
              errors.email ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            v-model="formData.password"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11791]',
              errors.password ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#E11791] text-white py-2 rounded-md font-medium hover:bg-[#d01685] transition-colors disabled:opacity-60"
        >
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="text-center mt-4 text-gray-500">
        Don't have an account?
        <RouterLink to="/auth/signup" class="text-[#E11791] hover:underline font-medium">Sign up</RouterLink>
      </p>

      <p class="text-center mt-2 text-gray-400 text-sm">
        <RouterLink to="/" class="hover:text-gray-600 hover:underline">← Back to home</RouterLink>
      </p>
    </div>

    <!-- Toast Container -->
    <Toaster :toasts="toasts" :removeToast="removeToast" />
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuth } from "@/contexts/AuthContext";
import Toaster, { useToast } from "@/components/Toaster.vue";

export default {
  name: "Login",
  components: { Toaster, RouterLink },
  setup() {
    const router = useRouter();
    const { login } = useAuth();

    // Toast hook
    const { toasts, addToast, removeToast } = useToast();

    const formData = reactive({ email: "", password: "" });
    const errors = reactive({});
    const isLoading = ref(false);

    const validateForm = () => {
      Object.keys(errors).forEach((key) => delete errors[key]);

      if (!formData.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";

      if (!formData.password) errors.password = "Password is required";
      else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";

      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        addToast({
          title: "Validation Error",
          description: "Please fix the errors in the form",
          type: "error",
        });
        return;
      }

      isLoading.value = true;

      try {
        const success = await login(formData.email, formData.password);

        if (success) {
          addToast({
            title: "Login Successful!",
            description: "Redirecting to your dashboard...",
            type: "success",
          });
          setTimeout(() => router.push("/dashboard"), 1200);
        } else {
          addToast({
            title: "Login Failed",
            description: "Invalid credentials. Please try again.",
            type: "error",
          });
        }
      } catch {
        addToast({
          title: "Network Error",
          description: "An error occurred. Please try again later.",
          type: "error",
        });
      } finally {
        isLoading.value = false;
      }
    };

    return { formData, errors, isLoading, handleSubmit, toasts, removeToast };
  },
};
</script>
