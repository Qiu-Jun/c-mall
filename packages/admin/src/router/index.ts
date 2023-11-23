/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-14 13:34:39
 * @LastEditors: June
 * @LastEditTime: 2023-10-27 23:45:33
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import constantsRouter from './modules/constants';
import type { App } from 'vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantsRouter,
  scrollBehavior: () => {
    return { top: 0 };
  },
});

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Login'];
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
};

export const setupRouter = (app: App<Element>) => app.use(router);

export default router;
