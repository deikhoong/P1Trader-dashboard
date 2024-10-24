import {create} from "zustand";
import {LoginForm, UserInfo} from "../api/api.types";
import {Login, Logout} from "../api/auth";

interface AuthState {
  user: UserInfo | null;
  isLogin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (values: LoginForm) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isLogin: (() => {
    const at = localStorage.getItem("at");
    const rt = localStorage.getItem("rt");
    return at && rt ? true : false;
  })(),
  login: async (values: LoginForm) => {
    set({isLoading: true, error: null});
    try {
      const response = await Login(values);
      if (response) {
        const {user, accessToken, refreshToken} = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("at", accessToken);
        localStorage.setItem("rt", refreshToken);
        set({user, isLogin: true, isLoading: false});
        return true;
      } else {
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "登入失敗",
        isLoading: false,
      });
      return false;
    }
  },
  logout: async () => {
    set({isLoading: true, error: null});
    try {
      const response = await Logout();
      if (response) {
        set({isLogin: false, isLoading: false});
        localStorage.removeItem("user");
        localStorage.removeItem("at");
        localStorage.removeItem("rt");
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "登出失敗",
        isLoading: false,
      });
      return false;
    }
  },
}));

export default useAuthStore;
