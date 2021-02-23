import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Stats from "stats.js";

function initStats() {
  const stats = new Stats();
  stats.dom.style.position = "absolute";
  stats.dom.style.left = "0px";
  stats.dom.style.top = "0px";
  return stats;
}

const Chapter01: NextPage = () => {
  const frameId = useRef(0);
  const mount = useRef<HTMLDivElement>(null);
  const statsMount = useRef<HTMLDivElement>(null);
  const gui = useRef<dat.GUI | null>(null);

  useEffect(() => {
    const stats = initStats();
    statsMount.current?.appendChild(stats.dom);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    let step = 0;

    const controls = {
      rotationSpeed: 0.02,
      bouncingSpeed: 0.03,
    };
    const initGUI = async () => {
      const dat = (await import("dat.gui")).default;
      if (!gui.current) {
        gui.current = new dat.GUI();
        gui.current.add(controls, "rotationSpeed", 0, 0.5);
        gui.current.add(controls, "bouncingSpeed", 0, 0.5);
      }
    };

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const animate = () => {
      stats.update();

      cube.rotation.x += controls.rotationSpeed;
      cube.rotation.y += controls.rotationSpeed;
      cube.rotation.z += controls.rotationSpeed;

      step += controls.bouncingSpeed;
      sphere.position.x = 20 + 10 * Math.cos(step);
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

      renderScene();
      frameId.current = window.requestAnimationFrame(animate);
    };

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    mount.current?.appendChild(renderer.domElement);
    window.addEventListener("resize", onResize, false);
    animate();
    initGUI();

    return () => {
      window.cancelAnimationFrame(frameId.current);
      window.removeEventListener("resize", onResize);
      gui.current?.destroy();
      gui.current = null;

      scene.remove(plane);
      planeGeometry.dispose();
      planeMaterial.dispose();

      scene.remove(cube);
      cubeGeometry.dispose();
      cubeMaterial.dispose();

      scene.remove(sphere);
      sphereGeometry.dispose();
      sphereMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Chapter 01 - Learning three.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div ref={statsMount}></div>
      <div ref={mount}></div>
    </div>
  );
};

export default Chapter01;
