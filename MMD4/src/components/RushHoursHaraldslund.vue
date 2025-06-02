<script setup>
// Importerer nødvendige funktioner og komponenter
import { useThemeStore } from '@/stores/themeStore';
import { ref, computed, watch } from 'vue';
import { nextTick } from 'vue';
// Importerer Bar-komponenten fra vue-chartjs
import { Bar } from 'vue-chartjs';
// Importerer nødvendige Chart.js komponenter
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Tilgår tema-store (brugt til at ændre diagramfarver baseret på tema)
const themeStore = useThemeStore();
const dateTextRef = ref(null);


// Registrerer de nødvendige komponenter i Chart.js (obligatorisk for brug af diagrammer)

// TABEL FUNKTIONALITET

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


/* --------- DATA SIMULERING --------- */
// Funktion der returnerer fiktive besøgsdata baseret på ugedagen
const fetchVisitorData = (date) => {
  // Beregner hvilken dag på ugen det er (0 = søndag, 1 = mandag, osv.)
  const day = date.getDay();
  // Returnerer et array af objekter, hvert med tidspunkt og antal besøgende
  // Antallet af besøgende justeres med dagsnummeret for variation i data
  const baseData = [
  { time: "08:00", amount: 13 + day },
  { time: "08:15", amount: 15 + day },
  { time: "08:30", amount: 18 + day },
  { time: "08:45", amount: 22 + day },
  { time: "09:00", amount: 28 + day },
  { time: "09:15", amount: 32 + day },
  { time: "09:30", amount: 35 + day },
  { time: "09:45", amount: 33 + day },
  { time: "10:00", amount: 30 + day },
  { time: "10:15", amount: 28 + day },
  { time: "10:30", amount: 27 + day },
  { time: "10:45", amount: 25 + day },
  { time: "11:00", amount: 23 + day },
  { time: "11:15", amount: 22 + day },
  { time: "11:30", amount: 20 + day },
  { time: "11:45", amount: 19 + day },
  { time: "12:00", amount: 21 + day },
  { time: "12:15", amount: 24 + day },
  { time: "12:30", amount: 23 + day },
  { time: "12:45", amount: 20 + day },
  { time: "13:00", amount: 18 + day },
  { time: "13:15", amount: 16 + day },
  { time: "13:30", amount: 17 + day },
  { time: "13:45", amount: 20 + day },
  { time: "14:00", amount: 26 + day },
  { time: "14:15", amount: 32 + day },
  { time: "14:30", amount: 38 + day },
  { time: "14:45", amount: 40 + day },
  { time: "15:00", amount: 44 + day },
  { time: "15:15", amount: 48 + day },
  { time: "15:30", amount: 50 + day },
  { time: "15:45", amount: 51 + day },
  { time: "16:00", amount: 52 + day },
  { time: "16:15", amount: 51 + day },
  { time: "16:30", amount: 50 + day },
  { time: "16:45", amount: 49 + day },
  { time: "17:00", amount: 47 + day },
  { time: "17:15", amount: 45 + day },
  { time: "17:30", amount: 42 + day },
  { time: "17:45", amount: 38 + day },
  { time: "18:00", amount: 32 + day },
  { time: "18:15", amount: 28 + day },
  { time: "18:30", amount: 24 + day },
  { time: "18:45", amount: 22 + day },
  { time: "19:00", amount: 20 + day },
  { time: "19:15", amount: 18 + day },
  { time: "19:30", amount: 17 + day },
  { time: "19:45", amount: 16 + day },
  { time: "20:00", amount: 15 + day },
  { time: "20:15", amount: 14 + day },
  { time: "20:30", amount: 13 + day },
  { time: "20:45", amount: 12 + day },
  { time: "21:00", amount: 11 + day },
];
  return baseData;
};



/* --------- TILSTAND --------- */
// Opretter en reaktiv dato-variabel og sætter den til i går
const pickedDate = ref(new Date());
// Sætter den valgte dato til i går (for at undgå at vise dagens data)
pickedDate.value.setDate(pickedDate.value.getDate() - 1);

// Initialiserer de besøgsdata, der vises i diagrammet
const visitorData = ref(fetchVisitorData(pickedDate.value));

// Når brugeren vælger en ny dato, opdateres data automatisk
watch(pickedDate, (newDate) => {
  visitorData.value = fetchVisitorData(newDate);
});


/* --------- DATOFORMATTERING --------- */
// Formaterer den valgte dato til en læsbar streng som opstilles efter dansk format og gør første bogstav stort
const formattedDate = computed(() => {
  const localeDate = pickedDate.value.toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return localeDate.charAt(0).toUpperCase() + localeDate.slice(1);
});


/* --------- NAVIGATIONSMULIGHEDER --------- */
// Beregner om knappen til forrige dag skal være deaktiveret (brugeren kan ikke vælge en dato tidligere end 7 dage før altså en uge bagud)
// Hvis datoen er 7 dage eller mere bagud, deaktiveres "forrige dag"-knappen
const isPreviousDisabled = computed(() => {
  const oneWeekAgo = new Date();
  // En uge før i dag
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
   // Deaktiver knappen hvis datoen er for gammel
  return pickedDate.value <= oneWeekAgo;
});

// Hvis datoen er i går eller nyere, deaktiveres "næste dag"-knappen
const isNextDisabled = computed(() => {
  const yesterday = new Date();
  // Sætter datoen til i går
  yesterday.setDate(yesterday.getDate() - 1);
  // Fjern tid for præcis sammenligning
  yesterday.setHours(0, 0, 0, 0);
  // Deaktiver knappen hvis datoen er i går eller senere
  return pickedDate.value >= yesterday;
});


/* --------- FUNKTIONER TIL DATOVALG --------- */
// Opdaterer pickedDate til forrige dag, hvis muligt
const goToPreviousDay = () => {
  const oneWeekAgo = new Date();
  // En uge før i dag
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
   // Hvis ikke datoen er for gammel
  if (pickedDate.value > oneWeekAgo) {
     // Sæt datoen til forrige dag
    pickedDate.value = new Date(pickedDate.value.setDate(pickedDate.value.getDate() - 1));
    nextTick(() => {
      dateTextRef.value?.focus();
    });
  }
};

// Opdaterer pickedDate til næste dag, hvis muligt
const goToNextDay = () => {
  const yesterday = new Date();
  // Sætter datoen til i går
  yesterday.setDate(yesterday.getDate() - 1);
   // Fjern tid for præcis sammenligning
  yesterday.setHours(0, 0, 0, 0);
  // Hvis datoen er tidligere end i går
  if (pickedDate.value < yesterday) {
     // Sæt datoen til næste dag
    pickedDate.value = new Date(pickedDate.value.setDate(pickedDate.value.getDate() + 1));
    // Efter at have opdateret datoen, sætter vi fokus på dato-teksten (dateTextRef)
    // Dette sikrer, at brugeren kan se den opdaterede dato med det samme og er tilgængelig for skærmlæsere. 
    // Vi bruger Vue's nextTick for at sikre, at DOM'en er opdateret før vi sætter fokus.
    nextTick(() => {
      dateTextRef.value?.focus();
    });
  }
};


/* --------- GRAFOPBYGNING --------- */
// Returnerer farve til hver søjle baseret på antal besøgende
const getColor = (amount) => {
  if (amount >= 40) return '#908872';
  if (amount >= 25) return '#C1BAA1';
  return '#D7D3BF';
};

// Forbereder data til grafen: x-akse (tid) og y-akse (antal besøgende)
const chartData = computed(() => ({
// Tidspunkterne på x-aksen
  labels: visitorData.value.map(visit => visit.time),
  datasets: [{
    label: 'Antal besøgende',
    // Besøgstal til y-aksen
    data: visitorData.value.map(visit => visit.amount),
    // Farve baseret på antal besøgende. Hver amount i vores array bliver vurderet om hvilken farve den skal have
    backgroundColor: visitorData.value.map(visit => getColor(visit.amount)),
    hoverBorderColor: '#bcbcbc',
    hoverBorderWidth: .5,
    borderRadius: {
      topLeft: 10,
      topRight: 10,
      bottomLeft: 0,
      bottomRight: 0,
    },
    borderSkipped: false,
  }],
}));


/* --------- GRAFKONFIGURATION --------- */
// Konfiguration af diagrammet https://www.chartjs.org/docs/latest/charts/bar.html

// INSPIRATIONSKILDE TIL Konfiguration af diagrammet: Chart.js. Bar Chart. 2025. (online) www.chartjs.org/ [Accessed 28/05/2025] URL: https://www.chartjs.org/docs/latest/charts/bar.html

// FARVETEMA / TOGGLE
const chartOptions = computed(() => {
  const isDark = themeStore.moerkTemaAktivt;

  return {
    responsive: true,
    plugins: {
      // Skjuler legend (forklaring)
      legend: { display: false },
      tooltip: {
        callbacks: {
          // Tilføjer tekst i tooltip
          label: context => `${context.raw} besøgende`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        // Skift farve afhængigt af tema
        ticks: { color: isDark ? '#ffffff' : '#1F1F1F' },
        title: {
        display: true,
        text: 'Antal besøgende', // Y-akse beskrivelse
        color: isDark ? '#ffffff' : '#1F1F1F',
        font: {
          size: 14,
          weight: 'bold',
        }
      }
      },
      x: {
        ticks: {
          // Skift farve afhængigt af tema
          color: isDark ? '#ffffff' : '#1F1F1F',
          callback: function(value) {
            const label = this.getLabelForValue(value);
            // Viser kun hele tider (fx 08:00)
            return label.endsWith(':00') ? label : ''; 
          },
          autoSkip: false,
        },
        grid: { display: false },
        title: {
        display: true,
        text: 'Tidspunkt på dagen', // X-akse beskrivelse
        color: isDark ? '#ffffff' : '#1F1F1F',
        font: {
          size: 14,
          weight: 'bold',
        }
      }
      },
    },
  };
});

</script>
<template>
  <div class="rush-hours">
    <div class="intro">
      <h3>Besøg os når der er god plads og færre mennesker</h3>
      <p>Vil du træne, når der er god plads? Her kan du se, hvornår der typisk er færrest besøgende i Haraldslund Vand- & Kulturhus. Grafen viser aktivitetsniveauet i løbet af dagen baseret på tidligere besøgstal, så du kan planlægge dit besøg i ro og mag.</p>
    </div>
    <div class="date--picker">
      <button 
        class="left"
        @click="goToPreviousDay" 
        :disabled="isPreviousDisabled" 
        :class="{ disabled: isPreviousDisabled }"
        :aria-label="'Gå til dagen før: ' + formattedDate"
        :aria-disabled="isPreviousDisabled.toString()"
      >
        <i class="material-symbols-rounded" aria-hidden="true">chevron_left</i>
      </button>
      <p class="bold" tabindex="-1" ref="dateTextRef">{{ formattedDate }}</p>
      <button class="right"
        @click="goToNextDay" 
        :disabled="isNextDisabled" 
        :class="{ disabled: isNextDisabled }"
        :aria-label="'Gå til dagen efter: ' + formattedDate"
        :aria-disabled="isNextDisabled.toString()"
        >
        <i class="material-symbols-rounded" aria-hidden="true">chevron_right</i>
      </button>
    </div>
    <Bar 
    :data="chartData" 
    :options="chartOptions" 
    role="img"
    aria-label="Søljediagram der viser antal besøgende i Haraldslund Kulturhus i løbet af dagen"
    />

    <div class="sr-only" id="rush-hours-table" tabindex="0" >
      <table 
      aria-live="polite"
      tabindex="0"
      >
      <caption id="rush-hours-caption">Besøgsdata for Haraldslund Kulturhus</caption>
        <thead>
          <tr>
            <th scope="col">Tidspunkt</th>
            <th scope="col">Antal besøgende</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in visitorData" :key="item.time">
            <td>{{ item.time }}</td>
            <td>{{ item.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
<style scoped>
button.disabled {
  color: gray;
  cursor: not-allowed;
  opacity: 0.5;
}

.rush-hours {
  background-color:var(--color-activity-viewer);
  border-radius: var( --border-radius);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-x1);
  color: var(--color-font-2);
  width: 95%;
  max-width: 1000px;
  margin: var(--spacer-x2) auto;
  padding: var(--spacer-x2) 0;
}

.rush-hours .intro h4, .rush-hours .intro p {
  color: var(--color-font-1);
}

.intro {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rush-hours .date--picker p{
    color: var(--color-font-1);
}

.bold {
  font-weight: bold;
  text-align: start;
  font-size: 0.8rem;
  color: var(--color-font-1);
}

.rush-hours canvas {
  width: 80% !important;
  margin: 0 auto;
  max-width: var(--max-width);
  color: var(--color-font-2);
  font-family: var(--font-heading);
}

button{
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--color-font-1);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 10px 15px;
}

button:hover{
  background-color: var(--color-btn-primary-hover);
  color: var(--color-font-2);
  border: 1px solid var(--color-btn-primary-hover);
}

.material-symbols-rounded{
text-align: center;
}

.date--picker{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacer-x1);
    width: fit-content;
    background-color: var(--color-btn-primary);
    color: var(--color-font-1);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-font-1);
    margin: 0 auto;
}

.sr-only {
  position: absolute;
  left: -9999px;
  bottom: auto;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
}

@media screen and (max-width: 700px) {
  .rush-hours canvas {
    max-width: 100%;
    width: 100% !important;
    height: 100% !important;
  }

  .rush-hours{
    width: 100%;
    padding: var(--spacer-x1);
  }
}

@media screen and (max-width: 500px) {
  .rush-hours {
    margin: 0 auto;
  }
    
}
</style>