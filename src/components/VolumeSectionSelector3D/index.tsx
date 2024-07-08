import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { VolumeSection } from '@/types';
import { volumeSections } from '@/constants';

import styles from './styles.module.scss';

type VolumeSectionSelectProps = {
  value?: VolumeSection;
  onSelect?: (volumeSection: VolumeSection) => void;
};

const VolumeSectionSelector3D: React.FC<VolumeSectionSelectProps> = ({
  onSelect = () => { },
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedVolumeSection, setSelectedVolumeSection] = useState<VolumeSection | null>(null);
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(null);

  const camera = useRef<THREE.OrthographicCamera | null>(null);
  const scene = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      console.error('mountRef.current is not defined');
      return;
    }

    scene.current = new THREE.Scene();

    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.current = new THREE.OrthographicCamera(-aspect * 200, aspect * 200, 200, -200, 0.1, 1000);
    camera.current.zoom = 1.25;
    camera.current.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.current.position.z = 100;

    const loader = new OBJLoader();
    loader.load(
      '/hippocampus-portal-dev/data/3d/volume-selector2.obj',
      (obj) => {
        console.log('OBJ loaded successfully');

        const offset = 180;
        const obj1 = obj.clone();
        const obj2 = obj.clone();
        const obj3 = obj.clone();

        obj1.position.set(-offset, 0, 0);
        obj2.position.set(0, 0, 0);
        obj3.position.set(offset, 0, 0);

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
                  color: 0xff0000,
                  transparent: true,
                  opacity: 1,
                  depthWrite: false, // Prevents depth writing for transparent objects
                });
                child.renderOrder = 999; // Ensure opaque object is rendered on top
              } else {
                material = new THREE.MeshBasicMaterial({
                  color: 0x44405B,
                  transparent: true,
                  opacity: 0.1,
                  depthWrite: false, // Prevents depth writing for transparent objects
                });
                const wireframeGeometry = new THREE.EdgesGeometry(child.geometry);
                const wireframeMaterial = new THREE.LineBasicMaterial({
                  color: 0x0000ff,
                  transparent: true,
                  opacity: .5, // Adjust opacity as needed
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
      renderer.render(scene.current!, camera.current!);
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
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

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
          document.body.style.cursor = 'pointer';
        }
      } else {
        if (hoveredObject) {
          setHoveredObject(null);
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