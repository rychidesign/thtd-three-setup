console.log("script loaded")

//import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/libs/GLTFLoader.js'
import { DRACOLoader } from 'https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/libs/DRACOLoader.js'
//import gsap from '/libs/gsap';

console.log("import ready")


// /**
//  * Spector JS
//  */
// const SPECTOR = require('spectorjs')
// const spector = new SPECTOR.Spector()
// spector.displayUI()



/* Base =================================================================================*/
// Debug
//const gui = new dat.GUI({
//    width: 300
//})

// Canvas
const canvas = document.getElementById('3d-canvas-02')
const wrapper = document.querySelector('div.product_3d_wrapper')
const productModel = document.getElementById('product_model').innerHTML
const productTextureUrl = document.getElementById('product_texture_url').src
const productRotation = document.getElementById('product_rotation').innerHTML


// Scene
const scene = new THREE.Scene()


console.log("canvas, scene ready")

/* Loaders =================================================================================*/

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

console.log("loaders ready")


/* Lights =================================================================================*/

// Spot light 01
const spotLight = new THREE.SpotLight()
spotLight.color = new THREE.Color(0xffffff)
spotLight.intensity = 0.8

spotLight.position.y = 1
spotLight.position.x = 1.5
spotLight.position.z = 1
scene.add(spotLight)



// Back Spot light 02
const spotLight02 = new THREE.SpotLight()
spotLight02.color = new THREE.Color(0xffffff)
spotLight02.intensity = 1
spotLight02.position.y = 0.5
spotLight02.position.x = -1
spotLight02.position.z = -2
scene.add(spotLight02)

// Back Spot light 03
const spotLight03 = new THREE.SpotLight()
spotLight03.color = new THREE.Color(0xffffff)
spotLight03.intensity = 1
spotLight03.position.y = 0.5
spotLight03.position.x = 1
spotLight03.position.z = -2
scene.add(spotLight03)

const lightsGroup = new THREE.Group();
lightsGroup.add(spotLight, spotLight02, spotLight03)
scene.add(lightsGroup)


// Ambient Spot light 03
const AmbientLight = new THREE.AmbientLight()
AmbientLight.color = new THREE.Color(0x9B9782)
AmbientLight.intensity = 0.2
scene.add(AmbientLight)

//gui.add( spotLight, 'intensity', 0, 5, 0.001 );
//gui.add( spotLight02, 'intensity', 0, 5, 0.001 );
//gui.add( spotLight03, 'intensity', 0, 5, 0.001 );
//gui.add( AmbientLight, 'intensity', 0, 1, 0.001 );

console.log("lights ready")

/* Textures =================================================================================*/
//Long sleeve textures

const bakedTextureJesus = textureLoader.load(productTextureUrl)
bakedTextureJesus.flipY = false
bakedTextureJesus.encoding = THREE.sRGBEncoding

const bumpTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/thtd-three-setup/assets/bake_bump_2.jpg')
bumpTexture.flipY = false

console.log("textures ready")

/* Materials =================================================================================*/
// Baked Long sleeve material
const bakedMaterialLong = new THREE.MeshStandardMaterial({
    map: bakedTextureJesus,
    roughness: 0.8,
    bumpMap: bumpTexture,
    bumpScale: 0.001,
    side: THREE.DoubleSide,   
});


console.log("material ready")

/* Model =================================================================================*/

const dresGroup = new THREE.Group();

let dresMesh
gltfLoader.load('https://uploads-ssl.webflow.com/658357c7bf6584b3811497cf/65a705ff2c0c20868ec4386f_long_sleeve.txt', (gltf) =>
    {
        dresMesh = gltf.scene
        dresMesh.traverse((child) =>
        {
            child.material = bakedMaterialLong
        })
        dresGroup.add(dresMesh)
        dresMesh.visible = true
    }
)

scene.add( dresGroup );
gsap.to(dresGroup.rotation, { duration: 1.8, y: Math.PI/10 * productRotation })

console.log("meshes ready")


/* Sizes =================================================================================*/

const sizes = {
    width: wrapper.getBoundingClientRect().width,
    height: wrapper.getBoundingClientRect().height
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = wrapper.getBoundingClientRect().width
    sizes.height = wrapper.getBoundingClientRect().height

    console.log(sizes.width, sizes.height)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4))
    renderer.render(scene, camera)
})



/* Camera =================================================================================*/

// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0.26
camera.rotation.x = Math.PI /20
camera.position.y = -0.2
camera.position.z = 1.2

scene.add(camera)
camera.add(lightsGroup)

/* Renderer =================================================================================*/

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    shadowMapEnabled: false,
    //precision: highp,
    toneMappingExposure: 1.5

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding


const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;
//controls.minDistance = 0.7;
//controls.maxDistance = 1.2;
//controls.zoomToCursor = true;
controls.enableZoom = false
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 1.5;
controls.dampingFactor = 0.5;
controls.update();


/* SCROLL ANIMATION ===========================================*/

/*
// SCROLL ANIMATION
window.onscroll = function() {scrollCheck()};

function scrollCheck() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    let scrolled = (winScroll / height) * 100

        // scroll Lights
        spotLight.intensity = scrolled /24
        spotLight.intensity = Math.min(1, Math.max(0, spotLight.intensity))

        spotLight02.intensity = scrolled /24
        spotLight02.intensity = Math.min(2, Math.max(0.2, spotLight.intensity))

        spotLight03.intensity = scrolled /24
        spotLight03.intensity = Math.min(1.5, Math.max(0.2, spotLight.intensity))
        
        AmbientLight.intensity = scrolled /24
        AmbientLight.intensity = Math.min(0.5, Math.max(0.2, AmbientLight.intensity))

        // scroll Mesh
        if (scrolled >= 0 && scrolled < 35){
            gsap.to(dresGroup.rotation, { duration: 1.5, y: Math.PI/10 * -1.6 })
            gsap.to(dresGroup.position, { duration: 1.5, z: 0 })
            gsap.to(dresGroup.position, { duration: 1.5, y: 0 })
        }if (scrolled >= 35 && scrolled < 70){
            gsap.to(dresGroup.rotation, { duration: 1.5, y: Math.PI/10 * 11 })
            gsap.to(dresGroup.position, { duration: 1.5, z: 0 })
            gsap.to(dresGroup.position, { duration: 1.5, y: 0 })
            gsap.to(dresGroup.rotation, { duration: 1.5, x: 0 })
        }if (scrolled >= 75){
            gsap.to(dresGroup.rotation, { duration: 1.5, y: Math.PI/10 * 19 })
            gsap.to(dresGroup.position, { duration: 1.5, z: 0.5 })
            gsap.to(dresGroup.position, { duration: 1.5, y: -0.2 })
            gsap.to(dresGroup.rotation, { duration: 1.5, x: 0.5 })
        }
 
        
}
*/



/*
// BUTTON TEXTURE SWITCHER

    // BUTTON TEXTURE SWITCHER
    // Create a reference to each button
    const bttnNutty = document.getElementById("bttn_nutty");
    const bttnBeersus = document.getElementById("bttn_beersus");
    const bttnSandy = document.getElementById("bttn_sandy");
    const bttnWhitee = document.getElementById("bttn_whitee");

    bttnNutty.addEventListener('click', () =>
    {
        console.log('Nutty button was clicked!');
        bakedMaterialLong.map = bakedTextureNutty
        dresMeshShort.visible = false
        dresMesh.visible = true
    })
    bttnBeersus.addEventListener('click', () =>
    {
        console.log('Beersus button was clicked!');
        bakedMaterialLong.map = bakedTextureJesus
        dresMeshShort.visible = false
        dresMesh.visible = true
    })
    bttnSandy.addEventListener('click', () =>
    {
        console.log('Sandy button was clicked!');
        bakedMaterialLong.map = bakedTextureSandy
        dresMeshShort.visible = false
        dresMesh.visible = true
    })
    bttnWhitee.addEventListener('click', () =>
    {
        console.log('Sandy button was clicked!');
        bakedMaterialLong.map = bakedTextureWhitee
        dresMeshShort.visible = true
        dresMesh.visible = false
    })
console.log("buttons ready")
*/

/* Animate =================================================================================*/

const clock = new THREE.Clock()

const tick = () =>
{   
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
