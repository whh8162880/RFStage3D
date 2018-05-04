module rf {
    export var particle_Perfix: string;

    export var particle_Texture_Perfix: string;

    export class Particle extends Mesh {

        data: IParticleData;

        load(url: string) {
            if (url.lastIndexOf(ExtensionDefine.PARTICLE) == -1) {
                url += ExtensionDefine.PARTICLE;
            }
            if (url.indexOf("://") == -1) {
                url = particle_Perfix + url;
            }
            loadRes(url, this.loadCompelte, this, ResType.bin);
        }

        loadCompelte(e: EventX) {
            let item: ResItem = e.data;
            let byte = item.data;
            let o = amf_readObject(byte);
            this.play(o);
        }


        play(data: IParticleData) {
            this.data = data;
            const { setting: settingData, mesh: meshData, material: materialData, runtime: runtimeData } = data;

            let { geometry, material } = this;

            if (!geometry) {
                this.geometry = geometry = new ParticleGeometry();
            }
            geometry.setData(meshData);
            (geometry as ParticleGeometry).setRuntime(runtimeData);

            if (!material) {
                this.material = material = new ParticleMaterial();
            }
            material.setData(materialData);
        }

    }


    export class ParticleGeometry extends GeometryBase {
        runtimeData: IParticleRuntimeData;
        setRuntime(runtime: IParticleRuntimeData) {
            this.initData(runtime)
            this.runtimeData = runtime;
        }

        uploadContext(camera: Camera, mesh: Particle, program: Program3D, now: number, interval: number) {
            super.uploadContext(camera, mesh, program, now, interval);
            const { vertexBuffer } = this.runtimeData;
            const { setting } = mesh.data
            vertexBuffer.uploadContext(program);

            let c = context3D;
            c.setProgramConstantsFromVector(P_PARTICLE.NOW, engineNow / 1000 * setting.speed, 1, false);

        }
    }


    export const enum P_PARTICLE {
        TIME = "p_time", //dataLength=4
        //scale
        SCALE = "p_scale",//dataLength=4
        //初始化旋转
        ROTATION = "p_init_rotation",//dataLength=4
        //旋转速度
        VROTATION = "p_vrotation",//dataLength=4

        ROTATION_HEAD = "p_rotation2head",
        //pos
        POSITION = "p_position",//dataLength=3
        //FOLLOW  0:位置 1:角度
        FOLLOW = "p_follow",//dataLength=2
        //velocity
        VELOCITY = "p_velocity",//dataLength=3
        //Accelerition 加速度
        ACCELERITION = "p_accelerition",//dataLength = 3;
        //按照朝向旋转
       
        //billboard
        // names[ParticleInfo.e_AnimNodeType_Billboard] = "p_billboard";
        //segemntedColor
        // names[ParticleInfo.e_AnimNodeType_SegmentColor] = "p_segment_color";
        //uv动画
        // names[ParticleInfo.e_AnimNodeType_SpriteSheetAnim] = "p_sprite_sheet_anim";

        NOW = "now"
    }

    export class ParticleMaterial extends Material {

        getTextUrl(data: ITextureData): string {
            return particle_Texture_Perfix + data.url;
        }

        uploadContext(camera: Camera, mesh: Mesh, now: number, interval: number) {
            let c = context3D;
            let { program, diffTex } = this;

            if (!diffTex) {
                return false;
            }

            let b = this.checkTexs(diffTex);
            if (false == b) {
                return false;
            }

            if (!program) {
                this.program = program = this.createProgram(mesh);
            }

            c.setProgram(program);
            c.setCulling(this.cull);

            let t: Texture

            if (undefined != diffTex) {
                t = c.textureObj[diffTex.key];
                t.uploadContext(program, 0, FS.diff);
            }

            return true;
        }


        createProgram(mesh: Mesh) {

            const { nodes } = (mesh as Particle).data;

            let node = nodes[P_PARTICLE.TIME];
            let vertexDefine = ""
            let vertexFunctions = this.timeNode(node as IParticleTimeNodeInfo);
            
            let fragmentDefine = "";
            let fragmentFunctions = "";

            //速度
            node = nodes[P_PARTICLE.VELOCITY];
            if(node){
                vertexDefine += "#define VELOCITY\n"
            }

            //加速度
            node = nodes[P_PARTICLE.ACCELERITION];
            if(node){
                vertexDefine += "#define ACCELERITION\n"
            }

            node = nodes[P_PARTICLE.ROTATION];
            if(node){
                vertexDefine += "#define ROTATION\n"
            }

            node = nodes[P_PARTICLE.VROTATION];
            if(node){
                vertexDefine += "#define VROTATION\n"
            }

            let vertexCode = `
                ${vertexDefine}

                precision mediump float;

                ${vertexFunctions}

                attribute vec3 ${VA.pos};
                attribute vec2 ${VA.uv};
                attribute vec4 ${P_PARTICLE.TIME};
                attribute vec3 ${P_PARTICLE.VELOCITY};
                attribute vec3 ${P_PARTICLE.ACCELERITION};
                attribute vec4 ${P_PARTICLE.ROTATION};
                attribute vec4 ${P_PARTICLE.VROTATION};

                uniform mat4 ${VC.mvp};
                uniform float ${P_PARTICLE.NOW};

                varying vec2 vUV;
                varying vec2 vTime;

                void quaXpos(in vec4 qua,inout vec3 pos){
                    vec4 temp = vec4(cross(qua.xyz,pos.xyz) + (qua.w * pos.xyz) , -dot(qua.xyz,pos.xyz));
                    pos = cross(temp.xyz,-qua.xyz) + (qua.w * temp.xyz) - (temp.w * qua.xyz);
                }

                void main(void) {
                    vec3 b_pos = ${VA.pos};
                    vec3 p_pos = vec3(0.0);
                    vec3 b_veo = vec3(0.0);
                    vec4 temp = vec4(0.0);
                    
                    //先处理时间  vec2 timeNode(float now,in vec3 pos,in vec4 time)
                    vec2 time = timeNode(${P_PARTICLE.NOW},b_pos,${P_PARTICLE.TIME});

#ifdef VELOCITY
                    //处理速度
                    b_veo += ${P_PARTICLE.VELOCITY};
                    p_pos += (time.xxx * b_veo);
#endif
                    
                   
#ifdef ACCELERITION
                    temp = ${P_PARTICLE.ACCELERITION} * time.x;        //at;
                    b_veo += temp;              //vt = v0+a*t;
                    p_pos += temp * time.x * 0.5;               //s = v0*t + a*t*t*0.5;
#endif

#ifdef ROTATION
                    quaXpos(${P_PARTICLE.ROTATION},b_pos);
#endif

#ifdef VROTATION
                    temp.xyz = ${P_PARTICLE.VROTATION}
                    quaXpos(temp,b_pos);
#endif

                    vUV = ${VA.uv};
                    vTime = time;
                    gl_Position = ${VC.mvp} * vec4(b_pos + p_pos,1.0);
                }
`


            let fragmentCode = `
                precision mediump float;

                ${fragmentDefine}

                ${fragmentFunctions}

                uniform sampler2D ${FS.diff};

                varying vec2 vUV;
                varying vec2 vTime;

                void main(void){
                    vec2 tUV = vUV;
                    vec4 c = texture2D(${FS.diff}, tUV);
                    // c = vec4(vTime.y);
                    gl_FragColor = c;
                    // gl_FragColor = vec4(1.0);
                }

            `
            let c = context3D;

            let p = c.createProgram(vertexCode, fragmentCode);

            return p;

        }


        //======================================================================
        //Nodes
        //======================================================================


        //==========================TimeNode====================================
        timeSetting(mesh: Particle, info: IParticleTimeNodeInfo, now: number) {

        }
        timeNode(info: IParticleTimeNodeInfo) {

            info.key = `time_${info.usesDuration}_${info.usesLooping}_${info.usesDelay}_`;

            let vcode = `
                vec2 timeNode(float now,in vec3 pos,in vec4 time){
                    //time: x:startTime, y:durtion,z:delay+durtion,w:1/durtion;
                    //o: time, time * 1/durtion;

                    now = now - time.x;
                    pos *= step(0.0,now);
                    
                    vec2 o = vec2(0.0,0.0);
            `

            if (info.usesDuration) {
                if (info.usesLooping) {
                    if (info.usesDelay) {
                        vcode += `
                    o.x = fract(now / time.z) * time.z
                    pos *= step(o.x,time.y);
                        `
                    } else {
                        vcode += `
                    o.x = fract(now * time.w) * time.y;      
                        `
                    }
                } else {
                    vcode += `
                    o.x = now * time.w;
                    pos *= step(now,time.y);  
                    `
                }
            } else {
                vcode += `
                    o.x = now;
                `
            }

            vcode += `
                    o.y = o.x * time.w;
                    return o;
                }
            `
            return vcode;
        }



        //==========================VELOCITY_Node====================================
        

    }
}