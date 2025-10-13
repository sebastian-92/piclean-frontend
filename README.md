# piclean
## a clean, open source, and compatible alternate frontend for [Picrew](https://picrew.me)

### [Official Instance](https://piclean.us)
### see the about section on the [website](https://piclean.us/progress) for more information on this project

## TODO
### 22/23 Complete (96%)
- [x] Search
    - [x] Basic Functionality
    - [x] [compatibility] Filtering
    - [x] [Extra] Infinite Scroll
- [x] Discovery
    - [x] Basic Functionality
    - [x] [compatibility] Infinite Scroll
- [x] Image Maker 
    - [x] Basic Functionality
    - [x] [compatibility] Color Switching
        - [x] [visual] Change via boxes
    - [x] [compatibility] Rotation
    - [x] [compatibility] XY Movement
    - [x] [compatibility] Multi-layer parts fix
    - [x] [visual] Rewrite css w/ Bulma for consistency
- [x] [compatibility] Creator Profiles
- [x] [compatibility] License display on browsing for search & profiles
- [x] [compatibility] Local progress saving
    - [x] [extra] Multiple Save Slots
    - [x] [extra] Import Saves
    - [x] [extra] Export Saves
- [ ] [compatibility] Local Favorites
- [x] [compatibility] Default config loading

### Longer term TODO:
- [ ] [extra] Custom Loading Import


#### Known bugs
- Eyes on 1810651 don't load
    - `Uncaught (in promise) TypeError: Cannot convert undefined or null to object
    at Object.values (<anonymous>)
    at render (player.js:245:14)`
    - same error on 2773995 w/ body
    - let me know if it happens!


## LICENSE
All Piclean Project software is licensed under the [GNU AGPL v3.0](LICENSE). All image makers belong to their respective owners, please respect the individual licenses of the creators.
