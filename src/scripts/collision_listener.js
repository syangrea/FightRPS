import * as THREE from 'three';

export default class CollisionListener {
    constructor(players){
        this.players = players;
    }

    checkCollisions(){
        let playerCollisionsTable = {};
        let playersArr = Object.values(this.players);
        for(let i = 0; i < playersArr.length; i++){
            let player = playersArr[i];
            for(let j = 0; j < playersArr.length; j++){
                let otherPlayer = playersArr[j];       
                if( player.model && otherPlayer.model
                    && otherPlayer.playerNumber !== player.playerNumber 
                    && player.model.position.distanceTo(otherPlayer.model.position) < 3 ){
                    if(playerCollisionsTable[`${player.playerNumber} ${otherPlayer.playerNumber}`]) {continue;}
                    let playerMeshes =  player.model.children[2].children;
                    for(let x = 0; x < playerMeshes.length; x++){
                        let playerBodyPartMesh = playerMeshes[x];
                        if(playerBodyPartMesh.type === "SkinnedMesh"){
                            if(playerCollisionsTable[`${player.playerNumber} ${otherPlayer.playerNumber}`]) {continue;}
                            playerBodyPartMesh.geometry.computeBoundingBox();
                            let otherPlayerMeshes =  otherPlayer.model.children[2].children;
                            for(let y = 0; y < otherPlayerMeshes.length; y++){
                                let otherPlayerBodyPartMesh = otherPlayerMeshes[x];
                                if(otherPlayerBodyPartMesh.type === "SkinnedMesh"){
                                    if(playerCollisionsTable[`${player.playerNumber} ${otherPlayer.playerNumber}`]) {continue;}
                                    otherPlayerBodyPartMesh.geometry.computeBoundingBox();
                                    if(playerBodyPartMesh.geometry.boundingBox.intersectsBox(otherPlayerBodyPartMesh.geometry.boundingBox)){
                                        playerCollisionsTable[`${player.playerNumber} ${otherPlayer.playerNumber}`] = true;
                                        playerCollisionsTable[`${otherPlayer.playerNumber} ${player.playerNumber}`] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        return playerCollisionsTable;
    }

    collisionUpdate(){
        let collisions = this.checkCollisions();
        Object.keys(collisions).forEach(collision => {
            let player = this.players[collision.split(" ")[0]]
            let otherPlayer = this.players[collision.split(" ")[1]]
            let playerAction = player.currentMove;
            let otherPlayerAction = otherPlayer.currentMove;
            if(otherPlayerAction._clip.name === "attack.001" ){
                if(playerAction._clip.name !== "block_idle"){
                    player.controller.switchActions("soft_hit");
                    player.health -= 25;
                }
            }else if(otherPlayerAction._clip.name === "attack.002" ){
                if(playerAction._clip.name !== "block_idle"){
                    player.controller.switchActions("hard_hit");
                    player.health -= 50;
                }
            }else{
                if(playerAction._clip.name === "walk" || playerAction._clip.name === "walk_backwards.001"){
                    player.controller.switchActions("idle");
                }

            }
        })
    }
}