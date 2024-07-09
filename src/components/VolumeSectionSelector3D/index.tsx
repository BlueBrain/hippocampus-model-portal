import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import { VolumeSection } from '@/types';
import { volumeSections, theme } from '@/constants'; // Import theme

import styles from './styles.module.scss';

type VolumeSectionSelectProps = {
  value?: VolumeSection;
  onSelect?: (volumeSection: VolumeSection) => void;
  theme?: number;
};

const VolumeSectionSelector3D: React.FC<VolumeSectionSelectProps> = ({
  onSelect = () => { },
  theme: themeProp = 1,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedVolumeSection, setSelectedVolumeSection] = useState<VolumeSection | null>(null);
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);

  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const composer = useRef<EffectComposer | null>(null);
  const outlinePass = useRef<OutlinePass | null>(null);

  const obj1Ref = useRef<THREE.Object3D | null>(null);
  const obj2Ref = useRef<THREE.Object3D | null>(null);
  const obj3Ref = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      console.error('mountRef.current is not defined');
      return;
    }

    scene.current = new THREE.Scene();
    scene.current.background = new THREE.Color('#313354');  // Set the background color here

    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.current = new THREE.OrthographicCamera(-aspect * 200, aspect * 200, 200, -200, 0.1, 1000);
    camera.current.zoom = 1.25;
    camera.current.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.current.position.z = 100;

    // Set up post-processing
    composer.current = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene.current, camera.current);
    composer.current.addPass(renderPass);

    outlinePass.current = new OutlinePass(
      new THREE.Vector2(mountRef.current.clientWidth, mountRef.current.clientHeight),
      scene.current,
      camera.current
    );
    outlinePass.current.edgeStrength = 2.5;
    outlinePass.current.edgeGlow = 0.0;
    outlinePass.current.edgeThickness = 2.0;
    outlinePass.current.pulsePeriod = 0;
    outlinePass.current.visibleEdgeColor.set(theme[themeProp].hover);
    outlinePass.current.hiddenEdgeColor.set(theme[themeProp].hover);
    composer.current.addPass(outlinePass.current);

    const loader = new OBJLoader();
    loader.load(
      '/hippocampus-portal-dev/data/3d/volume-selector2.obj',
      (obj) => {
        console.log('OBJ loaded successfully');

        const offset = 180;
        const obj1 = obj.clone();
        const obj2 = obj.clone();
        const obj3 = obj.clone();

        obj1Ref.current = obj1;
        obj2Ref.current = obj2;
        obj3Ref.current = obj3;

        obj1.position.set(-offset, 0, 0);
        obj2.position.set(0, 0, 0);
        obj3.position.set(offset, 0, 0);

        const currentTheme = theme[themeProp];

        const applyMaterial = (obj, index) => {
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              let material;
              if (
                (index === 0 && child.name === 'region') ||
                (index === 1 && child.name === 'slice') ||
                (index === 2 && child.name === 'cylinder')
              ) {
                material = new THREE.MeshBasicMaterial({
                  color: currentTheme.selected, // Apply selected color from theme
                  transparent: true,
                  opacity: 1,
                  depthWrite: false, // Prevents depth writing for transparent objects
                });
                child.renderOrder = 999; // Ensure opaque object is rendered on top
              } else {
                material = new THREE.MeshBasicMaterial({
                  color: currentTheme.default, // Apply default color from theme
                  transparent: true,
                  opacity: 0.1,
                  depthWrite: false, // Prevents depth writing for transparent objects
                });
                const wireframeGeometry = new THREE.EdgesGeometry(child.geometry);
                const wireframeMaterial = new THREE.LineBasicMaterial({
                  color: currentTheme.hover, // Apply hover color from theme
                  transparent: true,
                  opacity: .1, // Adjust opacity as needed
                  depthWrite: false, // Prevents depth writing for wireframe
                });
                const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
                wireframe.renderOrder = 1; // Ensures wireframe is rendered on top
                child.add(wireframe);
              }
              child.material = material;
              child.userData.volumeSection = volumeSections[index];
            }
          });
        };

        [obj1, obj2, obj3].forEach((obj, index) => {
          applyMaterial(obj, index);
          scene.current.add(obj);
        });

        // Add text labels
        const fontLoader = new FontLoader();
        fontLoader.load('/hippocampus-portal-dev/assets/fonts/Titillium_Web_Light_.json', (font) => {
          const createText = (text, position) => {
            const textGeometry = new TextGeometry(text, {
              font: font,
              size: 10,
              height: 1,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.5,
              bevelSize: 0.25,
              bevelOffset: 0,
              bevelSegments: 3,
            });

            const textMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.8,
              depthWrite: false,
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(position.x - 10, position.y - 10, position.z + 20); // Adjust position to ensure visibility
            scene.current.add(textMesh);
          };

          createText('OBJ1', obj1.position);
          createText('OBJ2', obj2.position);
          createText('OBJ3', obj3.position);
        });

        animate();
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      composer.current!.render();
    };

    const handleResize = () => {
      if (mountRef.current && renderer && camera.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);

        const aspect = width / height;
        camera.current.left = -aspect * 200;
        camera.current.right = aspect * 200;
        camera.current.top = 200;
        camera.current.bottom = -200;
        camera.current.updateProjectionMatrix();

        composer.current!.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [themeProp]);

  useEffect(() => {
    if (!mountRef.current || !camera.current || !scene.current) {
      return;
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera.current!);

      const intersects = raycaster.intersectObjects(scene.current!.children, true);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject !== hoveredObject) {
          setHoveredObject(intersectedObject);
          outlinePass.current!.selectedObjects
          document.body.style.cursor = 'pointer';
        }
      } else {
        if (hoveredObject) {
          setHoveredObject(null);
          outlinePass.current!.selectedObjects = [];
          document.body.style.cursor = 'default';
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera.current!);

      const intersects = raycaster.intersectObjects(scene.current!.children, true);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const volumeSection = intersectedObject.userData.volumeSection;
        setSelectedVolumeSection(volumeSection);
        if (onSelect) {
          onSelect(volumeSection);
        }
      }
    };

    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('click', onClick);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', onMouseMove);
        mountRef.current.removeEventListener('click', onClick);
      }
    };
  }, [hoveredObject, onSelect]);

  return (
    <div className={styles.container}>
      <div className={styles.volumeSelector} ref={mountRef}></div>
      <div className={styles.volumeList}></div>
    </div>
  );
};

export default VolumeSectionSelector3D;
