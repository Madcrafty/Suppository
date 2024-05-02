//Bounds
var splitRatio=0.7; //The scenes havea split in the middle, scene ratio is the divider

//brush
var brushRenderer;
var brushScene;
var brushCamera;
var brushCanvas;
var controls;

//vis script
var vsRenderer;
var vsScene;
var vsCamera;
var vsCanvas;

//lights
var cameraLight;
var ambietLight;

//Setup the 3 main components: scene, camera, renderer
function setScene() {
    var width=window.innerWidth;
    var height = window.innerHeight;
    //Brush
    brushCanvas = document.getElementById("brushCanvas");
    brushRenderer = new THREE.WebGLRenderer({canvas:brushCanvas});
    brushRenderer.setSize(width, height*splitRatio);
    
    brushScene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    brushCamera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    brushCamera.position.set(45, 10, 0);

    //VisScript
    vsCanvas = document.getElementById("vsCanvas");
    vsRenderer = new THREE.WebGLRenderer({canvas:vsCanvas});
    vsRenderer.setSize(width, height*(1-splitRatio));

    vsScene = new THREE.Scene();
    vsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

    controls = new THREE.OrbitControls(brushCamera,brushRenderer.domElement);
}

function setLight(){
    cameraLight = new THREE.PointLight(new THREE.Color(0xffffff),0.5);
    brushCamera.add(cameraLight);
    ambietLight = new THREE.AmbientLight(new THREE.Color(0xffffff),0.5);
}

//Resize the scene and update the camera aspect to the screen ration
var resizeScene = function() {
    var width=window.innerWidth;
    var height = window.innerHeight;

    brushRenderer.setSize(width, height*splitRatio);
    brushCamera.aspect = width / height;
    brushCamera.updateProjectionMatrix();
    brushRenderer.render(brushScene, brushCamera);

    vsRenderer.setSize(width, height*(1-splitRatio));
    vsRenderer.render(vsScene, vsCamera);
};