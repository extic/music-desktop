import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import WelcomePage from "../views/WelcomePage.vue";
import MainPage from "../views/MainPage.vue";
import SongListPage from "../views/SongListPage.vue";

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
  {
    path: "/main",
    component: MainPage,
    children: [
      {
        path: "/song-list",
        name: "SongList",
        component: SongListPage,
      },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
