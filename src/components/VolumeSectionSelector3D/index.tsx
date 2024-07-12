import React, { useEffect, useRef, useState } from 'react';
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
  const [selectedVolumeSection, setSelectedVolumeSection] = useState<VolumeSection | null>(null);
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);

  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const raycaster = useRef<THREE.Raycaster | null>(null);
  const mouse = useRef(new THREE.Vector2());

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

        const originalMaterials = [new Map(), new Map(), new Map()];

        const applyMaterial = (obj, index) => {
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              let material;
              let wireframeMaterial;
              let wireframe;

              if (
                (index === 0 && child.name === 'region') ||
                (index === 1 && child.name === 'slice') ||
                (index === 2 && child.name === 'cylinder')
              ) {
                // Store the original material
                const originalMaterial = new THREE.MeshBasicMaterial({
                  color: theme[themeProp].hover,
                  transparent: false,
                  opacity: 1,
                  depthWrite: true,
                });
                originalMaterials[index].set(child, originalMaterial);

                // Apply initial material
                material = originalMaterial;
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
                wireframeMaterial = new THREE.LineBasicMaterial({
                  color: theme[themeProp].default,
                  transparent: true,
                  opacity: 1,
                  depthWrite: false,
                });

                wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
                wireframe.renderOrder = 1; // Ensure wireframe renders below other objects
                child.add(wireframe);

              } else {
                child.visible = false;
              }

              // Only assign material if it has been defined
              if (material) {
                child.material = material;
              }

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

    const handleMouseMove = (event: MouseEvent) => {
      if (!raycaster.current || !camera.current || !mountRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera.current);

      if (obj1Ref.current && obj2Ref.current && obj3Ref.current) {
        const intersects = raycaster.current.intersectObjects([obj1Ref.current, obj2Ref.current, obj3Ref.current], true);

        if (intersects.length > 0) {
          const intersectedObject = intersects[0].object;
          if (intersectedObject !== hoveredObject) {
            if (hoveredObject) {
              // Reset previous hovered object's material
              hoveredObject.traverse((child: any) => {
                if (child instanceof THREE.Mesh && child.name !== 'skeleton') {
                  const index = [obj1Ref.current, obj2Ref.current, obj3Ref.current].indexOf(hoveredObject);
                  child.material = originalMaterials[index].get(child);
                }
              });
            }
            // Set new hovered object's material
            intersectedObject.traverse((child: any) => {
              if (child instanceof THREE.Mesh && child.name !== 'skeleton') {
                child.material = new THREE.MeshBasicMaterial({
                  color: 0xff0000, // Red color
                  transparent: false,
                  opacity: 1,
                  depthWrite: true,
                });
              }
            });
            setHoveredObject(intersectedObject);
            mountRef.current!.style.cursor = 'pointer';
          }
        } else {
          if (hoveredObject) {
            // Reset previous hovered object's material
            hoveredObject.traverse((child: any) => {
              if (child instanceof THREE.Mesh && child.name !== 'skeleton') {
                const index = [obj1Ref.current, obj2Ref.current, obj3Ref.current].indexOf(hoveredObject);
                child.material = originalMaterials[index].get(child);
              }
            });
            setHoveredObject(null);
            mountRef.current!.style.cursor = 'auto';
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    mountRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeEventListener('mousemove', handleMouseMove);
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
