<script setup>
import { onMounted, ref } from "vue";
import Base from "@/utils/base.js";
import * as THREE from "three";
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 补间动画库
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
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
  
  createSphere()
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
  // 更新补间动画tween
  TWEEN.update();
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
let sphere1
function createSphere(){
  sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  base.scene.add(sphere1)
  // 球体使用补间动画
  const tween = new TWEEN.Tween(sphere1.position)
  // 补间动画移动区域，时间
  tween.to({x:2},2000)
  // 循环补间动画（可填入次数，Infinity是无限循环）
  tween.repeat(Infinity)
  // 循环往复
  tween.yoyo(true)
  // 设置缓动函数(曲线)
  tween.easing(TWEEN.Easing.Quadratic.InOut)
  // 启动补间动画
  tween.start()
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
