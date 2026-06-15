// Stripe-like animated gradient shader — pure WebGL recreation of GradFlow
// Config: white, cyan/teal, purple with stripe pattern and noise
window.initGradientShader = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        // Fallback: CSS gradient for browsers without WebGL
        canvas.style.background = 'linear-gradient(135deg, #0b1121, #1E9FE0, #122656)';
        return;
    }

    // Vertex shader
    const vertexSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    // Fragment shader — stripe gradient with noise
    const fragmentSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;

        // Simplex-like noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                               -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                dot(x12.zw,x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution;

            // Colors matching site brand palette
            vec3 color1 = vec3(0.043, 0.067, 0.129);      // #0b1121 deep navy
            vec3 color2 = vec3(0.118, 0.624, 0.878);       // #1E9FE0 brand blue
            vec3 color3 = vec3(0.071, 0.149, 0.337);       // #122656 dark blue

            // Stripe pattern with animation
            float speed = 0.4;
            float t = u_time * speed;

            // Diagonal stripe coordinates
            float stripeCoord = uv.x * 2.0 + uv.y * 1.5 + t * 0.3;

            // Add noise for organic feel
            float noise = snoise(vec2(uv.x * 3.0 + t * 0.1, uv.y * 3.0 - t * 0.05)) * 0.08;

            // Create smooth stripe transitions
            float stripe1 = smoothstep(0.0, 0.5, sin(stripeCoord * 3.14159 + noise * 10.0) * 0.5 + 0.5);
            float stripe2 = smoothstep(0.0, 0.5, sin(stripeCoord * 3.14159 * 0.7 + 1.5 + noise * 8.0) * 0.5 + 0.5);

            // Mix colors with stripes
            vec3 col = mix(color1, color2, stripe1);
            col = mix(col, color3, stripe2 * 0.6);

            // Subtle brightness variation
            col += snoise(uv * 5.0 + t * 0.2) * 0.03;

            gl_FragColor = vec4(col, 1.0);
        }
    `;

    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program error:', gl.getProgramInfoLog(program));
        return;
    }

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();

    let startTime = performance.now();
    let animId;

    function render() {
        const elapsed = (performance.now() - startTime) / 1000;

        gl.useProgram(program);
        gl.enableVertexAttribArray(posLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animId = requestAnimationFrame(render);
    }

    render();

    // Cleanup handler
    window._gradientShaderCleanup = () => {
        cancelAnimationFrame(animId);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(buffer);
    };
};
