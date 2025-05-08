import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useClassesStore = defineStore("classes", () => {
    const classes = ref([]);

    // Fetch data from Strapi using .then()
    const fetchClasses = () => {
        fetch(
            "https://popular-gift-b355856076.strapiapp.com/api/hold-motions?populate[0]=De_praktiske_oplysninger&populate[2]=Priser&populate[3]=Cover_Billedet&populate[4]=Relaterede_hold.Cover_Billedet&populate[5]=Indhold.Afsnit.Tekst&populate[6]=Indhold.Afsnit.Billede&populate[7]=Indhold.Afsnit.Knapper"
        )
            .then(response => response.json())
            .then(data => {
                classes.value = data.data.map(item => ({
                    id: item.id,
                    name: item.Titel,
                    Traenings_kategorier: item.Traenings_kategorier,

                }));
            })
            .catch(error => {
                console.error("Fejl ved hentning af hold:", error);
            });
    };

    // Computed property
    const numberOfClasses = computed(() => classes.value.length);

    return { classes, numberOfClasses, fetchClasses };
});
