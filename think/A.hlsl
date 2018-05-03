                precision mediump float;
                vec2 timeNode(float now,in vec4 pos,in vec4 time){
                    //time: x:startTime, y:durtion,z:delay+durtion,w:1/durtion;
                    //o: time, time * 1/durtion;
                    now = now - time.x;
                    pos *= step(0.0,now);
                    vec2 o = vec2(0.0,0.0);
                    o.x = fract(now * time.w) * time.y;      
                    o.y = now * time.w;
                    return o;
                }
                attribute vec3 pos;
                attribute vec2 uv;
                attribute vec4 p_time;

                uniform mat4 mvp;
                uniform float now;

                varying vec2 vUV;
                varying vec2 vTime;

                void main(void) {
                    vec4 b_pos = vec4(pos, 1.0);
                    vec4 p_pos = vec4(0.0);
#ifdef Velocity
                    vec4 b_veo = vec4(0.0);
#endif
                    //先处理时间  vec2 timeNode(float now,in vec4 pos,in vec4 time){
                    vec2 time = timeNode(now,b_pos,p_time);

                    vUV = uv;
                    vTime = time;
                    gl_Position = mvp * b_pos;
                }
"