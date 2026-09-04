import { defineStore } from "pinia";

export const useAuthedUser = defineStore("authedUser", {
  state: () => ({
    isAuthenticated: false,
    authData: {
      token: "",
      refreshToken: "",
    },
    userData: null,
    isLoading: false,
    error: null
  }),
  actions: {
    
    async init() {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (token) {
        this.$state.authData.token = token;
        this.$state.authData.refreshToken = refreshToken || "";
        const data = await this.fetchUserData();
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
      // Le rôle est OBLIGATOIRE ici. Sans lui l'API applique « user » par
      // défaut : elle ne trouve pas de compte admin correspondant, en crée un
      // avec le rôle client (et un client Stripe au passage), et renvoie un
      // token `role: user` — que tous les endpoints @Roles(ADMIN) refusent.
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
        role: "admin",
      });

      if ( res.status === 200 || res.status === 201) {
        const {data} = res;

        this.$state.userData = data.user;
        this.$state.authData.token = data.token;
        this.$state.authData.refreshToken = data.refreshToken || "";
        //save tokens to local storage
        localStorage.setItem("token", data.token);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
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
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        return null;
      }
    },

    async refreshToken() {
      const refreshToken =
        this.$state.authData.refreshToken || localStorage.getItem("refreshToken");

      // Pas de refresh token disponible → déconnexion
      if (!refreshToken) {
        await this.logout();
        return null;
      }

      try {
        // axiosClient (sans intercepteur) pour éviter toute boucle sur 401
        const res = await axiosClient.post("/auth/refresh-token", { refreshToken });
        const newToken = res?.data?.token;

        if (!newToken) {
          throw new Error("Réponse de refresh invalide");
        }

        this.$state.authData.token = newToken;
        localStorage.setItem("token", newToken);
        return newToken;
      } catch (error: any) {
        // Refresh token expiré/invalide → on déconnecte proprement
        await this.logout();
        return null;
      }
    },

    async logout() {
      const router = useRouter();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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
