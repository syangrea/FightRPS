import * as THREE from 'three';


export default class ThirdPersonCamera {
    constructor(camera, player){
        this.camera = camera;
        this.player = player;
        this.position = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.cameraControl = {
            mouseMoving: false,
            mouseEvent: null
        };
        this.addCameraListener();
    }

    update(mixerUpdateDelta){
        const positionOffset = new THREE.Vector3(-1, 2,-4);
        const directionOffset = new THREE.Vector3(0,1,4);


        let newCameraPosition = positionOffset.applyQuaternion(this.player.model.quaternion).add(this.player.model.position)
        let newCameraLookAt = directionOffset.applyQuaternion(this.player.model.quaternion).add(this.player.model.position)

        this.position.copy(newCameraPosition);
        this.camera.position.copy(this.position);
        
        this.direction.copy(newCameraLookAt);
        this.camera.lookAt(this.direction)
    }

    addCameraListener(){
        //vertical look
        // document.addEventListener('keydown', e => {
        //     if(e.code === "ArrowUp"){
        //         this.cameraKeysPressed.right = true;
        //     }else if(e.code === "ArrowDown"){
        //         this.cameraKeysPressed.left = true;
        //     }
        // })
        // document.addEventListener('keyup', e => {
        //     if(e.code === "ArrowUp"){
        //         this.cameraKeysPressed.right = false;
        //     }else if(e.code === "ArrowDown"){
        //         this.cameraKeysPressed.left = false;
        //     }
        // })
    }
    

}