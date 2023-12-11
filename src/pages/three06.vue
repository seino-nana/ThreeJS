<script setup>
import { onMounted, ref } from "vue";
import Base from "@/utils/base.js";
import * as THREE from "three";
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
let controls; // 用户存储是否可操作摄像机
let base; // 用于存储 Base 类的实例
let dir; // 用于存储方向光
let sphere1;
let sphere2;
let pointLight; // 用于存储点光源
const canvasDom = ref(null); // Vue ref 用于引用 canvas 元素
// 设置时钟
const clock = new THREE.Clock()
// 窗口变化触发base.js中的resize函数
window.addEventListener("resize", () => {
  base.resize();
});
onMounted(() => {
  // 在组件挂载后执行的钩子函数
  base = new Base(canvasDom.value); // 创建 Base 实例，传入 canvas 元素的引用
  // 物体可操作
  controls = new OrbitControls(base.camera, base.renderer.domElement);

  // 灯光阴影需要满足四个条件
  // 1.渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
  // 2.设置光照投射阴影 directionalLight.castShadow = true;
  // 3.设置物体投射阴影 sphere.castShadow = true
  // 4.设置平面接受阴影 plane.receiveShadow = true
  // 环境光源
  base.addAmbientLight(0.7);
  // 方向光源
  dir = base.addDirLight(1);
  dir.shadow.radius = 10; // 设置阴影模糊度
  dir.shadow.mapSize.set(2048, 2048); // 设置阴影分辨率
  dir.position.set(3, 3, 3); // 设置方向光坐标
  const helper = new THREE.DirectionalLightHelper(dir, 1); // 显示方向光
  base.scene.add(helper);

  // 创建平面和球
  createPlane();
  createSpere();
  createSphere2();

  // 点光源
  pointLight = new THREE.PointLight("#d81e06", 3, 100, 2);
  pointLight.position.set(0, 0, 0);
  pointLight.castShadow = true;
  const pointLightHelper = new THREE.PointLightHelper(pointLight); // 显示点光源
  base.scene.add(pointLightHelper);
  // base.scene.add(pointLight);
  sphere2.add(pointLight); // 点光源添加到球上
  // 新建GUI
  createGui();
  // 启动更新循环
  update();
});

// 更新循环
function update() {
  requestAnimationFrame(update); // 使用浏览器的动画循环调用 update 函数，实现持续更新
  let time = clock.getElapsedTime()
  sphere2.position.x = Math.sin(time) * 2;
  sphere2.position.z = Math.cos(time) * 2;
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
  // 方向光x,y,z轴位移
  gui.add(dir.position, "x", -10, 10).name("控制方向光X轴");
  gui.add(dir.position, "z", -10, 10).name("控制方向光Z轴");
  //   是否投射方向光阴影
  gui.add(dir, "castShadow").name("开启方向光投射阴影");
  // 方向光投射阴影大小
  gui
    .add(dir.shadow.camera, "near")
    .min(0)
    .max(10)
    .step(0.1)
    .name("控制方向光大小") 
    .onChange(() => {
      dir.shadow.camera.updateProjectionMatrix();
    });
  // 点光源
  gui.add(pointLight,'decay').min(0).max(5).step(0.01).name('点光源强度')
}
function createPlane() {
  // 创建平面
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: "#ffffff", side: THREE.DoubleSide })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, -1, 0);
  plane.receiveShadow = true;
  base.scene.add(plane);
}
function createSpere() {
  sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ color: "#ffffff", side: THREE.DoubleSide })
  );
  sphere1.castShadow = true;
  base.scene.add(sphere1);
}
function createSphere2() {
  sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshStandardMaterial({ color: "#e81e06", side: THREE.DoubleSide })
  );
  sphere2.position.set(3, 1.5, 0);
  sphere2.castShadow = true;
  base.scene.add(sphere2);
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
