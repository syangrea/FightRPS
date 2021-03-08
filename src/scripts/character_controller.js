import { MixOperation } from "three";
import AiInput from "./ai_input";
import PlayerInput from "./player_input";
import * as THREE from 'three';


export default class CharacterController{
    constructor(player, gamePaused){
        this.player = player;
        this.switchActions = this.switchActions.bind(this);
        this.input;
        this.gamePaused = gamePaused;
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
        if(startAction === nextAction) return null;
        nextAction.enabled = true;
        nextAction.setEffectiveTimeScale(1);
        nextAction.setEffectiveWeight(1);
        nextAction.time = 0;
        startAction.crossFadeTo(nextAction, .3, true)
        nextAction.play();
        
        this.nextActionToHappen = null;

        this.player.currentMove = nextAction;

        //only switches to idle if no other action done to me like get hit
        const listenForDone = () => {


            this.player.mixer.addEventListener('loop', idleWhenDone);
            let that = this;
            function idleWhenDone(e){
                if(e.action === nextAction){
                    that.player.mixer.removeEventListener('loop', idleWhenDone)
                    
                    if(!that.nextActionToHappen){
                        if(nextAction._clip.name === "hard_hit"){
                            that.player.attacked = false;
                            that.player.hitAndRoundFinished = true;
                        
                        }else if(nextAction._clip.name === "punch" || nextAction._clip.name === "stab" || nextAction._clip.name === "block_idle" ){

                            that.player.attacksLeft -= 1;

                        
                        }else if(nextAction._clip.name === "death"){
                            that.player.dead = true;
                            nextAction.paused = true;
                        }
                        that.switchActions('idle')

                    }
                }
            }
        }

        //what to do when action starts and what the next action should be by default
        if(nextAction._clip.name === "hard_hit"){
            // this.player.attacked = true;
            this.player.health -= 1;
            listenForDone();

        }else if(nextAction._clip.name === "punch" || nextAction._clip.name === "stab" || nextAction._clip.name === "block_idle" ){
            nextAction.setLoop()
            listenForDone();
        }else if(nextAction._clip.name === "death"){
             listenForDone();
        }
 
    }

    finishStartAction(startAction, nextAction){
        // if(nextAction._clip.name == "hard_hit"){
        //     this.player.attacked = true;
        // }
        
        this.nextActionToHappen = nextAction
        this.player.mixer.addEventListener('loop', finishAction)
        let that = this;
        // debugger
        //what to do when action start

        let finished = false;
        function finishAction(e){
            // let nextActParam = nextAction;
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
                    debugger
                    that.executeAction(startAction,that.nextActionToHappen);
                }

            }
        }
    }

    switchActions(nextActionName){
        if(this.gamePaused) return null;
        let nextAction = this.player.actions[nextActionName].action;
        let startAction = this.player.currentMove;
        if(startAction === nextAction) return null;
        if(nextAction._clip.name == "hard_hit"){
            this.player.attacked = true;
        }
        if((startAction._clip.name === "punch" 
            || startAction._clip.name === "stab" 
            || startAction._clip.name === "block_idle" 
            || startAction._clip.name === "hard_hit" 
            || startAction._clip.name === "death") && nextActionName !== 'idle'){

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