import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Pre-allocated math helpers outside render loop (zero GC)
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  if (typeof document === 'undefined') {
    return { supported: false, isSoftwareGl: true };
  }
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl')) as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (!gl) return { supported: false, isSoftwareGl: true };

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftware = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftwareGl: isSoftware };
  } catch {
    return { supported: false, isSoftwareGl: true };
  }
}

export function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const { supported, isSoftwareGl } = detectSoftwareWebGL();
    if (!supported) {
      setFallbackMode(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallbackMode(true);
      return;
    }

    const isCompactViewport = window.innerWidth < 768;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isCompactViewport ? 1.5 : 2)
    );
    renderer.setClearColor(0x000000, 0);

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);

    // Procedural Studio Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // 3-Point Studio Lighting (Warm key + Cool Hemisphere + Electric/Purple Rim)
    const hemiLight = new THREE.HemisphereLight(0x8bb8ff, 0x101426, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 1.9);
    keyLight.position.set(4.5, 5, 5.5);
    scene.add(keyLight);

    const blueRimLight = new THREE.PointLight(0x1677ff, 18, 22, 2);
    blueRimLight.position.set(-4.2, 2.2, 2.4);
    scene.add(blueRimLight);

    const purpleRimLight = new THREE.PointLight(0x873bff, 18, 22, 2);
    purpleRimLight.position.set(4.0, -2.5, -2.0);
    scene.add(purpleRimLight);

    // Composite 9-Part Procedural Sculpture Group
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const disposables: Array<{ dispose: () => void }> = [envTarget];

    // 1. Primary Metallic Sculpted Core
    const coreGeo = new THREE.IcosahedronGeometry(1.06, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x101830,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      iridescence: 0.72,
      iridescenceIOR: 1.35,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sculpture.add(coreMesh);
    disposables.push(coreGeo, coreMat);

    // 2. Luminous Inner Energy Nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(0.62, 0);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x1677ff,
      emissive: 0x1677ff,
      emissiveIntensity: 1.6,
      metalness: 0.3,
      roughness: 0.35,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    sculpture.add(nucleusMesh);
    disposables.push(nucleusGeo, nucleusMat);

    // 3. Geodesic Wireframe Lattice
    const latticeBaseGeo = new THREE.IcosahedronGeometry(1.28, 1);
    const latticeEdgesGeo = new THREE.EdgesGeometry(latticeBaseGeo);
    latticeBaseGeo.dispose();
    const latticeMat = new THREE.LineBasicMaterial({
      color: 0x4ca1ff,
      transparent: true,
      opacity: 0.55,
    });
    const latticeLines = new THREE.LineSegments(latticeEdgesGeo, latticeMat);
    sculpture.add(latticeLines);
    disposables.push(latticeEdgesGeo, latticeMat);

    // 4. Optical Glass Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.44, 2);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8e6ff,
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.22 : 1,
      ior: 1.52,
      thickness: 0.8,
      attenuationColor: new THREE.Color(0x873bff),
      attenuationDistance: 2.2,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.renderOrder = 2;
    sculpture.add(shellMesh);
    disposables.push(shellGeo, shellMat);

    // 5-7. Three Orbital Gyroscope Rings
    const ringConfigs = [
      { radius: 1.88, tube: 0.024, color: 0x1677ff, emissive: 0x1677ff, rx: 0.95, ry: 0.35 },
      { radius: 2.12, tube: 0.018, color: 0x873bff, emissive: 0x873bff, rx: -0.7, ry: 0.85 },
      { radius: 2.34, tube: 0.014, color: 0x8fa8d6, emissive: 0x1677ff, rx: 0.25, ry: -1.1 },
    ];
    const rings: THREE.Mesh[] = [];
    ringConfigs.forEach((cfg) => {
      const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 120);
      const rMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.emissive,
        emissiveIntensity: 0.85,
        metalness: 0.85,
        roughness: 0.22,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.set(cfg.rx, cfg.ry, 0);
      sculpture.add(ring);
      rings.push(ring);
      disposables.push(rGeo, rMat);
    });

    // 8. Orbiting Geometric Satellites (4 nodes)
    const satGeo = new THREE.OctahedronGeometry(0.11, 0);
    const satMatBlue = new THREE.MeshStandardMaterial({
      color: 0x1677ff,
      emissive: 0x1677ff,
      emissiveIntensity: 1.2,
      metalness: 0.7,
      roughness: 0.2,
    });
    const satMatPurple = new THREE.MeshStandardMaterial({
      color: 0x873bff,
      emissive: 0x873bff,
      emissiveIntensity: 1.2,
      metalness: 0.7,
      roughness: 0.2,
    });
    disposables.push(satGeo, satMatBlue, satMatPurple);

    const satellites: Array<{ mesh: THREE.Mesh; radius: number; speed: number; phase: number; tilt: number }> = [];
    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(satGeo, i % 2 === 0 ? satMatBlue : satMatPurple);
      sculpture.add(sat);
      satellites.push({
        mesh: sat,
        radius: 1.9 + (i % 2) * 0.35,
        speed: 0.45 + i * 0.14,
        phase: (i * Math.PI) / 2,
        tilt: i % 2 === 0 ? 0.55 : -0.65,
      });
    }

    // 9. Instanced Particle Constellation
    const particleCount = isCompactViewport ? 75 : 165;
    const pGeo = new THREE.OctahedronGeometry(0.028, 0);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const particles = new THREE.InstancedMesh(pGeo, pMat, particleCount);
    particles.frustumCulled = false;

    const particleSeeds: Array<{ r: number; theta: number; phi: number; speed: number; scale: number }> = [];
    const palette = [0x1677ff, 0x873bff, 0xf5f7ff];

    for (let i = 0; i < particleCount; i++) {
      const r = 2.4 + Math.random() * 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.08 + Math.random() * 0.16;
      const scale = 0.55 + Math.random() * 0.95;

      particleSeeds.push({ r, theta, phi, speed, scale });

      _dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      particles.setMatrixAt(i, _dummy.matrix);

      _color.setHex(palette[i % palette.length]);
      particles.setColorAt(i, _color);
    }
    particles.instanceMatrix.needsUpdate = true;
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
    particles.computeBoundingSphere();
    scene.add(particles);
    disposables.push(pGeo, pMat);

    // Pre-warm shaders once on real GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer interaction target
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      if (reducedMotion) return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // WebGL Context Loss Handling
    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Animation loop with software WebGL pacing
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function updateScene(elapsed: number, delta: number) {
      if (!reducedMotion) {
        coreMesh.rotation.y += delta * 0.24;
        coreMesh.rotation.x += delta * 0.12;
        nucleusMesh.rotation.y -= delta * 0.45;
        latticeLines.rotation.y -= delta * 0.15;
        shellMesh.rotation.y += delta * 0.09;

        rings[0].rotation.z += delta * 0.32;
        rings[1].rotation.x += delta * 0.24;
        rings[2].rotation.y -= delta * 0.28;

        for (let i = 0; i < satellites.length; i++) {
          const s = satellites[i];
          const angle = elapsed * s.speed + s.phase;
          s.mesh.position.set(
            Math.cos(angle) * s.radius,
            Math.sin(angle) * s.radius * Math.sin(s.tilt),
            Math.sin(angle) * s.radius * Math.cos(s.tilt)
          );
          s.mesh.rotation.y += delta * 1.4;
        }

        for (let i = 0; i < particleSeeds.length; i++) {
          const seed = particleSeeds[i];
          const a = seed.theta + elapsed * seed.speed;
          _dummy.position.set(
            seed.r * Math.sin(seed.phi) * Math.cos(a),
            seed.r * Math.sin(seed.phi) * Math.sin(a) + Math.sin(elapsed * 0.8 + i) * 0.08,
            seed.r * Math.cos(seed.phi)
          );
          _dummy.scale.setScalar(seed.scale);
          _dummy.updateMatrix();
          particles.setMatrixAt(i, _dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;
      }

      // Smooth pointer-driven parallax tilt
      const targetRx = reducedMotion ? 0.12 : pointer.y * 0.28;
      const targetRy = reducedMotion ? 0.3 : pointer.x * 0.36;
      sculpture.rotation.x = THREE.MathUtils.damp(sculpture.rotation.x, targetRx, 4.5, delta);
      sculpture.rotation.y = THREE.MathUtils.damp(sculpture.rotation.y, targetRy, 4.5, delta);
    }

    function tick() {
      if (disposed) return;
      if (!contextLost) {
        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();
        updateScene(elapsed, delta);
        renderer.render(scene, camera);
      }

      if (reducedMotion) {
        // Render one static frame when reduced motion is enabled
        return;
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  if (fallbackMode) {
    return (
      <div
        className="relative flex h-full w-full items-center justify-center"
        aria-label="Futuristic geometric core illustration"
      >
        <div
          className="h-72 w-72 rounded-full opacity-35 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(22,119,255,0.65) 0%, rgba(135,59,255,0.45) 55%, transparent 75%)',
          }}
        />
        <svg viewBox="0 0 280 280" className="absolute h-72 w-72 sm:h-88 sm:w-88" aria-hidden="true">
          <defs>
            <linearGradient id="fallbackOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1677FF" />
              <stop offset="100%" stopColor="#873BFF" />
            </linearGradient>
          </defs>
          <circle cx="140" cy="140" r="108" fill="none" stroke="rgba(245,247,255,0.12)" strokeWidth="1" />
          <ellipse
            cx="140"
            cy="140"
            rx="124"
            ry="44"
            transform="rotate(-24 140 140)"
            fill="none"
            stroke="url(#fallbackOrbGrad)"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <ellipse
            cx="140"
            cy="140"
            rx="118"
            ry="38"
            transform="rotate(34 140 140)"
            fill="none"
            stroke="#873BFF"
            strokeWidth="1.2"
            opacity="0.55"
          />
          <polygon
            points="140,68 202,104 202,176 140,212 78,176 78,104"
            fill="rgba(16,20,38,0.8)"
            stroke="url(#fallbackOrbGrad)"
            strokeWidth="1.8"
          />
          <polygon
            points="140,94 180,117 180,163 140,186 100,163 100,117"
            fill="rgba(22,119,255,0.18)"
            stroke="#1677FF"
            strokeWidth="1"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={mountRef}
        className="h-full w-full"
        aria-label="Interactive 3D neural core visualization"
      />
    </div>
  );
}
