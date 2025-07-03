> Miro Haverinen — if you're reading this, I beg you to contact me regarding the legality of what I'm doing.

# W skrócie / In Summary

### 🇵🇱 Polski
Osobisty projekt tłumaczenia gry *Fear & Hunger 2: Termina* na język polski, którego celem jest **całkowite** spolszczenie wszystkich tekstów w grze.

### 🇬🇧 English
A personal project aimed at **fully** translating all in-game text of *Fear & Hunger 2: Termina* into Polish.

![Project Status](https://img.shields.io/badge/status-in%20progress-yellow)

---

<!-- The following line is auto-updated from translation_status.txt -->

**Current translation progress:**  
`Total: 1916/321084 translated (0.60%)`

---

# Dlaczego to robię? / Why Am I Doing This?

### 🇵🇱 Polski
Mój kolega miał problemy ze zrozumieniem gry po angielsku, więc postanowiłam znaleźć spolszczenie. Ku mojemu (nie)zdziwieniu — takie nie istniało. Gra jest niszowym tytułem indie, więc nie spodziewałxm się profesjonalnego tłumaczenia... więc biorę sprawy w swoje ręce.  
Moim celem jest ułatwienie zrozumienia fabuły oraz lokalizacja różnych elementów gry. Nie zamierzam nadużywać twórczości Miro — chcę jedynie wspomóc społeczność gry.

### 🇬🇧 English
My friend had trouble understanding the game in English, so I went looking for a Polish translation. To my (non)surprise, none existed. Since *Fear & Hunger* is a niche indie title, I didn’t expect a solid localization… so I decided to do it myself.  
My goal is to help others understand the story and localize various elements of the game. I don't plan to exploit Miro’s creation in any way — I just want to support the community.

---

# Pobieranie / Downloading

### 🇵🇱 Polski
1. Pobierz lub sklonuj repozytorium.
2. Znajdź folder z `Game.exe`.  
   > Jeśli gra pochodzi ze Steama, będzie w `/SteamLibrary/steamapps/common/`.
3. Stwórz kopię zapasową gry. **(WAŻNE!)**
4. Skopiuj zawartość projektu do odpowiednich folderów w `/Termina/www/`.

### 🇬🇧 English
1. Download or clone the repository.
2. Locate the folder containing `Game.exe`.  
   > If you're using the Steam version, it should be in `/SteamLibrary/steamapps/common/`.
3. Back up your game files. **(VERY IMPORTANT!)**
4. Copy the contents of this repo into the appropriate folders inside `/Termina/www/`.

---

# Install Script (Optional)

You can use the provided script below to install the translation automatically (for Windows):

```bat
@echo off
echo === Fear & Hunger 2: Termina Translation Installer ===
set /p game_path=Enter the full path to your game folder (where Game.exe is located): 

if not exist "%game_path%\Game.exe" (
    echo ERROR: Game.exe not found in the specified folder.
    pause
    exit /b
)

echo Backing up original files...
xcopy "%game_path%\www" "%game_path%\www_backup" /E /I /Y

echo Copying translation files...
xcopy "www" "%game_path%\www" /E /I /Y

echo Done!
pause
```

---

# Credits

- [ScorpGaming4432](https://github.com/ScorpGaming4432) – author, lead translator, and editor.
- My dear friend – inspiration behind the project.

## Special Thanks / Wielkie podziękowania

- [@Miro Haverinen](https://x.com/happy_paintings) – creator and owner of the game.
- Everyone listed in the game’s credits.

---

# Legal Disclaimer

This is a **fan-made** translation project for *Fear & Hunger 2: Termina* by Miro Haverinen.  
All rights to the original content, game, and assets belong to Miro Haverinen. No monetary gain is involved, and no copyrighted content is distributed.

If requested by the original creator or rights holder, this project will be removed immediately.

---

> Daan cos why not

![Daan smiling](https://preview.redd.it/funger-2-characters-but-smiling-v0-a0oe71h0vc1d1.png?width=180&format=png&auto=webp&s=969f7fd87b8676e17cb9ee24daf8748e755eca1b)
