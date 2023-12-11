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
// 导入hdr加载器 
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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
//   创建模型
  createGLB()
  // 新建GUI
  createGui()
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
}
function createHdr(){
  // 全景贴图
  let rabeLoader = new RGBELoader();
  rabeLoader.load('/hdr/room_2k.hdr', (texture) => {
    // 设置球形贴图
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // 设置背景
    base.scene.background = texture;
    // 开启环境贴图
    base.scene.environment = texture;
  })
}
function createGLB() {
     // 实例化gltf
    const gltfLoader = new GLTFLoader();
    // 实例化解码器
    const dracoLoader = new DRACOLoader()
    // 设置draco路径
    dracoLoader.setDecoderPath('./draco/')
    // 设置gltf加载器draco解码器
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load('/public/glb/GXD350-300.glb', (gltf) => {
        // Assuming base is a valid object with a scene property
        let gl = gltf.scene
        base.scene.add(gl);
    }, undefined, (error) => {
        console.error(error);
    });
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
