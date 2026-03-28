"use client";

import { useEffect, useRef } from "react";

interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

type Uniforms = {
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  move: WebGLUniformLocation | null;
  touch: WebGLUniformLocation | null;
  pointerCount: WebGLUniformLocation | null;
  pointers: WebGLUniformLocation | null;
};

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private uniforms: Uniforms | null = null;
  private scale: number;
  private shaderSource: string;
  private mouseMove = [0, 0];
  private mouseCoords = [0, 0];
  private pointerCoords = [0, 0];
  private pointerCount = 0;

  private readonly vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  constructor(canvas: HTMLCanvasElement, scale: number, shaderSource: string) {
    this.canvas = canvas;
    this.scale = scale;
    this.shaderSource = shaderSource;
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: false });
    if (!gl) {
      throw new Error("WebGL2 is not available");
    }
    this.gl = gl;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  updateShader(source: string) {
    this.reset();
    this.shaderSource = source;
    this.setup();
    this.init();
  }

  updateMove(deltas: number[]) {
    this.mouseMove = [deltas[0] ?? 0, deltas[1] ?? 0];
  }

  updateMouse(coords: number[]) {
    this.mouseCoords = [coords[0] ?? 0, coords[1] ?? 0];
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords.length > 1 ? coords : [0, 0];
  }

  updatePointerCount(count: number) {
    this.pointerCount = count;
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      throw new Error(`Shader compilation error: ${error ?? "unknown"}`);
    }
  }

  test(source: string) {
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!shader) {
      return "Failed to allocate fragment shader";
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let result: string | null = null;
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader);
    }

    gl.deleteShader(shader);
    return result;
  }

  reset() {
    const gl = this.gl;

    if (this.program) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs);
        gl.deleteShader(this.vs);
      }

      if (this.fs) {
        gl.detachShader(this.program, this.fs);
        gl.deleteShader(this.fs);
      }

      gl.deleteProgram(this.program);
    }

    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
    }

    this.vs = null;
    this.fs = null;
    this.program = null;
    this.buffer = null;
    this.uniforms = null;
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);

    if (!this.vs || !this.fs) {
      throw new Error("Failed to create shader objects");
    }

    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);

    this.program = gl.createProgram();
    if (!this.program) {
      throw new Error("Failed to create WebGL program");
    }

    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(this.program);
      throw new Error(`Program link error: ${error ?? "unknown"}`);
    }
  }

  init() {
    const gl = this.gl;
    const program = this.program;

    if (!program) {
      return;
    }

    this.buffer = gl.createBuffer();
    if (!this.buffer) {
      throw new Error("Failed to create vertex buffer");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    this.uniforms = {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      move: gl.getUniformLocation(program, "move"),
      touch: gl.getUniformLocation(program, "touch"),
      pointerCount: gl.getUniformLocation(program, "pointerCount"),
      pointers: gl.getUniformLocation(program, "pointers"),
    };
  }

  render(now = 0) {
    const gl = this.gl;
    const program = this.program;
    const uniforms = this.uniforms;

    if (!program || !uniforms) {
      return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.uniform2f(uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(uniforms.time, now * 1e-3);
    gl.uniform2f(uniforms.move, this.mouseMove[0], this.mouseMove[1]);
    gl.uniform2f(uniforms.touch, this.mouseCoords[0], this.mouseCoords[1]);
    gl.uniform1i(uniforms.pointerCount, this.pointerCount);
    gl.uniform2fv(uniforms.pointers, this.pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class PointerHandler {
  private scale: number;
  private active = false;
  private pointers = new Map<number, number[]>();
  private lastCoords = [0, 0];
  private moves = [0, 0];

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale;

    const map = (x: number, y: number) => {
      const rect = element.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;
      return [localX * this.getScale(), (rect.height - localY) * this.getScale()];
    };

    element.addEventListener("pointerdown", (event) => {
      this.active = true;
      this.pointers.set(event.pointerId, map(event.clientX, event.clientY));
    });

    element.addEventListener("pointerup", (event) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(event.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener("pointerleave", (event) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(event.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener("pointermove", (event) => {
      if (!this.active) {
        return;
      }
      this.lastCoords = [event.clientX, event.clientY];
      this.pointers.set(event.pointerId, map(event.clientX, event.clientY));
      this.moves = [this.moves[0] + event.movementX, this.moves[1] + event.movementY];
    });
  }

  getScale() {
    return this.scale;
  }

  updateScale(scale: number) {
    this.scale = scale;
  }

  get count() {
    return this.pointers.size;
  }

  get move() {
    return this.moves;
  }

  get coords() {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0];
  }

  get first() {
    return this.pointers.values().next().value ?? this.lastCoords;
  }
}

const useShaderBackground = (shaderSource = defaultShaderSource) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const pointersRef = useRef<PointerHandler | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const resize = () => {
      if (!canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio));
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      rendererRef.current?.updateScale(dpr);
      pointersRef.current?.updateScale(dpr);
    };

    let resizeObserver: ResizeObserver | null = null;

    try {
      rendererRef.current = new WebGLRenderer(canvas, Math.max(1, window.devicePixelRatio), shaderSource);
      pointersRef.current = new PointerHandler(canvas, Math.max(1, window.devicePixelRatio));
      rendererRef.current.setup();
      rendererRef.current.init();

      if (rendererRef.current.test(shaderSource) === null) {
        rendererRef.current.updateShader(shaderSource);
      }
    } catch {
      return;
    }

    const loop = (now: number) => {
      if (!rendererRef.current || !pointersRef.current) {
        return;
      }

      rendererRef.current.updateMouse(pointersRef.current.first);
      rendererRef.current.updatePointerCount(pointersRef.current.count);
      rendererRef.current.updatePointerCoords(pointersRef.current.coords);
      rendererRef.current.updateMove(pointersRef.current.move);
      rendererRef.current.render(now);
      animationFrameRef.current = window.requestAnimationFrame(loop);
    };

    resize();
    animationFrameRef.current = window.requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
    }

    return () => {
      window.removeEventListener("resize", resize);
      resizeObserver?.disconnect();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      rendererRef.current?.reset();
      rendererRef.current = null;
      pointersRef.current = null;
    };
  }, [shaderSource]);

  return canvasRef;
};

export function AnimatedShaderBackground({ className = "" }: { className?: string }) {
  const canvasRef = useShaderBackground();

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full touch-none ${className}`}
      style={{ background: "black" }}
      aria-hidden
    />
  );
}

export function AnimatedShaderHero({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = "",
}: HeroProps) {
  const toneClasses = ["text-yellow-300", "text-orange-300", "text-amber-300"];

  return (
    <div className={`relative h-screen w-full overflow-hidden bg-black ${className}`}>
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>

      <AnimatedShaderBackground />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        {trustBadge ? (
          <div className="mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-500/10 px-6 py-3 text-sm backdrop-blur-md">
              {trustBadge.icons && trustBadge.icons.length > 0 ? (
                <div className="flex">
                  {trustBadge.icons.map((icon, index) => (
                    <span key={`${icon}-${index}`} className={toneClasses[index] ?? "text-orange-200"}>
                      {icon}
                    </span>
                  ))}
                </div>
              ) : null}
              <span className="text-orange-100">{trustBadge.text}</span>
            </div>
          </div>
        ) : null}

        <div className="mx-auto max-w-5xl space-y-6 px-4 text-center">
          <div className="space-y-2">
            <h1 className="animate-fade-in-up animation-delay-200 bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-5xl font-bold text-transparent md:text-7xl lg:text-8xl">
              {headline.line1}
            </h1>
            <h1 className="animate-fade-in-up animation-delay-400 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-5xl font-bold text-transparent md:text-7xl lg:text-8xl">
              {headline.line2}
            </h1>
          </div>

          <div className="mx-auto max-w-3xl animate-fade-in-up animation-delay-600">
            <p className="text-lg font-light leading-relaxed text-orange-100/90 md:text-xl lg:text-2xl">{subtitle}</p>
          </div>

          {buttons ? (
            <div className="animation-delay-800 mt-10 flex animate-fade-in-up flex-col justify-center gap-4 sm:flex-row">
              {buttons.primary ? (
                <button
                  type="button"
                  onClick={buttons.primary.onClick}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-yellow-600 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  {buttons.primary.text}
                </button>
              ) : null}
              {buttons.secondary ? (
                <button
                  type="button"
                  onClick={buttons.secondary.onClick}
                  className="rounded-full border border-orange-300/30 bg-orange-500/10 px-8 py-4 text-lg font-semibold text-orange-100 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-orange-300/50 hover:bg-orange-500/20"
                >
                  {buttons.secondary.text}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  float cloudMask=smoothstep(.16,.94,bg);
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.35,bg*.2,bg*.085),d);
  }
  vec3 cloudTint=vec3(bg*.62,bg*.34,bg*.15);
  col=mix(col,cloudTint,.22+.32*cloudMask);
  col+=vec3(.06,.032,.014)*cloudMask;
  col=pow(col*1.12,vec3(.92));
  O=vec4(clamp(col,0.,1.),1);
}`;

export default AnimatedShaderHero;
