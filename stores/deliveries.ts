import {defineStore} from "pinia";
import {axiosClient3} from "~/utils/axios.js";

export const useDeliveriesStore = defineStore("deliveries", {
  state: () => ({
    all: {
      loading: true,
      data: [],
      currentPage: 1,
      pageCount: null,
      total: null,
    },
    itineraires: {
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

      const res = await axiosClient3.get(`/deliveries/${id}`);
      
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

      const res = await axiosClient3.get("/deliveries", {params: { ...options }});

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

    async getItineraires(options = {}) {
      this.$state.itineraires.loading = true;
      this.$state.itineraires.data = [];
      this.$state.itineraires.total = null;
      this.$state.itineraires.currentPage = 1;
      this.$state.itineraires.pageCount = null;

      const res = await axiosClient3.get("/deliveries/itineraires", {params: { ...options }});

      if (res.status !== 200 && res.status !== 201) {
        console.log('error', res);

        this.$state.all.loading = false;
        return;
      }

      const {data} = res;

      this.$state.itineraires.data = data.data;
      this.$state.itineraires.total = data.total;
      this.$state.itineraires.currentPage = data.currentPage
      this.$state.itineraires.pageCount = data.pageCount
      this.$state.itineraires.loading = false;
    },

    async add(data) {
      try {
        return await axiosClient3.post("/deliveries", data);
      } catch (error) {
        console.log(error);
      }
    },

    async update(data) {
      try {
        return await axiosClient3.patch("/deliveries/" + data._id, data);
      } catch (error) {
        console.log(error);
      }
    },

    async delete(data) {
      try {
        return await axiosClient3.delete("/deliveries/" + data._id, data);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
