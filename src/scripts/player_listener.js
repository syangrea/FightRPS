import * as THREE from 'three';

export default class PlayerListener{
    constructor(player){
        this.player = player;
        this.cameraKeysPressed = {
            left: false,
            right: false
        }
        this.run = false;
        this.addCameraListener();
        
    }

    // getForwardVector(){
    // 	camera.getWorldDirection(this.player.direction);
    // 	this.player.direction.y = 0;
    // 	this.player.direction.normalize();
    // 	return this.player.direction
    // }

    update(mixerUpdateDelta){
        if(this.player.health < 0){
            this.player.controller.switchActions("death");
            this.player.mixer.update(mixerUpdateDelta);
            return;
        }
        let decceleration = new THREE.Vector3(-0.0005, -0.0001, -10.0);
        let acceleration = new THREE.Vector3(1, 0.25, 25.0);
        let model = this.player.model;

        let direction = new THREE.Vector3(0,0,1);
        direction.applyQuaternion(model.quaternion);
        direction.normalize
        const frameDecceleration = new THREE.Vector3(
            this.player.velocity.x * decceleration.x,
            this.player.velocity.y * decceleration.y,
            this.player.velocity.z * decceleration.z
        );
        frameDecceleration.multiplyScalar(mixerUpdateDelta);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * 
                        Math.min(Math.abs(frameDecceleration.z), Math.abs(this.player.velocity.z));
        this.player.velocity.add(frameDecceleration);
        let acc = acceleration.clone();
   
        if(this.player.currentMove._clip.name === 'walk'){
       
            this.player.velocity.z += acc.z * mixerUpdateDelta;
        } else if(this.player.currentMove._clip.name === 'walk_backwards.001'){
            this.player.velocity.z -= acc.z * mixerUpdateDelta;
            // this.player.model.position.add(direction.normalize().multiplyScalar(-speed * mixerUpdateDelta));
	    }
        
        if (this.run){
            direction.multiplyScalar(2 * this.player.velocity.z * mixerUpdateDelta);
        } else{
            direction.multiplyScalar(this.player.velocity.z * mixerUpdateDelta);
        }
        model.position.add(direction)

        if(this.player.playerNumber === "player1"){

            if(this.cameraKeysPressed.left || this.cameraKeysPressed.right){
                const quat = new THREE.Quaternion();
                const axisY = new THREE.Vector3(0,1,0);
                const modelQuat = this.player.model.quaternion.clone();
                this.cameraKeysPressed.left ? 
                    quat.setFromAxisAngle(axisY, .5 * Math.PI * mixerUpdateDelta):
                    quat.setFromAxisAngle(axisY, .5 * -Math.PI * mixerUpdateDelta);
                
                modelQuat.multiply(quat);
                this.player.model.quaternion.copy(modelQuat);
        
            }
        }
        this.player.mixer.update(mixerUpdateDelta);
        
       
       
    }

    addCameraListener(){
        document.addEventListener('keydown', e => {
            if(e.code === "ArrowRight"){
                this.cameraKeysPressed.right = true;
            }else if(e.code === "ArrowLeft"){
                this.cameraKeysPressed.left = true;
            }else if(e.code === "ShiftLeft"){
                this.run = true;
            }
        })
        document.addEventListener('keyup', e => {
            if(e.code === "ArrowRight"){
                this.cameraKeysPressed.right = false;
            }else if(e.code === "ArrowLeft"){
                this.cameraKeysPressed.left = false;
            }else if(e.code === "ShiftLeft"){
                this.run = false;
            }
        })
        


    }

}