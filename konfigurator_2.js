import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/libs/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/libs/DRACOLoader.js';

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

function checkWebGLSupport(){
    if(isWebGL2Supported){
        build3DScene();
    }else{
        console.log('! Browser does not support WebGL !');
    };
};

window.onload = function(){
    checkWebGLSupport();
};

function build3DScene(){
        /* Base =================================================================================*/

        // CONFIGURATOR
        var configuratorSetUp = {
            design: 'custom_design',
            longSleeve: 'long_sleeve_12.glb',
            shortSleeve: 'short_sleeve_12.glb',
            name: true
        }
        // Canvas
        const canvas = document.getElementById('canvas-3d');
        const loaderWrapper = document.getElementById('loader-wrapper');
        const wrapper = document.querySelector('div.product_3d_wrapper');
        var productModel = configuratorSetUp.longSleeve //document.getElementById('product_model').innerHTML;
        const productRotation = '2';
        const ambientColor = '#ffffff';
        const ambientIntensity = '0.8';

        /* CONFIGURATOR =================================================================================*/

        var svgCode = document.querySelector(`[design-id="${configuratorSetUp.design}"]`);
        var svgStyle = document.querySelector(`[design-id="${configuratorSetUp.design}"]`).firstElementChild;
        var colorButtons = document.querySelectorAll('input[data-type="color-swatches"]');
        var nameInput = document.querySelector('input[name="name-on-jersey"]');
        var nameOnDesign = document.querySelector(`[design-id="${configuratorSetUp.design}"] text[name-id="name"]`);
        var svgBlobURL


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
                loaderWrapper.style.display = 'block';
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
        spotLight.intensity = 14;
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
        spotLight02.intensity = 10;
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
        var bakedTexture = textureLoader.load();
        bakedTexture.flipY = false;
         
        bakedTexture.colorSpace = THREE.SRGBColorSpace;

        const bumpTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/bake_bump_2.jpg');
        bumpTexture.flipY = false;

        console.log("textures ready");

        /* Materials =================================================================================*/

        // Baked Long sleeve material
        var bakedMaterial = new THREE.MeshStandardMaterial({
            map: bakedTexture,
            roughness: 0.85,
            bumpMap: bumpTexture,
            bumpScale: 2.5,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xffffff),
        });

        /* Model =================================================================================*/

        const dresGroup = new THREE.Group();
        var dresMeshLong;
        var dresMeshShort;

        gltfLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/' + configuratorSetUp.longSleeve, (gltf) =>
            {
                dresMeshLong = gltf.scene;
                dresMeshLong.traverse((child) =>
                {
                    child.material = bakedMaterial;
                })
                dresGroup.add(dresMeshLong);
                dresMeshLong.visible = true;
                //dresMeshLong.castShadow = true;
                //dresMeshLong.receiveShadow = true;
            }
        )
        gltfLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/' + configuratorSetUp.shortSleeve, (gltf) =>
            {
                dresMeshShort = gltf.scene;
                dresMeshShort.traverse((child) =>
                {
                    child.material = bakedMaterial;
                })
                dresGroup.add(dresMeshShort);
                dresMeshShort.visible = false;
                //dresMeshShort.castShadow = true;
                //dresMeshShort.receiveShadow = true;
            }
        )

        scene.add( dresGroup );
        dresGroup.rotation.y = Math.PI/10 * productRotation;


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
        controls.minDistance = 0.5;
        controls.maxDistance = 1.2;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.dampingFactor = 0.1;
        controls.update();
        if(sizes.width < 439){
            controls.enableZoom = true;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

       /* CONFIGURATOR =================================================================================*/

        const bttnLongSleeve = document.querySelector('input[id="buttons-1_1"]');
        const bttnShortSleeve = document.querySelector('input[id="buttons-1_2"]');

        bttnLongSleeve.addEventListener('click', () =>
        {
            dresMeshShort.visible = false;
            dresMeshLong.visible = true;
        });
        bttnShortSleeve.addEventListener('click', () =>
        {
            dresMeshShort.visible = true;
            dresMeshLong.visible = false;
        });

        nameInput.addEventListener('change', function(){
            nameOnDesign.innerHTML = nameInput.value;
            generateImage();
        });


        function updateSetUp(){

        }

        var designSetUp = {
            bg_color: '#000000',
            primary_color: '#333333',
            secondary_color: '#cccccc',
            tertiary_color: '#FFFFFF',
            quaternary_color: '',
            font_family:  'UniSansHeavyCAPS',
            font_size: '180'
        }

        function updatedesignSetUp (colorTarget, colorValue){
            switch (colorTarget) {
                case 'bg_color':
                    designSetUp.bg_color = colorValue;
                    console.log(colorTarget + " - " + colorValue);
                    break;
                case 'primary_color':
                    designSetUp.primary_color = colorValue;
                    console.log(colorTarget + " - " + colorValue);
                    break;
                case 'secondary_color':
                    designSetUp.secondary_color = colorValue;
                    console.log(colorTarget + " - " + colorValue);
                    break;
                case 'tertiary_color':
                    designSetUp.tertiary_color = colorValue;
                    console.log(colorTarget + " - " + colorValue);
                    break;
                case 'quaternary_color':
                    designSetUp.quaternary_color = colorValue;
                    console.log(colorTarget + " - " + colorValue);
                    break;
                case 'font_family':
                    designSetUp.font_family = colorValue;
                    console.log(colorTarget + " - " + colorValue);
                    break;
                case 'font_size':
                    designSetUp.font_size = colorValue;
                    console.log(colorTarget + " - " + colorValue);
                    break;
                default:
                    console.log(`Nenašel jsem ${colorTarget}.`);
            }
            svgStyle.innerHTML = 
            `
            .bg_color {fill: ${designSetUp.bg_color};}
            .primary_color {fill: ${designSetUp.primary_color};}
            .secondary_color {fill: ${designSetUp.secondary_color};}
            .tertiary_color {fill: ${designSetUp.tertiary_color};}
            .quaternary_color {fill: ${designSetUp.quaternary_color};}
            .font_family {font-family: '${designSetUp.font_family}';}
            .font_size {font-size: ${designSetUp.font_size}px;}
        `
        }

        function generateImage(){
            let svgAsString = svgCode.parentNode.innerHTML;
            const svgWidth = svgCode.viewBox.baseVal.width;
            const svgHeight = svgCode.viewBox.baseVal.height;

            let svgBlob = new Blob([svgAsString], {type: 'image/svg+xml'});
            svgBlobURL = globalThis.URL.createObjectURL(svgBlob);
            let img = document.createElement('img');

            var onImageLoaded = () => {
                var canvas = document.createElement('canvas');
                canvas.width = svgWidth;
                canvas.height = svgHeight;
                var context = canvas.getContext('2d');
                
                var createdImage = document.createElement('img');

                context.drawImage(img, 0, 0, svgWidth, svgHeight);
                createdImage.src = canvas.toDataURL('image/jpg');
                
                // Here the image is ready to use, e.g.,
                // document.body.appendChild(createdImage);
                
                //TextureLoader
                bakedTexture = textureLoader.load(createdImage.src);
                bakedTexture.flipY = false;
                bakedTexture.colorSpace = THREE.SRGBColorSpace;
                bakedTexture.minFilter = THREE.LinearFilter;
                bakedMaterial.map = bakedTexture;

                globalThis.URL.revokeObjectURL(svgBlobURL);
            };

            img.addEventListener('load', onImageLoaded);
            img.src = svgBlobURL;
            console.log("generateImage done")
        };

        generateImage()

        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                let bttnTargetColor = this.getAttribute('data-field-name');
                let bttnColorValue = this.getAttribute('value');
                console.log("target:" + bttnTargetColor + " / " + "value:" + bttnColorValue)

                updatedesignSetUp(bttnTargetColor, bttnColorValue);
                generateImage();
            });
        });

        /* Animate =================================================================================*/

        const clock = new THREE.Clock();

        const tick = () =>
        {   
            const elapsedTime = clock.getElapsedTime();
            // Update controls
            controls.update();
            // Render
            renderer.render(scene, camera);
            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        }
        tick();
};
