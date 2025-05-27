// stores/themeStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    // Tjekker om brugeren foretrækker mørkt tema via CSS media query
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mørktTemaAktivt = ref(prefersDark);

    // Funktion til at sætte CSS variabler ud fra tema
    function applyTheme(isDark) {
        const root = document.documentElement;

        if (isDark) {
            root.style.setProperty('--color-font-1', '#FFFFFF');
            root.style.setProperty('--color-font-2', '#FFFFFF');
            root.style.setProperty('--color-body-background', '#1F1F1F');
            root.style.setProperty('--color-navigation', '#526054');
            root.style.setProperty('--color-pricetable', '#504944');
            root.style.setProperty('--color-svim', '#477387');
            root.style.setProperty('--color-svim-light', '#477387');
            root.style.setProperty('--color-motion', '#4E7B45');
            root.style.setProperty('--color-motion-light', '#4E7B45');
            root.style.setProperty('--color-wellness', '#583F55');
            root.style.setProperty('--color-wellness-light', '#583F55');
            root.style.setProperty('--color-meetings', '#866C55');
            root.style.setProperty('--color-meetings-light', '#866C55');
            root.style.setProperty('--color-haraldslund-light', '#7F6A57');
            root.style.setProperty('--color-activity-viewer', '#323131');
            root.style.setProperty('--color-activity-viewer-stroke', '#FFE4AA');
            root.style.setProperty('--color-btn-primary', '#526054');
            root.style.setProperty('--color-btn-primary-hover', '#103916');
        } else {
            root.style.setProperty('--color-font-1', '#1F1F1F');
            root.style.setProperty('--color-font-2', '#FFFFFF');
            root.style.setProperty('--color-body-background', '#F3F1E8');
            root.style.setProperty('--color-navigation', '#526054');
            root.style.setProperty('--color-pricetable', '#E4E2D8');
            root.style.setProperty('--color-svim', '#477387');
            root.style.setProperty('--color-svim-light', '#D1DEE2');
            root.style.setProperty('--color-motion', '#4E7B45');
            root.style.setProperty('--color-motion-light', '#D1D9C3');
            root.style.setProperty('--color-wellness', '#583F55');
            root.style.setProperty('--color-wellness-light', '#E7E5E8');
            root.style.setProperty('--color-meetings', '#866C55');
            root.style.setProperty('--color-meetings-light', '#ECE3D9');
            root.style.setProperty('--color-haraldslund-light', '#DDD3C9');
            root.style.setProperty('--color-activity-viewer', '#FEFBF4');
            root.style.setProperty('--color-activity-viewer-stroke', '#58503F');
            root.style.setProperty('--color-btn-primary', '#FBF8F4');
            root.style.setProperty('--color-btn-primary-hover', '#526054');
        }
    }

    // Sætter tema ved opstart
    applyTheme(mørktTemaAktivt.value);

    function toggleTema() {
        mørktTemaAktivt.value = !mørktTemaAktivt.value;
        applyTheme(mørktTemaAktivt.value);
    }

    return { mørktTemaAktivt, toggleTema };
});
