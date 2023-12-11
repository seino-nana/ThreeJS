<script setup>
import { onMounted, ref } from "vue";
import Base from "@/utils/base.js";
import * as THREE from "three";
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入模型加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入draco解码器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
let controls; // 用户存储是否可操作摄像机
let base; // 用于存储 Base 类的实例
let dir;
let mixer;
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
  //   初始化渲染器背景
    base.scene.background = new THREE.Color("#eee");
    base.scene.environment = new THREE.Color("#eee");
  // 环境光源
  base.addAmbientLight(.5);
  // 方向光源
  dir = base.addDirLight(2);
  dir.shadow.radius = 10; // 设置阴影模糊度
  dir.shadow.mapSize.set(2048, 2048); // 设置阴影分辨率
  dir.position.set(-1, 1, 1); // 设置方向光坐标
//   const helper = new THREE.DirectionalLightHelper(dir, 1); // 显示方向光
//   base.scene.add(helper);
  createPlane();
  createPump();
  // 新建GUI
//   createGui();
  // 启动更新循环
  update();
});
let clock = new THREE.Clock();
// 更新循环
function update() {
  requestAnimationFrame(update); // 使用浏览器的动画循环调用 update 函数，实现持续更新

  // 调用base.js中的update热更新
  base.update();
  // 调用控制器热更新
  controls.update();
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
//   gui.add(base.camera.position, "x", -10, 1,0.5).name('控制摄像头x轴')
//   gui.add(base.camera.position, "y", -10, 1,0.5).name('控制摄像头y轴')
//   gui.add(base.camera.position, "z", -10, 1,0.5).name('控制摄像头z轴')
}

function createPlane() {
  const planeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 64);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: "#fff",
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  base.scene.add(plane);
}
const bodyMaterial1 = new THREE.MeshPhysicalMaterial({
  color: "#049CE9",
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
let gl;
function createPump() {
  // 导入模型压缩
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  // 设置gltf加载器draco解码器
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "/public/glb/zhongkaibeng.glb",
    (gltf) => {

      gl = gltf.scene;
      gl.position.set(0, 0.7, 0);
      gl.traverse((child) => {
        child.material = bodyMaterial1
      })
      gl.castShadow = true;
      base.scene.add(gl);
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
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
