module rf{

    export interface IShaderChunk{
        key:string;
        vdef?:string;
        fdef?:string;
        vary?:string;
        vcode?:string;
        fcode?:string;
    }

    export class Shader{
        att_uv_ui = {
            key:"a1",
            vdef:`
                attribute vec4 ${VA.color};
                attribute vec3 ${VA.uv};
                uniform vec4 ui[${max_vc}];
            `,
            vary:`
                varying vec2 vUV;  
                varying vec4 vColor;
            `,
            vcode:`
                vec4 tv = ui[int(${VA.uv}.z)];
                p.xy = p.xy + tv.xy;
                p.xy = p.xy * tv.zz;

                vec4 tc = ${VA.color};
                tc.w = tc.w * tv.w;
                vColor = tc;
                vUV.xy = ${VA.uv}.xy;
            `,
            fcode:`
                color = vColor*color;
            `
        }

        att_uv = {
            key:"a2",
            vdef:`
                attribute vec2 ${VA.uv}
            `,
            vary:`
                varying vec2 vUV;  
            `,
            vcode:`
                vUV.xy = ${VA.uv}.xy;
            `,
            fcode:`
                vec2 tUV = vUV;
            `
        }

        att_color = {
            key:"a3",
            vdef:`
                attribute vec4 ${VA.color};
            `,
            vary:`
                varying vec4 vColor;
            `,
            vcode:`
                vColor = ${VA.color};
            `,
            fcode:`
                color = vColor;
            `
        }

        att_normal = {
            key:"a4",
            vdef:`
                attribute vec3 ${VA.normal};
            `,
            vcode:`
                _normal = ${VA.normal};
            `
        }

        // uni_v_m = {
        //     key:"u1",
        //     vdef:`
        //         uniform mat4 m;
        //     `
        // }

        // uni_v_v = {
        //     key:"u2",
        //     vdef:`
        //         uniform mat4 v;
        //     `
        // }

        uni_v_p = {
            key:"u3",
            vdef:`
                uniform mat4 ${VC.p};
            `
        }

        uni_v_mv = {
            key:"u4",
            vdef:`
                uniform mat4 ${VC.mv};
            `
        }


        uni_v_mvp = {
            key:"u5",
            vdef:`
                uniform mat4 ${VC.mvp};
            `,
            vcode:`
                p = mvp * p;
            `
        }

        uni_f_diff = {
            key:"u5",
            fdef:`
                uniform sampler2D ${FS.diff};
            `,
            fcode:`
                vec4 color = texture2D(${FS.diff}, tUV);
            `
        }

        uni_v_inv_m = {
            key:"u6",
            vdef:`
                uniform mat4 ${VC.invm};
            `
        }

        uni_v_dir = {
            key : "u7",
            vdef:`
                uniform vec3 lightDirection;
            `
        }

        uni_v_light = {
            
        }


        createVertex(define:string[],modules:object):string{
            let code = "";
            let chunk:IShaderChunk;
            for(let str in define){
                code += `#define ${str}\n`;
            }

            code += `attribute vec3 ${VA.pos};\n`

            for(let str in modules){
                chunk = modules[str];
                if(undefined != chunk.vdef){
                    code += chunk.vdef;
                }
                if(undefined != chunk.vary){
                    code += chunk.vary;
                }
            }

            code += `
            void main(void){
                vec4 p = vec4(${VA.pos},1.0);
            `;


            chunk = modules[this.att_uv_ui.key];
            if(undefined != chunk){
                code += chunk.vcode + "\n"
            }

            chunk = modules[this.uni_v_mvp.key];
            if(undefined != chunk){
                code += chunk.vcode + "\n"
            }

            code += `
                gl_Position = p;
            }
            `

            return code;
        }

        createFragment(define:string[],modules:object):string{
            let code = "";
            let chunk:IShaderChunk;
            for(let str in define){
                code += `#define ${str}\n`;
            }

            code += "precision mediump float;\n"

            for(let str in modules){
                chunk = modules[str];
                if(undefined != chunk.fdef){
                    code += chunk.fdef+"\n";
                }
                if(undefined != chunk.vary){
                    code += chunk.vary+"\n";
                }
            }

            code += `
            void main(void){
            `;

            chunk = modules[this.att_uv.key];
            if(undefined != chunk){
                code += chunk.fcode + "\n";
            }

            chunk = modules[this.att_uv_ui.key];
            if(undefined != chunk){
                code += `vec2 tUV = vUV;\n`
            }

            chunk = modules[this.uni_f_diff.key]
            if(undefined != chunk){
                code += chunk.fcode + "\n";
            }


            chunk = modules[this.att_uv_ui.key];
            if(undefined != chunk){
                code += chunk.fcode + "\n";
            }

            
            code +=`
                gl_FragColor = color;\n
            }
            `
            return code;
        }

    }


}