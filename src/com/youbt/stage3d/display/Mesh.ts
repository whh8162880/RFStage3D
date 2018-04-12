module rf{
    export class Mesh extends RenderBase{
        vb:VertexBuffer3D;
        ib:IndexBuffer3D;
        program:Program3D;
        constructor(variables?:{ [key: string]: IVariable }){
            super(variables ? variables : vertex_mesh_variable);
        }
    }
}