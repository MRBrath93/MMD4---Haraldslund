import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useClassesStoreMotion = defineStore("motionclasses", () => {
    const classes = ref([]);

    // Fetch data from Strapi using .then()
    const fetchClasses = () => {
        fetch(
            "https://popular-gift-b355856076.strapiapp.com/api/hold-motions?pLevel"
        )
            .then(response => response.json())
            .then(data => {
                console.log("Data hentet fra Strapi:", data);
                classes.value = data.data.map(item => ({
                    id: item.id,
                }));
            })
            .catch(error => {
                console.error("Fejl ved hentning af hold:", error);
            });
    };



    // Computed property
    const numberOfClasses = computed(() => classes.value.length);

    return { classes, numberOfClasses, fetchClasses, };
});
