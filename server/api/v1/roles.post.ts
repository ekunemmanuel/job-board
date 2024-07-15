// server/api/setCustomClaims.ts
import { getAuth } from "firebase-admin/auth";
export default defineEventHandler(async (event) => {
  const { idToken, role } = await readBody(event);
  const auth = getAuth();
  try {
    const claims = await auth.verifyIdToken(idToken);
    await auth.setCustomUserClaims(claims.uid, {
      role,
    });
    return {
      status: 200,
      message: 'Role set successfully'
    };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw createError({
      status: 500,
      message: 'Error setting custom claims',
    })
  }
});
