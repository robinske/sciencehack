LEAP = {
	init: function(){
		Leap.loop(function(data) {
			LEAP.filterData(data);
		});		
	},
	filterData: function(data){
		if( data.valid ){		
			if(typeof data.hands[0] !== "undefined" ){
				
				var hand = data.hands[0];
				var hand2 = data.hands[1];

//				console.log(hand);
				DEMO.sphereRadius = DEMO.Functions.setToRange( hand.sphereRadius, [50,180], [10,400] );
				
				// DEMO.spherePosX = DEMO.Functions.setToRange( hand.palmPosition[0], [-200,200], [-700,700], DEMO.spherePosX );
				// DEMO.spherePosY = DEMO.Functions.setToRange( hand.palmPosition[1], [50,300], [-600,300], DEMO.spherePosY );
				// DEMO.spherePosZ = DEMO.Functions.setToRange( hand.palmPosition[2], [-50,300], [-250,200], DEMO.spherePosZ );
				
				DEMO.sphereRotX = DEMO.Functions.setToRange( hand.rotation[0][1], [-1,1], [1,-1], DEMO.sphereRotX );
				DEMO.sphereRotY = DEMO.Functions.setToRange( hand.rotation[1][2], [-1,1], [2.5,-2.5], DEMO.sphereRotY );
				DEMO.sphereRotZ = DEMO.Functions.setToRange( hand.rotation[0][2], [-1,1], [-2,2], DEMO.sphereRotZ );
				
				DEMO.update();
			}
		}
	}
};

DEMO = {
	renderer: null,
	camera: null,
	scene: null,
	sphereRadius: 150,
	
	windowWidth: 600,
	windowHeight: 400,
	windowDepth: 600,
	
	spherePosX: 0,
	spherePosY: 0,
	spherePosZ: 0,
	
	sphereRotX: 0,
	sphereRotY: 0,
	sphereRotZ: 0,
	
	rotationMatrix: new THREE.Matrix4(),


	
	init: function(){
		DEMO.setupScene();
		DEMO.addLight();
		DEMO.createSphere();
		LEAP.init();
	},
	update: function(){
		DEMO.createSphere();
	},
	setupScene: function(){

		DEMO.windowWidth	=	$(window).width(),
		DEMO.windowHeight	=	$(window).height(),
		DEMO.windowDepth	=	500;

		var viewingAngle =	60,
			aspect =		DEMO.windowWidth / DEMO.windowHeight,
			near =			0.1,
			far =			10000;

		var $container = $('#main-container');
		$container.css({
			'width': DEMO.windowWidth+'px',
			'height': DEMO.windowHeight+'px'
		});

		DEMO.renderer =	new THREE.WebGLRenderer();
		DEMO.camera =	new THREE.PerspectiveCamera(
			viewingAngle,
			aspect,
			near,
			far
		);
			
		DEMO.scene = new THREE.Scene();
		
		DEMO.scene.add(DEMO.camera);
		DEMO.camera.position.z = 500;

		// cameraControls = new THREE.LeapCameraControls(DEMO.camera);

		// cameraControls.panHands = 2;
		// cameraControls.rotateEnabled = false;

		
		DEMO.renderer.setSize(DEMO.windowWidth, DEMO.windowHeight);
		
		$container.append(DEMO.renderer.domElement);
	},
	createSphere: function(){
		
		var radius = DEMO.sphereRadius,
			segments = 10,
			rings = 10;
	
		var sphereMaterial = new THREE.MeshPhongMaterial({
			specular: 0xffffff,
			ambient: 0x00619e,
			color: 0x0084d6,
			wireframe: true
		});
			
		var mesh = new THREE.Mesh(
			new THREE.SphereGeometry(
				radius,
				segments,
				rings
			),
			sphereMaterial
		);
			
		DEMO.scene.add(mesh);	
				
		mesh.position.set( DEMO.spherePosX, DEMO.spherePosY, DEMO.spherePosZ );		
		mesh.rotation.set(DEMO.sphereRotY, DEMO.sphereRotZ, DEMO.sphereRotX);		
		mesh.matrix.setRotationFromEuler(mesh.rotation);
		
		DEMO.renderScene();		
		DEMO.scene.remove(mesh);
	},
	addLight: function(){
		var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.x = 200;
		pointLight.position.y = 500;
		pointLight.position.z = 1000;		
		DEMO.scene.add(pointLight);
	},
	renderScene: function(){
		DEMO.renderer.render(DEMO.scene, DEMO.camera);
		DEMO.updateLog();
	},
	updateLog: function(){
		$('#posX').html( DEMO.spherePosX.toFixed(2) );
		$('#posY').html( DEMO.spherePosY.toFixed(2) );
		$('#posZ').html( DEMO.spherePosZ.toFixed(2) );
		
		$('#rotX').html( DEMO.sphereRotX.toFixed(2) );
		$('#rotY').html( DEMO.sphereRotY.toFixed(2) );
		$('#rotZ').html( DEMO.sphereRotZ.toFixed(2) );
		
		$('#radius').html( DEMO.sphereRadius.toFixed(2) );
	},
	Functions: {
		setToRange: function(value, srcRange, dstRange, fallback){
			fallback = fallback || NaN;
			if (value < srcRange[0] || value > srcRange[1]){
				return fallback; 
			}
			var srcMax = srcRange[1] - srcRange[0],
			dstMax = dstRange[1] - dstRange[0],
			adjValue = value - srcRange[0];
			return (adjValue * dstMax / srcMax) + dstRange[0];
		}
	}
};

//---[ HERE WE GO... ]--------------------------------------------------------//
$(document).ready( DEMO.init );
//----------------------------------------------------------------------------//