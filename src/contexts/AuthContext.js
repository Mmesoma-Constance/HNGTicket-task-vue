// src/contexts/AuthContext.js
import { reactive, readonly, provide, inject, onMounted } from "vue";

const AuthSymbol = Symbol("Auth");

export function provideAuth() {
  const state = reactive({
    user: null,
  });

  // Load session from localStorage
  onMounted(() => {
    const session = localStorage.getItem("ticketapp_session");
    if (session) {
      try {
        state.user = JSON.parse(session);
      } catch {
        localStorage.removeItem("ticketapp_session");
      }
    }
  });

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);

    if (found) {
      const userData = { email: found.email, name: found.name };
      state.user = userData;
      localStorage.setItem("ticketapp_session", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (email, password, name) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");

    if (users.some((u) => u.email === email)) return false;

    const newUser = { email, password, name };
    users.push(newUser);
    localStorage.setItem("ticketapp_users", JSON.stringify(users));

    const userData = { email, name };
    state.user = userData;
    localStorage.setItem("ticketapp_session", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    state.user = null;
    localStorage.removeItem("ticketapp_session");
  };

  provide(AuthSymbol, {
    state: readonly(state),
    login,
    signup,
    logout,
    isAuthenticated: () => !!state.user,
  });
}

// Hook to use auth context
export function useAuth() {
  const context = inject(AuthSymbol);
  if (!context) throw new Error("useAuth must be used within provideAuth");
  return context;
}
