# FightBrosLite

## Background and Overview
FightBros Lite is a a browser fighting game built with three.js.  It allows the basics of all fighting games: punching, blocking, movement and multiplayer.

## Functionality and MVPs.
* Character selection - At least 2 characters to choose from.
* Fighting mechanics - Punching, Blocking, Right & Left Movement, Jump
* AI & Multiplayer - Can play against a computer or join a room to play online with others.

## Wireframe & File Structure
##### Create or Join room page
![join-room](https://github.com/syangrea/FightBrosLite/blob/main/images/joinroom.PNG)
Here you can press create room and generate a random room code. You can pass this code to someone else for them to join.

##### Game Canvas
![game-canvas](https://github.com/syangrea/FightBrosLite/blob/main/images/fightingcanvas.PNG)
This is where the action happens. The canvas in the middle is where the fighting will take place. There will be a health bar for each player on the bottom.

##### File Structure
![file-structure](https://github.com/syangrea/FightBrosLite/blob/main/images/jsfilestructure.PNG)


## Architecture and Technology
* three.js for graphics and rendering
* websocket for online multiplayer
* Everything else built with vanilla Javascript

## Implementation Timeline
* Rendering game background and character - Day 1 & Day 2
* Fighting logic - Day 2 & Day 3
* AI fighting and styling - Day 4
* Wrap up styling - Day 5

## Bonus Features
* Online Multiplayer - Websockets
