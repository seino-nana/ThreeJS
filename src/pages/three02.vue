<script setup>
import { onMounted, ref } from "vue";
import Base from "@/utils/base.js";
import * as THREE from "three";
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
let controls; // 用户存储是否可操作摄像机
let base; // 用于存储 Base 类的实例

const canvasDom = ref(null); // Vue ref 用于引用 canvas 元素

// 窗口变化触发base.js中的resize函数
window.addEventListener("resize", () => {
  base.resize();
});
onMounted(() => {
  // 在组件挂载后执行的钩子函数
  base = new Base(canvasDom.value); // 创建 Base 实例，传入 canvas 元素的引用
  // 物体可操作
  controls = new OrbitControls(base.camera, base.renderer.domElement);
  // 开启全景贴图
  createHdr()
  // 创建plane
  createPlane();
  // 新建GUI
  createGui();
  // 启动更新循环
  update();
});
// 更新循环
function update() {
  requestAnimationFrame(update); // 使用浏览器的动画循环调用 update 函数，实现持续更新
  // 调用base.js中的update热更新
  base.update();
  // 调用控制器热更新
  controls.update();
}
function createHdr(){
  // 全景贴图
  let rabeLoader = new RGBELoader();
  rabeLoader.load('/public/hdr/toolroom_4k.hdr', (texture) => {
    // 设置球形贴图
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    base.scene.background = texture;
    // 
    // base.scene.environment = texture;
    // 设置光照贴图（plane->background）
    planeMat.envMap = texture;
  })
}
let planeMat
// 创建plane
function createPlane() {
  let textureLoader = new THREE.TextureLoader(); // 创建纹理加载器
  let texture = textureLoader.load("/public/texture/shuinidi.jpg"); // 加载纹理
  let aoMap = textureLoader.load("/public/texture/shandian.jpg") // ao贴图
  let alphaMap = textureLoader.load("/public/texture/shandian.jpg") // 透明度贴图
  let lightMap = textureLoader.load("/public/texture/shandian.jpg") // 光照贴图
  let planeGeo = new THREE.PlaneGeometry(5, 5);
  planeMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    map: texture, // 纹理
    aoMap:aoMap , // 设置ao贴图（一般是文字）
    aoMapIntensity: 0.5,
    // alphaMap:alphaMap // 透明度贴图
    // lightMap:lightMap, // 光照贴图(光照贴图一般是图片中固定位置反射)
    reflectivity: 0.1,
    // transparent: true,// 允许透明
    side: THREE.DoubleSide,
  });
  let plane = new THREE.Mesh(planeGeo, planeMat);
  // plane.rotation.x = -Math.PI / 2;
  base.scene.add(plane);
}

// 新建GUI
function createGui() {
  let eventObj = {
    Fullscreen: function () {
      // 全屏
      document.body.requestFullscreen();
    },
    ExitFullscreen: function () {
      document.exitFullscreen();
    },
  };
  // 创建GUI
  const gui = new GUI();
  // 添加按钮
  gui.add(eventObj, "Fullscreen").name("全屏");
  gui.add(eventObj, "ExitFullscreen").name("退出全屏");
  // ao强度
  gui.add(planeMat,"aoMapIntensity").min(0).max(1).name("AO强度")
  // 光照贴图强度
  gui.add(planeMat,"reflectivity").min(0).max(1).name("光照贴图强度")
  // 透明度贴图选项
  // gui.add(planeMat,"alphaMap",{
  //   '空':null,
  //   '贴图':alphaMap
  // })
}
</script> 

<template>
  <div>
    <!-- Vue 模板，包含一个用于渲染 3D 场景的 canvas 元素 -->
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<style scoped>
#canvasDom {
  width: 100vw;
  height: 100vh;
}
</style>
