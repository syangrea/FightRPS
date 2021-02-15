import FightBrosLite from "./scripts/fight_bros_lite";
import "./styles/index.scss";

//player units
const PLAYERS = {

	player1: {
		modelName: "capoeira_girl",
		playerNumber: "player1"
		
	}, 
	
	player2: {
		modelName: "capoeira_girl",
		playerNumber: "player2"

	}
}

window.addEventListener("DOMContentLoaded", () => {
	let container = document.createElement( 'div' );
    container.setAttribute("id", "root");
    document.body.appendChild(container);
	new FightBrosLite(PLAYERS, container);
})
