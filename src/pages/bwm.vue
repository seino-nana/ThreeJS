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
let controls; // 用户存储是否可操作摄像机
let base; // 用于存储 Base 类的实例
let dir;
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
  base.scene.background = new THREE.Color("#ccc");
  base.scene.environment = new THREE.Color("#ccc");
  // 环境光源
  base.addAmbientLight(0.7);
  // 方向光源
  dir = base.addDirLight(1);
  dir.shadow.radius = 10; // 设置阴影模糊度
  dir.shadow.mapSize.set(2048, 2048); // 设置阴影分辨率
  dir.position.set(0, 10, 10); // 设置方向光坐标
  //   const helper = new THREE.DirectionalLightHelper(dir, 1); // 显示方向光
  //   base.scene.add(helper);
  //   添加地面网格
  createGrid();
  // 添加汽车模型
  createBWM();
  // 新建GUI
  // createGui();
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
function createGrid() {
  //   添加网格地面
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.opacity = 0.5;
  gridHelper.material.transparent = true;
  base.scene.add(gridHelper);
}
// 创建材质
const bodyMaterial1 = new THREE.MeshPhysicalMaterial({
  color: "red",
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const bodyMaterial2 = new THREE.MeshPhysicalMaterial({
  color: "red",
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const bodyMaterial3 = new THREE.MeshPhysicalMaterial({
  color: "red",
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const bodyMaterial4 = new THREE.MeshPhysicalMaterial({
  color: "red",
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
let option = [
  "选择驾驶室颜色",
  "选择操作臂颜色",
  "选择操作臂连接处颜色",
  "选择轮胎颜色",
];
let color = ["red", "blue", "green", "purple"];
let gl
function createBWM() {
  // 导入模型压缩
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  // 设置gltf加载器draco解码器
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "/public/glb/cart.gltf",
    (gltf) => {
      // Assuming base is a valid object with a scene property
      gl = gltf.scene;
      gl.traverse((child) => {
        // 驾驶室
        if (child.name === "Obj3d66-1119862-209-188_4") {
          child.material = bodyMaterial1;
        }
        // 操作臂
        if (child.name === "Obj3d66-1119862-209-188") {
          child.material = bodyMaterial2;
        }
        // 操作臂连接管
        if (child.name === "Obj3d66-1119862-209-188_8") {
          child.material = bodyMaterial3;
        }
        // 轮胎
        if (child.name === "Obj3d66-1119862-209-188_3") {
          child.material = bodyMaterial4;
        }
      });
      base.scene.add(gl);
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
}
const SelectColor = (index,ind) => {
  if(ind == 0){
    bodyMaterial1.color.set(color[index])
  } else if(ind == 1) {
    bodyMaterial2.color.set(color[index])
  } else if(ind == 2) {
    bodyMaterial3.color.set(color[index])
  } else if(ind == 3) {
    bodyMaterial4.color.set(color[index])
  }
  
}

</script> 

<template>
  <div class="bwm">
    <!-- Vue 模板，包含一个用于渲染 3D 场景的 canvas 元素 -->
    <canvas ref="canvasDom" id="canvasDom"></canvas>
    <div class="title">铲车展示与选配</div>
    <div class="option">
      <div v-for="(item,ind) in option" :key="item" style="margin-bottom:10px;">
        <div>{{ item }}</div>
        <div style="display: flex">
          <div
          v-for="(item,index) in color" 
          :key="item" 
          style="width: 30px;height: 30px;border-radius: 5px;margin-right: 10px;cursor: pointer;"
          :style="{backgroundColor:item}"
          @click="SelectColor(index,ind)"
          >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#canvasDom {
  width: 100vw;
  height: 100vh;
}
.bwm {
  position: relative;
}
.title {
  position: absolute;
  top: 20px;
  right: 100px;
  font-size: 30px;
  font-weight: 700;
  color: #34495e;
}
.option {
  position: absolute;
  top: 80px;
  right: 80px;
  font-size: 16px;
  color: #34495e;
}
</style>
