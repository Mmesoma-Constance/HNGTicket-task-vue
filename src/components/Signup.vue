<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7a5c7aa] via-purple-50 to-white p-4 relative">
    <!-- Toasts -->
    <Toaster :toasts="toasts" :removeToast="removeToast" />

    <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-8 relative z-10">
      <h1 class="text-3xl font-bold text-center mb-2">Create Account</h1>
      <p class="text-gray-500 text-center mb-6">Join TicketHub today</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block mb-1 font-medium">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            v-model="formData.name"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11791]',
              errors.name ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

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

        <div>
          <label for="confirmPassword" class="block mb-1 font-medium">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            v-model="formData.confirmPassword"
            :class="[
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E11791]',
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#E11791] text-white py-2 rounded-md font-medium hover:bg-[#d01685] transition-colors disabled:opacity-60"
        >
          {{ isLoading ? "Creating account..." : "Sign Up" }}
        </button>
      </form>

      <p class="text-center mt-4 text-gray-500">
        Already have an account?
        <router-link to="/auth/login" class="text-[#E11791] hover:underline font-medium">
          Login
        </router-link>
      </p>

      <p class="text-center mt-2 text-gray-400 text-sm">
        <router-link to="/" class="hover:text-gray-600 hover:underline">
          ← Back to home
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/contexts/AuthContext";
import Toaster, { useToast } from "@/components/Toaster.vue";

export default {
  name: "Signup",
  components: { Toaster },
  setup() {
    const router = useRouter();
    const { signup } = useAuth();
    const { toasts, addToast, removeToast } = useToast();

    const formData = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const errors = reactive({});
    const isLoading = ref(false);

    const validateForm = () => {
      Object.keys(errors).forEach((k) => delete errors[k]);

      if (!formData.name) errors.name = "Name is required";
      if (!formData.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
      if (!formData.password) errors.password = "Password is required";
      else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = "Passwords do not match";

      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        addToast({ title: "Form Error", description: "Please fix the errors in the form.", type: "error" });
        return;
      }

      isLoading.value = true;

      try {
        const success = await signup(formData.email, formData.password, formData.name);
        if (success) {
          addToast({ title: "Success!", description: "Account created successfully.", type: "success" });
          setTimeout(() => router.push("/dashboard"), 1000);
        } else {
          addToast({ title: "Account Exists", description: "An account with this email already exists.", type: "error" });
        }
      } catch {
        addToast({ title: "Error", description: "An error occurred. Please try again.", type: "error" });
      } finally {
        isLoading.value = false;
      }
    };

    return { formData, errors, isLoading, handleSubmit, toasts, addToast, removeToast };
  },
};
</script>
