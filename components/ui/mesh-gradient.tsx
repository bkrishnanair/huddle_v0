"use client"

import React, { useEffect, useRef, useMemo } from 'react';

// Helper to convert HSL to RGB
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const parseHsl = (hsl: string): [number, number, number] => {
    if (!hsl) return [0, 0, 0];
    const regex = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/;
    const match = hsl.match(regex);
    if (match) {
        return [parseInt(match[1]) / 360, parseInt(match[2]) / 100, parseInt(match[3]) / 100];
    }
    return [0, 0, 0];
};


const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_colors[4];
  uniform float u_distortion;
  uniform float u_swirl;
  uniform float u_speed;

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
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * u_speed * 0.1;

    float swirl = u_swirl * sin(t);
    vec2 p = uv - 0.5;
    p = p * mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl));
    p += 0.5;

    float n = snoise(vec3(p * u_distortion, t));
    
    vec3 color1 = u_colors[0];
    vec3 color2 = u_colors[1];
    vec3 color3 = u_colors[2];
    vec3 color4 = u_colors[3];

    vec3 c1 = mix(color1, color2, smoothstep(0.0, 0.5, p.x + n * 0.1));
    vec3 c2 = mix(color3, color4, smoothstep(0.0, 0.5, p.y - n * 0.1));

    gl_FragColor = vec4(mix(c1, c2, 0.5), 1.0);
  }
`;

interface MeshGradientProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
    colors?: string[];
    distortion?: number;
    swirl?: number;
    speed?: number;
}

export const MeshGradient: React.FC<MeshGradientProps> = ({
    colors = ["hsl(216, 90%, 27%)", "hsl(243, 68%, 36%)", "hsl(205, 91%, 64%)", "hsl(211, 61%, 57%)"],
    distortion = 0.8,
    swirl = 0.1,
    speed = 1,
    ...props
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const animationFrameId = useRef<number>(0);

    const parsedColors = useMemo(() => {
        return colors.map(c => hslToRgb(...parseHsl(c)).map(val => val / 255));
    }, [colors]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        glRef.current = gl;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (vertexShader) {
            gl.shaderSource(vertexShader, vertexShaderSource);
            gl.compileShader(vertexShader);
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (fragmentShader) {
            gl.shaderSource(fragmentShader, fragmentShaderSource);
            gl.compileShader(fragmentShader);
        }

        const program = gl.createProgram();
        if (program && vertexShader && fragmentShader) {
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            programRef.current = program;
        }

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(program!, 'position');
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const render = (time: number) => {
            const u_time = gl.getUniformLocation(program!, 'u_time');
            gl.uniform1f(u_time, time * 0.001);

            animationFrameId.current = requestAnimationFrame(render);
        };
        animationFrameId.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    useEffect(() => {
        const gl = glRef.current;
        const program = programRef.current;
        const canvas = canvasRef.current;
        if (!gl || !program || !canvas) return;

        const resize = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            const u_resolution = gl.getUniformLocation(program, 'u_resolution');
            gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        
        const u_colors = gl.getUniformLocation(program, 'u_colors');
        const flattenedColors = parsedColors.flat();
        gl.uniform3fv(u_colors, flattenedColors);
        
        const u_distortion = gl.getUniformLocation(program, 'u_distortion');
        gl.uniform1f(u_distortion, distortion);
        
        const u_swirl = gl.getUniformLocation(program, 'u_swirl');
        gl.uniform1f(u_swirl, swirl);

        const u_speed = gl.getUniformLocation(program, 'u_speed');
        gl.uniform1f(u_speed, speed);

        return () => {
            resizeObserver.disconnect();
        };

    }, [parsedColors, distortion, swirl, speed]);

    return <canvas ref={canvasRef} {...props} />;
};
