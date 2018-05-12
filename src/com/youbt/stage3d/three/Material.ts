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

        createProgram(mesh:Mesh){
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

        uploadContext(camera:Camera,mesh:Mesh, now: number, interval: number){
            let c = context3D;

            let{program,cull,srcFactor,dstFactor,depthMask,passCompareMode}=this;
            if(!program){
                this.program = program = this.createProgram(mesh);
            }

            
            c.setCulling(cull);
            c.setBlendFactors(srcFactor,dstFactor);
            c.setDepthTest(depthMask,passCompareMode);

            c.setProgram(program);

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


            let vertexCode = `
                precision mediump float;
                attribute vec3 ${VA.pos};
                uniform mat4 ${VC.mvp};
                // varying vec4 vPos;
                void main(void){
                    gl_Position = ${VC.mvp} * vec4(${VA.pos},1.0);
                }
            `

            let fragmentCode = `
                precision mediump float;
                const float PackUpscale = 256. / 255.;
                const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
                const float ShiftRight8 = 1. / 256.;
                vec4 packDepthToRGBA( const in float v ) {
                    vec4 r = vec4( fract( v * PackFactors ), v );
                    r.yzw -= r.xyz * ShiftRight8;
                    return r * PackUpscale;
                }

                
                void main(void){
                    // gl_FragColor = packDepthToRGBA(gl_FragCoord.z);
                    gl_FragColor = gl_FragCoord.zzzz;
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

            let{program,diff,emissive,specular,diffTex,emissiveTex,specularTex}=this;

            let{skAnim}=mesh;

            if(!diff && !diffTex){
                return false;
            }

            let b = this.checkTexs(diffTex,emissiveTex,specularTex);
            if(false == b){
                return false;
            }

            if(undefined == program){
                this.program = program = this.createProgram(mesh);
            }

            let sun = scene.sun;

            c.setProgram(program);
            c.setCulling(this.cull);
            c.setProgramConstantsFromVector(VC.lightDirection,[sun._x,sun._y,sun._z],3);

            let t:Texture

            if(undefined != diffTex){
                t = c.textureObj[diffTex.key];
                t.uploadContext(program,0,FS.diff);
            }else if(undefined != diff){
                c.setProgramConstantsFromVector(VC.vc_diff,[diff.r,diff.g,diff.b,diff.a],4);
            }

            if(mesh.shadowTarget){
                ROOT.shadow.rtt.uploadContext(program,0,FS.SHADOW);
            }

            // c.setProgramConstantsFromVector(VC.lightDirection,[100,100,100],3);

            // c.setProgramConstantsFromVector(VC.vc_diff,[Math.random(),Math.random(),Math.random(),1.0],4);
            if(undefined != emissive){
                c.setProgramConstantsFromVector(VC.vc_emissive,[emissive.r,emissive.g,emissive.b,0.0],4);
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
                f_def += "#define SHADOW";
                v_def += "#define SHADOW";
            }

            if(undefined != skAnim){
                key += "-skeleton";
                v_def += "#define USE_SKINNING\n           #define MAX_BONES 50\n";
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
                    #endif

                    #ifdef USE_SKINNING
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
                    diffuse += 0.5;
                    vDiffuse = vec4(vec3(diffuse), 1.0);
                    vUV = ${VA.uv};
                    gl_Position = ${VC.mvp} * t_pos;
#ifdef SHADOW
                    t_pos = ${VC.sunmvp} * t_pos;
                    vShadowUV = t_pos;
#endif
                }
            `
            
            



            let fragmentCode = `
                precision highp float;
                precision highp int;

                ${f_def}

                uniform sampler2D ${FS.diff};
                uniform sampler2D ${FS.SHADOW};

                uniform vec4 ${VC.vc_diff};
                uniform vec4 ${VC.vc_emissive};

                varying vec4 vDiffuse;
                varying vec2 vUV;

                varying vec4 vShadowUV;

                const float UnpackDownscale = 255.0 / 256.0;
                const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
                const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1.0);
                float unpackRGBAToDepth( const in vec4 v ) {
                    return dot( v, UnpackFactors );
                }
                
                void main(void){

                    vec2 tUV = vUV;

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
                        // vec4 s = texture2D(${FS.SHADOW}, tUV);
                        // if(unpackRGBAToDepth(s) > projCoords.z){
                        //     c = vec4(1.0);
                        // }else{
                        //     c = vec4(0.0);
                        // }
                        // c = vec4(unpackRGBAToDepth(s) > projCoords.z ? 1. : 0.);
                        // c = s;
                        // c = vec4(projCoords.xy,0.0,1.0);
                        c = vec4(unpackRGBAToDepth(s));
                        // c = vec4(vShadowUV.www,1.0);
                        // c = vec4(projCoords.zzz,1.);
                        // c = vec4(gl_FragCoord.z/gl_FragCoord.w);
                    #endif

                    c *= vDiffuse;

                    if(c.w < 0.1){
                        discard;
                    }
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