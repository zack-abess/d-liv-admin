<template>
  <div>
    <AdminLayout>
      <Head>
        <Title>{{ title }}</Title>
        <Meta name="description" :content="title" />
      </Head>
      <div class="my-5 text-md md:text-lg lg:text-2xl font-semibold text-gray-500">Comptes Clients</div>
      <div class="relative mb-5 bg-white border shadow-sm sm:rounded-lg">
        <!-- --- Start section action -->
        <div class="px-4 py-4 bg-white flex sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
          <div>
            <span class="text-gray-500 text-sm mr-2">Action multiple</span>
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="inline-flex gap-1 w-full justify-between items-center rounded-md bg-white border py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >
                  {{ selectedAction }}
                  <Icon name="ic:baseline-keyboard-arrow-down" size="16" class="h-5 w-5 text-gray-500 hover:text-gray-400" aria-hidden="true" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group flex w-full items-center rounded-md px-2 py-2 text-sm']"
                        @click="setAction('Publier')"
                      >
                        <Icon name="uil:file-export" :active="active" class="mr-2 h-5 w-5" aria-hidden="true" />
                        Publier
                      </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group flex w-full items-center rounded-md px-2 py-2 text-sm']"
                        @click="setAction('Dépublier')"
                      >
                        <Icon name="uil:file-import" :active="active" class="mr-2 h-5 w-5" aria-hidden="true" />
                        Dépublier
                      </button>
                    </MenuItem>
                  </div>
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group flex w-full items-center rounded-md px-2 py-2 text-sm']"
                        @click="setAction('Supprimer')"
                      >
                        <Icon name="bi:trash3" :active="active" class="mr-2 h-4 w-4" aria-hidden="true" />
                        Supprimer
                      </button>
                    </MenuItem>
                  </div>

<!--                  <div class="px-1 py-1">-->
<!--                    <MenuItem v-slot="{ active }">-->
<!--                      <button-->
<!--                        :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group flex w-full items-center rounded-md px-2 py-2 text-sm']"-->
<!--                        @click="setAction('Ordonner')"-->
<!--                      >-->
<!--                        <Icon name="bi:arrow-up-down" :active="active" class="mr-2 h-4 w-4" aria-hidden="true" />-->
<!--                        Ordonner-->
<!--                      </button>-->
<!--                    </MenuItem>-->
<!--                  </div>-->
                </MenuItems>
              </transition>
            </Menu>
            <button
                v-if="selectedAction === 'Ordonner'"
                @click="applyAction()"
                class="ml-3 inline-flex items-center text-white focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-2"
                :class="'bg-primary hover:bg-primary-light'"
            >
              Appliquer
            </button>
            <button
                v-else
                @click="(selectedAction === 'Séléctionner' || selectedDatas.length <= 0) ? null : applyAction()"
                class="ml-3 inline-flex items-center text-white focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-2"
                :class="(selectedAction === 'Séléctionner' || selectedDatas.length <= 0) ? 'bg-primary/50' : 'bg-primary hover:bg-primary-light'"
            >
              Appliquer
            </button>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex flex-inline gap-1">
              <label for="table-search" class="sr-only">Search</label>
              <div class="relative">
                <input
                  id="table-search"
                  v-model="search"
                  type="text"
                  class="py-2 px-3 pe-5 block bg-white border focus:outline-none rounded-lg text-sm text-gray-500 focus:ring-1 focus:border-gray-200 focus:ring-gray-300 placeholder:text-gray-400"
                  placeholder="Rechercher un avis"
                  @change="fetchPaginatedData()"
                />
              </div>
              <button
                class="inline-flex items-center text-white focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-2"
                :class="!search || search === '' ? 'bg-primary/50' : 'bg-primary hover:bg-primary-light'"
                @click="!search || search === '' ? null : fetchPaginatedData()"
              >
                <Icon name="mdi:magnify" size="22" class="text-gray-300" />
              </button>
            </div>
            <button
                class="inline-flex items-center text-white focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-2 bg-primary hover:bg-primary-light"
                @click="showAddNewModal()"
            >
              <Icon name="mdi:plus" size="22" class="text-gray-300" />
            </button>
            <AddModal
              v-model="showAddModal"
              @clole="onModalClose"
            />
          </div>
        </div>
        <!-- --- End section action -->

        <!-- --- Start section table -->
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100 border-t border-b">
            <tr>
              <th scope="col" class="px-6 py-3 text-primary font-light">
                <input
                  v-model="selectedDataModel"
                  type="checkbox"
                  class="form-checkbox h-4 w-4 text-green-600 accent-green-700 checkbox"
                  :class="{ 'checkbox-checked': selectedDataModel }"
                  @change="toggleAllDatas"
                />
              </th>

              <th scope="col" class="px-6 py-3 text-primary font-light">
                Nom
                <Icon name="uil:sort" class="cursor-pointer" size="16" @click="sortDatas('year')" />
              </th>
              <th v-if="isEditabled" scope="col" class="px-6 py-3 text-primary font-light">Poids</th>
              <th scope="col" class="px-6 py-3 text-primary font-light">
                <div class="flex items-center">
                  Prénom
                  <Icon name="uil:sort" class="cursor-pointer" size="16" @click="sortDatas('created_at')" />
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-primary font-light">
                <div class="flex items-center">
                  Mail
                  <Icon name="uil:sort" class="cursor-pointer" size="16" @click="sortDatas('created_at')" />
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-primary font-light">Statut</th>
              <th scope="col" class="text-right px-6 py-3 text-primary font-light">Actions</th>
            </tr>
          </thead>
          <!-- --- Start section table body without data --- -->
          <tbody v-if="$usersStore.users.loading || !$usersStore.users?.data?.length">
            <!-- Skeleton -->
            <tr v-for="i of [1, 4, 5, 6, 7, 8]" v-if="$usersStore.users.loading" class="border-b bg-white hover:bg-gray-100 h-12">
              <td class="text-center ps-4">
                <VaSkeleton variant="rounded" inline width="40px" height="28px" />
              </td>
              <td class="text-center ps-4">
                <VaSkeleton variant="rounded" inline width="240px" height="28px" />
              </td>
              <td class="text-center ps-4">
                <VaSkeleton variant="rounded" inline width="110px" height="28px" />
              </td>
              <td class="text-center ps-4">
                <VaSkeleton variant="rounded" inline width="90px" height="28px" />
              </td>
              <td class="text-center pe-4">
                <VaSkeleton class="ms-auto" variant="rounded" inline width="40px" height="28px" />
              </td>
            </tr>
            <!-- No data -->
            <tr v-else class="border-b bg-white hover:bg-gray-100">
              <td colspan="5">
                <p class="text-center py-8 text-gray-700">Pa de données disponible</p>
              </td>
            </tr>
          </tbody>
          <!-- --- Start section table body with data --- -->
          <tbody v-else-if="!isEditabled">
            <tr
              v-for="data in $usersStore.users.data"
              :key="data._id"
              :class="{
                'bg-[#256B3F]/10': data.selected,
                'bg-white': !data.selected,
                'border-b  ': true,
              }"
            >
              <th class="px-6">
                <input
                  v-model="data.selected"
                  type="checkbox"
                  :class="{ 'checkbox-checked': data.selected }"
                  class="form-checkbox h-4 w-4 text-primary accent-green-700 checkbox"
                  @input="toggleDataSelection(data)"
                />
              </th>
              <th scope="row" class="px-6 text-md font-medium text-gray-600 whitespace-nowrap">
                {{ data.firstName }}
              </th>
              <th scope="row" class="px-6 text-md font-medium text-gray-600 whitespace-nowrap">
                {{ data.lastName }}
              </th>
              <td class="px-6 text-md text-gray-600">
                {{ data.email }}
              </td>
              <td class="px-6 pt-2">
                <span v-if="data.isActive" class="bg-blue-800/15 text-blue-800 px-2 py-0.5 rounded">Actif</span>
                <span v-if="!data.isActive" class="bg-gray-800/15 text-gray-800 px-2 py-0.5 rounded">Inactif</span>
              </td>
              <td class="px-6 text-right">
                <Menu as="div" class="relative inline-block text-left">
                  <div>
                    <MenuButton
                      class="inline-flex items-center justify-center rounded-full w-10 h-10 bg-black bg-opacity-0 text-sm font-medium text-white hover:bg-opacity-5 focus:bg-opacity-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                      <Icon name="bi:three-dots-vertical" size="18" class="text-gray-500" aria-hidden="true" />
                    </MenuButton>
                  </div>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems
                      class="absolute top-5 z-10 right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group gap-1 flex w-full items-center rounded-md px-2 py-2 text-sm']"
                            @click="editData(data)"
                          >
                            <Icon name="uil:edit" size="14" />Modifier
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group gap-1 flex w-full items-center rounded-md px-2 py-2 text-sm']"
                            @click="deleteData(data)"
                          >
                            <Icon name="uil:trash-alt" size="14" />Supprimer
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </td>
            </tr>
          </tbody>
          <!-- editabled -->
          <draggable v-else-if="isEditabled" tag="tbody" :list="$usersStore.users.data" :options="{ handle: '.handle' }" class="w-full">
            <tr
              v-for="data in $usersStore.users.data"
              :key="data._id"
              :class="{
                'bg-[#256B3F]/10': data.selected,
                'bg-white': !data.selected,
                'border-b  ': true,
              }"
            >
              <th class="px-6 relative">
                <Icon name="charm:grab-vertical" size="18" class="absolute left-0 top-50 bottom-50 handle cursor-move text-gray-300" />
                <input
                  v-model="data.selected"
                  type="checkbox"
                  :class="{ 'checkbox-checked': data.selected }"
                  class="form-checkbox h-4 w-4 text-primary accent-green-700 checkbox"
                  @input="toggleDataSelection(data)"
                />
              </th>
              <th scope="row" class="px-6 text-md font-medium text-gray-600 whitespace-nowrap">
                {{ data.year }}
              </th>
              <td class="px-6 text-md text-gray-600">
                {{ data.weight }}
              </td>
              <td class="px-6 text-md text-gray-600">
                {{ formatDate(data.created_at) }}
              </td>
              <td class="px-6 pt-2">
                <VaSwitch v-model="data.published" size="small" true-label="En ligne" false-label="Hors ligne" @click="togglePublished(data)" />
              </td>
              <td class="px-6 text-right">
                <Menu as="div" class="relative inline-block text-left">
                  <div>
                    <MenuButton
                      class="inline-flex items-center justify-center rounded-full w-10 h-10 bg-black bg-opacity-0 text-sm font-medium text-white hover:bg-opacity-5 focus:bg-opacity-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                      <Icon name="bi:three-dots-vertical" size="18" class="text-gray-500" aria-hidden="true" />
                    </MenuButton>
                  </div>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems
                      class="absolute top-5 z-10 right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group gap-1 flex w-full items-center rounded-md px-2 py-2 text-sm']"
                            @click="editData(data)"
                          >
                            <Icon name="uil:edit" size="14" />Modifier
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[active ? 'bg-primary text-white' : 'text-gray-600', 'group gap-1 flex w-full items-center rounded-md px-2 py-2 text-sm']"
                            @click="deleteData(data)"
                          >
                            <Icon name="uil:trash-alt" size="14" />Supprimer
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </td>
            </tr>
          </draggable>
        </table>
        <!-- --- End section table -->

        <!-- --- Start section pagination -->
        <div class="py-3 px-3 flex items-center justify-between">
          <div class="flex items-center gap-5">
            <div class="flex items-center">
              <label for="perPageSelect" class="mr-2 text-gray-500">Afficher par page:</label>
              <select id="perPageSelect" v-model="perPage" class="shadow-sm border bg-white text-gray-500 px-3 py-2 text-sm rounded-md" @change="handlePerPageChange">
                <option value="1">1</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
            <div class="text-gray-500">
              Affichage {{ (currentPage - 1) * perPage + 1 }} -
              {{ $usersStore.users?.pageCount}}
              sur {{ $usersStore.users?.total }}
            </div>
          </div>
          <Pagination :current-page="currentPage" :total-pages="$usersStore.users.pageCount" :on-page-change="handlePageChange" />
        </div>
        <!-- --- End section pagination -->
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
  import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
  import AdminLayout from "~/layouts/AdminLayout.vue";
  import swal from "~/plugins/sweetalert.js";
  import { formatDate } from "~/utils/helpers.js";
  import Pagination from "~/components/core/Pagination.vue";
  import { useAuthedUser } from "~/stores/authedUser";
  import AddModal from "~/pages/admin/administration/comptes/admins/addModal.vue";

  const authedUser = useAuthedUser();
  const { $usersStore } = useNuxtApp();
  const $swal = swal().provide.swal;
  const title = ref("D-liv | Liste Comptes Client");
  const search = ref(null);
  const selectedDatas = ref([]);
  const currentPage = ref(1);
  const perPage = ref(10);
  const sortField = ref("label");
  const sortDirection = ref("desc");
  const selectedAction = ref("Séléctionner");
  const selectedDataModel = ref(false);

  const user = ref(null);
  user.value = authedUser.userData;
  const DEFAULT_MODEL = {
    _id: "",
    year: new Date().getFullYear(),
    file: "",
    weight: 0,
  };

  const datasModel = ref({ ...DEFAULT_MODEL });

  const showAddModal = ref(false);

  const isEditabled = ref(false);
  const setAction = (action) => {
    if (action === "Ordonner") {
      isEditabled.value = true;
    }
    selectedAction.value = action;
  };

  const toggleAllDatas = () => {
    if (selectedDatas.value.length === $usersStore.users.data.length) {
      selectedDatas.value = [];
      $usersStore.users.data.forEach((data) => {
        data.selected = false;
      });
      selectedDataModel.value = false;
    } else {
      selectedDatas.value = [];
      $usersStore.users.data.forEach((data) => {
        data.selected = true;
        selectedDatas.value.push(data);
      });
      selectedDataModel.value = true;
    }
  };

  const handlePageChange = async (newPage) => {
    currentPage.value = newPage;
    await fetchPaginatedData();
  };

  const onModalClose = async () => {
    datasModel.value = { ...DEFAULT_MODEL };
    await fetchPaginatedData();
  };

  const showAddNewModal = () => {
    showAddModal.value = true;
  };

  const editData = async (user) => {
    $usersStore.single.data = user
    showAddModal.value = true;
    showAddNewModal();
  };

  const deleteData = async (data) => {
    try {
      const result = await $swal.fire({
        title: "Êtes vous sur de vouloir supprimer?",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#15803d",
        cancelButtonColor: "#d33",
        cancelButtonText: "Annuler",
      });
      if (result.isConfirmed) {
        // const res = await $dataStore.deleteData(data);
        // if (res.success) {
        //   await $swal.fire({
        //     title: "Avis général supprimé avec succès",
        //     icon: "success",
        //     confirmButtonColor: "#15803d",
        //   });
        //
        //   if ($usersStore.users.data.length === 1 && currentPage.value > 1) {
        //     currentPage.value--; // Decrement the current page
        //   }
        //   await fetchPaginatedData();
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const published = async () => {
    if (selectedDatas.value.length === 0) {
      $swal.fire({
        position: "center",
        icon: "warning",
        title: "Sélectionner des données",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      // const res = await $dataStore.publishedAll(selectedDatas.value);
      // if (res.status === 200) {
      //   $usersStore.users.data.map((c) => {
      //     selectedDatas.value.map((s) => {
      //       if (s._id === c._id) c.published = true;
      //       return c;
      //     });
      //   });
      //   selectedDatas.value.map((c) => {
      //     c.selected = false;
      //   });
      //   selectedDatas.value = [];
      //   selectedAction.value = "Sélectionner";
      //   selectedDataModel.value = false;
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const unPublished = async () => {
    if (selectedDatas.value.length === 0) {
      await $swal.fire({
        position: "center",
        icon: "warning",
        title: "Sélectionner des données",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      // const res = await $dataStore.unPublishedAll(selectedDatas.value);
      // if (res.status === 200) {
      //   $usersStore.users.data.map((c) => {
      //     selectedDatas.value.map((s) => {
      //       if (s._id === c._id) c.published = false;
      //       return c;
      //     });
      //   });
      //   selectedDatas.value.map((c) => {
      //     c.selected = false;
      //   });
      //   selectedDatas.value = [];
      //   selectedAction.value = "Sélectionner";
      //   selectedDataModel.value = false;
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAll = async () => {
    if (selectedDatas.value.length === 0) {
      await $swal.fire({
        position: "center",
        icon: "warning",
        title: "Sélectionner des données",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      $swal
        .fire({
          title: "Êtes vous sur de vouloir tous les supprimer?",
          icon: "error",
          showCancelButton: true,
          confirmButtonColor: "#15803d",
          cancelButtonColor: "#d33",
          cancelButtonText: "Annuler",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              // const res = await $dataStore.deleteAll(selectedDatas.value);
              // if (res.success) {
              //   selectedDatas.value = [];
              //   selectedAction.value = "Sélectionner";
              //   $swal.fire({
              //     title: "Avis supprimés avec succès",
              //     icon: "success",
              //     confirmButtonColor: "#15803d",
              //   });
              //   await fetchPaginatedData();
              // }
            } catch (err) {
              console.log(err);
            }
          }
        });
    }
  };

  const orderTable = () => {
    const ids = $usersStore.users.data.map((c) => c._id);
    const params = {
      ids: ids,
    };
    // try {
    //   $dataStore.order(params);
    //   $swal.fire({
    //     position: "center",
    //     icon: "success",
    //     title: "Ordre modifié avec succès",
    //     showConfirmButton: false,
    //     timer: 1500,
    //   });
    //
    //   isEditabled.value = false;
    //   selectedAction.value = "Sélectionner";
    //   fetchPaginatedData();
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const publishedOne = async (data) => {
    if (!data) {
      await $swal.fire({
        position: "center",
        icon: "warning",
        title: "Aucun id ! mise à jour impossible",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // try {
    //   const res = await $dataStore.publishedOne(data);
    //   if (res.status !== 200) {
    //     $usersStore.users.data.map((c) => {
    //       if (data._id === c._id) c.published = false;
    //       return c;
    //     });
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };
  const unpublishedOne = async (data) => {
    // if (!data) {
    //   await $swal.fire({
    //     position: "center",
    //     icon: "warning",
    //     title: "Aucun id ! mise à jour impossible",
    //     showConfirmButton: false,
    //     timer: 1500,
    //   });
    // }
    // try {
    //   const res = await $dataStore.unPublishedOne(data);
    //   if (res.status !== 200) {
    //     $usersStore.users.data.map((c) => {
    //       if (data._id === c._id) c.published = true;
    //       return c;
    //     });
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const applyAction = async () => {
    if (selectedAction.value) {
      switch (selectedAction.value) {
        case "Publier":
          await published();
          break;
        case "Dépublier":
          await unPublished();
          break;
        case "Supprimer":
          await deleteAll();
          break;
        case "Ordonner":
          isEditabled.value = false;
          await orderTable();
          break;
      }
    }
  };

  const handlePerPageChange = async (type) => {
    currentPage.value = 1;
    await fetchPaginatedData();
  };

  const togglePublished = async (data) => {
    if (data.published === false) {
      await unpublishedOne(data);
    } else {
      await publishedOne(data);
    }
  };

  const toggleDataSelection = (data) => {
    data.selected = !data.selected;
    if (data.selected) {
      selectedDatas.value.push(data);
    } else {
      selectedDatas.value = selectedDatas.value.filter((n) => data._id !== data._id);
    }
  };

  const sortDatas = (field) => {
    if (field === sortField.value) {
      if (sortDirection.value === "desc") {
        sortDirection.value = "asc";
      } else {
        sortDirection.value = "desc";
      }
    } else {
      sortField.value = field;
      sortDirection.value = "asc";
    }
    fetchPaginatedData();
  };

  const fetchPaginatedData = async () => {
    let params = {};
    if (isEditabled) {
          params = {
            search: search.value,
            page: currentPage.value,
            limit: perPage.value,
          };
        } else {
          params = {
            label: search.value,
            page: currentPage.value,
            limit: perPage.value,
            sort_field: sortField.value,
            sort_direction: sortDirection.value,
          };
        }
    try {
      await $usersStore.getAdmins(params);
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {
    await fetchPaginatedData();
  });
</script>
<style scoped>
  .checkbox {
    @apply dark:bg-white dark:border-gray-400 rounded-sm p-2;
  }
  .checkbox-checked {
    @apply bg-green-600 border-green-600 rounded-sm p-2;
  }
</style>