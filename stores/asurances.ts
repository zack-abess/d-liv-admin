import {defineStore} from "pinia";
import {axiosClient3} from "~/utils/axios.js";

export const useAssurancesStore = defineStore("assurances", {
  state: () => ({
    all: {
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
    error: null
  }),

  actions: {
    async fetchOne(id) {
      this.$state.single.loading = true;
      this.$state.single.data = {};

      const res = await axiosClient3.get(`/assurances/${id}`);
      
      if (res.status !== 200 && res.status !== 201) {
        this.$state.single.loading = false;
        return;
      }

      const {data} = res;

      this.$state.single.data = data;
      this.$state.single.loading = false;
    },

    async getAll(options = {}) {
      this.$state.all.loading = true;
      this.$state.all.data = [];
      this.$state.all.total = null;
      this.$state.all.currentPage = 1;
      this.$state.all.pageCount = null;

      const res = await axiosClient3.get("/assurances", {params: { ...options, roles: ['user'] }});

      if (res.status !== 200 && res.status !== 201) {
        console.log('error', res);
        
        this.$state.all.loading = false;
        return;
      }

      const {data} = res;

      this.$state.all.data = data.data;
      this.$state.all.total = data.total;
      this.$state.all.currentPage = data.currentPage
      this.$state.all.pageCount = data.pageCount
      this.$state.all.loading = false;
    },

    async add(data) {
      try {
        return await axiosClient3.post("/assurances", data);
      } catch (error) {
        console.log(error);
      }
    },

    async update(data) {
      try {
        return await axiosClient3.patch("/assurances/" + data._id, data);
      } catch (error) {
        console.log(error);
      }
    },

    async delete(data) {
      try {
        return await axiosClient3.delete("/assurances/" + data._id, data);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
