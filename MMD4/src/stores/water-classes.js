// IMPORTS
import { ref, computed } from "vue";
import { defineStore } from "pinia";

// Pinia store til motion classes
// Denne store håndterer data og tilstand for motion classes, herunder filtrering af klasser baseret på kategori.
export const useClassesStoreWater = defineStore("waterclasses", () => {
    const classes = ref([]);
    const isLoading = ref(false);
    const numberOfTeams = ref(0);
    const numberOfClasses = ref(0);
    const selectedCategory = ref("Alle Hold"); // default kategori
    const availableCategories = [
        "Alle Hold",
        "Mindfullness",
        "Styrketræning",
        "Cirkeltræning",
        "Specialhold",
        "Kredsløbstræning",
        "Undervisning",
        "Wellness"
    ];

    // FILTERING
    // Der anvendes en computed property til at filtrere holdene baseret på den valgte kategori. Det gør det muligt at opdatere listen af hold dynamisk, når brugeren vælger en kategori.
    const filteredClasses = computed(() => {
        // Hvis ingen kategori er valgt, eller hvis "Alle Hold" er valgt, returneres alle klasser
        if (!selectedCategory.value || selectedCategory.value === "Alle Hold") {
            numberOfClasses.value = classes.value.length; // Opdaterer antallet af klasser til det samlede antal
            return classes.value;
        }
        // Ellers filtreres klasserne baseret på den valgte kategori. Der anvendes en JS-metode til at filtrere klasserne, der matcher den valgte kategori.
        // Her antages det, at hver klasse har en 'kategorier' egenskab, der er et array af kategorier.
        // includes metoden bruges til at tjekke, om den valgte kategori findes i klassens kategorier.

        let filteredClasses = classes.value.filter(klasse =>
            klasse.kategorier && klasse.kategorier.includes(selectedCategory.value)
        );
        numberOfClasses.value = filteredClasses.length; // Opdaterer antallet af klasser baseret på filtreringen
        return filteredClasses.sort((a, b) => a.name.localeCompare(b.name, 'da', { sensitivity: 'base' }));
    });

    // Funktion til at ændre den valgte kategori. Denne funktion opdaterer den reaktive 'selectedCategory' værdi, når brugeren vælger en ny kategori.
    // Dette gør det muligt at opdatere den viste liste af klasser i UI'en.
    // Funktionen tager en kategori som parameter og opdaterer 'selectedCategory' værdien.
    const setCategory = (category) => {
        selectedCategory.value = category;
    };

    // Fetch data from Strapi using .then()
    const fetchClasses = () => {
        isLoading.value = true;
        fetch(
            "https://popular-gift-b355856076.strapiapp.com/api/hold-vands?pLevel"
        )
            .then(response => response.json())
            .then(data => {
                console.log("Data hentet fra Strapi:", data);
                classes.value = data.data.map(item => ({
                    id: item.id,
                    name: item.Titel,
                    kategorier: item.Traenings_kategorier,
                    varighed: item.Varighed_Nr1,
                    maalgruppe: item.Maalgruppe,
                    aflysning: item.Aflysning,
                    praktiskeOplysninger: item.De_praktiske_oplysninger,
                    priser: item.Priser,
                    type_af_hold: item.Type_af_hold,
                    coverbilledeLarge: item.Cover_Billedet.formats.large ? item.Cover_Billedet.formats.large.url : null,
                    coverbilledeMedium: item.Cover_Billedet.formats.medium ? item.Cover_Billedet.formats.medium.url : null,
                    coverbilledeSmall: item.Cover_Billedet.formats.small ? item.Cover_Billedet.formats.small.url : null,
                    coverbilledeThumbnail: item.Cover_Billedet.formats.thumbnail ? item.Cover_Billedet.formats.thumbnail.url : null,
                    coverbilledeAlt: item.Cover_Billedet.alternativeText,

                    // Tjek om "Relaterede_hold" eksisterer, før .map() bruges
                    relateredeHold: item.Relaterede_hold ? item.Relaterede_hold.map(related => ({
                        id: related.id,
                        name: related.Titel,
                        coverbilledeLarge: related.Cover_Billedet.formats.large ? related.Cover_Billedet.formats.large.url : null,
                        coverbilledeMedium: related.Cover_Billedet.formats.medium ? related.Cover_Billedet.formats.medium.url : null,
                        coverbilledeSmall: related.Cover_Billedet.formats.small ? related.Cover_Billedet.formats.small.url : null,
                        coverbilledeThumbnail: related.Cover_Billedet.formats.thumbnail ? related.Cover_Billedet.formats.thumbnail.url : null,
                        coverbilledeAlt: related.Cover_Billedet.alternativeText,
                    })) : [], // Hvis "Relaterede_hold" er null, så giv en tom array

                    // Håndtering af Indhold som et objekt
                    indhold: item.Indhold ? {
                        id: item.Indhold.id,
                        afsnit: item.Indhold.Afsnit ? item.Indhold.Afsnit.map(section => ({
                            id: section.id,
                            overskrift: section.Overskrift,
                            tekst: section.Tekst ? section.Tekst.map(text => ({
                                id: text.id,
                                underoverskrift: text.Underoverskift,
                                brodtekst: text.Brodtekst,
                                punktopstilles: text.Skal_det_punkteopstilles,
                            })) : [], // Hvis "Tekst" er null, giv en tom array
                            // Håndtering af Billeder i Afsnit (som array)
                            billeder: section.Billede ? section.Billede.map(billede => ({
                                billedeLarge: billede.formats && billede.formats.large ? billede.formats.large.url : null,
                                billedeMedium: billede.formats && billede.formats.medium ? billede.formats.medium.url : null,
                                billedeSmall: billede.formats && billede.formats.small ? billede.formats.small.url : null,
                                billedeThumbnail: billede.formats && billede.formats.thumbnail ? billede.formats.thumbnail.url : null,
                                billedeAlt: billede.alternativeText ? billede.alternativeText : null,
                            })) : [], // Hvis Billede ikke findes, giv en tom array

                            knapper: section.Knapper ? section.Knapper.map(button => ({
                                id: button.id,
                                titel: button.btn_title,
                                beskrivelse: button.btn_description,
                                ikon: button.Icon,
                            })) : [], // Hvis "Knapper" er null, giv en tom array
                        })) : [], // Hvis "Afsnit" er null, giv en tom array
                    } : {}, // Hvis "Indhold" er null, giv et tomt objekt
                }));
                // Total Antal hold (Til counter)
                numberOfTeams.value = classes.value.length;
            })
            .catch(error => {
                console.error("Fejl ved hentning af hold:", error);
            })
            .finally(() => {
                isLoading.value = false; // Stop spinner
            });

    };


    return {
        classes,
        numberOfClasses,
        numberOfTeams,
        fetchClasses,
        filteredClasses,
        selectedCategory,
        setCategory,
        availableCategories,
        isLoading
    };
});
