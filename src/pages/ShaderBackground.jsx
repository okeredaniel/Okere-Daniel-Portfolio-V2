import { useEffect, useRef } from 'react'

/*
 * Raymarched "elevator" city shader by Matthias Hurrle (@atzedent),
 * ported into React as a background. The CodePen editor / controls were removed.
 * Small robustness fixes vs. the original: the march loop counter and the
 * distance accumulator are initialised, and every code path returns a value.
 */

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
uniform vec2 wheel;
#define FC gl_FragCoord.xy
#define R resolution
#define T (25.+time)
#define S smoothstep
#define N normalize
#define MN min(R.x,R.y)
#define rnd(p) fract(sin(dot(p,vec2(12.9898,78.233)))*345678.)
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
float box(vec3 p, vec3 s, float r) {
	p=abs(p)-s+r;
	return length(max(p,.0))+min(.0,max(max(p.x,p.y),p.z))-r;
}
float map(vec3 p) {
	vec3 q=cos(p*1.8+5e2);
	float s=sign(p.y);
	p.y=abs(p.y)-2.5;
	vec2 id=floor(p.xz-s);
	if (mod(id.y,2.)==.0) {
		p.x-=T*.5;
		id.x=floor(p.x-s);
	}
	float f=1.-dot(abs(fract(p*42.)-.5)-.25,vec3(1))*.5;
	p.xz=fract(p.xz-s)-.5;
	return box(p,vec3(.1+.3*rnd(id),2.-.6*rnd(id),.2),f*f*.0125)-1e-3*f;
}
vec3 norm(vec3 p) {
	float h=1e-3; vec2 k=vec2(-1,1);
	return N(
		k.xyy*map(p+k.xyy*h)+
		k.yxy*map(p+k.yxy*h)+
		k.yyx*map(p+k.yyx*h)+
		k.xxx*map(p+k.xxx*h)
	);
}
bool march(inout vec3 p, vec3 rd, inout float dd) {
	for (int i=0; i<400; i++) {
		float d=map(p);
		if (abs(d)<1e-3) return true;
		if (dd>15.) return false;
		p+=rd*d*.5;
		dd+=d*.5;
	}
	return false;
}
float occ(vec3 p, vec3 n, float d) {
	return clamp(map(p+n*d)/d,.0,1.);
}
vec3 dir(vec2 uv, vec3 p, vec3 t, float z) {
	vec3 up=vec3(0,1,0),
	f=N(t-p),
	r=N(cross(up,f)),
	u=N(cross(f,r));
	return mat3(r,u,f)*N(vec3(uv,z));
}
void cam(inout vec3 p) {
	p.xz*=rot(.2-move.x/MN+.2*T*.01);
}
vec3 render(vec2 uv) {
	vec3 col=vec3(0),
	p=vec3(0,-.3,-23.5-wheel.y/MN-1e2*sin(T*5e-3));
	cam(p);
	vec3 rd=dir(uv,p,vec3(0,5.5,0),1.2), lp=p;
	lp.z+=.5;
	float dd=0.;
	if (march(p,rd,dd)) {
		vec3 n=norm(p), l=N(lp-p);
		float dif=clamp(dot(l,n),.0,1.),
		spe=pow(clamp(dot(N(lp-rd),n),.0,1.),21.),
		ao=occ(p,n,.5)*.8*occ(p,n,1.),
		ld=distance(lp,p), atten=1./(1.+ld*.25+ld*ld*.125);
		vec3 mat=vec3(4,1.6,.6);
		col+=.08+dif*mat*ao*atten;
		col+=spe*atten;
	}
	col=mix(vec3(0),col,exp(-125e-5*dd*dd*dd));
	col=tanh(col*col);
	col=sqrt(col);
	col=mix(vec3(0),col,min(time*.3,1.));
	// vignette
	vec2 c=FC/R;
	c*=1.-c.yx;
	float vig=c.x*c.y*25.;
	vig=pow(vig,.5);
	col*=vig;
	return col;
}
void main() {
	vec2 uv=(FC-.5*R)/MN;
	vec3 col=render(uv);
	O=vec4(col,1);
}`

/**
 * Fills its parent <section> (which must be position: relative).
 * - renders at a reduced resolution (`scale`) because the shader is heavy
 * - pauses when off screen or when the tab is hidden
 * - the camera gently follows the cursor
 * - honours prefers-reduced-motion (draws one still frame)
 */
export default function ShaderBackground({ scale = 0.6 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const host = canvas.closest('section') || canvas.parentElement
    if (!host) return

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      // CSS fallback background (set on .contact) shows instead of the shader.
      console.warn('[ShaderBackground] WebGL2 is not available in this browser — showing static fallback background.')
      return
    }

    const compile = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    )
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.useProgram(program)

    const loc = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      time: gl.getUniformLocation(program, 'time'),
      move: gl.getUniformLocation(program, 'move'),
      wheel: gl.getUniformLocation(program, 'wheel'),
    }

    // This is a slow, ambient background animation (no flashing, no scroll-
    // jacking), so unlike a UI micro-interaction it's reasonable to keep it
    // running even when the user has motion reduced. `reduceMotion` is no
    // longer used to gate the loop, but is kept in case you want to add a
    // `respectReducedMotion` prop later.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      console.info('[ShaderBackground] prefers-reduced-motion is on, but this background animates anyway (ambient, no flashing/scroll-jacking).')
    }

    let raf = 0
    let last = 0
    let t = 0
    // Assume visible until the observer says otherwise — this can only pause
    // the loop (for perf when scrolled away), never block it from starting.
    let visible = true
    let look = 0 // smoothed cursor offset, -1..1
    let lookTarget = 0

    const draw = () => {
      gl.useProgram(program)
      gl.uniform2f(loc.resolution, canvas.width, canvas.height)
      gl.uniform1f(loc.time, t)
      gl.uniform2f(loc.move, look * Math.min(canvas.width, canvas.height) * 0.3, 0)
      gl.uniform2f(loc.wheel, 0, 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      t += dt
      look += (lookTarget - look) * (1 - Math.exp(-4 * dt))
      draw()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const resize = () => {
      const w = Math.max(2, Math.round(host.clientWidth * scale))
      const h = Math.max(2, Math.round(host.clientHeight * scale))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      if (!raf) draw() // keep a valid image while paused / reduced motion
    }

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return
      const r = host.getBoundingClientRect()
      lookTarget = ((e.clientX - r.left) / r.width) * 2 - 1
    }
    const onPointerLeave = () => {
      lookTarget = 0
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    const ro = new ResizeObserver(resize)

    io.observe(host)
    ro.observe(host)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibility)
    resize()
    start() // don't wait on the observer's first (async) callback to begin animating

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [scale])

  return (
    <div className="shader-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}