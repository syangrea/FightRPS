import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from 'three/examples/jsm/utils/SkeletonUtils';
import CharacterController from './character_controller';
import MoveListener from './move_listener';
import PlayerListener from './player_listener';



export default class PlayerLoader{

    constructor(characterNames, players, scene){
        this.characterNames = characterNames;
        this.players = players;
        this.scene = scene;
        //key: characterName, value: {characterName, model, animations}
        this.loadedCharacters = {};
        this.loadPlayers = this.loadPlayers.bind(this);
    }

    load(onAllPlayersLoaded){
        //callbacks to load player once character models are loaded and onloaded callback once both are loaded
        this.loadCharacters(onAllPlayersLoaded);

    }

    loadCharacters(onAllPlayersLoaded){
        let numLoadedCharacters = 0;
        this.characterNames.forEach(characterName => {
		//async so needs callback
		
		    this.loadCharacter(characterName, () => {
			    numLoadedCharacters += 1;
			    if(numLoadedCharacters === this.characterNames.length){
					
				    this.loadPlayers(onAllPlayersLoaded);
			    }
		    })
	    })
    }

    loadCharacter(characterName, onCharacterLoaded){
        const loader = new GLTFLoader();
	    loader.load(`./models/${characterName}.glb`, gltf => {

		    const model = gltf.scene;
		    const animations = gltf.animations;
            this.loadedCharacters[characterName] = {characterName, model, animations}
            // debugger
		
		    model.traverse( function ( object ) {
		    	if ( object.isMesh ) object.castShadow = true;
		    } );
		
		    onCharacterLoaded();
	    })
    }

    loadPlayers(onAllPlayersLoaded){
        let numPlayersLoaded = 0;
        Object.values(this.players).forEach(player => {
    		this.loadPlayer(player, () => {
                numPlayersLoaded += 1;
			    if(numPlayersLoaded === Object.values(this.players).length){
					
				    onAllPlayersLoaded();
			    }
            });
			
    	})

    }

    loadPlayer(player, onLoaded){
        const characterModel = this.loadedCharacters[player.modelName];
        // debugger
        const clonedCharacterModel = SkeletonUtils.clone(characterModel.model);
        const {mixer, actions} = this.initMixerAndActions(clonedCharacterModel, characterModel.animations);

        player.character = clonedCharacterModel;
        player.mixer = mixer;
        player.actions = actions;
        player.currentMove = null;

        this.scene.add(player.character);
        
        if(player.playerNumber === "player1"){
            player.initialPosition = [-2.5,0,0];
            player.character.position.set(-2.5,0,0);
            player.character.rotation.x = 0;
            player.character.rotation.y = Math.PI / 2;
            player.character.rotation.z = 0;
            
        }else{
            player.initialPosition = [2.5,0,0];
            player.character.position.set(2.5,0,0);
             player.character.rotation.x = 0;
            player.character.rotation.y = -Math.PI / 2;
            player.character.rotation.z = 0;
        }

        player.controller = new CharacterController(player);
        player.controller.initSetIdle();
        player.listener = new PlayerListener(player);
        player.moveListener = new MoveListener(player);
        player.currentRPSMove = null;
        player.attacked = false;
        player.dead = false;
        player.health = 3;
        player.attacksLeft = 3;
        player.hitAndRoundFinished = false;

        onLoaded();

    }

    initMixerAndActions(character, animations){
        const mixer = new THREE.AnimationMixer(character);
        let actions = {};
        // debugger
        animations.forEach(animation => {
            let action = mixer.clipAction(animation);
            actions[animation.name] = {name: animation.name, action};
        })
        // debugger
        return {mixer, actions};
    }

}