

export default class PlayerInput{
    constructor(switchActions){
        this.switchActions = switchActions;
        this.addKeyListeners();
    }

    addKeyListeners(){
        
    	document.addEventListener('keydown', e => {
    		switch(e.code){
    			case "ArrowRight":
    				this.switchActions('walk');
    				break;
    			case "ArrowLeft":
    				this.switchActions('walk_backwards.001');
    				break;
    			case "Digit4":
    				this.switchActions('dance');
    				break;
    			case "Digit5":
    				this.switchActions('taunt');
    				break;
				case "Digit1":
    				this.switchActions('stab' );
    				break;
    			case "Digit2":
    				this.switchActions('punch' );
    				break;
				case "Digit3":
    				this.switchActions('block_idle');
    				break;
    		}
    	})

    
    	document.addEventListener('keyup', e => {
    		switch(e.code){
    			case "ArrowRight":
    				this.switchActions('idle' )				
    				break;
    			case "ArrowLeft":
    				this.switchActions('idle' )				
    				break;			
    			case "Digit4":
    				this.switchActions('idle' )				
    				break;
    			case "Digit5":
    				this.switchActions('idle' )				
    				break;
				case "Digit1":
    				this.switchActions('idle' );
    				break;
    			case "Digit2":
    				this.switchActions('idle' );
    				break;
				case "Digit3":
    				this.switchActions('idle');
    				break;
    		}
        
    	})

    }
}