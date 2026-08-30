import {useAuthedUser} from "~/stores/authedUser";
import {useUsersStore} from "~/stores/account";
import {useCategoriesStore} from "~/stores/categories";

export default defineNuxtPlugin((NuxtApp) => {
    return {
        provide: {
            authedUserStore: useAuthedUser(),
            usersStore: useUsersStore(),
            assurancesStore: useAssurancesStore(),
            categoriesStore: useCategoriesStore(),
            deliveriesStore: useDeliveriesStore(),
            dashboardStore: useDashboardStore(),
        },
    };
});
