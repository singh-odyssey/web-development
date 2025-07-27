// Three.js Animation for Hero Section
document.addEventListener('DOMContentLoaded', function() {
    // Check if the canvas exists
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Initialize Three.js scene
    let scene, camera, renderer, particles, geometry;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let particleSystem;
    let raycaster, mouse;
    let clock;
    
    // Set up window dimensions
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    // Initialize the 3D scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        
        // Set up camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        
        // Initialize raycaster for mouse interaction
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        clock = new THREE.Clock();
        
        // Create particle geometry
        geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const color = new THREE.Color();
        const sizes = [];
        const initialPositions = []; // Store initial positions for animation
        
        // Create particles
        const numParticles = 2000; // Increased particle count
        const spread = 1000;
        
        for (let i = 0; i < numParticles; i++) {
            // Position
            const x = Math.random() * spread - spread/2;
            const y = Math.random() * spread - spread/2;
            const z = Math.random() * spread - spread/2;
            
            vertices.push(x, y, z);
            initialPositions.push(x, y, z); // Store initial position
            
            // Randomize sizes for more dynamic effect
            sizes.push(Math.random() * 5 + 2);
            
            // Color - use a more vibrant gradient palette
            let h = Math.random(); // Hue
            let s = 0.5 + Math.random() * 0.5; // Saturation
            let l = 0.5 + Math.random() * 0.5; // Lightness
            
            color.setHSL(h, s, l);
            colors.push(color.r, color.g, color.b);
        }
        
        // Set attributes
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('initialPosition', new THREE.Float32BufferAttribute(initialPositions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        // Create custom shader material for more control and effects
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                mousePosition: { value: new THREE.Vector3() },
                pixelRatio: { value: window.devicePixelRatio },
                cursorStrength: { value: 0.3 }
            },
            vertexShader: `
                attribute vec3 initialPosition;
                attribute float size;
                attribute vec3 color;
                uniform float time;
                uniform float pixelRatio;
                uniform vec3 mousePosition;
                uniform float cursorStrength;
                varying vec3 vColor;
                
                // Simplex noise function for more natural movement
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                
                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                    
                    vec3 i  = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;
                    
                    i = mod289(i);
                    vec4 p = permute(permute(permute(
                               i.z + vec4(0.0, i1.z, i2.z, 1.0))
                             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                             
                    float n_ = 0.142857142857;
                    vec3 ns = n_ * D.wyz - D.xzx;
                    
                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                    
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_);
                    
                    vec4 x = x_ *ns.x + ns.yyyy;
                    vec4 y = y_ *ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);
                    
                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);
                    
                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    
                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                    
                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);
                    
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                }
                
                void main() {
                    // Calculate distance to mouse for attraction effect
                    vec3 particlePosition = initialPosition;
                    
                    // Add flowing animation based on noise
                    float noiseScale = 0.05;
                    float noiseTime = time * 0.5;
                    float noise = snoise(vec3(
                        initialPosition.x * noiseScale, 
                        initialPosition.y * noiseScale, 
                        noiseTime
                    )) * 30.0;
                    
                    // Calculate distance to cursor
                    vec3 toMouse = mousePosition - initialPosition;
                    float distToMouse = length(toMouse);
                    float mouseInfluence = 1.0 - min(1.0, distToMouse / 300.0);
                    
                    // Attract particles toward mouse position
                    if (mouseInfluence > 0.0) {
                        vec3 dirToMouse = normalize(toMouse);
                        particlePosition += dirToMouse * mouseInfluence * 80.0 * cursorStrength;
                    }
                    
                    // Add organic movement
                    particlePosition.x += sin(time * 0.5 + initialPosition.y * 0.02) * 10.0;
                    particlePosition.y += cos(time * 0.6 + initialPosition.x * 0.02) * 10.0;
                    particlePosition.z += noise;
                    
                    // Set the final position
                    vec4 mvPosition = modelViewMatrix * vec4(particlePosition, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    // Set the point size with distance attenuation
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    
                    // Pulse size based on mouse proximity
                    gl_PointSize *= 1.0 + mouseInfluence * 1.5 * sin(time * 5.0);
                    
                    // Pass color to fragment shader
                    vColor = color;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Create a circular particle
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(gl_PointCoord, center);
                    float circle = smoothstep(0.5, 0.4, dist);
                    
                    // Apply glowing effect
                    vec3 finalColor = vColor * 1.2; // Brighten for glow
                    
                    gl_FragColor = vec4(finalColor, circle);
                    
                    // Apply additional glow at the edges
                    if (dist > 0.4 && dist < 0.5) {
                        gl_FragColor.a *= (1.0 - (dist - 0.4) / 0.1); // Fade alpha at edges
                        gl_FragColor.rgb *= 1.5; // Brighter edge glow
                    }
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        // Create particles system
        particleSystem = new THREE.Points(geometry, particleMaterial);
        scene.add(particleSystem);
        
        // Set up renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add event listeners
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
    }
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update shader uniforms
        if (particleSystem && particleSystem.material.uniforms) {
            particleSystem.material.uniforms.pixelRatio.value = window.devicePixelRatio;
        }
    }
    
    function onDocumentMouseMove(event) {
        // Get normalized mouse coordinates (-1 to 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update mouseX and mouseY for camera movement
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
        
        // Update target mouse position for particle attraction
        // Convert 2D mouse position to 3D space
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        
        // Update shader uniform with mouse position
        if (particleSystem && particleSystem.material.uniforms) {
            particleSystem.material.uniforms.mousePosition.value = pos;
        }
    }
    
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
    
    function render() {
        const time = clock.getElapsedTime();
        
        // Update shader time uniform
        if (particleSystem && particleSystem.material.uniforms) {
            particleSystem.material.uniforms.time.value = time;
            
            // Create a pulsing cursor effect
            const pulseStrength = (Math.sin(time * 2) * 0.25) + 0.75;
            particleSystem.material.uniforms.cursorStrength.value = pulseStrength;
        }
        
        // Gently rotate the entire scene
        if (particleSystem) {
            particleSystem.rotation.y += 0.0005;
            particleSystem.rotation.x += 0.0002;
        }
        
        // Move camera based on mouse position for parallax effect
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Render the scene
        renderer.render(scene, camera);
    }
    
    // Initialize and start animation
    init();
    animate();

    // Create another 3D object - A floating torus
    function addFloatingTorus() {
        const torusGeometry = new THREE.TorusKnotGeometry(100, 30, 128, 32);
        
        // Create custom shader material for a more impressive look
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() },
                mousePosition: { value: new THREE.Vector3() }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                uniform vec3 mousePosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    
                    // Calculate distance to mouse position
                    vec3 toMouse = mousePosition - position;
                    float distToMouse = length(toMouse);
                    float mouseInfluence = 1.0 - min(1.0, distToMouse / 300.0);
                    
                    // Apply vertex displacement based on time and mouse
                    float displacementHeight = sin(position.x * 0.05 + time) * 5.0;
                    displacementHeight += sin(position.y * 0.05 + time) * 5.0;
                    displacementHeight += sin(position.z * 0.05 + time) * 5.0;
                    
                    // Add mouse influence to displacement
                    if (mouseInfluence > 0.0) {
                        vec3 direction = normalize(toMouse);
                        displacementHeight += mouseInfluence * 20.0 * sin(time * 5.0);
                    }
                    
                    vec3 displaced = position + normal * displacementHeight;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                uniform vec3 mousePosition;
                
                // Function to create an electric/energy effect
                vec3 electricEffect(vec3 baseColor, float intensity) {
                    // Create electric patterns using noise-like functions
                    float pattern = sin(vPosition.x * 10.0 + time * 3.0) * 
                                   cos(vPosition.y * 10.0 + time * 2.0) * 
                                   sin(vPosition.z * 10.0 + time * 4.0);
                    
                    // Make the pattern sharper for an electric look
                    pattern = smoothstep(0.1, 0.9, pattern);
                    
                    // Create electric color (blue-white)
                    vec3 electricColor = mix(
                        vec3(0.3, 0.4, 1.0),  // Deep blue
                        vec3(1.0, 1.0, 1.0),  // White
                        pattern
                    );
                    
                    // Mix with base color based on intensity
                    return mix(baseColor, electricColor, intensity * pattern);
                }
                
                void main() {
                    // Calculate distance to mouse for highlight effect
                    vec3 toMouse = mousePosition - vPosition;
                    float distToMouse = length(toMouse);
                    float mouseInfluence = 1.0 - min(1.0, distToMouse / 300.0);
                    
                    // Create base colors
                    vec3 color1 = vec3(0.42, 0.36, 0.90); // Primary color
                    vec3 color2 = vec3(0.93, 0.47, 0.67); // Accent color
                    
                    // Create dynamic gradient based on position and time
                    float noise = sin(vPosition.x * 0.05 + time) * 0.5 + 0.5;
                    noise *= sin(vPosition.y * 0.05 + time) * 0.5 + 0.5;
                    noise *= sin(vPosition.z * 0.05 + time) * 0.5 + 0.5;
                    
                    // Calculate edge glow (fresnel effect)
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnel = pow(1.0 - max(0.0, dot(viewDirection, vNormal)), 3.0);
                    
                    // Create base color with gradient
                    vec3 baseColor = mix(color1, color2, noise);
                    
                    // Add electric effect with mouse influence
                    vec3 finalColor = electricEffect(baseColor, 0.7 + mouseInfluence * 0.3);
                    
                    // Add fresnel glow
                    finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), fresnel * 0.5);
                    
                    // Add pulsing glow based on time
                    float pulse = sin(time * 2.0) * 0.1 + 0.9;
                    finalColor *= pulse;
                    
                    // Enhance colors near mouse
                    if (mouseInfluence > 0.0) {
                        finalColor = mix(finalColor, vec3(1.0, 0.8, 1.0), mouseInfluence * 0.5);
                    }
                    
                    // Final color with transparency
                    gl_FragColor = vec4(finalColor, 0.8); 
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const torus = new THREE.Mesh(torusGeometry, material);
        torus.position.set(0, 0, -200);
        scene.add(torus);
        
        // Update the torus in the animation loop
        const updateTorus = function() {
            material.uniforms.time.value = clock.getElapsedTime();
            material.uniforms.mousePosition.value = particleSystem.material.uniforms.mousePosition.value;
            
            torus.rotation.x += 0.003;
            torus.rotation.y += 0.005;
            torus.rotation.z += 0.001;
        };
        
        // Add the update function to the animation loop
        const originalRender = render;
        render = function() {
            updateTorus();
            originalRender();
        };
    }
    
    // Add additional 3D objects after a delay to create an impressive effect
    setTimeout(addFloatingTorus, 1000);
    
    // Add post-processing effects if available
    if (THREE.EffectComposer) {
        let composer;
        
        function setupPostProcessing() {
            composer = new THREE.EffectComposer(renderer);
            
            const renderPass = new THREE.RenderPass(scene, camera);
            composer.addPass(renderPass);
            
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                1.5,  // strength
                0.4,  // radius
                0.85  // threshold
            );
            composer.addPass(bloomPass);
            
            // Replace renderer with composer in the animation loop
            render = function() {
                const time = Date.now() * 0.0001;
                
                particles.rotation.x += 0.0005;
                particles.rotation.y += 0.001;
                
                camera.position.x += (mouseX - camera.position.x) * 0.05;
                camera.position.y += (-mouseY - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                
                const positions = geometry.attributes.position.array;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    const y = positions[i + 1];
                    const z = positions[i + 2];
                    
                    positions[i + 2] = z + Math.sin((x / 50) + time) * 10 + Math.sin((y / 50) + time) * 10;
                }
                
                geometry.attributes.position.needsUpdate = true;
                
                composer.render();
            };
        }
        
        // Load post-processing if available
        if (THREE.RenderPass && THREE.UnrealBloomPass) {
            setupPostProcessing();
        }
    }
});
