import { MixOperation } from "three";
import AiInput from "./ai_input";
import PlayerInput from "./player_input";


export default class CharacterController{
    constructor(player){
        this.player = player;
        this.switchActions = this.switchActions.bind(this);
        this.input;
        if(this.player.playerNumber === "player1"){
            this.input = new PlayerInput(this.switchActions);
        }else{
            this.input = new AiInput(this.switchActions);
        }
    }

    initSetIdle(){
        // debugger
        let idleAction = this.player.actions['idle'].action;
        idleAction.enabled = true;
        idleAction.setEffectiveTimeScale(1);
        idleAction.setEffectiveWeight(1);
        idleAction.time = 0;
        idleAction.play();
        this.player.currentMove = idleAction;
    }



    switchActions(nextActionName){
        let nextAction = this.player.actions[nextActionName].action;
        let startAction = this.player.currentMove;
        if(startAction === nextAction) return null;
        if (nextActionName === "hard_hit" ){
            this.player.attacked = true;
            this.player.health -= 1;
            if(this.player.health <= 0) {
                this.switchActions("death");
                return;
            }
         
        }
        nextAction.enabled = true;
    	nextAction.setEffectiveTimeScale(1);
        
    	nextAction.setEffectiveWeight(1);
    	nextAction.time = 0;
    	startAction.crossFadeTo(nextAction, .3, true)
		nextAction.play();
    	this.player.currentMove = nextAction;
        let that = this;
        if (nextActionName === "punch" || nextActionName === "stab" || nextActionName === "block_idle" ){
            this.player.mixer.addEventListener('loop', finishedAttackAnimation);
        }
        function finishedAttackAnimation(e){
            if(e.action === nextAction){
                that.player.mixer.removeEventListener('loop', finishedAttackAnimation);
                that.player.attacksLeft -= 1;
            }
        }

        if (nextActionName === "death" ){
            this.player.mixer.addEventListener('loop', finishedDeathAnimation);
        }
        function finishedDeathAnimation(e){
            if(e.action === nextAction){
                that.player.mixer.removeEventListener('loop', finishedDeathAnimation);
                that.player.dead = true;
                nextAction.paused = true;
            }
        }

        if (nextActionName === "soft_hit" || nextActionName === "hard_hit" ){
            this.player.mixer.addEventListener('loop', finishedHitAnimation);
        }
        
        function finishedHitAnimation(e){
            if(e.action === nextAction){
                that.player.mixer.removeEventListener('loop', finishedHitAnimation);
                that.player.attacked = false;
                that.switchActions("idle");
            }
        }
        
    }

    
}