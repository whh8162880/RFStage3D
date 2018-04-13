module rf{
    export class Mesh extends RenderBase{
        geometry:GeometryBase;
        constructor(variables?:{ [key: string]: IVariable }){
            super(variables ? variables : vertex_mesh_variable);
        }

        

    }
}