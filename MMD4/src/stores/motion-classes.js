// IMPORTS
import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Pinia store til motion classes
// Denne store håndterer data og tilstand for motion classes, herunder filtrering af klasser baseret på kategori.
export const useClassesStoreMotion = defineStore("classesStoreMotion", () => {
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
    ];



    // FILTERING
    // Der anvendes en computed property til at filtrere holdene baseret på den valgte kategori. Det gør det muligt at opdatere listen af hold dynamisk, når brugeren vælger en kategori.
    const filteredClasses = computed(() => {
        // Funktion til at normalisere strenge for bedre sortering
        // // Konverterer til små bogstaver, fjerner bindestreger og diakritiske tegn (som é → e)
        const normalize = (str) => str
            .toLowerCase()
            // Erstatter bindestreger med mellemrum
            .replace(/-/g, ' ')
            // Fjerner evt. mellemrum i starten/slutningen
            .trim();

        // Funktion til at sortere et array af objekter efter navn med dansk lokalitet
        const sortClasses = (arr) =>
            // Lav en kopi af vores array med en spread operator
            [...arr].sort((a, b) =>
                normalize(a.name).localeCompare(normalize(b.name), 'da', { sensitivity: 'base' }));

        let relevantClasses = [];
        // Hvis ingen kategori er valgt, eller hvis "Alle Hold" er valgt, returneres alle klasser
        if (!selectedCategory.value || selectedCategory.value === "Alle Hold") {
            relevantClasses = classes.value;
        } else {
            // Ellers filtreres klasserne baseret på den valgte kategori. Der anvendes en JS-metode til at filtrere klasserne, der matcher den valgte kategori.
            // Her antages det, at hver klasse har en 'kategorier' egenskab, der er et array af kategorier.
            // includes metoden bruges til at tjekke, om den valgte kategori findes i klassens kategorier.
            relevantClasses = classes.value.filter(klasse =>
                klasse.kategorier && klasse.kategorier.includes(selectedCategory.value)
            );
        }

        // Opdaterer antallet af klasser til det samlede antal
        numberOfClasses.value = relevantClasses.length;
        return sortClasses(relevantClasses);
    });

    // Funktion til at ændre den valgte kategori. Denne funktion opdaterer den reaktive 'selectedCategory' værdi, når brugeren vælger en ny kategori.
    // Dette gør det muligt at opdatere den viste liste af klasser i UI'en.
    // Funktionen tager en kategori som parameter og opdaterer 'selectedCategory' værdien.

    // Cache variabler
    const setCategory = (category) => {
        selectedCategory.value = category;
    };
    const CACHE_KEY = 'MotionClasses';
    const CACHE_TIMESTAMP_KEY = 'MotionClassesCacheTimestamp';
    const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutter cache tid

    const fetchClasses = () => {
        isLoading.value = true;
        // Tjek om data findes i localStorage og ikke er for gammel
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        const cachedTimestampRaw = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();
        if (cachedRaw && cachedTimestampRaw) {
            const cachedTimestamp = Number(cachedTimestampRaw);
            if (now - cachedTimestamp < CACHE_DURATION_MS) {
                try {
                    const cachedData = JSON.parse(cachedRaw);
                    classes.value = cachedData;
                    numberOfTeams.value = cachedData.length;
                    numberOfClasses.value = cachedData.length; // Opdaterer antallet af klasser til det samlede antal
                    isLoading.value = false;
                    return;
                } catch (e) {
                    console.error("Fejl ved parsing af cache data:", e);
                }
            }
        }
        // Hent data fra Strapi API
        fetch(
            "https://popular-gift-b355856076.strapiapp.com/api/hold-motions?pLevel"
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


                    reklamekort: item.reklame_kort ? {
                        id: item.reklame_kort.id,
                        titel: item.reklame_kort.Titel,
                        tekst: item.reklame_kort.Tekst_afsnit,
                        kategori: item.reklame_kort.Kategori,
                        billedeLarge: item.reklame_kort.Billede.formats && item.reklame_kort.Billede.formats.large ? item.reklame_kort.Billede.formats.large.url : null,
                        billedeMedium: item.reklame_kort.Billede.formats && item.reklame_kort.Billede.formats.medium ? item.reklame_kort.Billede.formats.medium.url : null,
                        billedeSmall: item.reklame_kort.Billede.formats && item.reklame_kort.Billede.formats.small ? item.reklame_kort.Billede.formats.small.url : null,
                        billedeThumbnail: item.reklame_kort.Billede.formats && item.reklame_kort.Billede.formats.thumbnail ? item.reklame_kort.Billede.formats.thumbnail.url : null,
                        billedeAlt: item.reklame_kort.Billede.alternativeText ? item.reklame_kort.Billede.alternativeText : null,
                        knapper: item.reklame_kort.Knapper ? item.reklame_kort.Knapper.map(button => ({
                            id: button.id,
                            titel: button.btn_titel,
                            beskrivelse: button.btn_description,
                            ikon: button.Ikon[0],
                            link: button.link_to,
                        })) : [], // Hvis "Knapper" er null, giv en tom array
                    }
                        : null,

                    // Tjek om "Relaterede_hold" eksisterer, før .map() bruges
                    relateredeHold: item.Relaterede_hold ? item.Relaterede_hold.map(related => ({
                        id: related.id,
                        name: related.Titel,
                        kategorier: related.Traenings_kategorier,
                        type_af_hold: related.Type_af_hold,
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
                                ikon: button.Ikon[0],
                                link: button.link_to,
                            })) : [], // Hvis "Knapper" er null, giv en tom array
                        })) : [], // Hvis "Afsnit" er null, giv en tom array
                    } : {}, // Hvis "Indhold" er null, giv et tomt objekt
                }));
                // Total Antal hold (Til counter)
                numberOfTeams.value = classes.value.length;

                // Gem data i localStorage med timestamp
                localStorage.setItem(CACHE_KEY, JSON.stringify(classes.value));
                localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
            })
            .catch(error => {
                console.error("Fejl ved hentning af hold:", error);
            })
            .finally(() => {
                isLoading.value = false;
            });
    };


    // Ny funktion: Find klasse efter ID
    const getClassById = (id) => {
        return classes.value.find(klasse => klasse.id === id);
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
        isLoading,
        getClassById,
    };
});