export const useNotification = () => {
  const toast = useToast();
  toast.update("s", {});
  function notification({ title, message, type = "success" }: Notification) {
    const color =
      type === "success"
        ? "primary"
        : type === "error"
        ? "rose"
        : type === "warning"
        ? "yellow"
        : "blue";
    toast.add({
      title,
      description: message,
      color: color,
    });
  }
  function error({ title, message }: Notification) {
    notification({ title, message, type: "error" });
  }

  function success({ title, message }: Notification) {
    notification({ title, message, type: "success" });
  }

  function warning({ title, message }: Notification) {
    notification({ title, message, type: "warning" });
  }

  function info({ title, message }: Notification) {
    notification({ title, message, type: "info" });
  }

  return {
    error,
    success,
    warning,
    info,
  };
};

type Notification = {
  id?: string;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
};
