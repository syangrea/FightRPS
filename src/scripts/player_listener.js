import * as THREE from 'three';


export default class PlayerListener {

    constructor(player){
        this.player = player;
    }

    update(delta){
        let player = this.player;
        let character = this.player.character;
        let direction = new THREE.Vector3(0,0,1);
        direction.applyQuaternion(character.quaternion);
        direction.normalize;
        const speed = 2.5;
        if(player.currentMove._clip.name === "walk"){
            if(!player.collided
                && (!(player.againstRightWall && player.playerNumber === "player1"))
                &&(!(player.againstLeftWall && player.playerNumber === "player2"))){

                character.position.add(direction.multiplyScalar(speed * delta));
            }
        }else if(player.currentMove._clip.name === "walk_backwards.001"){
            // debugger
            if(!(player.againstRightWall && player.playerNumber === "player2")
                && !(player.againstLeftWall && player.playerNumber === "player1")){

                    character.position.add(direction.multiplyScalar(-speed * delta));
                }
        }
        this.player.mixer.update(delta);
    }

}