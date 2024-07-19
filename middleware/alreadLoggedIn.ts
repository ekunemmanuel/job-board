export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();

  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    // console.log(idTokenResult.claims.role);
    return navigateTo({
      path: "/dashboard",
    });
    // switch (idTokenResult.claims.role) {
    //   case "admin":
    //     return await navigateTo({
    //       path: "/dashboard",
    //     });

    //   default:
    //     return await navigateTo({
    //       path: "/",
    //     });
    // }
  }
});
