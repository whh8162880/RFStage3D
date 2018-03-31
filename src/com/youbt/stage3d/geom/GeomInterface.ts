module rf {

    /**
     * 包含 x,y两个点的结构
     * 
     * @export
     * @interface Point2D
     */
    export interface Point2D {
        x: number;
        y: number;
    }
    /**
     * 包含 x,y,z 三个点的结构
     * 
     * @export
     * @interface Point3D
     * @extends {Point2D}
     */
    export interface Point3D extends Point2D {
        z: number;
    }
    /**
     * 包含 x,y,z,w 四个点的结构
     * 
     * @export
     * @interface Point3DW
     * @extends {Point3D}
     */
    export interface Point3DW extends Point3D {
        w: number;
    }
}