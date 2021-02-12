import * as THREE from 'three';
import CollisionManager from './collision_manager';
import PlayerLoader from './players_loader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const CHARACTERS = [
    "capoeira_girl"
]


export default class FightBrosLite{

    constructor(players, container){
        this.players = players;
        this.container = container;
        this.clock;
        this.camera;
        this.scene;
        this.charactersLoaded = false;
        this.collisionManager;
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.init();
    }

    init(){
        //init clock
        this.clock = new THREE.Clock();
        this.initRenderer();
        this.initCamera();
        this.initScene();

        const playerLoader = new PlayerLoader(CHARACTERS, this.players, this.scene);
        playerLoader.load(() => {
            this.charactersLoaded = true;
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
    	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    	this.container.appendChild( renderer.domElement );
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
	    dirLight.position.set( - 3, 10, - 10 );
	    dirLight.castShadow = true;
	    dirLight.shadow.camera.top = 2;
	    dirLight.shadow.camera.bottom = - 2;
	    dirLight.shadow.camera.left = - 2;
	    dirLight.shadow.camera.right = 2;
	    dirLight.shadow.camera.near = 0.1;
	    dirLight.shadow.camera.far = 40;
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
        requestAnimationFrame(this.animate);
        let delta = this.clock.getDelta();
        if(this.charactersLoaded){
            Object.values(this.players).forEach(player => {
                // player.mixer.update(delta);
                // debugger
                this.collisionManager.updateCollisions();
                player.listener.update(delta);
            })
        }
        this.renderer.render(this.scene, this.camera);
    }

}