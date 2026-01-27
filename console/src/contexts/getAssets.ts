import { API } from "./API";
import { getErrorResponse } from "./Callbacks";
export const handleLogout = async () => {
  try {
    await API.get(`/auth/logout`);
    window.location.reload();
  } catch (error) {
    getErrorResponse(error, true);
  }
};
