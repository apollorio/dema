# Apollo DJ -- System Architecture Flowchart

> Mermaid diagrams describing the full Apollo DJ system:
> navbar, dashboard, BPM meter, sidebar tree, and CDJ screen-software theme previewer.

---

## 1. High-Level System Flow

```mermaid
graph TD
    A[User opens apolloDJ] --> B[Python backend starts]
    B --> C[Loads HTML theme previewer<br>apolloDJ.v3.html]
    B --> D[Coletanea library loads track data]
    D --> E[Sidebar tree renders<br>COMPUTADOR / PLAYLISTS / PENDRIVE]
    E --> F[User selects track]
    F --> G[Deck loads]
    G --> H[3-band waveform renders]
    H --> I[Audio analysis<br>BPM detection + key detection]
    I --> J{Export to USB?}
    J -- Yes --> K[Export to pendrive<br>using enabled playlists]
    J -- No --> L[Continue mixing / browsing]
    K --> L
```

---

## 2. Component Architecture

```mermaid
graph LR
    subgraph Frontend["Frontend Layer"]
        HTML[HTML / CSS / JS Previewer]
        NAV[Navbar v8]
        DASH[Dashboard Apollo]
        SIDE[Sidebar Tree]
    end

    subgraph Audio["Audio Engine"]
        WAA[Web Audio API]
        BPM[BPM Detection<br>spectral flux + autocorrelation]
        FILT[3-Band Frequency Separation<br>BiquadFilter nodes]
    end

    subgraph Data["Data Layer"]
        COL[Coletanea Library]
        PLM[Playlist Management]
        USB[USB Export State]
        SIM[Simulated Data Layers<br>simulated.navbar.data.js<br>simulated.data4.dashboard.js]
    end

    subgraph Render["Rendering Pipeline"]
        CAN[Canvas Waveform]
        BQF[3-Band BiquadFilter]
        RGB[RGB Compositing<br>screen blend mode]
        HYP[Hyperreal Output]
    end

    HTML --> NAV
    HTML --> DASH
    DASH --> SIDE
    SIDE --> PLM
    PLM --> USB
    COL --> PLM
    WAA --> BPM
    WAA --> FILT
    FILT --> CAN
    CAN --> BQF
    BQF --> RGB
    RGB --> HYP
```

---

## 3. Waveform Pipeline Detail

```mermaid
graph TD
    AB[Audio Buffer] --> FFT[FFT Analysis]
    FFT --> BQ1[BiquadFilter: Lowpass 250Hz<br>Bass band]
    FFT --> BQ2[BiquadFilter: Bandpass 250Hz-4kHz<br>Mid band]
    FFT --> BQ3[BiquadFilter: Highpass 4kHz<br>High band]

    BQ1 --> CH_B["Blue channel #0055FF<br>opacity 0.85"]
    BQ2 --> CH_G["Green channel #00CC44<br>opacity 0.75"]
    BQ3 --> CH_R["Red channel #FF2233<br>opacity 0.90"]

    subgraph Canvas["Canvas Rendering Order"]
        direction TB
        S1["1. Draw bass waveform<br>back layer, opacity 0.85"]
        S2["2. Draw mid waveform<br>middle layer, opacity 0.75<br>blend: screen"]
        S3["3. Draw high waveform<br>front layer, opacity 0.90<br>blend: screen"]
        S1 --> S2 --> S3
    end

    CH_B --> S1
    CH_G --> S2
    CH_R --> S3

    S3 --> OUT["Hyperreal RGB output<br>saturated, NOT washed white"]
```

---

## 4. BPM Detection Pipeline

```mermaid
graph TD
    MIC[Mic Input / Audio File / Stream] --> CTX[AudioContext]
    CTX --> WK[AudioWorkletNode<br>bpm-processor.js]
    WK --> RMS[RMS Energy<br>weight: 0.5]
    WK --> SF[Spectral Flux<br>weight: 0.3]
    WK --> AC[Autocorrelation<br>weight: 0.2<br>circular buffer 2048 samples]

    RMS --> SCORE[Hybrid Score<br>rms*0.5 + flux*0.3 + corr*0.2]
    SF --> SCORE
    AC --> SCORE

    SCORE --> THR{Score > Adaptive Threshold?}
    THR -- Yes --> BEAT[Beat Detected]
    THR -- No --> WAIT[Wait for next quantum]

    BEAT --> GATE{Interval > 120ms?}
    GATE -- Yes --> INT[Push interval to buffer<br>max 24 intervals]
    GATE -- No --> WAIT

    INT --> MED[Median filter intervals]
    MED --> OCTAVE[Octave normalization<br>constrain 60-220 BPM]
    OCTAVE --> EMA[EMA Smoothing<br>alpha 0.25]
    EMA --> POST[postMessage to main thread<br>bpm / phase / downbeat / rms / beat]
```

---

## 5. Navbar Architecture

```mermaid
graph TD
    subgraph Data
        SND[simulated.navbar.data.js<br>window.ApolloNavData]
    end

    subgraph Renderer
        ABN[app-btn.navbar.js<br>window.ApolloNavRenderer]
    end

    subgraph Engine
        NJS[navbar.js<br>window.ApolloNavbar]
    end

    subgraph Templates
        NHT[navbar.html<br>standalone page]
        NPH[navbar.php<br>embeddable partial]
    end

    subgraph Styles
        NCS[navbar.css<br>topbar + panels + layout]
        ACS[app-btn.navbar.css<br>bento apps grid]
    end

    SND --> ABN
    ABN --> NJS
    NCS --> NHT
    ACS --> NHT
    NCS --> NPH
    ACS --> NPH
    NJS --> NHT
    NJS --> NPH

    NJS -->|"open / close / toggle"| PANELS["3 Panels:<br>Nav left-slide<br>Apps dropdown<br>Profile right-slide"]
    ABN -->|renderNav / renderApps / renderProfile| PANELS
```

---

## 6. Dashboard Architecture

```mermaid
graph TD
    subgraph Styles
        DCS[dashboard.apollo.css<br>topbar + layout + dropdowns]
        STC[sidebar-tree.css<br>tree sections + rows]
    end

    subgraph Data
        SD4[simulated.data4.dashboard.js<br>window.ApolloSimData]
    end

    subgraph Engine
        DJS[dashboard.apollo.js<br>ApolloDashboard.boot]
    end

    subgraph Modules
        TM[ThemeManager<br>dark mode + localStorage]
        CM[ClockManager<br>pt-BR 1s tick]
        IM[InteractionManager<br>dropdowns + panels + overlay]
        CHM[ChartManager<br>amCharts 5 line series]
    end

    subgraph Sidebar
        STJ[sidebar-tree.js<br>window.ApolloSidebarTree]
    end

    subgraph Pages
        DHT[dashboard.apollo.html<br>production page]
        DBK[dashboard.apollo.bak.html<br>backup version]
        DRF[draft-building-theme-dash.html<br>draft / prototype]
    end

    DCS --> DHT
    STC --> DHT
    SD4 --> DJS
    DJS --> TM
    DJS --> CM
    DJS --> IM
    DJS --> CHM
    DJS --> DHT

    STJ -->|"init / getState /<br>getEnabledExportPlaylists"| TREE["Sidebar Tree<br>COMPUTADOR<br>PLAYLISTS<br>PENDRIVE"]

    STJ -->|"sidebar-select event"| DHT
```

---

## 7. BPM Module Architecture

```mermaid
graph TD
    subgraph Production["Production Entry (obfuscated)"]
        IDX[index.html<br>minified + encrypted boot]
        SW[sw.js<br>Service Worker<br>cache + security]
        BCB[bpm-core.blob.js<br>XOR-encrypted core]
        BAB[bpm-assets.blob.js<br>XOR-encrypted CSS]
        BWJ[bpm-core.wasm.js<br>mock WASM API]
        MAN[bpm-manifest.json<br>PWA manifest]
    end

    subgraph Development["Development Entry (readable)"]
        BMH[bpm-meter.html<br>standalone dev page]
        BPR[bpm-processor.js<br>AudioWorklet processor]
        RDM[README.md<br>documentation]
    end

    IDX --> SW
    IDX --> BCB
    IDX --> BAB
    IDX --> BWJ
    IDX --> MAN
    BMH --> BPR

    BCB -->|"decrypt at runtime"| CORE[ApolloBPMCore<br>mic analysis + AudioContext]
    BAB -->|"decrypt at runtime"| CSS[BPM meter styles]
    BWJ -->|"mock WASM exports"| API["startMic / stopAnalysis<br>getBPM / getConfidence"]

    BPR -->|"registerProcessor<br>bpm-processor"| WK[AudioWorkletNode]
    WK -->|postMessage| MAIN["Main Thread<br>bpm / phase / rms / beat"]
```

---

## 8. File Dependencies (complete)

```mermaid
graph TD
    subgraph CDN["External CDN"]
        CORE["cdn.apollo.rio.br/v1.0.0/core.js<br>GSAP + RemixIcon + Apollo Icons + Popper + jQuery"]
        HTMX["htmx.v2.0.8.js"]
        ALP["alpine.v.3.15.8.js"]
        FONTS["Google Fonts<br>Space Grotesk / Space Mono / Syne"]
        REMIX["Remix Icons 4.x"]
        AM5["amCharts 5"]
    end

    subgraph Root["Root Files"]
        UNI_CSS[universal.css<br>v3.2.0 design system]
        UNI_SHO[universal-showcase.html.bak.html<br>token showcase / backup]
    end

    subgraph Navbar["navbar/"]
        N_DATA[simulated.navbar.data.js]
        N_RENDER[app-btn.navbar.js]
        N_ENGINE[navbar.js]
        N_HTML[navbar.html]
        N_PHP[navbar.php]
        N_CSS[navbar.css]
        N_APP_CSS[app-btn.navbar.css]
    end

    subgraph Dash["DASH/"]
        D_HTML[dashboard.apollo.html]
        D_CSS[dashboard.apollo.css]
        D_JS[dashboard.apollo.js]
        D_BAK[dashboard.apollo.bak.html]
        D_DRAFT[draft-building-theme-dash.html]
        D_DATA[simulated.data4.dashboard.js]
        D_ST_CSS[sidebar-tree.css]
        D_ST_JS[sidebar-tree.js]
    end

    subgraph Bpm["BPM/"]
        B_METER[bpm-meter.html]
        B_PROC[bpm-processor.js]
        B_WASM[bpm-core.wasm.js]
        B_CORE[bpm-core.blob.js]
        B_ASSETS[bpm-assets.blob.js]
        B_MAN[bpm-manifest.json]
        B_SW[sw.js]
        B_IDX[index.html]
        B_README[README.md]
    end

    subgraph Dj["DJ/"]
        DJ_CSS[dj-page.css]
        DJ_JS[dj-page.js]
        DJ_INIT[finished/js/dj.init.js]
        DJ_DATA[finished/js/dj.data.js]
        DJ_ANIM[finished/js/dj.animations.js]
        DJ_FAB[finished/js/dj.fab-menu.js]
        DJ_MARQ[finished/js/dj.marquee.js]
        DJ_NAV[finished/js/dj.navbar.js]
        DJ_DEP[finished/js/dj.render-depoimentos.js]
        DJ_GIGS[finished/js/dj.render-gigs.js]
        DJ_TRKS[finished/js/dj.render-tracks.js]
        DJ_PROG[finished/js/dj.scroll-progress.js]
    end

    %% CDN dependencies
    CORE --> N_HTML
    CORE --> N_PHP
    CORE --> D_HTML
    CORE --> D_BAK
    CORE --> D_DRAFT
    FONTS --> B_METER
    FONTS --> B_IDX
    REMIX --> B_METER
    HTMX --> D_HTML
    ALP --> D_HTML
    AM5 --> D_JS

    %% Navbar chain
    N_DATA --> N_RENDER
    N_RENDER --> N_ENGINE
    N_CSS --> N_HTML
    N_APP_CSS --> N_HTML
    N_CSS --> N_PHP
    N_APP_CSS --> N_PHP

    %% Dashboard chain
    D_CSS --> D_HTML
    D_DATA --> D_JS
    D_JS --> D_HTML
    D_ST_CSS --> D_HTML
    D_ST_JS --> D_HTML

    %% BPM chain
    B_PROC --> B_METER
    B_WASM --> B_IDX
    B_CORE --> B_IDX
    B_ASSETS --> B_IDX
    B_MAN --> B_IDX
    B_SW --> B_IDX

    %% DJ chain
    DJ_DATA --> DJ_INIT
    DJ_ANIM --> DJ_INIT
    DJ_FAB --> DJ_INIT
    DJ_MARQ --> DJ_INIT
    DJ_NAV --> DJ_INIT
    DJ_DEP --> DJ_INIT
    DJ_GIGS --> DJ_INIT
    DJ_TRKS --> DJ_INIT
    DJ_PROG --> DJ_INIT
    UNI_CSS --> DJ_CSS

    %% Root dependencies
    CORE --> UNI_CSS
```

---

## 9. DJ Page Module Dependencies

```mermaid
graph TD
    INIT[dj.init.js<br>Main entry point] --> DATA[dj.data.js<br>gigsData / tracksData / depoimentosData]
    INIT --> ANIM[dj.animations.js<br>GSAP + ScrollTrigger]
    INIT --> FAB[dj.fab-menu.js<br>floating action button]
    INIT --> MARQ[dj.marquee.js<br>scrolling marquee]
    INIT --> NAV[dj.navbar.js<br>DJ-specific navbar logic]
    INIT --> RDEP[dj.render-depoimentos.js<br>testimonials renderer]
    INIT --> RGIG[dj.render-gigs.js<br>gigs grid renderer]
    INIT --> RTRK[dj.render-tracks.js<br>tracks card renderer]
    INIT --> SPRO[dj.scroll-progress.js<br>scroll progress bar]

    subgraph HTML_Partials["finished/html/"]
        HERO[hero.html]
        BIO[bio.html]
        AGENDA[agenda.html]
        BOOKING[booking.html]
        DEPO[depoimentos.html]
        EPK[epk.html]
        FOOTER[footer.html]
        GALLERY[gallery.html]
        MARQUEE[marquee.html]
        METRICS[metrics.html]
        NOISE[noise.html]
        PROGRESS[progress.html]
        SOUNDS[sounds.html]
        FABM[fab-menu.html]
    end

    subgraph CSS_Layers["finished/css/ (ordered)"]
        C01[01-tokens.css]
        C02[02-base.css]
        C03[03-progress.css]
        C04[04-navbar.css]
        C05[05-hero.css]
        C06[06-metrics.css]
        C07[07-gigs.css]
        C08[08-marquee.css]
        C09[09-tracks.css]
        C10[10-bio.css]
        C11[11-timeline.css]
        C12[12-epk.css]
        C13[13-gallery.css]
        C14[14-depoimentos.css]
        C15[15-booking.css]
        C16[16-footer.css]
        C17[17-sections.css]
        C18[18-fab-sheet.css]
        C19[19-animations.css]
    end

    subgraph PHP_Partials["finished/php/parts/dj-v3/"]
        BIO_PHP[bio.php]
        BOOKING_PHP[booking.php]
        AGENDA_PHP[agenda.php]
    end
```
