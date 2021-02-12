import * as THREE from 'three';
import PlayersLoader from './players_loader';
import ThirdPersonCamera from './third_person_camera';
// import * as CANNON from 'cannon-es';
import CollisionListener from './collision_listener';


const CHARACTERS = [
    "capoeira_girl"
]

export default class FightBrosLite{

    constructor(players, container){
        this.players = players;
        this.container = container;
        this.renderer;
        this.camera;
        this.scene;
        this.clock;
        this.playerLoader;
        this.thirdPersonCamera;
        this.onWindowResize = this.onWindowResize.bind(this);
        this.animate = this.animate.bind(this);
        this.init();
    }

    init(){
        let container = this.container;
        

        this.clock = new THREE.Clock();
        this.initRenderer();
        this.initCamera();
        this.initScene();
        //async because uses loader for gtlf
        
        let playerLoader = new PlayersLoader(CHARACTERS, this.players, this.scene);
        playerLoader.loadAllPlayers();
        this.playerLoader = playerLoader;
        this.thirdPersonCamera = new ThirdPersonCamera(this.camera, playerLoader.players['player1'])
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener( 'resize', this.onWindowResize );
        this.manager = new THREE.LoadingManager();
        this.collisionListener = new CollisionListener(this.players);
        this.animate();

    }



    initScene(){
        this.scene = new THREE.Scene();
        let scene = this.scene;
        
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

        //background might want to switch to a sky box - box with images on each side to create a world
        
        this.scene.background = new THREE.Color( 0xa0a0a0 );

	    // ground
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
        // this.initCannon(mesh);
    }

    // initCannon(groundMesh){
    //     this.world = new CANNON.World();
    //     this.world.gravity.set(0.-9.81,0);
    //     const groundShape = new CANNON.Plane();
    //     const groundCannonBody = new CANNON.Body({mass: 0});
    //     groundCannonBody.addShape(groundShape);
    //     //cannon doesn't have rotation, else just aligns with the scene mesh on line 84
    //     groundCannonBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0) - Math.PI / 2)
    //     this.world.addBody(groundCannonBody);
    // }

    initCamera(){
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	    // this.camera.position.set( 25,10,25);
        
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

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate(){
        
        requestAnimationFrame( () => {
            let updateDelta = this.clock.getDelta();
            this.animate();
            // this.updater();
            // this.world.step(updateDelta);
            this.renderer.render( this.scene, this.camera );
            this.updater(updateDelta);
        });

    }

    updater(updateDelta){
        
            if(this.players['player1'].model){
                
              
                
                Object.values(this.players).forEach(player => {
                  
                    // if(player.mixer) player.mixer.update(mixerUpdateDelta);
                    //called in player listener
                    if(player.model) this.collisionListener.collisionUpdate();
                    if(player.playerListener) player.playerListener.update(updateDelta);
                })
                this.thirdPersonCamera.update(updateDelta);
            }
            
        
    }
}