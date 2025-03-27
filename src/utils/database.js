export const db = {
    logClick: async (data) => {
      console.log("✅ Click Logged:", data);
      return { success: true, message: "Click logged" };
    },
  };