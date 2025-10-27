<template>
  <div class="min-h-screen bg-[#f9f9f9]">
    <!-- Header -->
    <header class="bg-white border-b border-gray-300 p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 class="text-2xl font-bold text-[#E11791]">TicketHub</h1>
      <div class="flex items-center gap-4">
        <span class="hidden md:flex">Welcome, {{ user?.name }}!</span>
        <button
          @click="handleLogout"
          class="p-2 px-8 bg-[#E11791] text-white rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          Logout
        </button>
      </div>
    </header>

    <!-- Main -->
    <main class="py-12 px-4 max-w-6xl mx-auto">
      <div class="mb-12">
        <span class="md:hidden">Welcome, {{ user?.name }}!</span>
        <h2 class="text-4xl font-bold mb-4">Dashboard</h2>
        <p>Here's an overview of your support tickets</p>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap gap-4 mb-12">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="flex-1 min-w-[250px] p-6 border-2 border-gray-300 rounded-lg transition-all duration-300"
        >
          <div :class="`w-12 h-12 rounded-lg ${stat.color} flex justify-center items-center mb-4`">
            <span>🎫</span>
          </div>
          <p class="text-gray-600 mb-2">{{ stat.label }}</p>
          <p class="text-3xl font-bold">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="p-8 border-2 border-gray-300 rounded-lg text-center">
        <h3 class="text-2xl font-bold mb-4">Ready to manage your tickets?</h3>
        <p class="text-gray-600 mb-6">
          Create, view, edit, and delete tickets from the Ticket Management screen
        </p>
        <router-link
          to="/tickets"
          class="p-3 px-8 bg-[#E11791] text-white rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          Go to Ticket Management
        </router-link>
      </div>
    </main>

    <!-- Footer -->
    <footer class="p-4 text-center border-t border-gray-300">
      &copy; {{ new Date().getFullYear() }} TicketHub
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/contexts/AuthContext";

export default {
  name: "Dashboard",
  setup() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const tickets = ref([]);

    onMounted(() => {
      const savedTickets = localStorage.getItem("ticketapp_tickets");
      if (savedTickets) {
        tickets.value = JSON.parse(savedTickets);
      }
    });

    const handleLogout = () => {
      logout();
      router.push("/");
    };

    const totalTickets = computed(() => tickets.value.length);
    const openTickets = computed(() => tickets.value.filter((t) => t.status === "open").length);
    const resolvedTickets = computed(() => tickets.value.filter((t) => t.status === "closed").length);

    const stats = computed(() => [
      { label: "Total Tickets", value: totalTickets.value, color: "bg-sky-200" },
      { label: "Open Tickets", value: openTickets.value, color: "bg-green-200" },
      { label: "Resolved Tickets", value: resolvedTickets.value, color: "bg-gray-200" },
    ]);

    return { user, tickets, stats, handleLogout };
  },
};
</script>
