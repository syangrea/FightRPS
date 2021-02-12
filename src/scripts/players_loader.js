import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import {SkeletonUtils} from 'three/examples/jsm/utils/SkeletonUtils';
import Controller from './controller';
import PlayerListener from './player_listener';
import * as CANNON from 'cannon-es';
import ThirdPersonCamera from './third_person_camera';

export default class PlayersLoader{

    constructor(characterNames, players, scene){
        this.characterNames = characterNames;
        //loadedCharacters each is {characterName, model, animations}, keys are characterName
        this.loadedCharacters = {};
        this.numLoadedCharacters = 0;
        //players each comes in as {modelName, playerNumber, position(maybe)} 
        //  becomes {modelName, playerNumber, mixer, velocity, direction
		// playerListener, controller(for player1), model, actions}. Keys are playerNumber
        this.players = players;
		this.scene = scene;
        
    }

    loadAllPlayers(){
        this.loadCharacters();
		
    }

    //for when others join while you are already in. otherwise, 
    addPlayer(player){

    }

    loadCharacters(){
	    
	    this.characterNames.forEach(characterName => {
		//async so needs callback
		
		    this.loadCharacter(characterName, () => {
			    this.numLoadedCharacters += 1;
			    if(this.numLoadedCharacters === this.characterNames.length){
					
				    this.createPlayers();
			    }
		    })
	    })
    }

    loadCharacter(characterName, onLoaded){
		
	    const loader = new GLTFLoader();
	    loader.load(`./models/${characterName}.glb`, gltf => {
			debugger
		    const model = gltf.scene;
		    const animations = gltf.animations;
            this.loadedCharacters[characterName] = {characterName, model, animations}
		
		    model.traverse( function ( object ) {
		    	if ( object.isMesh ) object.castShadow = true;
		    } );
		
		    onLoaded();
	    })
		
    }

    createPlayers(){
		
    	Object.values(this.players).forEach(player => {
    		this.createPlayer(player);
			// this.createCannonBody(player);
    	})
		
    }

    createPlayer(player){
        const character = this.loadedCharacters[player.modelName];
		
   		const clonedModel = SkeletonUtils.clone(character.model);
		// let skeleton = new THREE.SkeletonHelper( clonedModel );
		// skeleton.visible = true;
		// this.scene.add( skeleton );
		// const clonedModel = clonedScene.getObjectByName("Armature");
		// const mesh = new THREE.Group();
		// clonedModel.children[2].children.forEach(skinnedMesh => {
		// 	if(skinnedMesh.type === "SkinnedMesh"){
		// 		mesh.push(skinnedMesh);
		// 	}
		// })

   		const {mixer, actions} = this.initMixerAndActions(clonedModel, character.animations);
   		
   		player.mixer = mixer;
   		player.actions = actions;
        player.model = clonedModel;
		// player.mesh = mesh
       	
   		this.scene.add(clonedModel);
		debugger
   		if(player.playerNumber === "player1"){
			
            clonedModel.position.set(0,0,0);
            
        }else{
            clonedModel.position.set(20,0,0);
        }
		player.controller = new Controller(mixer, player);
        player.controller.initSetIdle();
        player.playerListener = new PlayerListener(player);
   		player.velocity = new THREE.Vector3(0,0,0);
		player.health = 100;
		let bodyPartMeshes = player.model.children[2].children;
		for(let i = 0; i < bodyPartMeshes.length; i++){
			let partMesh = bodyPartMeshes[i];
			if(partMesh.type === "SkinnedMesh"){
				let boxHelp = new THREE.Box3Helper(partMesh.geometry.boundingBox, 0xffff00)
				this.scene.add(boxHelp);
			}
		}
		let boxHelp = new THREE.Box3Helper(player.model)
		debugger
        
        
    }

	// createCannonBody(player){
	// 	let body = {};
	// 	let playerMeshGeometry = player.model.geometry;
	// 	debugger
	// 	let vertices = playerMeshGeometry.attributes.position.array
	// 	let playerShape;
	// 	let playerBody = new CANNON.Body({mass: 1});
	// 	playerBody.addShape(playerShape);
	// 	playerBody.position.x = monkeyMesh.position.x;
	// 	playerBody.position.y = monkeyMesh.position.y;
	// 	playerBody.position.z = monkeyMesh.position.z;

	// }

    initMixerAndActions(clonedModel, animations){
    	const mixer = new THREE.AnimationMixer(clonedModel);
    	let actions = {}
    	animations.forEach(animation => {
			
    		let action = mixer.clipAction(animation);
		
    		actions[animation.name] = {animation, action};
    		
    	})
    	return {mixer, actions};

    }


}