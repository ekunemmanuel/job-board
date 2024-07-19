// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();
  const notification = useNotification();
  // Redirect the user to the login page if not authenticated
  if (!user) {
    if (
      to.path !== "/auth/login" &&
      to.path !== "/auth/register" &&
      to.path !== "/auth/forgot-password" &&
      to.path !== "/auth/reset-password" &&
      to.path !== "/auth"
    ) {
      return navigateTo({
        path: "/auth/login",
        query: {
          redirect: to.fullPath,
        },
      });
    }
    return;
  }

  // const idTokenResult = await user.getIdTokenResult();
  // const role = idTokenResult.claims.role;

  // const isAdminRoute = to.path.startsWith("/dashboard");

  // if (role === "admin" && !isAdminRoute) {
  //   notification.error({
  //     title: "Unauthorized",
  //     message: "You are not authorized to access this page",
  //   });
  //   return navigateTo("/dashboard");
  // }

  // if (!role && to.path !== "/") {
  //   notification.error({
  //     title: "Unauthorized",
  //     message: "You are not authorized to access this page",
  //   });
  //   return navigateTo("/");
  // }

  const isAdminRoute = to.path.startsWith("/dashboard");

  if (!isAdminRoute) {
    notification.error({
      title: "Unauthorized",
      message: "You are not authorized to access ad this page",
    });
    return navigateTo("/dashboard");
  }

  // if (to.path !== "/") {
  //   notification.error({
  //     title: "Unauthorized",
  //     message: "You are not authorized to access this page",
  //   });
  //   return navigateTo("/");
  // }
});
