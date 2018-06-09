///<reference path="../stage3d/geom/Matrix3D.ts" />
module rf {
    export declare type PosKey = "x" | "y";
    export declare type SizeKey = "width" | "height";
    
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

    export interface Size extends Point2D{
        w:number;
        h:number;
    }

    export function size_checkIn(l:number,r:number,t:number,b:number,dx:number,dy:number,scale:number){
        return dx > l * scale && dx < r * scale && dy > t * scale && dy < b * scale;
    }

    export interface IFrame extends Size{
        ix:number;
        iy:number;
    }

    export interface IColor{
        r:number,
        g:number,
        b:number,
        a:number,
        hex?:number;
    }


    export let rgb_color_temp:IColor = {r:1,g:1,b:1,a:1}


    export function hexToCSS(d: number,a:number = 1): string {
        var r: number = ((d & 0x00ff0000) >>> 16) & 0xFF;
        var g: number = ((d & 0x0000ff00) >>> 8) & 0xFF;
        var b: number = d & 0x000000ff;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; //"rgba(0, 0, 200, 0.5)";
    }


    export function toRGB(color:number,out?:IColor):IColor{
        if(undefined == out){
            out = rgb_color_temp
        }
        out.hex = color;
        out.a = 1.0;
        out.r = ((color & 0x00ff0000) >>> 16) / 0xFF;
        out.g = ((color & 0x0000ff00) >>> 8) / 0xFF;
        out.b = (color & 0x000000ff) / 0xFF;
        return out
    }

    export function toCSS(color:IColor):string{
        return `rgba(${color.r*0xFF},${color.g*0xFF},${color.b*0xFF},${color.a*0xFF})`;
    }

    export function newColor(hex:number):IColor{
        return toRGB(hex,{} as IColor);
    }


    /**
     * 有 `x` `y` 两个属性
     * 
     * @export
     * @interface Point
     */
    export class Point {
        public x: number;
        public y: number;
        constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public get length(): Number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }


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
    export class Rect extends Point {
        public w: number = 0;
        public h: number = 0;
        constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
            super(x, y);
            this.w = w;
            this.h = h;
        }


        public clone(): Rect {
            return new Rect(this.x, this.y, this.w, this.h);
        }

    }


    export let RADIANS_TO_DEGREES: number = 180 / Math.PI;
    export let DEGREES_TO_RADIANS: number = Math.PI / 180;

    export let tempAxeX: IVector3D = newVector3D();
    export let tempAxeY: IVector3D = newVector3D();
    export let tempAxeZ: IVector3D = newVector3D();

    export let X_AXIS: IVector3D = newVector3D(1, 0, 0);
    export let Y_AXIS: IVector3D = newVector3D(0, 1, 0);
    export let Z_AXIS: IVector3D = newVector3D(0, 0, 1);



    export let PI2: number = Math.PI * 2;

    export let RAW_DATA_CONTAINER: Float32Array = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]);

    export let TEMP_MATRIX3D: IMatrix3D = newMatrix3D();
    export let TEMP_MATRIX2D: IMatrix = newMatrix();
    // export let CALCULATION_MATRIX_2D:Matrix = new Matrix();
    export let TEMP_VECTOR3D: IVector3D = newVector3D();

    export let TEMP_MatrixComposeData:IMatrixComposeData = {x:0,y:0,scaleX:1,scaleY:1,rotaiton:0};



    export interface IFunction{
        func:Function;
        thisobj:any;
    }

    export function newCallBackFunction(func:Function,thisobj:any){
        return {func:func,thisobj:thisobj} as IFunction;
    }


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

    export let EMPTY_POINT2D = new Point();
    export let EMPTY_POINT2D_2 = new Point();
    export let EMPTY_POINT2D_3 = new Point();

    // export function m2dTransform(matrix:ArrayLike<number>,p:Point2D,out:Point2D):void{
    //     const{
    //         m11,m12,m13,
    //         m21,m22,m23,
    //         m31,m32,m33
    //     } = matrix as any;
    //     const{
    //         x,y
    //     } = p;
    //     let dx = x * m11 + y * m21 + m31;
    //     let dy = x * m12 + y * m22 + m32;
    //     out.x = dx;
    //     out.y = dy;
    // }

    export function m2dTransform(matrix:ArrayLike<number>,p:number[],out:number[]):void{
        const[
            m11,m12,m13,
            m21,m22,m23,
            m31,m32,m33 
         ] = matrix as any;
         
        let x = p[0] - m31;
        let y = p[1] - m32;
        let dx = x * m11 + y * m21;
        let dy = x * m12 + y * m22;
        out[0] = dx + m31;
        out[1] = dy + m32;
    }


    // export class Float32Byte {
    //     public array: Float32Array;

    //     constructor(array?: Float32Array) {
    //         if(undefined == array){
    //             array = new Float32Array(0);
    //         }
    //         this.array = array;
    //     }

    //     get length(): number {
    //         return this.array.length;
    //     }

    //     set length(value: number) {
    //         if (this.array.length == value) {
    //             return;
    //         }
    //         let nd = new Float32Array(value);
    //         let len = value < this.array.length ? value : this.array.length;
    //         if(len != 0){
    //             // nd.set(this.array.slice(0, len), 0);
    //             nd.set(this.array);
    //         }
    //         this.array = nd;
    //     }

    //     append(byte: Float32Byte, offset: number = 0, len: number = -1): void {
    //         var position: number = 0;
    //         if (0 > offset) {
    //             offset = 0;
    //         }

    //         if (-1 == len) {
    //             len = byte.length - offset;
    //         } else {
    //             if (len > byte.length - offset) {
    //                 len = byte.length - offset;
    //             }
    //         }

    //         position = this.array.length;
    //         length = this.array.length + byte.length;

    //         if (len == byte.length) {
    //             this.array.set(byte.array, position);
    //         } else {
    //             this.array.set(byte.array.slice(offset, len), position);
    //         }
    //     }


    //     set(position:number, byte: Float32Byte, offset: number = 0, len: number = -1):void{
    //         if (0 > offset) {
    //             offset = 0;
    //         }

    //         if (-1 == len) {
    //             len = byte.length - offset;
    //         } else {
    //             if (len > byte.length - offset) {
    //                 len = byte.length - offset;
    //             }
    //         }

    //         if (len == byte.length) {
    //             this.array.set(byte.array, position);
    //         } else {
    //             this.array.set(byte.array.slice(offset, len), position);
    //         }
    //     }




    //     wPoint1(position: number, x: number, y?: number, z?: number, w?: number): void {
    //         this.array[position] = x;
    //     }

    //     wPoint2(position: number, x: number, y: number, z?: number, w?: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //     }

    //     wPoint3(position: number, x: number, y: number, z: number, w?: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //     }

    //     wPoint4(position: number, x: number, y: number, z: number, w: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //         this.array[position + 3] = w;
    //     }

    //     wUIPoint(position: number, x: number, y: number, z: number, u: number, v: number, index: number, r: number, g: number, b: number, a: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //         this.array[position + 3] = u;
    //         this.array[position + 4] = v;
    //         this.array[position + 5] = index;
    //         this.array[position + 6] = r;
    //         this.array[position + 7] = g;
    //         this.array[position + 8] = b;
    //         this.array[position + 9] = a;
    //     }
    // }
}