precision highp float;

varying vec2 v_coordinates;

uniform sampler2D u_input;

uniform vec2 u_resolution;

const float FXAA_SPAN_MAX = 8.0;
const float FXAA_REDUCE_MUL = 1.0 / 8.0;
const float FXAA_REDUCE_MIN = 1.0 / 128.0;
 
void main () {
    vec2 delta = 1.0 / u_resolution;

    vec3 rgbTL = texture2D(u_input, v_coordinates + vec2(-1.0, -1.0) * delta).rgb;
    vec3 rgbTR = texture2D(u_input, v_coordinates + vec2(1.0, -1.0) * delta).rgb;
    vec3 rgbBL = texture2D(u_input, v_coordinates + vec2(-1.0, 1.0) * delta).rgb;
    vec3 rgbBR = texture2D(u_input, v_coordinates + vec2(1.0, 1.0) * delta).rgb;
    vec3 rgbM = texture2D(u_input, v_coordinates).rgb;

    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaTL = dot(rgbTL, luma);
    float lumaTR = dot(rgbTR, luma);
    float lumaBL = dot(rgbBL, luma);
    float lumaBR = dot(rgbBR, luma);
    float lumaM  = dot(rgbM,  luma);

    float lumaMin = min(lumaM, min(min(lumaTL, lumaTR), min(lumaBL, lumaBR)));
    float lumaMax = max(lumaM, max(max(lumaTL, lumaTR), max(lumaBL, lumaBR)));

    vec2 dir = vec2(
        -((lumaTL + lumaTR) - (lumaBL + lumaBR)),
        ((lumaTL + lumaBL) - (lumaTR + lumaBR)));

    float dirReduce = max((lumaTL + lumaTR + lumaBL + lumaBR) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX), dir * rcpDirMin)) * delta.xy;

    vec3 rgbA = 0.5 * (texture2D(u_input, v_coordinates.xy + dir * (1.0 / 3.0 - 0.5)).xyz + texture2D(u_input, v_coordinates.xy + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (texture2D(u_input, v_coordinates.xy + dir * -0.5).xyz + texture2D(u_input, v_coordinates.xy + dir * 0.5).xyz);
    float lumaB = dot(rgbB, luma);
    if (lumaB < lumaMin || lumaB > lumaMax) {
        gl_FragColor = vec4(rgbA, 1.0);
    } else {
        gl_FragColor = vec4(rgbB, 1.0);
    }
}
