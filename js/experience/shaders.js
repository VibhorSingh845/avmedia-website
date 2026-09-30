// Procedural reflection rather than costly screen-space transmission.
// This leaves the HTML readable and needs no textures or models.
export const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uPhase;
  void main() {
    vec3 p = position;
    float wave = sin(p.y * 2.4 + uTime * .28) * cos(p.x * 1.8 + uTime * .18);
    p += normal * wave * .018 * (1.0 - uPhase * .65);
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;
export const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uDark;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 view = normalize(-vPosition);
    vec3 reflection = reflect(-view, n);
    float fresnel = pow(1.0 - abs(dot(n, view)), 2.3);
    float softbox = smoothstep(.38, .57, reflection.x) * (1.0 - smoothstep(.64, .79, reflection.x));
    float strip = pow(max(0.0, 1.0 - abs(reflection.x + reflection.y * .3 + .23)), 35.0);
    float rim = pow(max(dot(n, normalize(vec3(-.4, .8, 1.0))), 0.0), 3.0);
    float lower = smoothstep(-.6, .5, reflection.y);
    vec3 stone = mix(vec3(.24,.25,.19), vec3(.80,.72,.60), lower);
    vec3 color = stone * (.55 + .45 * rim);
    color = mix(color, vec3(.95,.89,.76), softbox * .88);
    color += vec3(.8,.73,.6) * strip * .8;
    color = mix(color, vec3(.92,.85,.70), fresnel * .6);
    color += vec3(.18,.065,.045) * pow(max(0.0, reflection.z), 3.0);
    color = mix(color, color * .92 + vec3(.04,.07,.03), uDark);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
