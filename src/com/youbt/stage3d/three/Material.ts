module rf{
    export class Material {
        triangleFaceToCull: string = Context3DTriangleFace.NONE;
        sourceFactor: number;
        destinationFactor: number;
        depthMask: boolean = false;
        passCompareMode: number;
        program:Program3D;
        createProgram(){
            return this.program;
        }

        uploadContext(mesh:Mesh){

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


        uploadContext(mesh:Mesh){
            let scene = mesh.scene;
            let c = context3D;

            c.setProgramConstantsFromVector(VC.lightDirection,[0,500,500],3);
            c.setProgramConstantsFromVector(VC.color,[1.0,1.0,1.0,1.0],4);
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

            this.program = p;

            return p;

        }

        




    }
}