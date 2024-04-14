console.log("script loaded");
// Zjistit, zda je dostupná funkce WebGL 2.0
var isWebGL2Supported = (function () {
    try {
      var canvas = document.createElement('canvas');
      return !!(
        window.WebGL2RenderingContext && (canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2')));
    } catch (e) {
      return false;
    }
})();


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/libs/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/libs/DRACOLoader.js';


function checkWebGLSupport(){
    if(isWebGL2Supported){
        init();
    }else{
        document.getElementById('3d_image_wrapper').style.display = 'none';
        document.getElementById('image_wrapper').style.display = 'block';
    };
};


function doSomething() {
    console.info("DOM loaded");
  }


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", doSomething);
  } else {
    checkWebGLSupport();
  }

function init(){
        /* Base =================================================================================*/

        // Canvas
        const canvas = document.getElementById('3d-canvas-02');
        const loaderWrapper = document.getElementById('loader-wrapper');
        const wrapper = document.querySelector('div.product_3d_wrapper');
        const productModel = document.getElementById('product_model').innerHTML;
        const productTextureUrl = document.getElementById('product_texture_url').src;
        const productRotation = document.getElementById('product_rotation').innerHTML;
        const ambientColor = document.getElementById('product_ambient_color').innerHTML;
        const ambientIntensity = document.getElementById('product_ambient_intensity').innerHTML;


        /*
        // PRELOADER
        */
        const loadingManager = new THREE.LoadingManager(
            //LOADED
            () =>
            {
                console.log('>> loaded <<');
                loaderWrapper.style.display = 'none';
            },
            //PROGRESS
            () =>
            {
                console.log('progress');
            }
        )


        // Scene
        const scene = new THREE.Scene();

        /* Loaders =================================================================================*/

        // Texture loader
        const textureLoader = new THREE.TextureLoader(loadingManager);

        // Draco loader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/draco/');

        // GLTF loader
        const gltfLoader = new GLTFLoader(loadingManager);
        gltfLoader.setDRACOLoader(dracoLoader);


        /* Lights =================================================================================*/

        // Spot light 01
        const spotLight = new THREE.SpotLight();
        spotLight.color = new THREE.Color(0xffffff);
        spotLight.intensity = 20;
        spotLight.position.y = 0.3;
        spotLight.position.x = 1.5;
        spotLight.position.z = 1;
        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 512;
        spotLight.shadow.mapSize.height = 512; 
        spotLight.shadow.camera.near = 0.5;
        spotLight.shadow.camera.far = 400;
        spotLight.shadow.focus = 1;

        scene.add(spotLight);


        // Back Spot light 02
        const spotLight02 = new THREE.SpotLight();
        spotLight02.color = new THREE.Color(0xffffff);
        spotLight02.intensity = 6;
        spotLight02.position.y = 0.5;
        spotLight02.position.x = -1;
        spotLight02.position.z = -2;
        //spotLight02.castShadow = true;
        scene.add(spotLight02);

        // Back Spot light 03
        const spotLight03 = new THREE.SpotLight();
        spotLight03.color = new THREE.Color(0xffffff);
        spotLight03.intensity = 6;
        spotLight03.position.y = 0.5;
        spotLight03.position.x = 1;
        spotLight03.position.z = -2;
        //spotLight03.castShadow = true;
        scene.add(spotLight03);

        const lightsGroup = new THREE.Group();
        lightsGroup.add(spotLight, spotLight02, spotLight03);
        scene.add(lightsGroup);


        // Ambient Spot light 03
        const AmbientLight = new THREE.AmbientLight();
        AmbientLight.color = new THREE.Color(ambientColor);
        AmbientLight.intensity = ambientIntensity;
        scene.add(AmbientLight);


        /* Textures =================================================================================*/

        //Long sleeve textures
        const bakedTexture = textureLoader.load(productTextureUrl);
        bakedTexture.flipY = false;
        bakedTexture.colorSpace = THREE.SRGBColorSpace;
        bakedTexture.minFilter = THREE.LinearFilter;
        const bumpTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/bake_bump_2.jpg');
        bumpTexture.flipY = false;

        console.log("textures ready");

        /* Materials =================================================================================*/

        // Baked Long sleeve material
        const bakedMaterial = new THREE.MeshStandardMaterial({
            map: bakedTexture,
            roughness: 0.85,
            bumpMap: bumpTexture,
            bumpScale: 2.5,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xffffff)
        });

        /* Model =================================================================================*/


        const dresGroup = new THREE.Group();

        let dresMesh;
        gltfLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/' + productModel, (gltf) =>
            {
                dresMesh = gltf.scene;
                dresMesh.traverse((child) =>
                {
                    child.material = bakedMaterial;
                })
                dresGroup.add(dresMesh);
                dresMesh.visible = true;
                dresMesh.castShadow = true;
                dresMesh.receiveShadow = true;
            }
        )

        scene.add( dresGroup );
        //dresGroup.rotation.y = Math.PI/10 * productRotation;
        gsap.to(dresGroup.rotation, { duration: 1.8, y: Math.PI/10 * productRotation });


        /* Sizes =================================================================================*/

        const sizes = {
            width: wrapper.getBoundingClientRect().width,
            height: wrapper.getBoundingClientRect().height
        };

        window.addEventListener('resize', () =>
        {
            // Update sizes
            sizes.width = wrapper.getBoundingClientRect().width;
            sizes.height = wrapper.getBoundingClientRect().height;
            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix();
            // Update renderer
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.render(scene, camera);
        });



        /* Camera =================================================================================*/

        // Base camera
        const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100);
        camera.position.x = 0.26;
        camera.rotation.x = Math.PI /20;
        camera.position.y = -0.2
        camera.position.z = 1.2
        camera.add(lightsGroup);
        scene.add(camera);         

        /* Renderer =================================================================================*/

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            shadowMapEnabled: true
        })
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;


        const controls = new OrbitControls( camera, canvas );
        controls.enableDamping = true;
        controls.minDistance = 0.7;
        controls.maxDistance = 1.2;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.dampingFactor = 0.1;
        controls.update();
        if(sizes.width < 439){
            controls.enableZoom = true;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4));
        };


        /* MOUSE ANIMATION =================================================================================*/

        // mouse mapping
        document.addEventListener('mousemove', onDocumentMouseMove)
        let mouseX = 0
        let mouseY = 0

        let targetX = 0
        let targetY = 0

        const windowX = window.innerWidth / 2;
        const windowY = window.innerHeight / 2;

        function onDocumentMouseMove(event){
            mouseX = (event.clientX - windowX);
            mouseY = (event.clientY - windowY);
        }



        /* Animate =================================================================================*/

        const clock = new THREE.Clock();

        const tick = () =>
        {   
            const elapsedTime = clock.getElapsedTime();
            // Mouse animation
            targetX = mouseX * .0003
            targetY = mouseY * .0003
            dresGroup.rotation.y += 0.02 * (targetX - dresGroup.rotation.x);
            dresGroup.rotation.x += 0.02 * (targetY - dresGroup.rotation.y);
            // Update controls
            controls.update();
            // Render
            renderer.render(scene, camera);
            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        }
        tick();
};
