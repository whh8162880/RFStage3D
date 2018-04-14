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
    }



    export class PhongMaterial extends Material{
        //贴图
        diff:number = 0xFFFFFF;
        diffTex:string;

        //自发光
        emissive:number = 0x000000;
        emissiveTex:string;

        //高光
        specular:number = 0x000000;
        specularTex:string;


        uploadContext(camera:Camera,mesh:Mesh, now: number, interval: number){
            let scene = mesh.scene;
            let c = context3D;

            let{program}=this;
            if(undefined == program){
                this.program = program = this.createProgram();
            }
            c.setProgram(program);

            c.setCulling(this.triangleFaceToCull);

            c.setProgramConstantsFromVector(VC.lightDirection,[camera._x,camera._y,camera._z],3);
            // c.setProgramConstantsFromVector(VC.color,[Math.random(),Math.random(),Math.random(),1.0],4);
            c.setProgramConstantsFromVector(VC.color,[1.0,1.0,1.0,1.0],4);

            return true;
        }

        createProgram(){


            const{diffTex,emissiveTex,specularTex} = this;

            let c = context3D;


            let key = "PhongMaterial";

            if(undefined != diffTex){
                key += "-diff"
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
                precision highp float;
                attribute vec3 ${VA.pos};
                attribute vec3 ${VA.normal};
                attribute vec3 ${VA.uv};

                uniform mat4 ${VC.mvp};
                uniform mat4 ${VC.invm};

                uniform vec3 ${VC.lightDirection};
                uniform vec4 ${VC.color};

                varying vec4 vColor;
                void main() {
                    vec3  invLight = normalize(${VC.invm} * vec4(${VC.lightDirection}, 0.0)).xyz;
                    float diffuse  = clamp(dot(${VA.normal}, invLight), 0.1, 1.0);
                    vColor         = ${VC.color} * vec4(vec3(diffuse), 1.0);
                    gl_Position    = ${VC.mvp} * vec4(${VA.pos}, 1.0);
                }
            `

            let fragmentCode = `
                precision mediump float;
                varying vec4 vColor;
                void main(void){
                    vec4 c = vColor;
                    gl_FragColor = c;
                    // gl_FragColor = vec4(1.0,1.0,1.0,1.0);
                }
            `
            p = c.createProgram(vertexCode,fragmentCode,key);

            return p;

        }

        




    }
}