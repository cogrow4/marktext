> **This documentation is outdated, based on the original readme from 14 April 2018!**

<p align="center"><img src="../../static/logo-small.png" alt="novelcraft" width="100" height="100"></p>

<h1 align="center">NovelCraft</h1>

<div align="center">
  <a href="https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fnovelcraft%2Fnovelcraft">
    <img src="https://img.shields.io/twitter/url/https/github.com/novelcraft/novelcraft.svg?style=for-the-badge" alt="twitter">
  </a>
</div>
<div align="center">
  <strong>:high_brightness:Edytor markdown nowej generacji:crescent_moon:</strong>
</div>
<div align="center">
  Aplikacja na bazie <code>Electron</code> na platformy OS X, Windows i Linux
</div>

<br />

<div align="center">
  <!-- Version -->
  <a href="https://novelcraft.github.io/website">
    <img src="https://badge.fury.io/gh/jocs%2Fnovelcraft.svg" alt="website">
  </a>
  <!-- License -->
  <a href="https://novelcraft.github.io/website">
    <img src="https://img.shields.io/github/license/novelcraft/novelcraft.svg" alt="LICENSE">
  </a>
  <!-- Build Status -->
  <a href="https://novelcraft.github.io/website">
    <img src="https://travis-ci.org/novelcraft/novelcraft.svg?branch=master" alt="build">
  </a>
  <!-- Downloads total -->
  <a href="https://novelcraft.github.io/website">
    <img src="https://img.shields.io/github/downloads/novelcraft/novelcraft/total.svg" alt="total download">
  </a>
  <!-- Downloads latest release -->
  <a href="https://novelcraft.github.io/website">
    <img src="https://img.shields.io/github/downloads/novelcraft/novelcraft/v0.17.1/total.svg" alt="latest download">
  </a>
  <!-- deps -->
  <a href="https://novelcraft.github.io/website">
    <img src="https://img.shields.io/hackage-deps/v/lens.svg" alt="dependencies">
  </a>
  <!-- donates -->
  <a href="https://opencollective.com/novelcraft">
    <img src="https://opencollective.com/novelcraft/tiers/backer/badge.svg?label=backer&color=brightgreen" alt="donate">
  </a>
</div>

<div align="center">
  <h3>
    <a href="https://novelcraft.github.io/website">
      Strona
    </a>
    <span> | </span>
    <a href="https://github.com/novelcraft/novelcraft#features">
      Cechy programu
    </a>
    <span> | </span>
    <a href="https://github.com/novelcraft/novelcraft#download-and-installation">
      Instalacja
    </a>
    <span> | </span>
    <a href="https://github.com/novelcraft/novelcraft#development">
      Rozwój
    </a>
    <span> | </span>
    <a href="https://github.com/novelcraft/novelcraft#contribution">
      Udział w projekcie
    </a>
  </h3>
</div>

<div align="center">
  <sub>Edytor Markdown, który potrafi. Zbudowany z ❤︎ przez
    <a href="https://github.com/Jocs">Jocs</a> i
    <a href="https://github.com/novelcraft/novelcraft/graphs/contributors">
      innych
    </a>
  </sub>
</div>

<br />

![](../../docs/novelcraft.gif)

### Cechy programu

- Podgląd na żywo - użycie [snabbdom](https://github.com/snabbdom/snabbdom) jako swojego silnika renderującego.
- Wsparcie specyfikacji [CommonMark](https://spec.commonmark.org/0.29/) i [GitHub Flavored Markdown](https://github.github.com/gfm/).
- Wsparcie paragrafów i skrótów klawiatowych dla stylów wbudowanych w celu zwiększenia twojej wydajności podczas pisania.
- Zapis do plików **HTML** i **PDF**.
- Ciemny i jasny motyw.
- Różne tryby edycji: **Kod źródłowy**, **Maszyna do pisania**, **Skupienie**.

<h4 align="center">:crescent_moon:Motywy:high_brightness:</h4>

| Ciemny :crescent_moon:                                             | Jasny :high_brightness:                                             |
|:------------------------------------------------------------------:|:-------------------------------------------------------------------:|
| ![](../../docs/dark.jpg) | ![](../../docs/light.jpg) |

<h4 align="center">:smile_cat:Tryby edycji:dog:</h4>

| Kod źródłowy                                                         | Maszyna do pisania                                                       | Skupienie                                                           |
|:--------------------------------------------------------------------:|:------------------------------------------------------------------------:|:-------------------------------------------------------------------:|
| ![](../../docs/source.gif) | ![](../../docs/typewriter.gif) | ![](../../docs/focus.gif) |

### Dlaczego kolejny edytor?

1. Kocham pisać. Używałem wiele różnych edytorów markdown, ale wciąż nie ma takiego, który byłby w pełni zgodny z moimi oczekiwaniami. Nie lubię, kiedy pisanie przerywają mi niemożliwe do wytrzymania błędy. **NovelCraft** używa wirtualnego DOM do wyrenderowania strony co sprawia, że jest bardzo wydajny. Program jest rozpowszechniany na licencji open source dla wszystkich przyjaciół kochających markdown i pisanie.
2. Jak już zostało wspomniane powyżej, **NovelCraft** będzie zawsze rozpowszechniany na licencji open source. Wierzymy, że wszyscy wielbiciele markdown dołożą swoją cegiełkę do kodów źródłowych programu i pomogą w rozwijaniu **NovelCraft**.
3. Istnieje wiele edytorów markdown i każdy z nich ma swoje cechy szczególne, jednak ciężko jest zaspokoić wszystkie potrzeby użytkowników. Wierzę, że **NovelCraft** jest w stanie zaspokoić potrzeby jak największej grupy osób. Mimo iż najnowsza wersja **NovelCraft** nie jest idealna, próbujemy stworzyć go tak doskonałym jak to jest tylko możliwe.

### Instalacja

![Conda](https://img.shields.io/conda/pn/conda-forge/python.svg?style=for-the-badge)

| ![]( https://github.com/ryanoasis/nerd-fonts/wiki/screenshots/v1.0.x/mac-pass-sm.png)                                                                                                             | ![]( https://github.com/ryanoasis/nerd-fonts/wiki/screenshots/v1.0.x/windows-pass-sm.png)                                                                                                                     | ![]( https://github.com/ryanoasis/nerd-fonts/wiki/screenshots/v1.0.x/linux-pass-sm.png)                                                                                                                                   |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [![latest version](https://img.shields.io/github/downloads/novelcraft/novelcraft/latest/novelcraft-x64.dmg.svg)](https://github.com/novelcraft/novelcraft/releases/download/v0.17.1/novelcraft-x64.dmg) | [![latest version](https://img.shields.io/github/downloads/novelcraft/novelcraft/latest/novelcraft-setup.exe.svg)](https://github.com/novelcraft/novelcraft/releases/download/v0.17.1/novelcraft-setup.exe) | [![latest version](https://img.shields.io/github/downloads/novelcraft/novelcraft/latest/novelcraft-x86_64.AppImage.svg)](https://github.com/novelcraft/novelcraft/releases/download/v0.17.1/novelcraft-x86_64.AppImage) |

Nie znalazłeś swojego systemu? Przejdź do strony [release](https://github.com/novelcraft/novelcraft/releases). Wciąż nie znalazłeś? Zgłoś [problem](https://github.com/novelcraft/novelcraft/issues).

Chciałbyś zobaczyć jak nowe udogodnienia wprowadziła najnowsza wersja? Udaj się do [CHANGELOG](../../.github/CHANGELOG.md)

Jeśli używasz systemu OS X, to możesz zainstalować NovelCraft za pomocą [**homebrew cask**](https://github.com/caskroom/homebrew-cask). Aby zacząć korzystać z Homebrew-Cask potrzebujesz tylko [Homebrew](https://brew.sh/).

> brew install --cask mark-text

![](../../docs/brew-cask.gif)

### Rozwój

Jeżeli chciałbyś samodzielnie zbudować **NovelCraft**:

- sklonuj to repozytorium.
- uruchom komendę `npm install`
- uruchom komendę `npm run build`
- skopiuj zbudowaną aplikację do folderu Applications lub jeśli używasz systemu Windows uruchom instalator.

W przypadku jakichkolwiek pytań podczas korzystania z **NovelCraft** zaczęcamy do zgłoszenia problemu. Mamy nadzieję, że będziesz trzymał się ustalonego z góry formatu zgłaszania problemów. Wspaniale by było, jeżeli to właśnie ty naprawisz błąd i zgłosisz pull request.

## Udział w projekcie

NovelCraft jest w trakcie rozwijania. Upewnij się, że przeczytałeś [Contributing Guide](../../CONTRIBUTING.md) przed stworzeniem pull request. Chcesz dodać nowe udogodnienia do NovelCraft? Udaj się do [TODO LIST](../../.github/TODOLIST.md)

Dziękujemy wszystkim osobom, które już wzięły udział w projekcie NovelCraft! Jeżeli już jesteś członkiem [contributors](https://github.com/novelcraft/novelcraft/graphs/contributors), otwórz pull request aby dodać twoje imię i zdjęcie do poniższej listy osób, które pomogły przy projekcie.

Specjalne podziękowania dla @[Yasujizr](https://github.com/Yasujizr), który zaprojektował logo NovelCraft.

| [![Jocs](https://avatars0.githubusercontent.com/u/9712830?s=150&v=4)](https://github.com/Jocs) | [![ywwhack](https://avatars1.githubusercontent.com/u/8746197?s=150&v=4)](https://github.com/ywwhack) | [![notAlaanor](https://avatars1.githubusercontent.com/u/17591936?s=150&v=4)](https://github.com/notAlaanor) | [![fxha](https://avatars1.githubusercontent.com/u/22716132?s=150&v=4)](https://github.com/fxha) |
|:----------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
| [Jocs](https://github.com/Jocs)                                                                | [ywwhack](https://github.com/ywwhack)                                                                | [notAlaanor](https://github.com/notAlaanor)                                                                 | [fxha](https://github.com/fxha)                                                                 |

### Licencja

 [**MIT**](../../LICENSE).

Copyright (c) 2017-present, @Jocs
