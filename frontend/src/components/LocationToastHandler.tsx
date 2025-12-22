import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function ToastFromLocation() {
  const location = useLocation();
  const { toast } = useToast();
  const state = (location as any).state;

  useEffect(() => {
    const payload = state?.authToast;
    if (payload) {
      toast(payload);
      window.history.replaceState({}, "", location.pathname);
    }
  }, [state, toast, location.pathname]);

  return null;
}

export default ToastFromLocation;