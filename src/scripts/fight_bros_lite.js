import * as THREE from 'three';
import CollisionManager from './collision_manager';
import MoveLoader from './move_loader';
import PlayerLoader from './players_loader';



const CHARACTERS = [
    "capoeira_girl"
]

const MOVES = [
    "rock", "paper", "scissor"
]


export default class FightBrosLite{

    constructor(players, container){
        this.players = players;
        this.container = container;
        this.currentScreen;
        this.clock;
        this.camera;
        this.scene;
        this.charactersLoaded = false;
        this.collisionManager;
        this.movesLoaded = false;
        this.loadedMoves;
        this.winner = null;
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.createStartScreen();
    }

    initGame(){
        this.container.removeChild(this.currentScreen);
        let gameCanvas = document.createElement("div");
        gameCanvas.setAttribute("id", "game-canvas")
        this.container.appendChild(gameCanvas);
        this.currentScreen = gameCanvas;
        //init clock
        this.clock = new THREE.Clock();
        this.initRenderer();
        this.initCamera();
        this.initScene();

        const playerLoader = new PlayerLoader(CHARACTERS, this.players, this.scene);
        playerLoader.load(() => {
            this.charactersLoaded = true;
        })

        const moveLoader = new MoveLoader(MOVES, this.scene, this.players);
        moveLoader.loadMoves(() => {
            this.movesLoaded = true;
        })

        this.collisionManager = new CollisionManager(this.players);
        window.addEventListener( 'resize', this.onWindowResize );
        this.animate();
    }

    initRenderer(){
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        let renderer = this.renderer;
       	renderer.setPixelRatio( window.devicePixelRatio );
    	renderer.setSize( window.innerWidth, window.innerHeight );
    	renderer.outputEncoding = THREE.sRGBEncoding;
    	renderer.shadowMap.enabled = true;

    	this.currentScreen.appendChild( renderer.domElement );
    }

    initCamera(){
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	    this.camera.position.set( 0, 1, 5);
    }

    initScene(){
        this.scene = new THREE.Scene();
        let scene = this.scene;
        scene.background = new THREE.Color( 0x1167b1 );

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	    hemiLight.position.set( 0, 20, 0 );
	    this.scene.add( hemiLight );

	    const dirLight = new THREE.DirectionalLight( 0xffffff );
	    dirLight.position.set( - 5, 10, - 5 );
	    dirLight.castShadow = true;

	    this.scene.add( dirLight );

        let stageLoader = new THREE.TextureLoader();
        const groundTexture = stageLoader.load('./images/grass.jpg');
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25,25);
        groundTexture.anisotropy = 16;
        groundTexture.encoding = THREE.sRGBEncoding;

        const groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
        
	    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100,100,10,10 ), groundMaterial );
	    mesh.rotation.x = - Math.PI / 2;
	    mesh.receiveShadow = true;
	    mesh.updateMatrixWorld(true);
	    this.scene.add( mesh );
    }

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate(){
        let reqId = requestAnimationFrame(this.animate);
        let delta = this.clock.getDelta();
        if(this.charactersLoaded && this.movesLoaded){
            Object.values(this.players).forEach(player => {
                // player.mixer.update(delta);
                // debugger
                if(player.dead){
                    this.winner = (player.playerNumber === "player1") ? "player2" : "player1";
                    window.cancelAnimationFrame(reqId);
                    this.gameOver();
                }
                this.collisionManager.updateCollisions();
                player.listener.update(delta);
            })
        }
        this.renderer.render(this.scene, this.camera);
    }

    createStartScreen(){
        if(this.currentScreen){
            this.charactersLoaded = false;
            this.movesLoaded = false;
            this.winner = null;
            this.container.removeChild(this.currentScreen);
        }
        let startScreen = document.createElement('div');
        startScreen.setAttribute('id', 'start-screen');
        this.container.appendChild(startScreen);
        let startHeader = document.createElement('h1');
        startHeader.innerText = 'Welcome to 3D Rock Papers Scissors';
        startScreen.appendChild(startHeader);
        let startButton = document.createElement('button');
        startButton.innerText = "Play";
        startScreen.appendChild(startButton);
        this.currentScreen = startScreen;
        startButton.addEventListener("click", (e) => {
            
            this.initGame();
        })  
    }

    gameOver(){
        this.container.removeChild(this.currentScreen);
        let gameOverScreen = document.createElement('div');
        gameOverScreen.setAttribute("id", "game-over-screen");
        this.container.appendChild(gameOverScreen);
        this.currentScreen = gameOverScreen;
        let gameOverHeader = document.createElement('h1');
        gameOverHeader.innerText = `${this.winner} has won!`
        gameOverScreen.appendChild(gameOverHeader);
        let restartButton = document.createElement('button');
        restartButton.innerText = "Play Again";
        gameOverScreen.appendChild(restartButton);
        restartButton.addEventListener('click', e => {
            this.createStartScreen();
        })
    }
}