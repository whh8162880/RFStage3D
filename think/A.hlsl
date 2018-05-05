                #define VELOCITY
                #define ROTATION_HEAD
                #define BILLBOARD


                precision mediump float;

                
                vec2 timeNode(float now,in vec3 pos,in vec4 time){
                    //time: x:startTime, y:durtion,z:delay+durtion,w:1/durtion;
                    //o: time, time * 1/durtion;

                    now = now - time.x;
                    pos *= step(0.0,now);
                    
                    vec2 o = vec2(0.0,0.0);
            
                    o.x = fract(now * time.w) * time.y;      
                        
                    o.y = o.x * time.w;
                    return o;
                }
            

                void quaXpos(in vec4 qua,inout vec3 pos){
                    vec4 temp = vec4(cross(qua.xyz,pos.xyz) + (qua.w * pos.xyz) , -dot(qua.xyz,pos.xyz));
                    pos = cross(temp.xyz,-qua.xyz) + (qua.w * temp.xyz) - (temp.w * qua.xyz);
                }

                attribute vec3 pos;
                attribute vec2 uv;
                attribute vec4 p_time;
                attribute vec3 p_velocity;
                attribute vec3 p_accelerition;
                attribute vec4 p_init_rotation;
                attribute vec4 p_vrotation;
                attribute vec4 p_scale;

                uniform mat4 mvp;
                uniform mat4 invm;
                uniform mat4 m;

                uniform float now;
                

                varying vec2 vUV;
                varying vec2 vTime;

                void main(void) {
                    vec3 b_pos = pos;
                    vec3 p_pos = vec3(0.0);
                    vec3 b_veo = vec3(0.0);
                    vec4 temp = vec4(0.0);
                    
                    //先处理时间  vec2 timeNode(float now,in vec3 pos,in vec4 time)
                    vec2 time = timeNode(now,b_pos,p_time);

#ifdef VELOCITY
                    //处理速度
                    b_veo += p_velocity;
                    p_pos += (time.xxx * b_veo);
#endif
                    
                   
#ifdef ACCELERITION 
                    //加速度
                    temp = p_accelerition * time.x; //at;
                    b_veo += temp;                              //vt = v0+a*t;
                    p_pos += temp * time.x * 0.5;               //s = v0*t + a*t*t*0.5;
#endif

#ifdef ROTATION     
                    //初始化旋转角度
                    quaXpos(p_init_rotation,b_pos);
#endif

#ifdef VROTATION    
                        //旋转动画
                    temp = p_vrotation;
                    temp.w *= time.x;
                    temp.xyz *= sin(temp.w);
                    temp.w = cos(temp.w);
                    quaXpos(temp,b_pos);
#endif

#ifdef ROTATION_HEAD    
                    //b_veo = vec3(0.0,1.0,1.0);
                    //if b_veo.yz is (0,0) ,change it to (0.00001,0);
                    b_veo.y += step(b_veo.y+b_veo.z,0.0) * 0.00001;
    #ifdef BILLBOARD
                    vec3 c1 = (m * vec4(b_veo,0.0)).xyz
                    vec3 c3 = normalize(vec3(c1.xy,0.0));
                    vec3 c2 = vec3(c3.y,c3.x,0.0);
                    c1 = vec3(c3.x,-c3.y,0.0);
                    c3 = vec3(0.0,0.0,1.0);
                    mat3 m = mat3(c1,c2,c3);
                    b_pos = m * b_pos;
    #else
                    b_veo = normalize(b_veo);
                    vec3 xAxis = vec3(1.0,0.0,0.0);
                    temp.w = dot(b_veo,xAxis);
                    temp.xyz = normalize(cross(xAxis,n_veo));

                    //两倍角公式获得 cos sin
                    //cos2a = cosa^2 - sina^2 = 2cosa^2 - 1 = 1 - 2sina^2;
                    //cosa = sqt((1 + cos2a)/2);
                    //sina = sqt((1 - cos2a)/2);

                    temp.xyz *= sqrt( (1.0-temp.w) * 0.5);
                    temp.w = sqrt((1.0 + temp.w) * 0.5);
                    quaXpos(temp,b_pos);
                   
    #endif
#endif

#ifdef SCALE
                    //缩放
                    scaleNode(p_scale,time,b_pos);
#endif

#ifdef BILLBOARD
                    b_pos = (vec4(b_pos,0.0) * invm).xyz;
#endif

                    vUV = uv;
                    vTime = time;
                    gl_Position = mvp * vec4(b_pos + p_pos,1.0);
                }