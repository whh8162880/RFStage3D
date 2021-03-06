module rf{
    export class Material {
        cull: number;
        srcFactor: number;
        dstFactor: number;
        depthMask: boolean = false;
        passCompareMode: number;
        alphaTest:number;

        program:Program3D;

        //贴图
        diff:IColor;
        diffTex:ITextureData;

        createProgram(mesh:SceneObject){
            return this.program;
        }

        setData(data:IMaterialData){
            if(!data){
                this.cull = WebGLConst.NONE;
                this.depthMask = true;
                this.passCompareMode = WebGLConst.LEQUAL;
                this.srcFactor = WebGLConst.SRC_ALPHA;
                this.dstFactor = WebGLConst.ONE_MINUS_SRC_ALPHA;
                this.alphaTest = -1;
            }else{
                let{cull,depthMask,passCompareMode,srcFactor,dstFactor,alphaTest,diffTex}=data;

                this.cull = (undefined != cull) ? cull : WebGLConst.BACK;
                this.depthMask = undefined != depthMask ? depthMask : true;
                this.passCompareMode = passCompareMode ? passCompareMode : WebGLConst.LEQUAL;
                this.srcFactor = srcFactor ? srcFactor : WebGLConst.SRC_ALPHA;
                this.dstFactor = dstFactor ? dstFactor : WebGLConst.ONE_MINUS_SRC_ALPHA;
                this.alphaTest = Number(alphaTest);
                
                if(diffTex){
                    this.diffTex = diffTex;
                }else{
                    this.diff = newColor(0xFFFFFF);
                }
            }
            
        }

        uploadContextSetting(){
            let{setting}=context3D;
            let{cull,srcFactor,dstFactor,depthMask,passCompareMode}=this;
            setting.cull = cull;
            setting.depth = depthMask;
            setting.depthMode = passCompareMode;
            setting.src = srcFactor;
            setting.dst = dstFactor;
        }


        uploadContext(camera:Camera,mesh:SceneObject, now: number, interval: number){
            let c = context3D;
            let{program}=this;
            if(!program){
                this.program = program = this.createProgram(mesh);
            }
            c.setProgram(program);
            this.uploadContextSetting();
            return true;
        }


        checkTexs(...args){
            let c = context3D;
            let b = true;
            args.forEach(data => {
                if(undefined != data){
                    let tex:Texture
                    if(data.key){
                        tex = c.textureObj[data.key];
                    }
                    if(undefined == tex){
                        tex = c.createTexture(data,undefined);
                        b = false;
                    }
                    let{readly,status}=tex;
                    if(false == readly){
                        if(LoadStates.COMPLETE != status){
                            if(LoadStates.WAIT == status){
                                tex.load(this.getTextUrl(data));
                            }
                            b =false;
                        }
                    }
                }
            });
            return b;
        }

        getTextUrl(data:ITextureData):string{
            return data.url;
        }

    }


    export class ShadowMaterial extends Material{

        createProgram(mesh:Mesh){
            let c = context3D;
            let key = "ShadowMaterial";

            let p = c.programs[key];

            if(undefined != p){
                return p;
            }

            let skAnim = mesh.skAnim;
            let v_def = "";

            if(undefined != skAnim){
                key += "-skeleton";
                v_def += "#define USE_SKINNING\n           #define MAX_BONES 50\n";
            }


            let vertexCode = `
                precision mediump float;

                ${v_def}



                attribute vec3 ${VA.pos};
                uniform mat4 ${VC.mvp};
                varying vec4 vPos;


#ifdef USE_SKINNING
                attribute vec4 ${VA.index};
                attribute vec4 ${VA.weight};
                uniform mat4 ${VC.vc_bones}[ MAX_BONES ];
                mat4 getBoneMatrix( const in float i ) {
                    mat4 bone = ${VC.vc_bones}[ int(i) ];
                    return bone;
                }
#endif
                void main(void){
                    vec4 t_pos = vec4(${VA.pos},1.0);
                    #ifdef USE_SKINNING
                        mat4 boneMatX = getBoneMatrix( ${VA.index}.x );
                        mat4 boneMatY = getBoneMatrix( ${VA.index}.y );
                        mat4 boneMatZ = getBoneMatrix( ${VA.index}.z );
                        mat4 boneMatW = getBoneMatrix( ${VA.index}.w );
                    // #endif
                    // #ifdef USE_SKINNING
                        mat4 skinMatrix = mat4( 0.0 );
                        skinMatrix += ${VA.weight}.x * boneMatX;
                        skinMatrix += ${VA.weight}.y * boneMatY;
                        skinMatrix += ${VA.weight}.z * boneMatZ;
                        skinMatrix += ${VA.weight}.w * boneMatW;
                        t_pos = skinMatrix * t_pos;
                    #endif
                    
                    // t_pos = ${VC.mvp} * t_pos;
                    // t_pos.z = log(t_pos.z + 1.0)/8.0;
                    // gl_Position = t_pos;

                    gl_Position = vPos = ${VC.mvp} * t_pos;
                }
            `

            let fragmentCode = `
                precision mediump float;


                // const float PackUpscale = 256. / 255.;
                // const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
                // const float ShiftRight8 = 1. / 256.;
                // vec4 packDepthToRGBA( const in float v ) {
                //     vec4 r = vec4( fract( v * PackFactors ), v );
                //     r.yzw -= r.xyz * ShiftRight8;
                //     return r * PackUpscale;
                // }


                vec4 packDepthToRGBA(float depth){
                    float r = depth;
                    float g = fract(r * 255.0);
                    float b = fract(g * 255.0);
                    float a = fract(b * 255.0);
                    float coef = 1.0 / 255.0;
                    r -= g * coef;
                    g -= b * coef;
                    b -= a * coef;
                    return vec4(r, g, b, a);
                }

                varying vec4 vPos;
                void main(void){
                    // gl_FragColor = packDepthToRGBA(gl_FragCoord.z);
                    gl_FragColor = vec4(gl_FragCoord.zzz,1.0);
                    // gl_FragColor = vec4(vPos.zzz/vPos.w,1.0);
                    // gl_FragColor = packDepthToRGBA(vPos.z/vPos.w);
                }
                
            `
            

            p = c.createProgram(vertexCode,fragmentCode,key);

            return p;
        }

    }

    export class SkyBoxMaterial extends Material{

        // //自发光
        // emissive:IColor;
        // emissiveTex:ITextureData;

        uploadContext(camera:Camera,mesh:Mesh, now: number, interval: number){
            let scene = mesh.scene;
            let c = context3D;
            

            let{diffTex}=this;

            let{skAnim}=mesh;

            if(!diffTex){
                return false;
            }

            let b = this.checkTexs(diffTex);
            if(false == b){
                return false;
            }

            super.uploadContext(camera,mesh,now,interval);
            let{program} = this;
            
            let t:Texture;
            let textureID = 0;

            t = c.textureObj[diffTex.key];
            t.uploadContext(program,textureID++,FS.diff);

            return true;
        }

        checkTexs(data){
            let c = context3D;
            let b = true;
            let tex:Texture
            if(data.key){
                tex = c.textureObj[data.key];
            }
            if(undefined == tex){
                tex = c.createCubeTexture(data);
                b = false;
            }
            let{readly,status}=tex;
            if(false == readly){
                if(LoadStates.COMPLETE != status){
                    if(LoadStates.WAIT == status){
                        tex.load(this.getTextUrl(data));
                    }
                    b =false;
                }
            }
            return b;
        }

        createProgram(mesh:Mesh){

            const{diffTex} = this;
            
            let c = context3D;
            
            let f_def = "";
            let v_def = "";

            let key = "SkyBoxMaterial";

            key += "-diff";
            f_def += "#define DIFF\n";


            let p = c.programs[key];

            if(undefined != p){
                return p;
            }

            let vertexCode = `
                precision mediump float;
                ${v_def}
                attribute vec3 ${VA.pos};
                attribute vec2 ${VA.uv};
                
                uniform mat4 ${VC.mvp};

                varying vec3 v_texCoord;

                void main() {
                    vec4 t_pos = vec4(${VA.pos}, 1.0);
                    
                    v_texCoord = ${VA.pos};

                    t_pos = ${VC.mvp} * t_pos;
                    
                    gl_Position = t_pos.xyww;
                }
            `
            
            



            let fragmentCode = `
            precision mediump float;    

            ${f_def}

            uniform samplerCube ${FS.diff};
            
            uniform vec4 ${VC.vc_diff};
            uniform vec4 ${VC.vc_emissive};
            
            varying vec3 v_texCoord;

            void main(void){

                vec4 c = textureCube(${FS.diff}, v_texCoord);
                
                gl_FragColor = c;
            }
            `
            p = c.createProgram(vertexCode,fragmentCode,key);

            return p;

        }

    }


    export class PhongMaterial extends Material{
        //自发光
        emissive:IColor;
        emissiveTex:ITextureData;

        //高光
        specular:IColor;
        specularTex:ITextureData;


        

        uploadContext(camera:Camera,mesh:Mesh, now: number, interval: number){
            let scene = mesh.scene;
            let c = context3D;
            

            let{diff,diffTex,emissiveTex,specularTex}=this;

            let{skAnim}=mesh;

            if(!diff && !diffTex){
                return false;
            }

            let b = this.checkTexs(diffTex,emissiveTex,specularTex);
            if(false == b){
                return false;
            }

            super.uploadContext(camera,mesh,now,interval);
            let{program,emissive,specular} = this;
            

            let sun = scene.sun;
            c.setProgramConstantsFromVector(VC.lightDirection,[sun._x,sun._y,sun._z],3);

            let t:Texture;

            let textureID = 0;

            if(undefined != diffTex){
                t = c.textureObj[diffTex.key];
                t.uploadContext(program,textureID++,FS.diff);
            }else if(undefined != diff){
                c.setProgramConstantsFromVector(VC.vc_diff,[diff.r,diff.g,diff.b,diff.a],4);
            }

            if(mesh.shadowTarget){
                ROOT.shadow.rtt.uploadContext(program,textureID++,FS.SHADOW);
            }

            // c.setProgramConstantsFromVector(VC.lightDirection,[100,100,100],3);

            // c.setProgramConstantsFromVector(VC.vc_diff,[Math.random(),Math.random(),Math.random(),1.0],4);
            if(undefined != emissive){
                c.setProgramConstantsFromVector(VC.vc_emissive,[emissive.r,emissive.g,emissive.b,0.0],4);
            }

            if(context3D.logarithmicDepthBuffer){
                c.setProgramConstantsFromVector(VC.logDepthFar, camera.logDepthFar, 1, false);
            }

            return true;
        }

        createProgram(mesh:Mesh){


            const{diffTex,emissiveTex,specularTex,diff} = this;
            const{skAnim,shadowTarget}=mesh;

            let c = context3D;
            
            let f_def = "";
            let v_def = "";

            let key = "PhongMaterial";

            if(undefined != diffTex){
                key += "-diff";
                f_def += "#define DIFF\n";
            }else if(undefined != diff){
                f_def += "#define VC_DIFF\n";
            }

            if(undefined != emissiveTex){
                key += "-emissive"
            }

            if(undefined != specularTex){
                key += "-specular"
            }

            if(shadowTarget){
                key += "-shadow";
                f_def += "#define SHADOW\n";
                v_def += "#define SHADOW\n";
            }

            if(undefined != skAnim){
                key += "-skeleton";
                v_def += "#define USE_SKINNING\n           #define MAX_BONES 50\n";
            }

            if(context3D.logarithmicDepthBuffer){
                key += "-log_depth_buffer";
                v_def += "#define LOG_DEPTH_BUFFER\n";
                f_def += "#define LOG_DEPTH_BUFFER\n";
                if(context3D.use_logdepth_ext){
                    key += "_ext";
                    v_def += "#define LOG_DEPTH_BUFFER_EXT\n";
                    f_def += "#define LOG_DEPTH_BUFFER_EXT\n";
                }
            }

            let p = c.programs[key];

            if(undefined != p){
                return p;
            }




            let vertexCode = `
                precision mediump float;
                ${v_def}
                attribute vec3 ${VA.pos};
                attribute vec3 ${VA.normal};
                attribute vec2 ${VA.uv};
                #ifdef USE_SKINNING
                    attribute vec4 ${VA.index};
                    attribute vec4 ${VA.weight};
                #endif
                uniform mat4 ${VC.mvp};
                uniform mat4 ${VC.invm};
                uniform vec3 ${VC.lightDirection};
                uniform mat4 ${VC.sunmvp};

                varying vec4 vDiffuse;
                varying vec2 vUV;
                varying vec4 vShadowUV;
                #ifdef LOG_DEPTH_BUFFER
                    #ifdef LOG_DEPTH_BUFFER_EXT
                        varying float depth;
                    #else
                        uniform float logDepthFar;
                    #endif
                #endif
                
#ifdef USE_SKINNING
                uniform mat4 ${VC.vc_bones}[ MAX_BONES ];
                mat4 getBoneMatrix( const in float i ) {
                    mat4 bone = ${VC.vc_bones}[ int(i) ];
                    return bone;
                }
#endif
                void main() {
                    vec4 t_pos = vec4(${VA.pos}, 1.0);
                    vec3 t_normal = ${VA.normal};

                    #ifdef USE_SKINNING
                        mat4 boneMatX = getBoneMatrix( ${VA.index}.x );
                        mat4 boneMatY = getBoneMatrix( ${VA.index}.y );
                        mat4 boneMatZ = getBoneMatrix( ${VA.index}.z );
                        mat4 boneMatW = getBoneMatrix( ${VA.index}.w );
                    // #endif
                    // #ifdef USE_SKINNING
                        mat4 skinMatrix = mat4( 0.0 );
                        skinMatrix += ${VA.weight}.x * boneMatX;
                        skinMatrix += ${VA.weight}.y * boneMatY;
                        skinMatrix += ${VA.weight}.z * boneMatZ;
                        skinMatrix += ${VA.weight}.w * boneMatW;
                        t_normal = vec4( skinMatrix * vec4( t_normal, 0.0 ) ).xyz;
                        t_pos = skinMatrix * t_pos;
                    #endif

                    vec3  invLight = normalize(${VC.invm} * vec4(${VC.lightDirection}, 0.0)).xyz;
                    float diffuse  = clamp(dot(t_normal.xyz, invLight), 0.1, 1.0);
                    vDiffuse = vec4(vec3(diffuse), 1.0);
                    vUV = ${VA.uv};
                    
                    gl_Position = ${VC.mvp} * t_pos;
                    #ifdef LOG_DEPTH_BUFFER
                        #ifdef LOG_DEPTH_BUFFER_EXT
                            depth = gl_Position.w + 1.0;
                        #else
                            gl_Position.z = log2( max( 0.0000001, gl_Position.w + 1.0 ) ) * logDepthFar * 2.0 - 1.0;
                            gl_Position.z *= gl_Position.w;
                        #endif
                    #endif
                    
#ifdef SHADOW
                    t_pos = ${VC.sunmvp} * t_pos;
                    // t_pos.xyz /= t_pos.w;
                    // t_pos.xy = t_pos.xy * 0.5 + 0.5;
                    vShadowUV = t_pos;
#endif
                }
            `
            
            



            let fragmentCode = `
                ${f_def}
                precision mediump float;    
                
                #ifdef LOG_DEPTH_BUFFER_EXT
                    #extension GL_EXT_frag_depth : enable
                #endif
                
                uniform sampler2D ${FS.diff};
                uniform sampler2D ${FS.SHADOW};

                uniform vec4 ${VC.vc_diff};
                uniform vec4 ${VC.vc_emissive};

                varying vec4 vDiffuse;
                varying vec2 vUV;
                varying vec4 vShadowUV;
                
                #ifdef LOG_DEPTH_BUFFER_EXT
                    varying float depth;
                    uniform float logDepthFar;
                #endif

                // const float UnpackDownscale = 255.0 / 256.0;
                // const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
                // const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1.0);
                // float unpackRGBAToDepth( const in vec4 v ) {
                //     return dot( v, UnpackFactors );
                // }

                float unpackRGBAToDepth(vec4 RGBA){
                    const float rMask = 1.0;
                    const float gMask = 1.0 / 255.0;
                    const float bMask = 1.0 / (255.0 * 255.0);
                    const float aMask = 1.0 / (255.0 * 255.0 * 255.0);
                    float depth = dot(RGBA, vec4(rMask, gMask, bMask, aMask));
                    return depth;
                }
                
                void main(void){

                    vec2 tUV = vUV;
                    vec4 diffuse = vDiffuse;

                    #ifdef DIFF
                        vec4 c = texture2D(${FS.diff}, tUV);
                    #else
                        #ifdef VC_DIFF
                            vec4 c = ${VC.vc_diff};
                        #else
                            vec4 c = vec4(1.0,1.0,1.0,1.0) ;
                        #endif
                    #endif
                    
                    #ifdef SHADOW
                        vec3 projCoords = vShadowUV.xyz / vShadowUV.w;
                        projCoords.xyz = projCoords.xyz * 0.5 + 0.5;
                        vec4 s = texture2D(${FS.SHADOW}, projCoords.xy);

                        if(projCoords.z > s.z - 0.001){
                            diffuse.xyz *= 0.8;
                        }
                       
                        // diffuse.xyz *= s.z;
                        // c.xyz = vec3(restDepth(s));
                        // c.xyz = vec3((s.z-.55) * 5.);
                        // c = s.z;

                        // if(s.x >= projCoords.z-0.01){
                        //     diffuse.xyz *= 0.8;
                        // }

                        // c = vec4(vec3(projCoords.z),1.);
                        // vec4 s = texture2D(${FS.SHADOW}, tUV);
                        // if(unpackRGBAToDepth(s) > projCoords.z){
                        //     c = vec4(1.0);
                        // }else{
                        //     c = vec4(0.0);
                        // }
                        // c = vec4(unpackRGBAToDepth(s) > projCoords.z ? 1. : 0.);
                        // c = s;
                        // c = vec4(projCoords.xy,0.0,1.0);
                        // c = vec4(vShadowUV.www,1.0);
                        // c = vec4(projCoords.zzz,1.);
                        // c = vec4(gl_FragCoord.z/gl_FragCoord.w);
                        
                    #endif

                    diffuse.xyz += 0.5;
                    c *= diffuse;

                    if(c.w < 0.1){
                        discard;
                    }
                    #ifdef LOG_DEPTH_BUFFER_EXT
	                    gl_FragDepthEXT = log2( depth ) * logDepthFar;
                    #endif
                    gl_FragColor = c;
                    
                    // gl_FragColor = vec4(1.0,1.0,1.0,1.0);
                    // gl_FragColor = vec4(vUV,0.0,1.0);
                }
            `
            p = c.createProgram(vertexCode,fragmentCode,key);

            return p;

        }

        




    }
}