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

            let{geometry,material}=this;

            if(!geometry){
                this.geometry = geometry = new ParticleGeometry();
            }
            geometry.setData(meshData);
            (geometry as ParticleGeometry).setRuntime(runtimeData);

            if(!material){
                this.material = material = new ParticleMaterial();
            }
            material.setData(materialData);
        }

    }


    export class ParticleGeometry extends GeometryBase{
        runtimeData:IParticleRuntimeData;
        setRuntime(runtime:IParticleRuntimeData){
            this.initData(runtime)
            this.runtimeData = runtime;
        }

        uploadContext(camera:Camera,mesh:Mesh, program:Program3D, now: number, interval: number){
            super.uploadContext(camera,mesh,program,now,interval);
            const{vertexBuffer} = this.runtimeData;
            vertexBuffer.uploadContext(program);
        }
    }


    export enum P_PARTICLE{
        TIME = "p_time", //dataLength=4
		//scale
		SCALE = "p_scale",//dataLength=4
		//初始化旋转
        ROTATION = "p_init_rotation",//dataLength=4
        //旋转速度
        VROTATION = "p_vrotation",//dataLength=4
        //pos
        POSITION = "p_position",//dataLength=3
        //FOLLOW  0:位置 1:角度
        FOLLOW = "p_follow",//dataLength=2
        //velocity
        VELOCITY = "p_velocity",//dataLength=3
        //Accelerition 加速度
        ACCELERITION = "p_accelerition",//dataLength = 3;
        //billboard
        // names[ParticleInfo.e_AnimNodeType_Billboard] = "p_billboard";
        //segemntedColor
        // names[ParticleInfo.e_AnimNodeType_SegmentColor] = "p_segment_color";
        //uv动画
        // names[ParticleInfo.e_AnimNodeType_SpriteSheetAnim] = "p_sprite_sheet_anim";

        NOW = "now"
    }

    export class ParticleMaterial extends Material {

        uploadContext(camera: Camera, mesh: Mesh, now: number, interval: number) {
            let c = context3D;
            let{program,diffTex}=this;

            if(!diffTex){
                return false;
            }
            
            let b = this.checkTexs(diffTex);
            if(false == b){
                return false;
            }

            if(!program){
                this.program = program = this.createProgram(mesh);
            }

            c.setProgram(program);
            c.setCulling(this.cull);

            let t:Texture

            if(undefined != diffTex){
                t = c.textureObj[diffTex.key];
                t.uploadContext(program,0,FS.diff);
            }

            return true;
        }


        createProgram(mesh:Mesh){

            let vertexCode = `
                precision mediump float;

                attribute vec3 ${VA.pos};
                attribute vec2 ${VA.uv};
                attribute vec4 ${P_PARTICLE.TIME};

                uniform mat4 ${VC.mvp};
                uniform float ${P_PARTICLE.NOW};

                varying vec2 vUV;

                void main(void) {
                    vec4 b_pos = vec4(${VA.pos}, 1.0);
                    vec4 p_pos = vec4(0.0);
#ifdef Velocity
                    vec4 b_veo = vec4(0.0);
#endif

                    //先处理时间
                    float t_now = ${P_PARTICLE.NOW} - ${P_PARTICLE.TIME}.x;
                    if(t_now >= 0){

                    }
                    
                    float scale = step(t_now,0);



                    vUV = ${VA.uv};
                    gl_Position = ${VC.mvp} * b_pos;
                }
            `


            let fragmentCode = `
                precision mediump float;

                uniform sampler2D ${FS.diff};

                varying vec2 vUV;

                void main(void){
                    vec2 tUV = vUV;
                    vec4 c = texture2D(${FS.diff}, tUV);
                    gl_FragColor = c;
                    // gl_FragColor = vec4(1.0);
                }

            `
            let c = context3D;

            let p = c.createProgram(vertexCode,fragmentCode);

            return p;

        }

        getTextUrl(data:ITextureData):string{
            return particle_Texture_Perfix + data.url;
        }
    }
}