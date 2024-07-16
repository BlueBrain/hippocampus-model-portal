import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
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
  const hoveredObjectRef = useRef<THREE.Object3D | null>(null);
  const selectedVolumeSectionRef = useRef<VolumeSection | null>(null);
  const selectedObjectRef = useRef<THREE.Object3D | null>(null);

  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const raycaster = useRef<THREE.Raycaster | null>(null);
  const mouse = useRef(new THREE.Vector2());

  const obj1Ref = useRef<THREE.Object3D | null>(null);
  const obj2Ref = useRef<THREE.Object3D | null>(null);
  const obj3Ref = useRef<THREE.Object3D | null>(null);

  const handleClick = useCallback((event) => {
    console.log('Click event detected');
    const rect = mountRef.current!.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    console.log('Mouse coordinates:', mouse.current);

    raycaster.current!.setFromCamera(mouse.current, camera.current!);
    const intersects = raycaster.current!.intersectObjects([obj1Ref.current!, obj2Ref.current!, obj3Ref.current!], true);

    console.log('Intersected objects:', intersects);

    if (intersects.length > 0) {
      let intersectedObject = intersects[0].object;
      while (intersectedObject.parent && ![obj1Ref.current, obj2Ref.current, obj3Ref.current].includes(intersectedObject)) {
        intersectedObject = intersectedObject.parent;
      }

      if ([obj1Ref.current, obj2Ref.current, obj3Ref.current].includes(intersectedObject)) {
        const volumeSection = intersectedObject.userData.volumeSection;
        console.log('Intersected volume section:', volumeSection);
        if (volumeSection) {
          // Reset the color of the previously selected object
          if (selectedObjectRef.current) {
            selectedObjectRef.current.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                if (
                  (child.name === 'region' && selectedObjectRef.current === obj1Ref.current) ||
                  (child.name === 'slice' && selectedObjectRef.current === obj2Ref.current) ||
                  (child.name === 'cylinder' && selectedObjectRef.current === obj3Ref.current)
                ) {
                  child.material.color.set(theme[themeProp].default);
                }
              }
            });
          }

          // Set the color of the newly selected object
          intersectedObject.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
              if (
                (child.name === 'region' && intersectedObject === obj1Ref.current) ||
                (child.name === 'slice' && intersectedObject === obj2Ref.current) ||
                (child.name === 'cylinder' && intersectedObject === obj3Ref.current)
              ) {
                child.material.color.set(theme[themeProp].selected);
              }
            }
          });

          selectedVolumeSectionRef.current = volumeSection;
          selectedObjectRef.current = intersectedObject;
          onSelect(volumeSection);
        }
      } else {
        console.log('Intersected object is not a main volume section object');
      }
    }
  }, [onSelect, themeProp]);

  useEffect(() => {
    if (!mountRef.current) {
      console.error('mountRef.current is not defined');
      return;
    }

    scene.current = new THREE.Scene();
    scene.current.background = new THREE.Color('#313354');  // Set the background color here

    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.current = new THREE.OrthographicCamera(-aspect * 200, aspect * 200, 200, -200, 0.1, 1000);
    camera.current.zoom = 12;
    camera.current.updateProjectionMatrix();

    renderer.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio); // Ensure high DPI rendering
    mountRef.current.appendChild(renderer.current.domElement);

    camera.current.position.z = 10;

    raycaster.current = new THREE.Raycaster();

    const loader = new OBJLoader();
    loader.load(
      '/hippocampus-portal-dev/data/3d/volume-selector-with-skeleton.obj',
      (obj) => {
        console.log('OBJ loaded successfully');

        const offset = 18;
        const obj1 = obj.clone();
        const obj2 = obj.clone();
        const obj3 = obj.clone();

        obj1Ref.current = obj1;
        obj2Ref.current = obj2;
        obj3Ref.current = obj3;

        obj1.position.set(-offset, 0, 0);
        obj2.position.set(0, 0, 0);
        obj3.position.set(offset, 0, 0);

        obj1.userData.volumeSection = 'region';
        obj2.userData.volumeSection = 'slice';
        obj3.userData.volumeSection = 'cylinder';

        const applyMaterial = (obj, index) => {
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              let material;

              if (
                (index === 0 && child.name === 'region') ||
                (index === 1 && child.name === 'slice') ||
                (index === 2 && child.name === 'cylinder')
              ) {
                // Apply initial material
                material = new THREE.MeshBasicMaterial({
                  color: theme[themeProp].default,
                  transparent: false,
                  opacity: 1,
                  depthWrite: true,
                });
                child.renderOrder = 2;

              } else if (child.name === 'skeleton') {
                // Skeleton's material
                material = new THREE.MeshBasicMaterial({
                  color: 0x000000,
                  transparent: true,
                  opacity: 0,
                  depthWrite: false,
                });

                const wireframeGeometry = new THREE.EdgesGeometry(child.geometry);
                const wireframeMaterial = new THREE.LineBasicMaterial({
                  color: theme[themeProp].default,
                  transparent: true,
                  opacity: 1,
                  depthWrite: false,
                });

                const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
                wireframe.renderOrder = 1; // Ensure wireframe renders below other objects
                child.add(wireframe);

              } else {
                child.visible = false;
              }

              // Only assign material if it has been defined
              if (material) {
                child.material = material;
              }
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
          const createText = (text, obj, childName) => {
            const textGeometry = new TextGeometry(text, {
              font: font,
              size: 0.8,
              height: 0.2,
              curveSegments: 32,
              bevelEnabled: true,
              bevelThickness: 0.02,
              bevelSize: 0.02,
            });

            const textMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: false,
              opacity: 1,
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            obj.traverse((child) => {
              if (child instanceof THREE.Mesh && child.name === childName) {
                textMesh.position.set(0, 0, 0);
                child.add(textMesh);
              }
            });
          };

          createText('Region', obj1, 'region');
          createText('Slice', obj2, 'slice');
          createText('Cylinder', obj3, 'cylinder');
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
      renderer.current!.render(scene.current!, camera.current!);
    };

    const handleResize = () => {
      if (mountRef.current && renderer.current && camera.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.current.setSize(width, height);

        const aspect = width / height;
        camera.current.left = -aspect * 200;
        camera.current.right = aspect * 200;
        camera.current.top = 200;
        camera.current.bottom = -200;
        camera.current.updateProjectionMatrix();
      }
    };

    const handleMouseMove = (event) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current!.setFromCamera(mouse.current, camera.current!);
      const intersects = raycaster.current!.intersectObjects([obj1Ref.current!, obj2Ref.current!, obj3Ref.current!], true);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (hoveredObjectRef.current !== intersectedObject) {
          hoveredObjectRef.current = intersectedObject;
          mountRef.current!.style.cursor = 'pointer';
        }
      } else {
        if (hoveredObjectRef.current) {
          hoveredObjectRef.current = null;
          mountRef.current!.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current!.removeEventListener('mousemove', handleMouseMove);
      mountRef.current!.removeEventListener('click', handleClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.current!.domElement);
      }
    };
  }, [themeProp]);

  return (
    <div className={styles.container}>
      <div className={styles.volumeSelector} ref={mountRef}></div>
      <div className={styles.volumeList}></div>
    </div>
  );
};

export default VolumeSectionSelector3D;
