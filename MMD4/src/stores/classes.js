import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useClassesStore = defineStore("classes", () => {
    const classes = ref([
        { id: 1, name: "Math", description: "Mathematics" },
        { id: 2, name: "Science", description: "Science" },
        { id: 3, name: "History", description: "History" },
        { id: 4, name: "Art", description: "Art" },
        { id: 5, name: "Physical Education", description: "Physical Education" },
        { id: 6, name: "Music", description: "Music" },
        { id: 7, name: "Computer Science", description: "Computer Science" },
    ])




    // Computed property
    const numberOfClasses = computed(() => classes.value.length)

    return { classes, numberOfClasses }
})