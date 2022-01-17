//SCENE, CAMERA, RENDERER------------------------
const scene = new THREE.Scene();

//create new perspective camera
//four arguments: vertical FOV, aspect ratio, near boundary of camera's view, far boundary of camera's view
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
//set z to 10
camera.position.set(0, 0, 10);

//create WebGL renderer and set its size to the full dimensions of the screen
const renderer = new THREE.WebGLRenderer({ antialias: false });
//set max width and height to browser window
renderer.setSize(window.innerWidth, window.innerHeight);

//add the renderer canvas to the DOM
document.body.appendChild(renderer.domElement);

//ORBIT CONTROLS --------------------------------
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

//LIGHTING--------------------------------------
//create a new ambient light -- POSSIBLY REMOVE LATER
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

//create a new directional light
const directionalLight = new THREE.DirectionalLight(0xfdcf0, 1);
directionalLight.position.set(20, 10, 20);
scene.add(directionalLight);

//EARTH OBJECT ---------------------------------
//3 arguments: radius of sphere, number of radial segments, number of height segments
const earthGeo = new THREE.SphereGeometry(5, 50, 50);
const earthMat = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load("./textures/earth_texture.jpg"),
  color: 0xaaaaaa,
  specular: 0x333333,
  shininess: 25,
});

//CLOUD OBJECT --------------------------------
const cloudGeo = new THREE.SphereGeometry(5.1, 50, 50);
const cloudMat = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load("./textures/clouds_2.jpg"),
  transparent: true,
  opacity: 0.1,
});

//STARFIELD OBJECT --------------------------------
const starGeo = new THREE.SphereGeometry(1000, 50, 50);
const starMat = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load("./textures/galaxy_starfield.png"),
  side: THREE.DoubleSide,
  shininess: 0,
});

//MOON OBJECT --------------------------------
// const mtlLoader = new THREE.LoadingManager();
// mtlLoader.setPath("./objects/moon/");

const moonLoader = new THREE.ObjectLoader();
moonLoader.setPath("./objects/moon/");
moonLoader.load(
  "moon.obj",
  function (object) {
    object.position.set(15, 0, 0);
    // object.scale(5, 5, 5);
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (err) {
    console.error("An error happened", err);
  }
);

//build mesh
const clouds = new THREE.Mesh(cloudGeo, cloudMat);
const earth = new THREE.Mesh(earthGeo, earthMat);
const stars = new THREE.Mesh(starGeo, starMat);

//add object meshes to the Scene
scene.add(earth);
scene.add(clouds);
scene.add(stars);

//RENDER LOOP ---------------------------------
const render = function (actions) {
  //roate earth about y-axis
  earth.rotation.y -= 0.0005;
  clouds.rotation.y -= 0.00025;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();
