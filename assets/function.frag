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
    if (uMode == 1) {
        oColor = f1(color, neighbours, pos);
    }
    else if (uMode == 2) {
        oColor = f2(color, neighbours, pos);
    }
    else if (uMode == 3) {
        oColor = f3(color, neighbours, pos);
    }
    else if (uMode == 4) {
        oColor = f4(color, neighbours, pos);
    }
    else if (uMode == 5) {
        oColor = f5(color, neighbours, pos);
    }
    else if (uMode == 6) {
        oColor = f6(color, neighbours, pos);
    }
    else if (uMode == 7) {
        oColor = f7r(color, neighbours, pos);
    }
    else if (uMode == 8) {
        oColor = f8(color, neighbours, pos);
    }
}



// #version 150
//
// out vec4 oColor;
//
// uniform sampler2D 	uTex0;
// //uniform float 		uExposure;
// uniform float 		uOffset;
// uniform int uMode = 0;
// uniform vec2 uSize;
//
// in vec2 			TexCoord0;
//
// void insertionSort8(float[8] data) {
// 	int size = 8;
// 	for (int i = 1; i < size; i++) {
// 		for (int j = i; j > 0 && data[j] < data[j-1]; j--) {
// 			float tmp = data[j];
// 			data[j] = data[j-1];
// 			data[j-1] = tmp;
// 		}
// 	}
// }
//
// void insertionSort9(float[9] data) {
// 	int size = 9;
// 	for (int i = 1; i < size; i++) {
// 		for (int j = i; j > 0 && data[j] < data[j-1]; j--) {
// 			float tmp = data[j];
// 			data[j] = data[j-1];
// 			data[j-1] = tmp;
// 		}
// 	}
// }
//
// void insertionSort5(float[5] data) {
// 	int size = 5;
// 	for (int i = 1; i < size; i++) {
// 		for (int j = i; j > 0 && data[j] < data[j-1]; j--) {
// 			float tmp = data[j];
// 			data[j] = data[j-1];
// 			data[j-1] = tmp;
// 		}
// 	}
// }
//
// vec4[5] insertionSort5v(vec4[5] data) {
// 	int size = 5;
// 	for (int i = 1; i < size; i++) {
// 		for (int j = i; j > 0 && data[j].x < data[j-1].x; j--) {
// 			vec4 tmp = data[j];
// 			data[j] = data[j-1];
// 			data[j-1] = tmp;
// 		}
// 	}
// 	return data;
// }
//
// vec4[9] insertionSort9v(vec4[9] data) {
// 	int size = 9;
// 	for (int i = 1; i < size; i++) {
// 		for (int j = i; j > 0 && data[j].x < data[j-1].x; j--) {
// 			vec4 tmp = data[j];
// 			data[j] = data[j-1];
// 			data[j-1] = tmp;
// 		}
// 	}
// 	return data;
// }
//
//
//
// void main(void)
// {
// 	vec4 color = texture( uTex0, TexCoord0 );
//
// 	vec4 neighbours[9];
//
// 	vec2 offset = uOffset / uSize;
// //	offset = vec2(0.1);
//
//
// 	neighbours[0] = texture( uTex0, TexCoord0 + vec2(0, -offset.y) );
// 	neighbours[1] = texture( uTex0, TexCoord0 + vec2(0, offset.y) );
// 	neighbours[2] = texture( uTex0, TexCoord0 + vec2(offset.x, 0) );
// 	neighbours[3] = texture( uTex0, TexCoord0 + vec2(-offset.x, 0) );
//
// 	neighbours[4] = color;
//
// 	neighbours[5] = texture( uTex0, TexCoord0 + vec2(-offset.x, -offset.y) );
// 	neighbours[6] = texture( uTex0, TexCoord0 + vec2(offset.x, offset.y) );
// 	neighbours[7] = texture( uTex0, TexCoord0 + vec2(offset.x, -offset.y) );
// 	neighbours[8] = texture( uTex0, TexCoord0 + vec2(-offset.x, offset.y) );
//
// //	vec2 offsets[] = vec2[](vec2(0, -offset), vec2(0, offset), vec2(offset, 0), vec2(-offset, 0));
// //	for (int i = 0; i < 4; i++) {
// //		neighbours[i] = texture(uTex0, TexCoord0 + offsets[i] + vec2(TexCoord0) * 0.005);
// //	}
// //
//
// 	// make your own shape?
// //	neighbours[0] = texture( uTex0, TexCoord0 + vec2(0, -offset*2) );
// //	neighbours[1] = texture( uTex0, TexCoord0 + vec2(0, offset*0.7) );
// //	neighbours[2] = texture( uTex0, TexCoord0 + vec2(offset*0.3, 0) );
// //	neighbours[3] = texture( uTex0, TexCoord0 + vec2(-offset*1.5, 0) );
//
//
//
//
// 	// notes
// 	// use first or second lot of 4 neighbours
// 	//
//
//
//
//
//
// 	float n = 0;
// 	oColor = vec4(0);
// 	vec4 sum = vec4(0);
//
//
//
// 	if (uMode == 2) oColor = vec4(1);
//
// //	oColor = color; //uncomment this for different on mode 1 & 2
//
// 	for (int i = 2; i < 5; i+=1) {
//
// 	if (uMode == 3) {
// 		if (neighbours[i].r < color.r) {
// 			sum+= neighbours[i];
// 			n++;
//
// 		}
// 	}
// 	else if (uMode == 4) {
// 		if (neighbours[i].r > color.r) {
// 			sum+= neighbours[i];
// 			n++;
//
// 		}
// 	}
// 	else if (uMode == 5) {
// 		if (all(greaterThanEqual(neighbours[i], color))) {
// 			sum+= neighbours[i];
// 			n++;
// 		}
// 	}
// 	else {
// 		sum+= neighbours[i];
// 		n++;
//
// 	}
//
// //	if (neighbours[i].r < color.r) {
// //		oColor+= neighbours[i];
// //		n+= 1;
// //	}
//
//
// 		if (uMode == 1) oColor = max(oColor, neighbours[i]);
// 		else if (uMode == 2) oColor = min(oColor, neighbours[i]);
// 	}
//
// 	vec4 av = sum / n;
// 	if (uMode == 0) oColor = av;
// 	else if (uMode == 3 || uMode == 4 ||  uMode == 5) {
// 		oColor = mix(av, color, 0.1);
// 	}
//
// 	if (uMode == 6) {
// 		vec4 res[9] = insertionSort9v(neighbours);
// 		oColor = res[8];
// 	}
//     else if (uMode == 7) {
// 		vec4 res[9] = insertionSort9v(neighbours);
// 		oColor = mix(res[0], color, 0.5);
// 	}
//
// 	//oColor = mix(oColor, color, 0.9);
//
// //	oColor = max(color, av);
//
// //	oColor/= n;
//
//
// //	oColor = (n+s+w+e) * 0.25;
//
//
// //	oColor = color * uExposure;
// 	oColor.a = 1.0;
// }
