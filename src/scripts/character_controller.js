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
        nextAction.enabled = true;
    	nextAction.setEffectiveTimeScale(1);
    	nextAction.setEffectiveWeight(1);
    	nextAction.time = 0;
    	startAction.crossFadeTo(nextAction, .3, true)
		nextAction.play();
    	this.player.currentMove = nextAction;

    }
}