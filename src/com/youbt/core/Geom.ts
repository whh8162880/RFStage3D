module rf{
    export declare type PosKey = "x" | "y";
    export declare type SizeKey = "width" | "height";

    /**
     * 有`width` `height` 2个属性
     * 
     * @export
     * @interface Size
     */
    export interface Size {
        width: number;
        height: number;
    }

    /**
     * 有 `x` `y` 两个属性
     * 
     * @export
     * @interface Point
     */
    export interface Point {
        x: number;
        y: number;
    }

    /**
     * 有 `x` `y` `z` 3个属性
     * 
     * @export
     * @interface Point3D
     * @extends {Point}
     */
    export interface Point3D extends Point {
        z: number;
    }

    /**
     * 矩形
     * 有`x`,`y`,`width`,`height` 4个属性
     * 
     * @export
     * @interface Rect
     * @extends {Point}
     * @extends {Size}
     */
    export interface Rect extends Point, Size { };


    export let RADIANS_TO_DEGREES: number = 180 / Math.PI;
    export let DEGREES_TO_RADIANS: number = Math.PI / 180;
    export let tempAxeX: Vector3D = new Vector3D();
    export let tempAxeY: Vector3D = new Vector3D();
    export let tempAxeZ: Vector3D = new Vector3D();

    export let RAW_DATA_CONTAINER:Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]);
    	
	export let CALCULATION_MATRIX:Matrix3D = new Matrix3D();
	// export let CALCULATION_MATRIX_2D:Matrix = new Matrix();
	export let CALCULATION_VECTOR3D:Vector3D = new Vector3D();
	export let CALCULATION_DECOMPOSE:Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D()];



     /**
     * 经纬度 定位信息
     * 
     * @export
     * @interface Location
     */
    export interface Location {
        /**维度*/
        latitude: number;
        /**精度*/
        longitude: number;
    }

    export interface LocationConstructor {
        /**
         * 根据两个经纬度获取距离(单位：米)
         * 
         * @param {Location} l1
         * @param {Location} l2 
         * @returns 距离(单位：米)
         */
        getDist(l1: Location, l2: Location): number
    }

    export var Location: LocationConstructor = {
        /**
         * 根据两个经纬度获取距离(单位：米)
         * 
         * @param {Location} l1
         * @param {Location} l2 
         * @returns 距离(单位：米)
         */
        getDist(l1: Location, l2: Location) {
            const dtr = DEGREES_TO_RADIANS;
            let radlat1 = l1.latitude * dtr;
            let radlat2 = l2.latitude * dtr;
            let a = radlat1 - radlat2;
            let b = (l1.longitude - l2.longitude) * dtr;
            return Math.asin(Math.sqrt(Math.sin(a * .5) ** 2 + Math.cos(radlat1) * Math.cos(radlat2) * (Math.sin(b * .5) ** 2))) * 12756274;
        }
    }
}