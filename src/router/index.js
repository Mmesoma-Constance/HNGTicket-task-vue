import { createRouter, createWebHistory } from "vue-router";

import Landing from "../pages/Landing.vue";
import Signup from "../pages/Signup.vue";   
import Login from "../pages/Login.vue";     
import Dashboard from "../pages/Dashboard.vue"; 
import Tickets from "../pages/Tickets.vue"; 

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/auth/signup", name: "Signup", component: Signup },
  { path: "/auth/login", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/tickets", name: "Tickets", component: Tickets },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
