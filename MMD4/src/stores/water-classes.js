import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useClassesStoreWater = defineStore("waterclasses", () => {
    const classes = ref([]);

    // Fetch data from Strapi using .then()
    const fetchClasses = () => {
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
            })
            .catch(error => {
                console.error("Fejl ved hentning af hold:", error);
            });
    };



    // Computed property
    const numberOfClasses = computed(() => classes.value.length);

    return { classes, numberOfClasses, fetchClasses, };
});
