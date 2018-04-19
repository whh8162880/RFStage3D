module rf{
    export class Material {
        triangleFaceToCull: string = Context3DTriangleFace.BACK;
        sourceFactor: number;
        destinationFactor: number;
        depthMask: boolean = false;
        passCompareMode: number;
        program:Program3D;
        createProgram(){
            return this.program;
        }

        uploadContext(camera:Camera,mesh:Mesh, now: number, interval: number){
            return false;
        }


        checkTexs(...args){
            let c = context3D;
            let b = true;
            args.forEach(name => {
                if(undefined != name){
                    let tex = c.textureObj[name];
                    if(undefined == tex){
                        tex = c.createTexture(name,undefined);
                        b = false;
                    }
                    let{readly,status}=tex;
                    if(false == readly){
                        if(LoadStates.COMPLETE != status){
                            if(LoadStates.WAIT == status){
                                tex.load();
                            }
                            b =false;
                        }
                    }
                }
            });
            return b;
        }

    }



    export class PhongMaterial extends Material{
        //贴图
        diff:Color;
        diffTex:string;

        //自发光
        emissive:Color;
        emissiveTex:string;

        //高光
        specular:Color;
        specularTex:string;


        uploadContext(camera:Camera,mesh:Mesh, now: number, interval: number){
            let scene = mesh.scene;
            let c = context3D;

            let{program,diff,emissive,specular,diffTex,emissiveTex,specularTex}=this;

            if(!diff && !diffTex){
                return false;
            }

            let b = this.checkTexs(diffTex,emissiveTex,specularTex);
            if(false == b){
                return false;
            }

            if(undefined == program){
                this.program = program = this.createProgram();
            }

            let sun = scene.sun;

            c.setProgram(program);
            c.setCulling(this.triangleFaceToCull);
            c.setProgramConstantsFromVector(VC.lightDirection,[sun._x,sun._y,sun._z],3);
            
            let t:Texture

            if(undefined != diffTex){
                t = c.textureObj[diffTex];
                t.mipmap = true;
                t.uploadContext(program,0,FS.diff);
            }


            // c.setProgramConstantsFromVector(VC.lightDirection,[100,100,100],3);

            // c.setProgramConstantsFromVector(VC.vc_diff,[Math.random(),Math.random(),Math.random(),1.0],4);
            if(undefined != diff){
                c.setProgramConstantsFromVector(VC.vc_diff,[diff.r,diff.g,diff.b,diff.a],4);
            }

            if(undefined != emissive){
                c.setProgramConstantsFromVector(VC.vc_emissive,[emissive.r,emissive.g,emissive.b,0.0],4);
            }
            
            

            return true;
        }

        createProgram(){


            const{diffTex,emissiveTex,specularTex} = this;

            let c = context3D;
            
            let f_def = "";

            let key = "PhongMaterial";

            if(undefined != diffTex){
                key += "-diff";
                f_def += "#define DIFF\n";
            }

            if(undefined != emissiveTex){
                key += "-emissive"
            }

            if(undefined != specularTex){
                key += "-specular"
            }

           
            let p = c.programs[key];

            if(undefined != p){
                return p;
            }




            let vertexCode = `
                precision mediump float;
                attribute vec3 ${VA.pos};
                attribute vec3 ${VA.normal};
                attribute vec2 ${VA.uv};

                uniform mat4 ${VC.mvp};
                uniform mat4 ${VC.invm};

                uniform vec3 ${VC.lightDirection};
                
                varying vec4 vDiffuse;
                varying vec2 vUV;
                void main() {
                    vec3  invLight = normalize(${VC.invm} * vec4(${VC.lightDirection}, 0.0)).xyz;
                    float diffuse  = clamp(dot(${VA.normal}, invLight), 0.1, 1.0);
                    vDiffuse = vec4(vec3(diffuse), 1.0);
                    vUV = ${VA.uv};
                    gl_Position = ${VC.mvp} * vec4(${VA.pos}, 1.0);
                }
            `
            
            



            let fragmentCode = `
                precision mediump float;

                ${f_def}

                uniform sampler2D ${FS.diff};

                uniform vec4 ${VC.vc_diff};
                uniform vec4 ${VC.vc_emissive};

                varying vec4 vDiffuse;
                varying vec2 vUV;


                
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