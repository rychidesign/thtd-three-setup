console.log("script loaded")

//import * as dat from 'lil-gui'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'loaders/GLTFLoader.js'
import { DRACOLoader } from 'jsm/loaders/DRACOLoader.js'
import gsap from 'gsap';

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
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


console.log("canvas, scene ready")

/* Loaders =================================================================================*/

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

console.log("loaders ready")


/* Lights =================================================================================*/

// Spot light 01
let spotLight = new THREE.SpotLight()
spotLight.color = new THREE.Color(0xffffff)
spotLight.intensity = 0

spotLight.position.y = 1
spotLight.position.x = 1.5
spotLight.position.z = 1
scene.add(spotLight)

// Back Spot light 02
const spotLight02 = new THREE.SpotLight()
spotLight02.color = new THREE.Color(0x9B9782)
spotLight02.intensity = 0.2
spotLight02.position.y = 0.5
spotLight02.position.x = -1
spotLight02.position.z = -1
scene.add(spotLight02)

// Back Spot light 03
const spotLight03 = new THREE.SpotLight()
spotLight03.color = new THREE.Color(0x9B9782)
spotLight03.intensity = 0.2
spotLight03.position.y = 0.5
spotLight03.position.x = 1
spotLight03.position.z = -1
scene.add(spotLight03)

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
const bakedTextureEmpty = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/baked_empty.jpg')
bakedTextureEmpty.flipY = false
bakedTextureEmpty.encoding = THREE.sRGBEncoding

const bakedTextureNutty = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/baked_nutty.jpg')
bakedTextureNutty.flipY = false
bakedTextureNutty.encoding = THREE.sRGBEncoding

const bakedTextureJesus = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/baked_jesus.jpg')
bakedTextureJesus.flipY = false
bakedTextureJesus.encoding = THREE.sRGBEncoding

const bakedTextureSandy = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/baked_sandy.jpg')
bakedTextureSandy.flipY = false
bakedTextureSandy.encoding = THREE.sRGBEncoding

const bumpTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/bake_bump.jpg')
bumpTexture.flipY = false
bumpTexture.encoding = THREE.sRGBEncoding


//Short sleeve textures
const bakedTextureWhitee = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/baked_whitee.jpg')
bakedTextureWhitee.flipY = false
bakedTextureWhitee.encoding = THREE.sRGBEncoding

const bumpTextureShort = textureLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/baked_short_sleeve_bump.jpg')
bumpTextureShort.flipY = false
bumpTextureShort.encoding = THREE.sRGBEncoding


console.log("textures ready")

/* Materials =================================================================================*/
// Baked Long sleeve material
const bakedMaterialLong = new THREE.MeshStandardMaterial({
    map: bakedTextureEmpty,
    roughness: 0.85,
    bumpMap: bumpTexture,
    bumpScale: 0.001,
    side: THREE.DoubleSide,   
});

// Baked Short sleeve material
const bakedMaterialShort = new THREE.MeshStandardMaterial({
    map: bakedTextureWhitee,
    roughness: 0.85,
    bumpMap: bumpTextureShort,
    bumpScale: 0.001,
    side: THREE.DoubleSide,   
});

console.log("material ready")

/* Model =================================================================================*/

const dresGroup = new THREE.Group();

let dresMesh
gltfLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/dres_01.glb', (gltf) =>
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

let dresMeshShort
gltfLoader.load('https://cdn.jsdelivr.net/gh/rychidesign/three-setup/assets/dres_02.glb', (gltf) =>
    {
        dresMeshShort = gltf.scene
        dresMeshShort.traverse((child) =>
        {
            child.material = bakedMaterialShort
        })
        dresGroup.add(dresMeshShort)
        dresMeshShort.visible = false
    }
)


scene.add( dresGroup );
gsap.to(dresGroup.rotation, { duration: 1.5, y: Math.PI/10 * -1.6 })

console.log("meshes ready")


/* Sizes =================================================================================*/

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/* Camera =================================================================================*/

// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.rotation.x = Math.PI /20
camera.position.y = -0.24
camera.position.z = 1.5
scene.add(camera)

// Controls
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true



/* Renderer =================================================================================*/

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    shadowMapEnabled: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding



/* SCROLL ANIMATION ===========================================*/


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

/* Animate =================================================================================*/

const clock = new THREE.Clock()

const tick = () =>
{   
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    //controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
