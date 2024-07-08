import React, { useEffect, useRef } from 'react';
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
  value: currentVolumeSection,
  onSelect = () => { },
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) {
      console.error("mountRef.current is not defined");
      return;
    }

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    const camera = new THREE.OrthographicCamera(-aspect * 200, aspect * 200, 200, -200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    scene.background = new THREE.Color(0x313354);

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);


    camera.position.z = 100;
    camera.zoom = 1.25; // Zoom in a bit
    camera.updateProjectionMatrix();


    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight1.position.set(1, 1, 1).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, -1).normalize();
    scene.add(directionalLight2);

    // Load the OBJ file
    const loader = new OBJLoader();
    loader.load(
      '/hippocampus-portal-dev/data/3d/volume-selector.obj',
      (obj) => {
        console.log("OBJ loaded successfully");

        // Clone the OBJ and set positions
        const offset = 170;
        const obj1 = obj.clone();
        const obj2 = obj.clone();
        const obj3 = obj.clone();

        obj1.position.set(-offset, 0, 0);
        obj2.position.set(0, 0, 0);
        obj3.position.set(offset, 0, 0);

        [obj1, obj2, obj3].forEach((obj, index) => {
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
              child.userData.volumeSection = volumeSections[index];
            }
          });
          scene.add(obj);
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      if (mountRef.current && renderer && camera) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);

        const aspect = width / height;
        camera.left = -aspect * 200;
        camera.right = aspect * 200;
        camera.top = 200;
        camera.bottom = -200;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const selectVolumeSection = (volumeSection: VolumeSection): void => onSelect(volumeSection);

  const getClassName = (volumeSection) => {
    return `text-capitalize ${styles.volumeSection} ${volumeSection === currentVolumeSection ? styles.active : ''}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.volumeSelector} ref={mountRef}></div>
      <div className={styles.volumeList}>
        {volumeSections.map((volumeSection) => (
          <div
            key={volumeSection}
            className={getClassName(volumeSection)}
            onClick={() => selectVolumeSection(volumeSection)}
          >
            {volumeSection}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolumeSectionSelector3D;