export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();

  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    console.log(idTokenResult.claims.role);
    
    switch (idTokenResult.claims.role) {
      case "admin":
        return await navigateTo({
          path: "/admin",
        });

      default:
        return await navigateTo({
          path: "/",
        });
    }
  }
});
