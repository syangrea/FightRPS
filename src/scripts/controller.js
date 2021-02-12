import * as THREE from 'three';
import AiInput from './ai_input';
import PlayerInput from './player_input';

// animation names: 
// attack1.001, attack2, 
// block_idle, block_impact, block_start,
// dance, death, hard_hit, soft_hit, idle, taunt,
// walk_backwards, walking


export default class Controller{
    constructor(mixer, player){
        this.mixer = mixer;
		this.player = player
		this.input;
		this.switchActions = this.switchActions.bind(this);
		if(this.player.playerNumber === "player1"){
			this.input = new PlayerInput(this.switchActions);
		}else{
			this.input = new AiInput(this.switchActions);
		}
    }

	initSetIdle(){
	
		let idleAction = this.player.actions['idle'].action;
		idleAction.enabled = true;
		idleAction.setEffectiveTimeScale(1);
    	idleAction.setEffectiveWeight(1);
    	idleAction.time = 0;
		idleAction.play();
		this.player.currentMove = idleAction;
		
	}

    executeCrossFade(startAction, nextAction){
    
    	nextAction.enabled = true;
    	nextAction.setEffectiveTimeScale(1);
    	nextAction.setEffectiveWeight(1);
    	nextAction.time = 0;
    	startAction.crossFadeTo(nextAction, .2, true)
		nextAction.play();
    	this.player.currentMove = nextAction;
		startAction.stop();
        
    }

    syncCrossFade(startAction, nextAction){
    	this.mixer.addEventListener('finished', finishedAction);
		
		// nextAction.setLoop(THREE.LoopOnce, 1);
		
    	const finishedAction = (e) => {
    		//finished action
		
    		if(e.action === startAction){
    			this.mixer.removeEventListener('finished', finishedAction);
    			this.executeCrossFade(startAction, nextAction);
    		}
    	}
    
    }

	switchActions(nextActionName){
	
		let startAction = this.player.currentMove;
		let nextAction = this.player.actions[nextActionName].action;
		if(startAction._clip.name === nextActionName) return null;
		switch(startAction._clip.name){
			// case "attack1.001":
			// 	this.syncCrossFade(startAction, nextAction);
			// 	break;
			// case "attack2.001":
			// 	this.syncCrossFade(startAction, nextAction);
			// 	break;
			default:
				this.executeCrossFade(startAction, nextAction);
				break;

		}

	}

    

}