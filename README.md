# Relic Finder

**An interactive 3D museum for the machines NASA left behind.**
Built for the NASA Space Apps Challenge 2026: *Abandoned but not Forgotten, Storytelling about NASA's Discarded Equipment on the Moon and Mars.*

Walk a first-person museum hall, photograph a relic, step through the photo into its own timeline room, then operate the machine in a short mini-game.

> Not an official NASA product.

---

## Why this exists

Most students only hear about active missions. The rovers, landers and probes NASA left on the Moon, Mars and in deep space rarely get their story told. A plain landing page would not change that, so Relic Finder turns the history into something you explore and play.

## The 10 relics

| # | Relic | Where it is | Operate mission |
|---|---|---|---|
| 1 | Apollo Lunar Module | The Moon | Land the descent stage |
| 2 | NEAR Shoemaker | Asteroid 433 Eros | Land on Eros |
| 3 | Kepler Space Telescope | Earth-trailing orbit | Run the telescope |
| 4 | Viking Lander | Mars | Run the sampling arm |
| 5 | Spirit & Opportunity | Mars | Drive the rover |
| 6 | Ingenuity Helicopter | Mars | Fly the helicopter |
| 7 | Hubble Space Telescope | Low Earth orbit | Point and image the sky |
| 8 | Voyager 1 | Interstellar space | Phone home |
| 9 | Cassini-Huygens | Saturn | Thread the Grand Finale |
| 10 | Pioneer 10 | Jupiter and beyond | Slingshot past Jupiter |

## How it works

1. **Look**: walk the museum hall and find the framed relics.
2. **Snap**: frame one in the viewfinder and take its photo.
3. **Project**: place the photo on any wall or the floor.
4. **Step inside**: walk into the photo to enter that relic's room, then read its timeline and stations.
5. **Operate**: run the relic's mini-game and feel its real engineering limits.
6. **Rewind**: undo a placement or return to the museum at any time.

Read every panel in a room to unlock its exit. Complete all ten rooms to finish the collection.

## Controls

| Action | Desktop | Mobile |
|---|---|---|
| Look | Drag | Drag |
| Walk | W A S D | Virtual joystick |
| Snap photo | C or Space | Snap button |
| Place photo | Click or F | Place button |
| Rotate photo | Q | Rotate button |
| Operate relic | O | Operate button |
| Rewind / exit | R | Rewind button |

## Run it

No build step and no install.

1. Download the repository.
2. Open `index.html` in a modern browser with WebGL enabled.
3. Keep an internet connection on: Three.js and the fonts load from CDNs.

For GitHub Pages, rename the file to `index.html` (or keep the current name and link to it directly), then enable Pages in the repo settings.

> The file is about 13 MB because the NASA 3D models and textures are embedded. The first load takes a moment.

## Tech stack and why

| Choice | Reason |
|---|---|
| Plain HTML, CSS and JavaScript in one file | No framework, bundler or server code to maintain or exploit |
| Three.js r128 and GLTFLoader, pinned to exact versions | Renders NASA's own 3D models in the browser with predictable behavior |
| Embedded GLB models, textures and mission facts | No database, API key or backend needed |
| Google Fonts with system fallbacks | Looks good online and still readable if fonts fail |

**Philosophy:** make it exist first, make it beautiful later. After the wave of vulnerabilities reported in October 2026, we kept the architecture deliberately simple and the dependency list short.

## Data and credits

- Mission facts: NASA mission pages and the [NSSDC catalogue](https://nssdc.gsfc.nasa.gov/)
- 3D models, Moon surface and Hipparcos star map: [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources)
- Mars horizon: derived from a NASA rover panorama

NASA does not endorse this project. Relic Finder is not an official NASA product.

## Roadmap

- Add more discarded hardware from NASA's list: lunar rovers, ALSEP, Surveyor, Sojourner, Phoenix, InSight, Dawn and Pioneer 11
- Upgrade visuals with richer lighting, higher-resolution textures and polished transitions
- Rework each gamified room with deeper missions, clearer scoring and difficulty levels for different age groups
- Add automated tests, dependency audits and a build pipeline once the visuals mature

## Team

Shaikh Zaid Rahman - Coding + Ideation 
Ruhi Rani Khatun - Research +  Data Verification + Control Mechanism Design
Swastika Haldar - Overall design (Color palette, UI/UX Design)

- All students are from iLEAD (Institute of Leadership, Entrepreneurship, and Development), Kolkata.

Any querries email on: shaikhzaidrahman10b@gmail.com
