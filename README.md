# 🏃‍♂️ Homer's Run

Een simpele, verslavende endless runner game gebaseerd op The Simpsons.  
Help Homer te springen over de dansende Lisa's en scoor zoveel mogelijk punten!

**Live demo (na deployment):**  
https://jouwgebruikersnaam.github.io/homers-run/

---

## 🎮 Hoe speel je?

- **Desktop**: Druk op de **spatiebalk** om te springen.
- **Mobiel / Tablet**: Tik ergens op het scherm om te springen.
- Spring op het juiste moment over de dansende Lisa's.
- Hoe langer je speelt, hoe sneller het gaat en hoe vaker de Lisa's verschijnen.

---

## ✨ Features

- Vloeiende animaties met `requestAnimationFrame`
- Onregelmatige spawn tijden voor Lisa's (wordt sneller naarmate je scoort)
- Beste score wordt opgeslagen in de browser sessie (sessionStorage)
- Speciale **Game Over** weergave: achtergrond stopt, Homer verdwijnt, één grote dansende Lisa in het midden
- Volledig responsive (werkt goed op mobiel)
- D'oh! geluidseffect bij Game Over
- Touch & pointer support (geen scroll issues op mobiel)

---

## 🚀 Lokaal testen

1. Download of clone deze map.
2. Open `index.html` direct in je browser (dubbelklik).
3. Of gebruik een lokale server voor de beste ervaring:

```bash
# Met Python
python -m http.server 8000

# Of met Node.js (http-server)
npx http-server
```

Open dan http://localhost:8000 in je browser.

---

## 📤 Publiceren op GitHub (vanuit Visual Studio Code)

Je kunt deze website **gratis** hosten via **GitHub Pages** in een paar minuten.

### Stap-voor-stap vanuit VS Code:

1. **Open de map in VS Code**
   - Open de map `homers-run` (of de map met `index.html`) in Visual Studio Code.

2. **Initialiseer Git (als nog niet gedaan)**
   - Open de **Terminal** in VS Code (`Ctrl + `` ` of `Terminal → New Terminal`)
   - Voer uit:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: Homer's Run game"
     ```

3. **Maak een nieuwe repository op GitHub**
   - Ga naar [github.com/new](https://github.com/new)
   - Maak een **nieuwe lege repository** aan (bijv. `homers-run`)
   - **NIET** aanvinken "Add a README file" of ".gitignore" (want die hebben we lokaal al)
   - Klik op **Create repository**

4. **Verbind lokale map met GitHub (VS Code)**
   In de Terminal:
   ```bash
   git remote add origin https://github.com/JOUW_GITHUB_NAAM/homers-run.git
   git branch -M main
   git push -u origin main
   ```

   (Vervang `JOUW_GITHUB_NAAM` door je eigen GitHub gebruikersnaam)

5. **Activeer GitHub Pages**
   - Ga naar je repository op GitHub → tab **Settings**
   - Scroll naar **Pages** (in de linker sidebar)
   - Onder **Source** kies:
     - **Deploy from a branch**
     - Branch: `main`
     - Folder: `/ (root)`
   - Klik **Save**
   - Wacht 1-2 minuten → je website is live op:
     `https://jouwgebruikersnaam.github.io/homers-run/`

6. **Klaar!**  
   Iedereen kan nu je spel spelen via die URL. Deel hem gerust!

---

## 📁 Project structuur

```
homers-run/
├── index.html          # Het spel (start hier)
├── homer.css           # Styling + responsive design
├── homer.js            # Alle game logica (physics, collision, spawn, etc.)
├── afbeeldingen/       # Alle sprites & backgrounds
│   ├── runningHomer.gif
│   ├── dancingLisa.gif
│   ├── simpsonGameBg.png
│   └── ...
├── geluiden/
│   └── Doh.mp3         # Homer's iconische "D'oh!"
└── README.md
```

---

## 🛠️ Technische details (analytisch)

- **Game loop**: `requestAnimationFrame` → soepel op alle apparaten
- **Physics**: Simpele gravity + velocity jump (JUMP_VELOCITY = 13.5, GRAVITY = 0.55)
- **Spawn logica**: Random interval tussen ~900-2950ms, wordt korter naarmate score stijgt
- **Collision**: Simpele bounding box check (horizontaal + verticaal)
- **Performance**: `will-change` CSS hints + minimale DOM manipulatie
- **State management**: Duidelijke scheiding tussen `startGame()`, `gameLoop()`, `endGame()`
- **Best score**: `sessionStorage` → blijft alleen tijdens de huidige browsersessie

---

## 📝 Licentie

Dit is een fan-project voor educatieve / persoonlijke doeleinden.  
Alle Simpsons afbeeldingen en geluiden behoren toe aan 20th Century Fox / The Walt Disney Company.

Veel plezier met springen! 🍩 

_Gemaakt met ❤️ voor Simpsons fans_DOH 
