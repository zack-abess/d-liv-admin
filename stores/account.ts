import {defineStore} from "pinia";
import {axiosClient2} from "~/utils/axios.js";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: {
      loading: true,
      data: [],
      currentPage: 1,
      pageCount: null,
      total: null,
    },
    single: {
      data: {},
      loading: true,
    },
  }),

  actions: {
    async fetchUser(id) {
      this.$state.single.loading = true;
      this.$state.single.data = {};

      const res = await axiosClient2.get(`/users/${id}`);
      
      if (res.status !== 200 && res.status !== 201) {
        this.$state.single.loading = false;
        return;
      }

      const {data} = res;

      this.$state.single.data = data;
      this.$state.single.loading = false;
    },
    async getCustomers(options = {}) {
      this.$state.users.loading = true;
      this.$state.users.data = [];
      this.$state.users.total = null;
      this.$state.users.currentPage = 1;
      this.$state.users.pageCount = null;

      const res = await axiosClient2.get("/users", {params: { ...options, roles: ['user'] }});
      
      
      if (res.status !== 200 && res.status !== 201) {
        console.log('error', res);
        
        this.$state.users.loading = false;
        return;
      }

      const {data} = res;
      console.log(data);


      this.$state.users.data = data.data;
      this.$state.users.total = data.total;
      this.$state.users.currentPage = data.currentPage
      this.$state.users.pageCount = data.pageCount
      this.$state.users.loading = false;
    },
    async getAdmins(options = {}) {
      this.$state.users.loading = true;
      this.$state.users.data = [];
      this.$state.users.total = null;
      this.$state.users.currentPage = 1;
      this.$state.users.pageCount = null;

      const res = await axiosClient2.get("/users", {params: { ...options, roles: ['admin'] }});

      if (res.status !== 200 && res.status !== 201) {
        this.$state.users.loading = false;
        return;
      }

      const {data} = res;
      
      this.$state.users.data = data.data;
      this.$state.users.total = data.total;
      this.$state.users.currentPage = data.currentPage
      this.$state.users.pageCount = data.pageCount
      this.$state.users.loading = false;
    },

    async getDeliveries(options = {}) {
      this.$state.users.loading = true;
      this.$state.users.data = [];
      this.$state.users.total = null;
      this.$state.users.currentPage = 1;
      this.$state.users.pageCount = null;

      const res = await axiosClient2.get("/users", {params: { ...options, roles: ['delivery'] }});

      if (res.status !== 200 && res.status !== 201) {
        this.$state.users.loading = false;
        return;
      }

      const {data} = res;

      this.$state.users.data = data.data;
      this.$state.users.total = data.total;
      this.$state.users.currentPage = data.currentPage
      this.$state.users.pageCount = data.pageCount
      this.$state.users.loading = false;
    },

    async addUser(data) {
      try {
        return await axiosClient2.post("/users", data);
      } catch (error) {
        console.log(error);
      }
    },

    async updateUser(user) {
      try {
        return await axiosClient2.put("/users" + user._id, user);
      } catch (error) {
        console.log(error);
      }
    },


    async checkEmail(email) {
      try {
          return await axiosClient2.post("/auth/check-email", {email});
      } catch (error) {
          console.log(error);
      }
    },
    async checkPhone(phone) {
      try {
          return await axiosClient2.post("/auth/check-phone", {phone});
      } catch (error) {
          console.log(error);
      }
    },

    async updateStatus({status, type, comment}) {
      this.$state.single.loading = true;
      const id = this.$state.single.data._id;
      const res = await axiosClient2.put(`/users/docs/pieces/${id}`, {
        status: status,
        type: type,
        comment: comment
      });

      if (res.status !== 200 && res.status !== 201) {
        this.$state.single.loading = false;
        return;
      }

      const {data} = res;

      this.$state.single.data = data;
      this.$state.single.loading = false;
    }
  },
});
