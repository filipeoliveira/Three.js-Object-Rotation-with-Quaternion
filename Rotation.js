/*
#TODO

1. Fazer seleção dos poligonos via divs.
- Limpar os poligonos existentes na cena
- Carregar o poligono adequado.
- Adicionar funcionalidade do RESET para carregar o poligono atual novamente.

2. Adicionar cor ao poligono tetrahedron.

3. Ao apertar right-click fixar a face no meio.

4.Realizar uma busca em profundidade para determinar o núero dos vértices a serem abertos.
- Abrir o poligono cubo (inicialmente);  (??)

*/

// Namespace
var Defmech = Defmech ||
{};

Defmech.RotationWithQuaternion = (function()
{
	'use_strict';

	var container;

	var camera, scene, renderer;

	// var selectedPolygon = 'cube';
	var selectedPolygon = 'tetrahedron';

	var mouseDown = false;
	var rotateStartPoint = new THREE.Vector3(0, 0, 1);
	var rotateEndPoint = new THREE.Vector3(0, 0, 1);

	var curQuaternion;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var rotationSpeed = 2;
	var lastMoveTimestamp,
		moveReleaseTimeDelta = 50;

	var startPoint = {
		x: 0,
		y: 0
	};

	var deltaX = 0,
		deltaY = 0;

	var setup = function()
	{
		container = document.createElement('div');
		document.body.appendChild(container);

		var info = document.createElement('div');
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = 'Drag to spin the cube';
		container.appendChild(info);

		var reset = document.createElement('div');
		reset.style.position = 'absolute';
		reset.style.top = '10px';
		reset.style.right = '20px';
		reset.style.width = '8em';
		reset.style.textAlign = 'center';
		reset.innerHTML = 'RESET';
		reset.style.backgroundColor = 'lightcoral';
		reset.style.cursor = 'pointer';
		reset.style.color = 'white';
		reset.style.padding = '1em';
		container.appendChild(reset);

		var tetrahedron_btn = document.createElement('div');
		tetrahedron_btn.style.position = 'absolute';
		tetrahedron_btn.style.top = '70px';
		tetrahedron_btn.style.right = '20px';
		tetrahedron_btn.style.width = '8em';
		tetrahedron_btn.style.textAlign = 'center';
		tetrahedron_btn.innerHTML = 'TETRAHEDRON';
		tetrahedron_btn.style.backgroundColor = 'lightgreen';
		tetrahedron_btn.style.cursor = 'pointer';
		tetrahedron_btn.style.color = 'white';
		tetrahedron_btn.style.padding = '1em';
		container.appendChild(tetrahedron_btn);

		document.get

		var octahedron_btn = document.createElement('div');
		octahedron_btn.style.position = 'absolute';
		octahedron_btn.style.top = '130px';
		octahedron_btn.style.right = '20px';
		octahedron_btn.style.width = '8em';
		octahedron_btn.style.textAlign = 'center';
		octahedron_btn.innerHTML = 'OCTAHEDRON';
		octahedron_btn.style.backgroundColor = 'lightgreen';
		octahedron_btn.style.cursor = 'pointer';
		octahedron_btn.style.color = 'white';
		octahedron_btn.style.padding = '1em';
		container.appendChild(octahedron_btn);

		var hexahedron_btn = document.createElement('div');
		hexahedron_btn.style.position = 'absolute';
		hexahedron_btn.style.top = '190px';
		hexahedron_btn.style.right = '20px';
		hexahedron_btn.style.width = '8em';
		hexahedron_btn.style.textAlign = 'center';
		hexahedron_btn.innerHTML = 'HEXAHEDRON';
		hexahedron_btn.style.backgroundColor = 'lightgreen';
		hexahedron_btn.style.cursor = 'pointer';
		hexahedron_btn.style.color = 'white';
		hexahedron_btn.style.padding = '1em';
		container.appendChild(hexahedron_btn);

		var icosahedron_btn = document.createElement('div');
		icosahedron_btn.style.position = 'absolute';
		icosahedron_btn.style.top = '250px';
		icosahedron_btn.style.right = '20px';
		icosahedron_btn.style.width = '8em';
		icosahedron_btn.style.textAlign = 'center';
		icosahedron_btn.innerHTML = 'ICOSAHEDRON';
		icosahedron_btn.style.backgroundColor = 'lightgreen';
		icosahedron_btn.style.cursor = 'pointer';
		icosahedron_btn.style.color = 'white';
		icosahedron_btn.style.padding = '1em';
		container.appendChild(icosahedron_btn);

		var dodecahedron_btn = document.createElement('div');
		dodecahedron_btn.style.position = 'absolute';
		dodecahedron_btn.style.top = '310px';
		dodecahedron_btn.style.right = '20px';
		dodecahedron_btn.style.width = '8em';
		dodecahedron_btn.style.textAlign = 'center';
		dodecahedron_btn.innerHTML = 'DODECAHEDRON';
		dodecahedron_btn.style.backgroundColor = 'lightgreen';
		dodecahedron_btn.style.cursor = 'pointer';
		dodecahedron_btn.style.color = 'white';
		dodecahedron_btn.style.padding = '1em';
		container.appendChild(dodecahedron_btn);


		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.y = 150;
		camera.position.z = 500;

		window.scene = new THREE.Scene();

		console.log(selectedPolygon);

		if(selectedPolygon == "cube"){
			console.log('1');
			loadCube();
		}
		if(selectedPolygon == "tetrahedron"){
			console.log('2');
			loadTetrahedron();
		}
		// -------------------------------------------------------------------------


		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0xf0f0f0);
		renderer.setSize(window.innerWidth, window.innerHeight);

		container.appendChild(renderer.domElement);

		document.addEventListener('mousedown', onDocumentMouseDown, false);

		window.addEventListener('resize', onWindowResize, false);

		animate();
	}

	function onWindowResize()
	{
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function onDocumentMouseDown(event)
	{
		event.preventDefault();

		document.addEventListener('mousemove', onDocumentMouseMove, false);
		document.addEventListener('mouseup', onDocumentMouseUp, false);

		mouseDown = true;

		startPoint = {
			x: event.clientX,
			y: event.clientY
		};

		rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
	}

	function onDocumentMouseMove(event)
	{
		deltaX = event.x - startPoint.x;
		deltaY = event.y - startPoint.y;

		handleRotation();

		startPoint.x = event.x;
		startPoint.y = event.y;

		lastMoveTimestamp = new Date();
	}

	function onDocumentMouseUp(event)
	{
		if (new Date().getTime() - lastMoveTimestamp.getTime() > moveReleaseTimeDelta)
		{
			deltaX = event.x - startPoint.x;
			deltaY = event.y - startPoint.y;
		}

		mouseDown = false;

		document.removeEventListener('mousemove', onDocumentMouseMove, false);
		document.removeEventListener('mouseup', onDocumentMouseUp, false);
	}

	function projectOnTrackball(touchX, touchY)
	{
		var mouseOnBall = new THREE.Vector3();

		mouseOnBall.set(
			clamp(touchX / windowHalfX, -1, 1), clamp(-touchY / windowHalfY, -1, 1),
			0.0
		);

		var length = mouseOnBall.length();

		if (length > 1.0)
		{
			mouseOnBall.normalize();
		}
		else
		{
			mouseOnBall.z = Math.sqrt(1.0 - length * length);
		}

		return mouseOnBall;
	}

	function rotateMatrix(rotateStart, rotateEnd)
	{
		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();

		var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

		if (angle)
		{
			axis.crossVectors(rotateStart, rotateEnd).normalize();
			angle *= rotationSpeed;
			quaternion.setFromAxisAngle(axis, angle);
		}
		return quaternion;
	}

	function clamp(value, min, max)
	{
		return Math.min(Math.max(value, min), max);
	}

	function animate()
	{
		requestAnimationFrame(animate);
		render();
	}

	function render()
	{
		if (!mouseDown)
		{
			var drag = 0.95;
			var minDelta = 0.05;

			if (deltaX < -minDelta || deltaX > minDelta)
			{
				deltaX *= drag;
			}
			else
			{
				deltaX = 0;
			}

			if (deltaY < -minDelta || deltaY > minDelta)
			{
				deltaY *= drag;
			}
			else
			{
				deltaY = 0;
			}

			handleRotation();
		}

		renderer.render(window.scene, camera);
	}

	var handleRotation = function()
	{
		rotateEndPoint = projectOnTrackball(deltaX, deltaY);

		var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);

		if(selectedPolygon === "cube"){
			curQuaternion = window.cube.quaternion;
			curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
			curQuaternion.normalize();
			window.cube.setRotationFromQuaternion(curQuaternion);
		}

		if(selectedPolygon === "tetrahedron"){
			curQuaternion = window.tetrahedron.quaternion;
			curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
			curQuaternion.normalize();
			window.tetrahedron.setRotationFromQuaternion(curQuaternion);
		}

		rotateEndPoint = rotateStartPoint;
	};

	// PUBLIC INTERFACE
	return {
		init: function()
		{
			setup();
		}
	};
})();

document.onreadystatechange = function()
{
	if (document.readyState === 'complete')
	{
		Defmech.RotationWithQuaternion.init();
	}
};

document.setPolygon = function(polygon){

	if (polygon === "tetrahedron"){
		if(selectedPolygon != "tetrahedron"){
			selectedPolygon = "tetrahedron";
			window.scene.remove(window.cube);
			window.scene.remove(plane);
			//remove other polygons;
			loadTetrahedron();
		}
		else{
			alert("Tetrahedron is already selected!")
		}
	}

	if (polygon === "cube"){
		if(selectedPolygon != "cube"){
			selectedPolygon = "cube";
			window.scene.remove(window.tetrahedron);
			//remove other polygons;
			loadCube();
		}
		else{
			alert("Cube is already selected!");
		}
	}
}

function loadCube(){
	var boxGeometry = new THREE.BoxGeometry(200, 200, 200);

	for (var i = 0; i < boxGeometry.faces.length; i += 2)
	{
		//hue, saturation, lightning
		var color = {
			h: (1 / (boxGeometry.faces.length)) * i,
			s: 0.5,
			l: 0.5
		};

		boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
		boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);

	}

	//Changing cube colors
	var cubeMaterial = new THREE.MeshBasicMaterial(
	{
		vertexColors: THREE.FaceColors,
		overdraw: 0.5
	});

	window.cube = new THREE.Mesh(boxGeometry, cubeMaterial);
	window.cube.position.y = 200;
	window.scene.add(window.cube);

	// Plane
	var planeGeometry = new THREE.PlaneGeometry(200, 200);
	planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	var planeMaterial = new THREE.MeshBasicMaterial(
	{
		color: 0xe0e0e0,
		overdraw: 0.5
	});

	plane = new THREE.Mesh(planeGeometry, planeMaterial);
	window.scene.add(plane);

}


function loadTetrahedron(){
	//Changing tetrahedron colors
	var tetrahedronMaterial = new THREE.MeshBasicMaterial(
	{
		vertexColors: THREE.FaceColors,
		overdraw: 0.5
	});

	THREE.TetrahedronGeometry = function ( radius, detail ) {

	var vertices = [ 1,  1,  1,   - 1, - 1,  1,   - 1,  1, - 1,    1, - 1, - 1];
	var indices = [ 2,  1,  0,    0,  3,  2,    1,  3,  0,    2,  3,  1];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );
};
	console.log('ok');

	THREE.TetrahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
	window.tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(50), tetrahedronMaterial);
	console.log(window.tetrahedron);
	window.scene.add(window.tetrahedron);
}
