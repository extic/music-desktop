import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import WelcomePage from "../views/WelcomePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "welcome",
  },
  {
    path: "/welcome",
    name: "WelcomePage",
    component: WelcomePage,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
