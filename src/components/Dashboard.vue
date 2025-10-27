<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow sticky top-0 z-50">
      <div class="max-w-1440px overflow-hidden mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-[#E11791]">TicketHub</h1>
        <div class="flex items-center gap-2">
          <span class="hidden sm:inline text-gray-600">Welcome, {{ user?.name || "Guest" }}!</span>
          <button @click="$router.push('/dashboard')" class="px-3 py-1 border border-[#E11791] rounded hover:bg-gray-100">
            Dashboard
          </button>
          <button @click="handleLogout" class="px-3 py-1 border border-[#E11791] rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="w-full mx-auto px-10 py-12">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-6 md:gap-0 mb-8">
        <div>
          <h2 class="text-4xl font-bold mb-2 text-gray-800">Ticket Management</h2>
          <p class="text-gray-500">Create, view, edit, and delete your tickets</p>
        </div>
        <button @click="isCreateOpen = true" class="px-4 py-2 bg-[#E11791] text-white rounded hover:opacity-90">
          + Create Ticket
        </button>
      </div>

      <div v-if="tickets.length === 0" class="p-12 bg-white rounded shadow text-center">
        <p class="text-gray-500 mb-4">No tickets yet</p>
        <button @click="isCreateOpen = true" class="px-4 py-2 bg-[#E11791] text-white rounded hover:opacity-90">
          + Create Your First Ticket
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="ticket in tickets" :key="ticket.id" class="p-6 bg-white rounded shadow border hover:shadow-lg transition">
          <div class="flex justify-between mb-4">
            <span :class="getStatusColor(ticket.status)" class="px-2 py-1 rounded text-sm">
              {{ ticket.status.replace('_', ' ') }}
            </span>
            <span :class="getPriorityColor(ticket.priority)" class="px-2 py-1 rounded text-sm">
              {{ ticket.priority }}
            </span>
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ ticket.title }}</h3>
          <p class="text-gray-500 mb-2">{{ ticket.description || 'No description' }}</p>
          <p class="text-sm text-gray-400 mb-4">
            Created: {{ new Date(ticket.createdAt).toLocaleDateString() }}
          </p>
          <div class="flex gap-2">
            <button @click="openEdit(ticket)" class="flex-1 px-2 py-1 border rounded hover:bg-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Edit
            </button>
            <button @click="openDelete(ticket)" class="flex-1 px-2 py-1 border rounded bg-red-500 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="isCreateOpen || isEditOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-2">{{ isCreateOpen ? 'Create Ticket' : 'Edit Ticket' }}</h2>

          <div class="space-y-3">
            <div>
              <label class="block mb-1">Title *</label>
              <input v-model="formData.title" :class="errors.title ? 'border-red-500' : 'border-gray-300'" class="w-full px-3 py-2 border rounded"/>
              <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
            </div>

            <div>
              <label class="block mb-1">Description</label>
              <textarea v-model="formData.description" class="w-full px-3 py-2 border rounded border-gray-300"></textarea>
            </div>

            <div>
              <label class="block mb-1">Status *</label>
              <select v-model="formData.status" :class="errors.status ? 'border-red-500' : 'border-gray-300'" class="w-full px-3 py-2 border rounded">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <p v-if="errors.status" class="text-red-500 text-sm">{{ errors.status }}</p>
            </div>

            <div>
              <label class="block mb-1">Priority</label>
              <select v-model="formData.priority" class="w-full px-3 py-2 border rounded border-gray-300">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button @click="closeModal" class="px-3 py-1 border rounded hover:bg-gray-100">Cancel</button>
            <button @click="isCreateOpen ? handleCreate() : handleEdit()" class="px-3 py-1 bg-[#E11791] text-white rounded hover:opacity-90">
              {{ isCreateOpen ? 'Create' : 'Save' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation -->
      <div v-if="isDeleteOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-sm">
          <h2 class="text-xl font-bold mb-2">Are you sure?</h2>
          <p class="mb-4">This will permanently delete ticket "{{ selectedTicket?.title }}"</p>
          <div class="flex justify-end gap-2">
            <button @click="isDeleteOpen = false" class="px-3 py-1 border rounded hover:bg-gray-100">Cancel</button>
            <button @click="handleDelete" class="px-3 py-1 bg-red-600 text-white rounded hover:opacity-90">Delete</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Toasts -->
    <Toaster :toasts="toasts" :removeToast="removeToast" />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/contexts/AuthContext";
import Toaster, { useToast } from "@/components/Toaster.vue";

export default {
  components: { Toaster },
  setup() {
    const { user, logout } = useAuth();
    const router = useRouter();

    // Toast hook
    const { toasts, addToast, removeToast } = useToast();

    const tickets = ref([]);
    const isCreateOpen = ref(false);
    const isEditOpen = ref(false);
    const isDeleteOpen = ref(false);
    const selectedTicket = ref(null);
    const formData = reactive({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    const errors = reactive({});

    const loadTickets = () => {
      const saved = localStorage.getItem("ticketapp_tickets");
      if (saved) tickets.value = JSON.parse(saved);
    };

    const saveTickets = (updated) => {
      localStorage.setItem("ticketapp_tickets", JSON.stringify(updated));
      tickets.value = updated;
    };

    const validateForm = () => {
      errors.title = !formData.title.trim() ? "Title is required" : "";
      errors.status = ["open", "in_progress", "closed"].includes(formData.status) ? "" : "Invalid status";
      return !errors.title && !errors.status;
    };

    const resetForm = () => {
      formData.title = "";
      formData.description = "";
      formData.status = "open";
      formData.priority = "medium";
      Object.keys(errors).forEach((k) => (errors[k] = ""));
    };

    const handleCreate = () => {
      if (!validateForm()) {
        addToast({ title: "Validation Error", description: "Please fix the errors", type: "error" });
        return;
      }
      const newTicket = { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() };
      saveTickets([...tickets.value, newTicket]);
      isCreateOpen.value = false;
      resetForm();
      addToast({ title: "Ticket Created!", description: "Your new ticket has been added.", type: "success" });
    };

    const handleEdit = () => {
      if (!selectedTicket.value || !validateForm()) {
        addToast({ title: "Validation Error", description: "Fix errors before saving.", type: "error" });
        return;
      }
      const updated = tickets.value.map((t) => (t.id === selectedTicket.value.id ? { ...t, ...formData } : t));
      saveTickets(updated);
      isEditOpen.value = false;
      selectedTicket.value = null;
      resetForm();
      addToast({ title: "Ticket Updated!", description: "Changes saved successfully.", type: "success" });
    };

    const handleDelete = () => {
      if (!selectedTicket.value) return;
      saveTickets(tickets.value.filter((t) => t.id !== selectedTicket.value.id));
      isDeleteOpen.value = false;
      addToast({ title: "Ticket Deleted", description: `Ticket "${selectedTicket.value.title}" removed.`, type: "success" });
      selectedTicket.value = null;
    };

    const openEdit = (ticket) => {
      selectedTicket.value = ticket;
      Object.assign(formData, ticket);
      isEditOpen.value = true;
    };

    const openDelete = (ticket) => {
      selectedTicket.value = ticket;
      isDeleteOpen.value = true;
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "open": return "bg-green-100 text-green-800";
        case "in_progress": return "bg-yellow-100 text-yellow-800";
        case "closed": return "bg-gray-100 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high": return "bg-red-100 text-red-800";
        case "medium": return "bg-[#e7a5c7] text-[#E11791]";
        case "low": return "bg-gray-100 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
      }
    };

    const handleLogout = () => {
      logout();
      router.push("/");
    };

    onMounted(loadTickets);

    const closeModal = () => {
      isCreateOpen.value = false;
      isEditOpen.value = false;
      resetForm();
    };

    return {
      user,
      tickets,
      isCreateOpen,
      isEditOpen,
      isDeleteOpen,
      selectedTicket,
      formData,
      errors,
      toasts,
      addToast,
      removeToast,
      openEdit,
      openDelete,
      handleCreate,
      handleEdit,
      handleDelete,
      getStatusColor,
      getPriorityColor,
      handleLogout,
      closeModal,
    };
  },
};
</script>
