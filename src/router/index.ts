import { createRouter, createWebHistory, RouteRecordRaw ,createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home
  // },
  {
    path: "/imageList",
    name: "imageList",
    component: () => import("@/components/ImageList")
  },
  {
    path: "/",
    name: "Test",
    component: () => import("@/components/Test/Test")
  },
  {
    path: "/formatJson",
    name: "FormatJson",
    component: () => import("@/components/Json/formatJson")
  }
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// });

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
