// Approved portfolio renderer; lifecycle is owned by the React route.
export default function initialize(state, on) {
  /* Local image displacement only; no framework, simulation grid, or new media. */
  state.createNaturalWater = function (canvas, source) {
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    });
    let ready = false,
      playing = false,
      enabled = false,
      raf = 0,
      last = 0,
      time = 0,
      strength = 1,
      frames = 0,
      lost = false;
    const fallback = () => {
      canvas.style.visibility = 'hidden';
      canvas.dataset.state = 'unavailable';
    };
    if (!gl) {
      fallback();
      return { update() {}, resize() {}, dispose() {}, available: false };
    }
    const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
    const fragment = `precision highp float;
    varying vec2 uv;
    uniform sampler2D picture;
    uniform sampler2D masks;
    uniform float clock;
    uniform float strength;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    vec3 image(vec2 p){return texture2D(picture,clamp(p,vec2(.001),vec2(.999))).rgb;}
    void main(){
      // Canvas is cropped to the actual water region, using top-down image coordinates.
      vec2 p=vec2(.23,.49)+vec2(uv.x,1.-uv.y)*vec2(.52,.36);
      vec3 m=texture2D(masks,p).rgb;
      float pond=m.r,fall=m.g,foam=m.b;
      float alpha=max(pond,max(fall,foam));
      if(alpha<.005){gl_FragColor=vec4(0);return;}
      float t=clock;
      vec3 base=image(p),color=base;
      // Perspective-compressed waves travel out from the waterfall; overlapping
      // frequencies disturb existing reflections instead of drawing new rings.
      vec2 d=(p-vec2(.507,.686))*vec2(1.,3.7);
      float radius=length(d);
      float w1=sin(radius*135.-t*3.8+p.x*19.);
      float w2=sin(p.y*230.+p.x*38.-t*2.1);
      float w3=noise(p*vec2(115.,290.)+vec2(t*.5,-t*.85))-.5;
      float bank=smoothstep(.03,.85,pond);
      float perspective=smoothstep(.68,.84,p.y);
      vec2 offset=vec2(w1*.0014+w2*.0008+w3*.0016,w2*.00065+w3*.0011);
      offset*=strength*bank*(.55+perspective*.9);
      vec3 reflection=image(p+offset);
      float sheen=(w1*.012+w2*.008)*bank*strength;
      reflection+=vec3(.7,.88,.82)*sheen;
      color=mix(color,reflection,pond);
      // Two advected samples overlap through their cycle boundaries. Different
      // columns flow at different speeds, retaining the source's cel shading.
      float fy=clamp((p.y-.503)/.185,0.,1.);
      float speed=.65+noise(vec2(p.x*95.,2.))* .38;
      float phase=fract(t*speed*.7);
      float phaseB=fract(phase+.5);
      float blend=abs(phase*2.-1.);
      float bend=(noise(vec2(p.x*155.,p.y*36.-t*3.))-.5)*.002*strength;
      float sampleA=.516+fract(fy-phase)*.157;
      float sampleB=.516+fract(fy-phaseB)*.157;
      vec3 falling=mix(image(vec2(p.x+bend,sampleA)),image(vec2(p.x-bend,sampleB)),blend);
      float breakup=noise(vec2(p.x*370.,p.y*74.-t*9.));
      falling*=.91+breakup*.18;
      float body=smoothstep(.0,.11,fy)*(1.-smoothstep(.90,1.,fy));
      color=mix(color,mix(base,falling,.72),fall*body);
      // Churn only inside the photographed/illustrated impact foam.
      vec2 agitation=vec2(noise(p*vec2(230.,430.)+t)-.5,noise(p*vec2(340.,190.)-t*1.4)-.5);
      vec3 churn=image(p+agitation*vec2(.004,.003)*strength);
      churn*=.94+.13*noise(p*vec2(200.,500.)+vec2(t*2.,-t*3.));
      color=mix(color,churn,foam*.8);
      gl_FragColor=vec4(color*alpha,alpha);
    }`;
    function compile(type, code) {
      const s = gl.createShader(type);
      gl.shaderSource(s, code);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(s));
      return s;
    }
    let program, vs, fs;
    try {
      vs = compile(gl.VERTEX_SHADER, vertex);
      fs = compile(gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
    } catch (error) {
      console.warn('Water enhancement unavailable:', error.message);
      fallback();
      return { update() {}, resize() {}, dispose() {}, available: false };
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const timeLocation = gl.getUniformLocation(program, 'clock'),
      strengthLocation = gl.getUniformLocation(program, 'strength');
    const textures = [];
    function texture(unit, element, name) {
      const tx = gl.createTexture();
      textures.push(tx);
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        element
      );
      gl.uniform1i(gl.getUniformLocation(program, name), unit);
    }
    function makeMask() {
      const m = document.createElement('canvas');
      m.width = 836;
      m.height = 471;
      const c = m.getContext('2d');
      c.fillStyle = 'black';
      c.fillRect(0, 0, m.width, m.height);
      c.scale(0.5, 0.5);
      c.filter = 'blur(3px)';
      c.fillStyle = 'red';
      c.beginPath();
      [
        [450, 668],
        [650, 654],
        [820, 652],
        [1030, 661],
        [1187, 675],
        [1173, 712],
        [1070, 751],
        [946, 774],
        [848, 790],
        [726, 779],
        [658, 760],
        [567, 747],
        [540, 717],
      ].forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
      c.closePath();
      c.fill();
      c.fillStyle = 'lime';
      c.beginPath();
      c.moveTo(780, 478);
      c.lineTo(920, 480);
      c.lineTo(930, 634);
      c.quadraticCurveTo(853, 657, 775, 635);
      c.closePath();
      c.fill();
      c.globalCompositeOperation = 'lighter';
      c.fillStyle = 'blue';
      c.beginPath();
      c.ellipse(848, 651, 104, 16, 0, 0, Math.PI * 2);
      c.fill();
      return m;
    }
    function resize() {
      const r = canvas.getBoundingClientRect();
      const w = Math.min(
        800,
        Math.max(
          256,
          Math.round(r.width * Math.min(devicePixelRatio || 1, 1.5))
        )
      );
      canvas.width = w;
      canvas.height = Math.round((w * (941 * 0.36)) / (1672 * 0.52));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (ready) draw();
    }
    function draw() {
      if (!ready || lost) return;
      gl.uniform1f(timeLocation, time);
      gl.uniform1f(strengthLocation, strength);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frames++;
      if (frames % 30 === 0) canvas.dataset.frames = String(frames);
    }
    function tick(now) {
      raf = 0;
      if (!playing || !ready || lost) return;
      if (!last) last = now;
      const dt = now - last;
      if (dt >= 1000 / 30) {
        time += Math.min(dt, 100) / 1000;
        last = now;
        draw();
      }
      raf = requestAnimationFrame(tick);
    }
    function update(run, on, amount = 1) {
      enabled = on;
      strength = amount;
      playing = run && on;
      canvas.style.visibility = on && !lost ? 'visible' : 'hidden';
      canvas.dataset.state = lost
        ? 'unavailable'
        : playing
          ? 'running'
          : 'paused';
      if (!playing) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      } else if (ready && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    }
    function init() {
      try {
        textures.splice(0).forEach((tx) => gl.deleteTexture(tx));
        texture(0, source, 'picture');
        texture(1, makeMask(), 'masks');
        ready = true;
        resize();
        canvas.dataset.ready = 'true';
        if (playing && !raf) raf = requestAnimationFrame(tick);
      } catch (error) {
        console.warn('Water image unavailable:', error.message);
        lost = true;
        fallback();
      }
    }
    on(source, 'load', init);
    if (source.complete && source.naturalWidth) init();
    on(canvas, 'webglcontextlost', () => {
      lost = true;
      playing = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      fallback();
    });
    const observer = new ResizeObserver(() => {
      if (enabled) resize();
    });
    observer.observe(canvas);
    function dispose() {
      playing = false;
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      source.removeEventListener('load', init);
      textures.forEach((tx) => gl.deleteTexture(tx));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    }
    return {
      update,
      resize,
      dispose,
      get available() {
        return !lost;
      },
    };
  };
}
