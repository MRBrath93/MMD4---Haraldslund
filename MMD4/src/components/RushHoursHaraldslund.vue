<script setup>
import { ref, computed, watch } from 'vue';
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

// Registrerer de nødvendige Chart.js elementer
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Funktion til at hente besøgsdata for en given dato
const fetchVisitorData = (date) => {
  // Simulerer data baseret på en dato
  // Beregner hvilken dag på ugen det er (0 = søndag, 1 = mandag, osv.)
  const day = date.getDay();
  // Simuleret besøgstal for forskellige tidspunkter på dagen, der ændrer sig afhængigt af ugedagen. Så tallet + ugendagens nr. 
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

// Opretter en reaktiv variabel til den valgte dato
const pickedDate = ref(new Date());
// Sætter den valgte dato til i går (for at undgå at vise dagens data)
pickedDate.value.setDate(pickedDate.value.getDate() - 1);

// Henter data for den valgte dato
const visitorData = ref(fetchVisitorData(pickedDate.value));

// Lytter på ændringer af pickedDate og opdaterer visitorData
watch(pickedDate, (newDate) => {
  visitorData.value = fetchVisitorData(newDate);
});

// Formaterer den valgte dato til en læsbar streng som opstilles efter dansk format
// og gør første bogstav stort
const formattedDate = computed(() => {
  return pickedDate.value.toLocaleDateString('da-DK', {
    weekday: 'long', // Ugedag (langt format)
    year: 'numeric', // Årstal
    month: 'long', // Måned (langt format)
    day: 'numeric', // Dag i måneden
  }).charAt(0).toUpperCase() + 
  pickedDate.value.toLocaleDateString('da-DK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).slice(1);
});

// Beregner om knappen til forrige dag skal være deaktiveret (brugeren kan ikke vælge en dato tidligere end 7 dage før altså en uge bagud)
const isPreviousDisabled = computed(() => {
  const oneWeekAgo = new Date();
  // En uge før i dag
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
   // Deaktiver knappen hvis datoen er for gammel
  return pickedDate.value <= oneWeekAgo;
});

// Beregner om knappen til næste dag skal være deaktiveret (brugeren kan ikke vælge en dato senere end i går)
const isNextDisabled = computed(() => {
  const yesterday = new Date();
  // Sætter datoen til i går
  yesterday.setDate(yesterday.getDate() - 1);
  // Fjern tid for præcis sammenligning
  yesterday.setHours(0, 0, 0, 0);
  // Deaktiver knappen hvis datoen er i går eller senere
  return pickedDate.value >= yesterday;
});

// Går til forrige dag, hvis muligt
const goToPreviousDay = () => {
  const oneWeekAgo = new Date();
  // En uge før i dag
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
   // Hvis ikke datoen er for gammel
  if (pickedDate.value > oneWeekAgo) {
     // Sæt datoen til forrige dag
    pickedDate.value = new Date(pickedDate.value.setDate(pickedDate.value.getDate() - 1));
  }
};

// Går til næste dag, hvis muligt
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
  }
};

// Funktion til at vælge farve baseret på antal besøgende
const getColor = (amount) => {
  if (amount >= 40) return '#ef4444';
  if (amount >= 25) return '#eab308';
  return '#22c55e';
};

// Beregner data til diagrammet
const chartData = computed(() => ({
// Tidspunkterne på x-aksen
  labels: visitorData.value.map(v => v.time),
  datasets: [{
    label: 'Antal besøgende',
    // Besøgstal til y-aksen
    data: visitorData.value.map(v => v.amount),
    // Farve baseret på antal besøgende
    backgroundColor: visitorData.value.map(v => getColor(v.amount)),
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

// Konfiguration af diagrammet https://www.chartjs.org/docs/latest/charts/bar.html
const chartOptions = {
// Responsivitet til tilpasning på forskellige skærmstørrelser
  responsive: true,
  plugins: {
    // Skjuler legenden (Beskrivelses boks af data)
    legend: { display: false },
    tooltip: {
      callbacks: {
        // Vist tooltip med antal besøgende
        label: context => `${context.raw} besøgende`,
      },
    },
  },
  scales: {
    y: {
    // Starter y-aksen ved 0
      beginAtZero: true,
       // Skjuler y-aksens grid
      grid: { display: false },
      // Gør y-aksens ticks hvide
      ticks: { color: 'var(--color-font-1)' },
    },
    x: {
      ticks: {
        // Gør x-aksens ticks hvide
        color: 'var(--color-font-1)',
        callback: function(value) {
            // Henter etiketten for hver værdi
          const label = this.getLabelForValue(value);
          // Vis kun hele timer på x-aksen
          return label.endsWith(':00') ? label : '';
        },
        // Sikrer, at alle etiketter vises
        autoSkip: false,
      },
      // Skjuler x-aksens grid
      grid: { display: false },
    },
  },
};
</script>

<template>
  <div class="rush-hours">
    <div class="intro">
      <h4>Planlæg dit besøg - undgå myldretiden</h4>
      <p>Få et hurtigt overblik over, hvornår der typisk er flest besøgende i Haraldslund Kulturhus. Grafen viser det forventede aktivitetsniveau i løbet af dagen baseret på tidligere besøgstal.</p>
    </div>
    <div class="date--picker">
      <button 
      class="left"
        @click="goToPreviousDay" 
        :disabled="isPreviousDisabled" 
        :class="{ disabled: isPreviousDisabled }">
        <span class="material-symbols-rounded">chevron_left</span>
      </button>
      <p class="bold">{{ formattedDate }}</p>
      <button class="right"
        @click="goToNextDay" 
        :disabled="isNextDisabled" 
        :class="{ disabled: isNextDisabled }">
        <span class="material-symbols-rounded">chevron_right</span>
      </button>
    </div>
    <Bar :data="chartData" :options="chartOptions" />
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
  max-width: 1432px;
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
  padding: 0;
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

@media screen and (max-width: 700px) {
  .rush-hours canvas {
    max-width: 100%;
    width: 100% !important;
    height: 100% !important;
  }

  .rush-hours{
    width: 100%;
  }
}

@media screen and (max-width: 500px) {
  .rush-hours {
    margin: 0 auto;
  }
    
}
</style>