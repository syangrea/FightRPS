

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
    			case "Space":
    				this.switchActions('block_idle');
    				break;
    			case "Digit3":
    				this.switchActions('dance');
    				break;
    			case "Digit4":
    				this.switchActions('taunt');
    				break;
				case "Digit1":
    				this.switchActions('attack1.001' );
    				break;
    			case "Digit2":
    				this.switchActions('attack2.001' );
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
    			case "Space":
    				this.switchActions('idle' )				
    				break;
    			case "Digit3":
    				this.switchActions('idle' )				
    				break;
    			case "Digit4":
    				this.switchActions('idle' )				
    				break;
				case "Digit1":
					this.switchActions('idle' )				
    				break;
    			case "Digit2":
    				this.switchActions('idle' )				
    				break;
    		}
        
    	})

    }
}