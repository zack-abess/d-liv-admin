import { defineStore } from "pinia";

export const useAuthedUser = defineStore("authedUser", {
  state: () => ({
    isAuthenticated: false,
    authData: {
      token: "",
    },
    userData: null,
    isLoading: false,
    error: null
  }),
  actions: {
    
    async init() {
      const token = localStorage.getItem("token");

      if (token) {
        this.$state.authData.token = token;
        const data = await this.fetchUserData();
        console.log("init user data => ", data);
        if (!data) {
          this.clearUserData();
        } else {
          this.$state.userData = data;
          this.$state.isAuthenticated = true;
        }
      }
    },

    async login(email, password) {
      //TODO:check role and redirect to appropriate page
      const router = useRouter();

      this.$state.error = null;
      this.$state.isLoading = true;
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      if ( res.status === 200 || res.status === 201) {
        const {data} = res;

        this.$state.userData = data.user;
        this.$state.authData.token = data.token;
        //save token to local storage
        localStorage.setItem("token", data.token);
        this.$state.isAuthenticated = true;
        this.$state.error = null;
        this.$state.isLoading = false;

        await this.fetchUserData()
        //navigate to home page
        await router.push("/");
      } else {
        const {data} = res.response  
        this.$state.error = data.message;
        this.$state.isLoading = false;
      }

      return res;
    },

    async fetchUserData() {
      try {
        const { data } = await axiosClient2.get("/auth/me");

        this.$state.userData = data;
        return data;
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
      }
    },

    async refreshToken() {
      //TODO: implement refresh token
    },

    async logout() {
      const router = useRouter();
      localStorage.removeItem("token");
      this.clearUserData();
      await router.push("/auth/login");
    },

    async forgotPassword(email) {
      const res = await axiosClient.post("/auth/password-rese", { email });
      //save email to local storage
      localStorage.setItem("reset_email", email);
      return res;
    },

    async verifyResetToken(token) {
      const email = localStorage.getItem("reset_email");
      const res = await axiosClient.post("/auth/verify-password-reset-token", { email, token });
      if (res.status === 200 || res.status === 201) {
        //save reset token to local storage
        localStorage.setItem("reset_token", token);
      }
      return res;
    },

    async resetPassword(password) {
      const email = localStorage.getItem("reset_email");
      const token = localStorage.getItem("reset_token");
      const res = await axiosClient.post("/auth/reset-password", { newPassword: password, token, email });

      if (res.status === 200 || res.status === 201) {
          localStorage.removeItem("reset_email");
          localStorage.removeItem("reset_token");
      }
      return res;
    },

    clearUserData() {
      this.$state.isAuthenticated = false;
      this.$state.userData = {};
      this.$state.authData.token = null;
    },
  },
});
