import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import { VolumeSection } from '@/types';
import { volumeSections, theme } from '@/constants';

import { basePath } from '@/config';

import styles from './styles.module.scss';

type VolumeSectionSelectProps = {
  value?: VolumeSection | string;
  onSelect?: (volumeSection: VolumeSection) => void;
  theme?: number;
};

const VolumeSectionSelector3D: React.FC<VolumeSectionSelectProps> = ({
  value = 'region',
  onSelect = () => { },
  theme: themeProp = 2,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoveredObjectRef = useRef<THREE.Object3D | null>(null);
  const selectedVolumeSectionRef = useRef<VolumeSection>(value as VolumeSection);
  const selectedObjectRef = useRef<THREE.Object3D | null>(null);

  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const raycaster = useRef<THREE.Raycaster | null>(null);
  const mouse = useRef(new THREE.Vector2());

  const obj1Ref = useRef<THREE.Object3D | null>(null);
  const obj2Ref = useRef<THREE.Object3D | null>(null);
  const obj3Ref = useRef<THREE.Object3D | null>(null);

  const objectsLoadedRef = useRef(false);

  const handleClick = useCallback(
    (event) => {
      if (!objectsLoadedRef.current) return;

      const rect = mountRef.current!.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current!.setFromCamera(mouse.current, camera.current!);
      const intersects = raycaster.current!.intersectObjects([obj1Ref.current!, obj2Ref.current!, obj3Ref.current!], true);

      if (intersects.length > 0) {
        let intersectedObject = intersects[0].object;
        while (intersectedObject.parent && ![obj1Ref.current, obj2Ref.current, obj3Ref.current].includes(intersectedObject)) {
          intersectedObject = intersectedObject.parent;
        }

        if ([obj1Ref.current, obj2Ref.current, obj3Ref.current].includes(intersectedObject)) {
          const volumeSection = intersectedObject.userData.volumeSection as VolumeSection;
          if (volumeSection) {
            updateSelection(volumeSection, intersectedObject);
            onSelect(volumeSection);
          }
        }
      }
    },
    [onSelect, themeProp]
  );

  const updateSelection = (newVolumeSection: VolumeSection, newSelectedObject: THREE.Object3D) => {
    if (selectedObjectRef.current) {
      updateObjectColors(selectedObjectRef.current, theme[themeProp].default, theme[themeProp].hover);
    }

    updateObjectColors(newSelectedObject, theme[themeProp].selected, 0xffffff);

    selectedVolumeSectionRef.current = newVolumeSection;
    selectedObjectRef.current = newSelectedObject;
  };

  const updateObjectColors = (object: THREE.Object3D, mainColor: number, textColor: number) => {
    object.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === object.userData.volumeSection) {
          child.material.color.set(mainColor);
        }
        if (child.geometry && child.geometry.type === 'TextGeometry') {
          child.material.color.set(textColor);
        }
      }
    });
  };

  useEffect(() => {
    if (!mountRef.current) return;

    scene.current = new THREE.Scene();
    scene.current.background = new THREE.Color('#313354');

    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.current = new THREE.OrthographicCamera(-aspect * 200, aspect * 200, 200, -200, 0.1, 1000);
    camera.current.zoom = 16;
    camera.current.updateProjectionMatrix();

    renderer.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.current.domElement);

    camera.current.position.z = 10;

    raycaster.current = new THREE.Raycaster();

    const loader = new OBJLoader();
    loader.load(
      basePath + '/resources/3d/volume-selector/volume-selector.obj',
      (obj) => {
        const offset = 20;
        [obj1Ref, obj2Ref, obj3Ref].forEach((ref, index) => {
          const newObj = obj.clone();
          ref.current = newObj;
          newObj.position.set((index - 1) * offset, 0, 0);
          newObj.userData.volumeSection = ['region', 'slice', 'cylinder'][index];
          applyMaterial(newObj, index);
          scene.current!.add(newObj);
        });

        const fontLoader = new FontLoader();
        fontLoader.load('/hippocampus-portal-dev/assets/fonts/Titillium_Web_Light_.json', (font) => {
          ['Region', 'Slice', 'Cylinder'].forEach((text, index) => {
            createText(text, [obj1Ref, obj2Ref, obj3Ref][index].current!, text.toLowerCase(), font);
          });
        });

        objectsLoadedRef.current = true;

        if (value) {
          setInitialSelection(value as VolumeSection);
        }

        animate();
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
      (error) => console.error('An error happened', error)
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
      if (!objectsLoadedRef.current) return;

      const rect = mountRef.current!.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current!.setFromCamera(mouse.current, camera.current!);
      const intersects = raycaster.current!.intersectObjects([obj1Ref.current!, obj2Ref.current!, obj3Ref.current!], true);

      if (intersects.length > 0) {
        let intersectedObject = intersects[0].object;
        while (intersectedObject.parent && ![obj1Ref.current, obj2Ref.current, obj3Ref.current].includes(intersectedObject)) {
          intersectedObject = intersectedObject.parent;
        }

        if (hoveredObjectRef.current !== intersectedObject && selectedObjectRef.current !== intersectedObject) {
          if (hoveredObjectRef.current && hoveredObjectRef.current !== selectedObjectRef.current) {
            updateObjectColors(hoveredObjectRef.current, theme[themeProp].default, theme[themeProp].hover);
          }

          updateObjectColors(intersectedObject, theme[themeProp].hover, theme[themeProp].hover);

          hoveredObjectRef.current = intersectedObject;
          mountRef.current!.style.cursor = 'pointer';
        }
      } else {
        if (hoveredObjectRef.current && hoveredObjectRef.current !== selectedObjectRef.current) {
          updateObjectColors(hoveredObjectRef.current, theme[themeProp].default, theme[themeProp].hover);
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
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('click', handleClick);
        mountRef.current.removeChild(renderer.current!.domElement);
      }
    };
  }, [themeProp]);

  useEffect(() => {
    if (objectsLoadedRef.current && value) {
      setInitialSelection(value as VolumeSection);
    }
  }, [value, themeProp]);

  const applyMaterial = (obj: THREE.Object3D, index: number) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        let material;
        if (child.name === obj.userData.volumeSection) {
          material = new THREE.MeshBasicMaterial({
            color: theme[themeProp].default,
            transparent: false,
            opacity: 1,
            depthWrite: true,
          });
          child.renderOrder = 2;
        } else if (child.name === 'skeleton') {
          material = new THREE.MeshBasicMaterial({
            color: theme[themeProp].selectedEdges,
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
          wireframe.renderOrder = 1;
          child.add(wireframe);
        } else {
          child.visible = false;
        }
        if (material) {
          child.material = material;
        }
      }
    });
  };

  const createText = (text: string, obj: THREE.Object3D, childName: string, font: THREE.Font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.8,
      height: 0.2,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
    });

    const textMaterialColor = selectedVolumeSectionRef.current === childName ? 0xffffff : theme[themeProp].hover;

    const textMaterial = new THREE.MeshBasicMaterial({
      color: textMaterialColor,
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

  const setInitialSelection = (initialVolumeSection: VolumeSection) => {
    const initialObjectRef = [obj1Ref, obj2Ref, obj3Ref].find(
      (ref) => ref.current?.userData.volumeSection === initialVolumeSection
    );

    if (initialObjectRef?.current) {
      updateSelection(initialVolumeSection, initialObjectRef.current);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.volumeSelector} ref={mountRef}></div>
      <div className={styles.volumeList}></div>
    </div>
  );
};

export default VolumeSectionSelector3D;