import { Vector2, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";


export default class MoveLoader {

    constructor(moves,scene, players){
        this.moves = moves;
        this.scene = scene;
        this.players = players

        
    }

    loadMoves(onLoaded){
        let numLoaded = 0;

        this.moves.forEach(move => {
            const loader = new GLTFLoader();
            loader.load(`./models/${move}/${move}.gltf`, gltf => {
                let model = gltf.scene;
                model.traverse( function ( object ) {
		    	    if ( object.isMesh ) object.castShadow = true;
		        } );

                
                Object.values(this.players).forEach(player => {
                    let clonedMoveModel = SkeletonUtils.clone(model).children[0];
                    player.moves = player.moves || {};
                    player.moves[move] = clonedMoveModel;
                    this.scene.add(clonedMoveModel);
                    clonedMoveModel.position.set(10,3,0);
                   
                    // debugger
                    switch(move){
                        case "paper":
                            clonedMoveModel.scale.set(.2,.2,.2);
                             if(player.playerNumber === "player1"){
                                clonedMoveModel.rotation.x = Math.PI / 2;
                                clonedMoveModel.rotation.y = Math.PI;
                                clonedMoveModel.rotation.z = Math.PI / 2;
                            }else{
                                clonedMoveModel.rotation.x = Math.PI / 2;
                                clonedMoveModel.rotation.y = -Math.PI;
                                clonedMoveModel.rotation.z = -Math.PI / 2;
                            }
                            break;
                        case "scissor":
                            clonedMoveModel.scale.set(.015,.015,.015);
                             if(player.playerNumber === "player1"){
                                clonedMoveModel.rotation.x = -Math.PI / 2;
                                clonedMoveModel.rotation.y = Math.PI;
                                clonedMoveModel.rotation.z = Math.PI / 2;
                            }else{
                                clonedMoveModel.rotation.x = -Math.PI / 2;
                                clonedMoveModel.rotation.y = -Math.PI;
                                clonedMoveModel.rotation.z = -Math.PI / 2;
                            }
                            break;
                        case "rock":
                            clonedMoveModel.scale.set(.025,.025,.025);
                             if(player.playerNumber === "player1"){
                                clonedMoveModel.rotation.x = Math.PI;
                                clonedMoveModel.rotation.y = Math.PI / 2;
                                clonedMoveModel.rotation.z = 0;
                            }else{
                                clonedMoveModel.rotation.x = -Math.PI;
                                clonedMoveModel.rotation.y = -Math.PI / 2;
                                clonedMoveModel.rotation.z = 0;
                            }
                            break;
                    }
                })

                numLoaded += 1;
                if(numLoaded === this.moves.length){
                    onLoaded();
                }
            })
        })
    }
    
}