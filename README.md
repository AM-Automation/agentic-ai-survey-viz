# Agentic AI Survey Visualizer 🚀

[![Public Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/AM-Automation/agentic-ai-survey-viz)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Design](https://img.shields.io/badge/Design-Apple--Grade-black)](https://developer.apple.com/design/)

Ein hochmodernes Dashboard zur Visualisierung und statistischen Analyse der **Agentic AI Adoption** im Software Development Life Cycle (SDLC). Entwickelt im Rahmen einer Masterarbeit 2026.

## 🎯 Projektziel
Ziel dieses Dashboards ist es, die Synergieeffekte zwischen der methodischen Reife von Softwareteams (SDLC Maturity) und dem Einsatz generativer KI-Agenten wissenschaftlich fundiert darzustellen. Es liefert nicht nur deskriptive Statistiken, sondern nutzt Inferenzstatistik, um Kausalitäten und Signifikanzen aufzuzeigen.

## ✨ Key Features (Phase 7: Precision & Clarity)
*   **Apple-Grade UI/UX**: Minimalistisches Design, Glassmorphism-Effekte und flüssige Animationen mit `framer-motion`.
*   **Statistische Tiefe**:
    *   **Inferenzstatistik**: Automatische Berechnung von p-Werten (Signifikanz) für Korrelationen.
    *   **Varianz-Analyse**: Boxplot-Visualisierungen zur Darstellung von Konsens und Ausreißern in den SDLC-Phasen.
    *   **Clustering**: Algorithmische Segmentierung der Teilnehmer in Profile (AI Champions, Pragmatisten, Beobachter).
    *   **Variable Importance**: Identifikation der stärksten Treiber für Produktivitätsgewinne.
*   **Dynamic Insight Layer**: Automatisierte Interpretation der Daten in natürlicher Sprache.
*   **Executive Summary**: Hochkarätige Zusammenfassung der signifikantesten Befunde.

## 🛠 Tech Stack
*   **Core**: React 19, TypeScript 5, Vite
*   **Visualization**: @nivo/bar, @nivo/pie (Charts)
*   **Animation**: Framer Motion
*   **Styling**: Styled-Components & CSS Variables
*   **Data Processing**: PapaParse (CSV) & Custom Statistical Modules (`statisticalAnalysis.ts`)

## 🚀 Quick Start

1.  **Repo klonen**:
    ```bash
    git clone https://github.com/AM-Automation/agentic-ai-survey-viz.git
    cd agentic-ai-survey-viz
    ```

2.  **Abhängigkeiten installieren**:
    ```bash
    npm install
    ```

3.  **Dev-Server starten**:
    ```bash
    npm run dev
    ```

4.  **Build für Production**:
    ```bash
    npm run build
    ```

## 📊 Datenbasis
Das Dashboard visualisiert anonymisierte Umfragedaten von Software-Experten. Die Daten sind unter `public/data/Umfrage.csv` abgelegt.

## 📄 Lizenz
Dieses Projekt dient akademischen Zwecken und ist unter der MIT Lizenz veröffentlicht.

---
*Erstellt zur Unterstützung der Masterarbeit zum Thema "Agentic AI in der Softwareentwicklung".*
