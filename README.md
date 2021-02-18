# FightBrosLite

## Background and Overview
FightBros Lite is a 3D Rock, Papers, Scissors game built with three.js. The twist is that spacing and timing matters.Each player starts with three lives. Each time they lose in rock, papers, scissors, they lose a life. You can move right and left and your move (rock, papers, scissors) only hits a certain distance in front of you. Each player only has three chances to make a move, but resets after either player gets hit, like a round in a regular game of rock papers scissors.  

Live Link: https://syangrea.github.io/FightRPS/

## Functionality and MVPs.
* Character selection - At least 2 characters to choose from.
* Fighting mechanics - Rock, Papers, Scissors, Right & Left Movement
* AI - Can play against a computer

## Wireframe & File Structure
##### Create or Join room page
![join-room](https://github.com/syangrea/FightBrosLite/blob/main/images/joinroom.PNG)

* Here you can press create room and generate a random room code. You can pass this code to someone else for them to join.

##### Game Canvas
![game-canvas](https://github.com/syangrea/FightBrosLite/blob/main/images/fightingcanvas.PNG)

* This is where the action happens. The canvas in the middle is where the fighting will take place. There will be a health bar for each player on the bottom.

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
