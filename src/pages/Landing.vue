<template>
  <div class="min-h-screen bg-background max-w-1440px overflow-hidden relative">
    <!-- Decorative Background Circles -->
    <DecorativeCircle size="lg" position="top-left" animate />
    <DecorativeCircle size="md" position="top-right" animate class="animate-float-delayed" />

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div
        class="container-app relative z-10 bg-gradient-to-t from-[#e7a5c7aa] via-white to-[#e76fb6aa] p-10 md:p-20"
      >
        <div class="max-w-3xl mx-auto text-center p-4">
          <header class="text-3xl md:text-4xl font-bold mb-6 leading-tight text-[#E11791]">
            TicketHub
          </header>
          <div class="text-center mx-auto">
            <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">
              Manage Your Support
              <span class="text-[#E11791] text-center"> Tickets Effortlessly </span>
            </h1>
          </div>
          <p class="text-xl mb-8">
            TicketHub streamlines your customer support workflow with powerful
            tools for creating, tracking, and resolving tickets efficiently.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink
              to="/auth/signup"
              class="text-lg p-2 px-8 bg-[#E11791] text-white rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
            >
              Get Started
            </RouterLink>
            <RouterLink
              to="/auth/login"
              class="text-lg p-2 px-8 bg-gray-500 text-white rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
            >
              Login
            </RouterLink>
          </div>
        </div>
      </div>

      <WaveBackground />
    </section>

    <!-- Features Section -->
    <section class="py-20 relative px-10 bg-[#fce4ef] bg-opacity-20">
      <DecorativeCircle size="sm" position="bottom-right" class="opacity-50" />

      <div class="container-app">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Powerful Features</h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to deliver exceptional customer support
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
          >
            <div class="w-12 h-12 rounded-lg bg-[#E11791] flex items-center justify-center mb-4">
              <component :is="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-muted-foreground">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 relative overflow-hidden px-10">
      <div class="absolute inset-0 bg-[#fce4ef] opacity-40"></div>
      <DecorativeCircle size="md" position="bottom-left" animate />
      <DecorativeCircle size="lg" position="top-right" animate />

      <div class="container-app relative z-10">
        <div class="p-10 md:p-12 text-center shadow-2xl border-2">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams using TicketHub to deliver amazing
            customer support
          </p>
          <RouterLink
            to="/auth/signup"
            class="text-[15px] md:text-lg p-2 px-8 bg-[#E11791] text-white rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
          >
            Create Your Account
          </RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import { Ticket, CheckCircle, TrendingUp, Users } from "lucide-vue-next";
import Footer from "../components/Footer.vue";
import DecorativeCircle from "../components/DecorativeCircle.vue";
import WaveBackground from "../components/WaveBackground.vue";

export default {
  name: "Landing",
  components: {
    Ticket,
    CheckCircle,
    TrendingUp,
    Users,
    Footer,
    DecorativeCircle,
    WaveBackground,
  },
  data() {
    return {
      features: [
        { icon: Ticket, title: "Smart Ticket Management", description: "Organize and track all your support tickets in one centralized platform." },
        { icon: CheckCircle, title: "Status Tracking", description: "Monitor ticket progress with visual status indicators and real-time updates." },
        { icon: TrendingUp, title: "Analytics Dashboard", description: "Get insights into your support performance with comprehensive analytics." },
        { icon: Users, title: "Team Collaboration", description: "Work together seamlessly with your team to resolve tickets faster." },
      ],
    };
  },
};
</script>
