//import * as dat from 'lil-gui'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '/gh/rychidesign/three-setup/libs/GLTFLoader.js'
import { DRACOLoader } from '/gh/rychidesign/three-setup/libs/DRACOLoader.js'


// Zjistit, zda uživatel používá mobilní zařízení pomocí CSS Media Queries
var isMobileDevice = window.matchMedia('(max-width: 768px)').matches;

if (isMobileDevice) {
    console.log('Uživatel používá mobilní zařízení');
  } else {
    console.log('Uživatel nepoužívá mobilní zařízení');

    // Canvas
    const canvas = document.querySelector('canvas.webgl')
    // Scene
    const scene = new THREE.Scene()


    /* Loaders =================================================================================*/

    // Texture loader
    const textureLoader = new THREE.TextureLoader()

    // Draco loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/draco/')

    // GLTF loader
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)


    /* Lights =================================================================================*/

    // Spot light 01

    let spotLight = new THREE.SpotLight()
    spotLight.color = new THREE.Color(0xffffff)
    spotLight.intensity = 2
    spotLight.position.y = 1
    spotLight.position.x = 1.5
    spotLight.position.z = 1
    scene.add(spotLight)

    // Spot light 02
    let spotLight02 = new THREE.SpotLight()
    spotLight02.color = new THREE.Color(0xffffff)
    spotLight02.intensity = 2
    spotLight02.position.y = 1
    spotLight02.position.x = -2
    spotLight02.position.z = 1
    scene.add(spotLight02)

    /* Model =================================================================================*/

    const mainGroup = new THREE.Group();

    let macbook
    gltfLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/macbook_silver_01.glb', (gltf) =>
        {
            macbook = gltf.scene
            mainGroup.add(macbook)
        }
    )
    scene.add( mainGroup );
    //gsap.to(mainGroup.rotation, { duration: 1.8, y: -0.5 })


    /* Sizes =================================================================================*/

    const wrapper = document.querySelector('div.laptop_hero')
    const sizes = {
        width: wrapper.clientWidth,
        height: wrapper.clientHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = wrapper.clientWidth
        sizes.height = wrapper.clientHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })


    /* Camera =================================================================================*/

    // Base camera
    const camera = new THREE.PerspectiveCamera(15, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1.62
    scene.add(camera)

    /* Renderer =================================================================================*/

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputEncoding = THREE.sRGBEncoding

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

    const clock = new THREE.Clock()

    const tick = () =>
    {   
        const elapsedTime = clock.getElapsedTime()

        // Mouse animation
        targetX = mouseX * .0003
        targetY = mouseY * .0002
        mainGroup.rotation.y += 0.05 * (targetX - mainGroup.rotation.y);
        mainGroup.rotation.x += 0.05 * (targetY - mainGroup.rotation.x);

        // Render
        renderer.render(scene, camera)
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()

}