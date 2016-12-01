#version 150

out vec4 oColor;

uniform sampler2D 	uTex0;
uniform float 		uOffset;
uniform int uMode = 0;
uniform vec2 uSize;

in vec2 			TexCoord0;

vec4 f1(vec4 current, vec4 neighbours[9], vec2 pos) {
    // vec4 current = neighbours[4];
    if (pos.x < 0) {
        return vec4(1, 0, 0, 1);
    }
    int index = int(current.r * 92);
    vec4 next = vec4(vec3(neighbours[int(mod(index, 7))].r), 1);
    return mix(current, next, 0.5);
}

vec4 f2(vec4 current, vec4 neighbours[9], vec2 pos) {
    // vec4 current = neighbours[4];
    if (pos.x < 0) {
        return vec4(1, 0, 0, 1);
    }
    vec4 index = current * vec4(92);
    vec3 c;
    c.r = neighbours[int(mod(index.r, 8))].r;
    c.g = neighbours[int(mod(index.g, 8))].g;
    c.b = neighbours[int(mod(index.b, 8))].b;
    vec4 next = vec4(c, 1);
    return mix(current, next, 0.8);
}

vec4 f3(vec4 current, vec4 neighbours[9], vec2 pos) {
    float v = (tan(current.r) * 0.5 + 0.5);
    int index = int(v * 81);
    vec4 next = neighbours[int(mod(index, 8))];
    next = vec4(vec3(next.r), 1);
    // next = vec4(vec3(index / 8), 1);
    return mix(current, next, 0.9);
}

vec4 f4(vec4 current, vec4 neighbours[9], vec2 pos) {
    vec4 v = (sin(current) * 0.5 + 0.5);
    vec4 index = v * 81;
    vec4 next;
    next.r = neighbours[int(mod(index.r, 8))].r;
    next.g = neighbours[int(mod(index.g, 8))].g;
    next.b = neighbours[int(mod(index.b, 8))].b;
    next.a = 1;
    // next = vec4(vec3(next.r), 1);
    // next = vec4(vec3(index / 8), 1);
    return mix(current, next, 0.5);
}

vec4 f5(vec4 current, vec4 neighbours[9], vec2 pos) {
    vec4 next = neighbours[int(current.x * 80) % 8];
    return mix(current, next, 0.5);
}

vec4 f6_1(vec4 current, vec4 neighbours[9], vec2 pos) {
    vec4 next = mod(current * 0.5 + neighbours[0] * neighbours[7], 1);
    next.a = 1;
    return mix(current, next, 0.1);
}

vec4 f6(vec4 current, vec4 neighbours[9], vec2 pos) {
    // vec4 next = mod(current * 0.5 + neighbours[2], 1);
    // vec4 next = mod(current + neighbours[2] * 0.01, 1);
    vec4 next = mod(current + neighbours[2] * neighbours[7] * 0.09, 1);
    next.a = 1;
    return mix(current, next, 0.3);
}

vec4 f7(vec4 current, vec4 neighbours[9], vec2 pos) {
    vec4 next = mod(neighbours[0] * 0.9 + neighbours[7] * 0.5, 1);
    next.a = 1;
    return mix(current, next, 0.1);
}

vec4 f8(vec4 current, vec4 neighbours[9], vec2 pos) {
    vec4 next = mod(sin((neighbours[7] + neighbours[0]) * 6.28318 * 0.5) * 0.5 + 0.5, 1);
    next.a = 1;
    return mix(current, next, 0.1);
}


void main(void)
{
	vec4 color = texture( uTex0, TexCoord0 );

	vec4 neighbours[9];

	vec2 offset = uOffset / uSize;
//	offset = vec2(0.1);

	neighbours[0] = texture( uTex0, TexCoord0 + vec2(0, -offset.y) );
	neighbours[1] = texture( uTex0, TexCoord0 + vec2(0, offset.y) );
	neighbours[2] = texture( uTex0, TexCoord0 + vec2(offset.x, 0) );
	neighbours[3] = texture( uTex0, TexCoord0 + vec2(-offset.x, 0) );

	// neighbours[4] = color;

	neighbours[4] = texture( uTex0, TexCoord0 + vec2(-offset.x, -offset.y) );
	neighbours[5] = texture( uTex0, TexCoord0 + vec2(offset.x, offset.y) );
	neighbours[6] = texture( uTex0, TexCoord0 + vec2(offset.x, -offset.y) );
	neighbours[7] = texture( uTex0, TexCoord0 + vec2(-offset.x, offset.y) );

    // oColor = color;
    // oColor.r = 1;
    //
	// oColor.a = 1.0;
    vec2 pos = TexCoord0;// * 0.5 + 0.5;
    oColor = f6_1(color, neighbours, pos);
}
