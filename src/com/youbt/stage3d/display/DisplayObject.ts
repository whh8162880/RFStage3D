///<reference path="../../rfreference.ts" />
module rf {
    export var ROOT: Stage3D;

    export interface IMouse {
        mouseEnabled?:boolean,
        mouseChildren?:boolean,
        getObjectByPoint?(dx: number, dy: number,scale:number): DisplayObject
    }

    export enum DChange {
        trasnform = 0b1,
        alpha = trasnform << 1,
        vertex = alpha << 1,
        vcdata = vertex << 1,
        //底层transfrom改变
        ct = vcdata << 1,
        area = ct << 1,
        //底层htiArea改变
        ca = area << 1,
        c_all = (ct | ca),  
        ac = (area | ca),
        ta = (trasnform | alpha),
        batch = (vertex | vcdata),
        base = (trasnform | alpha | area),
        /**
         *  自己有transform变化 或者 下层有transform变化
         */
        t_all = (trasnform | alpha | ct)

    }


    export class HitArea {

        allWays:boolean
        left: number = 0;
        right: number = 0;
        top: number = 0;
        bottom: number = 0;
        front: number = 0;
        back: number = 0;
        clean():void{
            this.left = this.right = this.top = this.bottom = this.front = this.back = 0;
        }

        combine(hitArea:HitArea,x:number,y:number):boolean{
            let b = false;
            if(this.left > hitArea.left+x){
                this.left = hitArea.left+x;
                b = true;
            }

            if(this.right < hitArea.right+x){
                this.right = hitArea.right+x;
                b = true;
            }

            if(this.top > hitArea.top+y){
                this.top = hitArea.top+y;
                b = true;
            }

            if(this.bottom < hitArea.bottom+y){
                this.bottom = hitArea.bottom+y;
                b = true;
            }

            if(this.front > hitArea.front){
                this.front = hitArea.front;
                b = true;
            }

            if(this.back < hitArea.back){
                this.back = hitArea.back;
                b = true;
            }
            return b
        }

        updateArea(x: number, y: number, z: number): boolean {
            let b = false;
            if (this.left > x) {
                this.left = x;
                b = true;
            } else if (this.right < x) {
                this.right = x;
                b = true;
            }

            if (this.top > y) {
                this.top = y;
                b = true;
            } else if (this.bottom < y) {
                this.bottom = y;
                b = true;
            }

            if (this.front > z) {
                this.front = z;
                b = true;
            } else if (this.back < z) {
                this.back = z;
                b = true;
            }

            return b;
        }
        checkIn(x: number, y: number, scale: number = 1): boolean {
            if(this.allWays){
                return true;
            }

            if (x > this.left * scale && x < this.right * scale && y > this.top * scale && y < this.bottom * scale) {
                return true;
            }
            return false;
        }
        public toString(): string {
            return `HitArea left:${this.left} right:${this.right} top:${this.top} bottom:${this.bottom} front:${this.front} back:${this.back}`
        }
    }

    export class DisplayObject extends MiniDispatcher implements IMouse {
        hitArea: HitArea;
        mouseEnabled:boolean;
        mouseChildren:boolean;
        transformComponents: Vector3D[];
        pos: Vector3D;
        rot: Vector3D;
        sca: Vector3D;
        up:Vector3D = new Vector3D(0,1,0);

        public _x: number = 0;
        public _y: number = 0;
        public _z: number = 0;

        public _rotationX: number = 0;
        public _rotationY: number = 0;
        public _rotationZ: number = 0;

        public _scaleX: number = 1;
        public _scaleY: number = 1;
        public _scaleZ: number = 1;
        public _alpha: number = 1;

        public sceneAlpha: number = 1;

        public w: number = 0;
        public h: number = 0;

        public _visible: Boolean = true;
        public states: number = 0;

        public pivotZero: boolean = false;
        public pivotPonumber: Vector3D = undefined;
        public transform: Matrix3D;
        public sceneTransform: Matrix3D;
        public parent: DisplayObjectContainer = undefined;
        public stage: Stage3D = undefined;
        public name: string = undefined;

        constructor() {
            super();
            this.pos = new Vector3D();
            this.rot = new Vector3D();
            this.sca = new Vector3D(1,1,1);
            this.transformComponents = [this.pos, this.rot, this.sca];
            this.transform = new Matrix3D();
            this.sceneTransform = new Matrix3D();
        }

        /**
         * 逻辑规则
         * 改变对象 transform  alpha   vertexData  vcData  hitArea
         * 1.transform alpha 改变需要递归计算 并且上层是需要下层有改变的 引申出 ct 对象 childTranformORAlphaChange
         * 2.vertexData vcData 是要让batcher知道数据改变了 本层不需要做任何处理
         * 3.hitArea 改变 需要递归计算，引申出 ca对象 childHitAreaChange
         */
        setChange(value: number, p: number = 0, c: boolean = false) {
            //batcher相关的都和我无关
            this.states |= (value & ~DChange.batch);    //本层不需要batcher对象识别
            if (undefined != this.parent) {
                if(value & DChange.ta){
                    value |= DChange.ct;                //如果本层transform or alpha 改变了 那就得通知上层
                }
                if(value & DChange.area){
                    value |= DChange.ca;                //如果本层hitArea改变了 那就得通知上层
                }
                this.parent.setChange(/*给batcher用的*/value & DChange.batch, /*给顶层通知说下层有情况用的*/value & DChange.c_all, true);
            }
        }

        public get visible(): Boolean { return this._visible; }
        public set visible(value: Boolean) {
            if (this._visible != value) {
                this._visible = value;
                this.setChange(DChange.vertex)
            }
        }

        public set alpha(value: number) {
            if (this._alpha == value) {
                return;
            }

            let vertex = 0

            if (this._alpha <= 0 || value == 0) {
                vertex |= DChange.vertex;
            }

            this._alpha = value;
            this.setChange(vertex | DChange.alpha | DChange.vcdata);
        }

        public get alpha(): number {
            return this._alpha;
        }

        public get scaleX(): number { return this._scaleX; }
        public set scaleX(value: number) {
            if (this._scaleX == value) return;
            this._scaleX = value;
            this.sca.x = value;
            this.setChange(DChange.trasnform | DChange.vcdata);
        }
        public get scaleY(): number { return this._scaleY; }
        public set scaleY(value: number) { this._scaleY = value; this.sca.y = value; this.setChange(DChange.trasnform); }
        public get scaleZ(): number { return this._scaleZ; }
        public set scaleZ(value: number) { this._scaleZ = value; this.sca.z = value; this.setChange(DChange.trasnform); }
        public get rotationX(): number { return this._rotationX * RADIANS_TO_DEGREES; }
        public get rotationY(): number { return this._rotationY * RADIANS_TO_DEGREES; }
        public get rotationZ(): number { return this._rotationZ * RADIANS_TO_DEGREES; }


        public set rotationX(value: number) {
            value %= 360; value *= DEGREES_TO_RADIANS;
            if (value == this._rotationX) return;
            this._rotationX = value; this.rot.x = value; this.setChange(DChange.trasnform);
        }
        public set rotationY(value: number) {
            value %= 360; value *= DEGREES_TO_RADIANS;
            if (value == this._rotationY) return;
            this._rotationY = value; this.rot.y = value; this.setChange(DChange.trasnform);
        }
        public set rotationZ(value: number) {
            value %= 360; value *= DEGREES_TO_RADIANS;
            if (value == this._rotationZ) return;
            this._rotationZ = value; this.rot.z = value; this.setChange(DChange.trasnform);
        }

        public get x(): number { return this._x; }
        public get y(): number { return this._y; }
        public get z(): number { return this._z; }

        public set x(value: number) {
            if (value == this._x) return;
            this._x = value; this.pos.x = value;
            this.setChange(DChange.trasnform | DChange.vcdata);
        }
        public set y(value: number) {
            if (value == this._y) return;
            this._y = value; this.pos.y = value;
            this.setChange(DChange.trasnform | DChange.vcdata);
        }
        public set z(value: number) {
            if (value == this._z) return;
            this._z = value; this.pos.z = value;
            this.setChange(DChange.trasnform);
        }


        public setPos(x: number, y: number, z: number = 0, update: Boolean = true): void {
            this.pos.x = this._x = x;
            this.pos.y = this._y = y;
            this.pos.z = this._z = z;
            if (update) {
                this.setChange(DChange.trasnform | DChange.vcdata);
            }
        }

        public set eulers(value: Vector3D) {
            this._rotationX = value.x * DEGREES_TO_RADIANS;
            this._rotationY = value.y * DEGREES_TO_RADIANS;
            this._rotationZ = value.z * DEGREES_TO_RADIANS;
            this.setChange(DChange.trasnform);
        }

		/**
		 * 当前方向Z轴移动
		 * @param distance
		 * 
		 */
        public forwardPos(distance: number, or: Boolean = false): void {
            this.transform.copyColumnTo(2, tempAxeX);
            tempAxeX.normalize();
            if (or) {
                this.pos.x = -tempAxeX.x * distance;
                this.pos.y = -tempAxeX.y * distance;
                this.pos.z = -tempAxeX.z * distance;
            } else {
                this.pos.x += tempAxeX.x * distance;
                this.pos.y += tempAxeX.y * distance;
                this.pos.z += tempAxeX.z * distance;
            }
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        }


		/**
		 * 当前方向Y轴移动
		 * @param distance
		 * 
		 */
        public upPos(distance: number): void {
            this.transform.copyColumnTo(1, tempAxeX);
            tempAxeX.normalize();
            this.pos.x += tempAxeX.x * distance;
            this.pos.y += tempAxeX.y * distance;
            this.pos.z += tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        }


		/**
		 * 当前方向X轴移动
		 * @param distance
		 * 
		 */
        public rightPos(distance: number): void {
            this.transform.copyColumnTo(0, tempAxeX);
            tempAxeX.normalize();
            this.pos.x += tempAxeX.x * distance;
            this.pos.y += tempAxeX.y * distance;
            this.pos.z += tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        }

		/**
		 * 
		 * @param rx
		 * @param ry
		 * @param rz
		 * 
		 */
        public setRot(rx: number, ry: number, rz: number, update: Boolean = true): void {
            this.rot.x = this._rotationX = rx * DEGREES_TO_RADIANS;
            this.rot.y = this._rotationY = ry * DEGREES_TO_RADIANS;
            this.rot.z = this._rotationZ = rz * DEGREES_TO_RADIANS;
            if (update) {
                this.setChange(DChange.trasnform);
            }
        }


		/**
		 * 
		 * @param rx
		 * @param ry
		 * @param rz
		 * 
		 */
        public setRotRadians(rx: number, ry: number, rz: number, update: Boolean = true): void {
            this.rot.x = this._rotationX = rx;
            this.rot.y = this._rotationY = ry;
            this.rot.z = this._rotationZ = rz;
            if (update) {
                this.setChange(DChange.trasnform);
            }
        }

        public set scale(value: number) {
            this.setSca(value, value, value);
        }

        public get scale(): number {
            if (this._scaleX == this._scaleY && this._scaleX == this._scaleZ) {
                return this._scaleX;
            }
            return 1;
        }

        public setSca(sx: number, sy: number, sz: number, update: Boolean = true): void {
            this.sca.x = this._scaleX = sx;
            this.sca.y = this._scaleY = sy;
            this.sca.z = this._scaleZ = sz;
            if (update) {
                this.setChange(DChange.trasnform | DChange.vcdata);
            }
        }



        public setPivotPonumber(x: number, y: number, z: number): void {
            if (undefined == this.pivotPonumber) { this.pivotPonumber = new Vector3D() };
            this.pivotPonumber.x = x;
            this.pivotPonumber.y = y;
            this.pivotPonumber.z = z;
            this.pivotZero = (x != 0 || y != 0 || z != 0);
        }


        public setTransform(matrix: Matrix3D): void {
            //			transform.copyFrom(matrix);
            var vs: Vector3D[] = matrix.decompose();
            this.pos.copyFrom(vs[0]);
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;

            this.rot.copyFrom(vs[1]);
            this._rotationX = this.rot.x;
            this._rotationY = this.rot.y;
            this._rotationZ = this.rot.z;

            this.sca.copyFrom(vs[2]);
            this._scaleX = this.sca.x;
            this._scaleY = this.sca.y;
            this._scaleZ = this.sca.z;
            this.setChange(DChange.trasnform | DChange.vcdata);
        }




		/**
		 * 
		 */
        public updateTransform(): void {
            if (this.pivotZero) {
                this.transform.identity();
                this.transform.appendTranslation(-this.pivotPonumber.x, -this.pivotPonumber.y, -this.pivotPonumber.z);
                this.transform.appendScale(this._scaleX, this._scaleY, this._scaleZ);
                this.transform.appendTranslation(this._x, this._y, this._z);
                this.transform.appendTranslation(this.pivotPonumber.x, this.pivotPonumber.y, this.pivotPonumber.z);
            } else {
                this.transform.recompose(this.transformComponents);
            }

            this.states &= ~DChange.trasnform;
        }


		/**
		 * 
		 * 
		 */
        public updateSceneTransform(sceneTransform: Matrix3D): void {
            this.sceneTransform.copyFrom(this.transform);
            this.sceneTransform.append(sceneTransform);
        }


        public updateAlpha(sceneAlpha: number): void {
            this.sceneAlpha = this.sceneAlpha * this._alpha;
            this.states &= ~DChange.alpha;
        }

        public remove(): void {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }

        public addToStage(): void { };
        public removeFromStage(): void { };

        public setSize(width: number, height: number): void {
            this.w = width;
            this.h = height;
            this.invalidate();
        }

        protected invalidateFuncs: Function[] = [];

        protected invalidate(func: Function = null): void {
            ROOT.addEventListener(EventT.ENTER_FRAME, this.onInvalidate, this);
            if (null == func) {
                func = this.doResize;
            }

            if (this.invalidateFuncs.indexOf(func) == -1) {
                this.invalidateFuncs.push(func);
            }
        }

        protected invalidateRemove(func: Function = null): void {
            if (null == func) {
                func = this.doResize;
            }
            var i: number = this.invalidateFuncs.indexOf(func);
            if (i != -1) {
                this.invalidateFuncs.splice(i, 1);
                if (!this.invalidateFuncs.length) {
                    ROOT.removeEventListener(EventT.ENTER_FRAME, this.onInvalidate);
                }
            }
        }

        protected onInvalidate(event: EventX): void {
            event.currentTarget.off(EventT.ENTER_FRAME, this.onInvalidate);
            var arr: Function[] = this.invalidateFuncs.concat();
            this.invalidateFuncs.length = 0;
            for (var func of arr) {
                func();
            }
        }

        protected doResize(): void { }



        //==============================================================
        dispatchEvent(event: EventX): boolean {
            var bool: boolean = false;
            if (undefined != this.mEventListeners && event.type in this.mEventListeners) {
                bool = super.dispatchEvent(event);
            }

            if (false == event.stopImmediatePropagation && event.bubbles) {
                if (this.parent) {
                    this.parent.dispatchEvent(event);
                }
            }
            return bool;
        }

        public updateHitArea():void{
            this.states &= ~DChange.ac;
        }

        getObjectByPoint(dx: number, dy: number,scale:number): DisplayObject {
            let area = this.hitArea;
            if (undefined == area) {
                return undefined;
            }
            if(area.checkIn(dx, dy, this._scaleX * scale) == true){
                return this;
            }

            return undefined;
        }


        public get mouseX():number{
            return nativeMouseX - this.sceneTransform.rawData[12];
        }

        public get mouseY():number{
            return nativeMouseY - this.sceneTransform.rawData[13];
        }
    }
}