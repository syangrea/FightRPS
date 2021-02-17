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
        
        let idleAction = this.player.actions['idle'].action;
        idleAction.enabled = true;
        idleAction.setEffectiveTimeScale(1);
        idleAction.setEffectiveWeight(1);
        idleAction.time = 0;
        idleAction.play();
        this.player.currentMove = idleAction;
    }

    executeAction(startAction,nextAction){
        
        nextAction.enabled = true;
        nextAction.setEffectiveTimeScale(1);
        nextAction.setEffectiveWeight(1);
        nextAction.time = 0;
        startAction.crossFadeTo(nextAction, .3, true)
        nextAction.play();
        
        this.player.currentMove = nextAction;

        //what to do when action starts and what the next action should be by default
        if(nextAction._clip.name === "hard_hit"){
            this.player.attacked = true;
            this.player.health -= 1;
            this.switchActions('idle');

        }else if(nextAction._clip.name === "punch" || nextAction._clip.name === "stab" || nextAction._clip.name === "block_idle" ){
            
            this.switchActions('idle');
        }else if(nextAction._clip.name === "death"){
             this.switchActions('idle');
        }
        
    }

    finishStartAction(startAction,nextAction){
        if(nextAction._clip.name == "hard_hit"){
            this.player.attacked = true;
        }
        this.player.mixer.addEventListener('loop', finishAction)
        let that = this;
        // 
        //what to do when action start
        let finished = false;
        function finishAction(e){
            
            if(e.action === startAction){
                
                that.player.mixer.removeEventListener('loop',finishAction);
                if(!finished){

                    finished = true;
                    if(startAction._clip.name === "hard_hit"){
                        that.player.attacked = false;
                        that.player.hitAndRoundFinished = true;
    
                    }else if(startAction._clip.name === "punch" || startAction._clip.name === "stab" || startAction._clip.name === "block_idle" ){
                        
                        that.player.attacksLeft -= 1;
                        
    
                    }else if(startAction._clip.name === "death"){
                        that.player.dead = true;
                        startAction.paused = true;
                    }
                    
                    that.executeAction(startAction,nextAction);
                }

            }
        }
    }

    switchActions(nextActionName){
        let nextAction = this.player.actions[nextActionName].action;
        let startAction = this.player.currentMove;
        if(startAction === nextAction) return null;
        
        if(startAction._clip.name === "punch" 
            || startAction._clip.name === "stab" 
            || startAction._clip.name === "block_idle" 
            || startAction._clip.name === "hard_hit" 
            || startAction._clip.name === "death"){

                //don't allow walk in either direction because when walk is held and attack happens there are errors
                if(nextActionName === "idle" ||
                    nextActionName === "hard_hit" ||
                    nextActionName === "death") {
                        this.finishStartAction(startAction, nextAction);
                    }
        }else{
            this.executeAction(startAction, nextAction);
        }
        
    }

    

    
}