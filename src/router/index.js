import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "lobby" */ "../components/LocationDetails.vue"),
    props: true,
  },
  {
    path: "/location/:city",
    name: "LocationDetails",
    component: () =>
      import(/* webpackChunkName: "lobby" */ "../components/LocationDetails.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
