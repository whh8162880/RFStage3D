///<reference path="../../rfreference.ts" />
module rf{
    export var ROOT:Stage3D;

    export let RADIANS_TO_DEGREES:number = 180 / Math.PI;
    export let DEGREES_TO_RADIANS:number = Math.PI / 180;
    export let tempAxeX:Vector3D = new Vector3D();
    export let tempAxeY:Vector3D = new Vector3D();
    export let tempAxeZ:Vector3D = new Vector3D();
    
    export let BIT_CLEAR:number = 0x1;
    export let BIT_VERTEX:number = 0x2;
    export let BIT_VC:number = 0x4;
    export let BIT_ALL_VERTEX:number = BIT_CLEAR | BIT_VERTEX | BIT_VC;
    export let BIT_COLOR:number = 0x10;
    export let BIT_TRIANGLES:number = 0x20;
    export let BIT_ALPHA:number = 0x40;
    export let BIT_PROGRAM:number = 0x100;
    export let BIT_FRAGMENT_DATA:number = 0x200;
    export let BIT_VERTEX_DATA:number = 0x400;
    export let BIT_ALL_PROGRAM:number = BIT_PROGRAM | BIT_FRAGMENT_DATA | BIT_VERTEX_DATA;
    

    export class DisplayObject extends MiniDispatcher{
        


        public transformComponents:Vector3D[];
        public pos:Vector3D;
        public rot:Vector3D;
        public sca:Vector3D;

        public _x:number = 0;
		public _y:number = 0;
		public _z:number = 0;
		
		public _rotationX:number = 0;
		public _rotationY:number = 0;		
		public _rotationZ:number = 0;
			
		public _scaleX:number = 1;
		public _scaleY:number = 1;
		public _scaleZ:number = 1;
        public _alpha:number = 1;

        public _width:number = 0;
        public _height:number = 0;

        public _visible:Boolean = true;
        public _change:boolean = false;
        
        public pivotZero:boolean = false;
        public pivotPonumber:Vector3D= undefined;
        
		public transform:Matrix3D;		
		public sceneTransform:Matrix3D;
		
		public parent:DisplayObjectContainer = undefined;
        public stage:Stage3D = undefined;
        
        constructor(){
            super();
            this.pos = new Vector3D();
            this.rot = new Vector3D();
            this.sca = new Vector3D();
            this.transformComponents = [this.pos,this.rot,this.sca];
            this.transform = new Matrix3D();
            this.sceneTransform = new Matrix3D();
        }

        public set change(value:boolean){
            this._change = value;
        }

        public setDirty(value:number):void{

        }


        public get visible():Boolean{return this._visible;}
		public set visible(value:Boolean){this._visible = value;}
		
		public get scaleX():number{return this._scaleX;}
		public set scaleX(value:number){this._scaleX = value;this.sca.x = value;this.change = true;}
		public get scaleY():number{return this._scaleY;}
		public set scaleY(value:number){this._scaleY = value;this.sca.y = value;this.change = true;}
		public get scaleZ():number{return this._scaleZ;}
		public set scaleZ(value:number){this._scaleZ = value;this.sca.z = value;this.change = true;}
		public get rotationX():number{return this._rotationX * RADIANS_TO_DEGREES;}
		public get rotationY():number{	return this._rotationY * RADIANS_TO_DEGREES;}
		public get rotationZ():number{return this._rotationZ * RADIANS_TO_DEGREES;}
		public set rotationX(value:number){
			value %= 360;value *= DEGREES_TO_RADIANS;
			if(value == this._rotationX)return;
            this._rotationX = value;this.rot.x = value;this.change = true;
		}
		public set rotationY(value:number){
			value %= 360;value *= DEGREES_TO_RADIANS;
			if(value == this._rotationY)return;
            this._rotationY = value;this.rot.y = value;this.change = true;
		}
		public set rotationZ(value:number){
			value %= 360;value *= DEGREES_TO_RADIANS;
			if(value == this._rotationZ)return;
            this._rotationZ = value;this.rot.z = value;this.change = true;
		}
		
		public get x():number{return this._x;}
		public get y():number{return this._y;}
		public get z():number{return this._z;}
		
		public set x(value:number){
			if(value == this._x) return;
            this._x = value;this.pos.x = value;this.change = true;
		}
		public set y(value:number){
			if(value ==this._y) return;
            this._y = value;this.pos.y = value;this.change = true;
		}
		public set z(value:number)
		{
			if(value ==this._z) return;
            this._z = value;this.pos.z = value;this.change = true;
		}
		
		
		public setPos(x:number,y:number,z:number = 0,update:Boolean = true):void{
            this.pos.x =this._x = x;
            this.pos.y =this._y = y;
            this.pos.z =this._z = z;
			if(update){
                this.setDirty(BIT_VC);
				this._change = true;
			}
		}
		
		public set eulers(value:Vector3D)
		{
            this._rotationX = value.x*DEGREES_TO_RADIANS;
            this._rotationY = value.y*DEGREES_TO_RADIANS;
            this._rotationZ = value.z*DEGREES_TO_RADIANS;
            this.change = true;
		}
		
		/**
		 * 当前方向Z轴移动
		 * @param distance
		 * 
		 */		
		public forwardPos(distance:number,or:Boolean = false):void{
			this.transform.copyColumnTo(2, tempAxeX);
			tempAxeX.normalize();
			if(or){
                this.pos.x = -tempAxeX.x*distance;
                this.pos.y = -tempAxeX.y*distance;
                this.pos.z = -tempAxeX.z*distance;
			}else{
                this.pos.x += tempAxeX.x*distance;
                this.pos.y += tempAxeX.y*distance;
                this.pos.z += tempAxeX.z*distance;
			}
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.change = true;
		}
		
		
		/**
		 * 当前方向Y轴移动
		 * @param distance
		 * 
		 */		
		public upPos(distance:number):void{
            this.transform.copyColumnTo(1, tempAxeX);
			tempAxeX.normalize();
            this.pos.x += tempAxeX.x*distance;
            this.pos.y += tempAxeX.y*distance;
            this.pos.z += tempAxeX.z*distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.change = true;
		}
		
		
		/**
		 * 当前方向X轴移动
		 * @param distance
		 * 
		 */		
		public rightPos(distance:number):void{
            this.transform.copyColumnTo(0, tempAxeX);
			tempAxeX.normalize();
            this.pos.x += tempAxeX.x*distance;
            this.pos.y += tempAxeX.y*distance;
            this.pos.z += tempAxeX.z*distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.change = true;
		}
		
		/**
		 * 
		 * @param rx
		 * @param ry
		 * @param rz
		 * 
		 */		
		public setRot(rx:number,ry:number,rz:number,update:Boolean = true):void{
            this.rot.x =this._rotationX = rx * DEGREES_TO_RADIANS;
            this.rot.y =this._rotationY = ry * DEGREES_TO_RADIANS;
            this.rot.z =this._rotationZ = rz * DEGREES_TO_RADIANS;
			if(update){
                this.setDirty(BIT_VC);
                this._change = true;
			}
		}
		
		
		/**
		 * 
		 * @param rx
		 * @param ry
		 * @param rz
		 * 
		 */		
		public setRotRadians(rx:number,ry:number,rz:number,update:Boolean = true):void{
            this.rot.x =this._rotationX = rx;
            this.rot.y =this._rotationY = ry;
            this.rot.z =this._rotationZ = rz;
			if(update){
                this.setDirty(BIT_VC);
                this._change = true;
			}
		}
		
		public set scale(value:number)
		{
            this.setSca(value,value,value);
		}
		
		public get scale():number
		{
			if(this._scaleX == this._scaleY && this._scaleX == this._scaleZ)
			{
				return this._scaleX;
			}
			return 1;	
		}
		
		public setSca(sx:number,sy:number,sz:number,update:Boolean = true):void{
            this.sca.x =this._scaleX = sx;
            this.sca.y =this._scaleY = sy;
            this.sca.z =this._scaleZ = sz;
			if(update){
                this.setDirty(BIT_VC);
                this._change = true;
			}
		}

		
		
		public setPivotPonumber(x:number,y:number,z:number):void{
            if(undefined == this.pivotPonumber){this.pivotPonumber = new Vector3D()};
            this.pivotPonumber.x = x;
            this.pivotPonumber.y = y;
            this.pivotPonumber.z = z;
            this.pivotZero = (x != 0 || y != 0 || z != 0);
		}

		
		public setTransform(matrix:Matrix3D):void{
//			transform.copyFrom(matrix);
            var vs:Vector3D[] = matrix.decompose();
            this.pos.copyFrom(vs[0]);
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.rot.copyFrom(vs[1]);
            this.
                //			if(rot.z<0){
                //				rot.z = Math.PI / 2 - rot.z;
                //				rot.x -= Math.PI / 2;
                //				rot.y -= Math.PI / 2;
                //			}
                _rotationX = this.rot.x;
            this._rotationY = this.rot.y;
            this._rotationZ = this.rot.z;
			
            this.sca.copyFrom(vs[2]);
            this._scaleX = this.sca.x;
            this._scaleY = this.sca.y;
            this._scaleZ = this.sca.z;
            this.
                //			trace("===",rotationX.toFixed(0),rotationY.toFixed(0),rotationZ.toFixed(0))
                //			trace("---",scaleX.toFixed(0),scaleY.toFixed(0),scaleZ.toFixed(0))
                change = true;
//			trace(pos);
		}
		
		
		

		/**
		 * 
		 */		
		public updateTransform():void{
			if (this.pivotZero) {
				
                this.transform.identity();
                this.transform.appendTranslation(-this.pivotPonumber.x, -this.pivotPonumber.y, -this.pivotPonumber.z);
                this.transform.appendScale(this._scaleX, this._scaleY, this._scaleZ);
                this.transform.appendTranslation(this._x,this._y,this._z);
                this.transform.appendTranslation(this.pivotPonumber.x, this.pivotPonumber.y, this.pivotPonumber.z);
//				sca.x = 1;
//				sca.y = 1;
//				sca.z = 1;
//				transform.recompose(transformComponents);
//				transform.prependTranslation(-pivotPonumber.x, -pivotPonumber.y, -pivotPonumber.z);
//				transform.appendScale(_scaleX, _scaleY, _scaleZ);
//				transform.appendTranslation(pivotPonumber.x, pivotPonumber.y, pivotPonumber.z);
//				sca.x = _scaleX;
//				sca.y = _scaleY;
//				sca.z = _scaleZ;
			}else{
                this.transform.recompose(this.transformComponents);
			}
			
            this._change = false;
		}
		
		
		/**
		 * 
		 * 
		 */		
		public updateSceneTransform():void{
            this.sceneTransform.copyFrom(this.transform);
			if(this.parent) this.sceneTransform.append(this.parent.sceneTransform);
			// var raw:Float32Array = this.sceneTransform.rawData;
			// scenePos.x = raw[12];
			// scenePos.y = raw[13];
			// scenePos.z = raw[14];
		}
		
		
		/**
		 * 
		 * @param now
		 * 
		 */		
//		public render(now:number):void{
//		}
		
		
		public remove():void{
			if(this.parent){
				this.parent.removeChild(this);
			}
        }
        
        public addToStage():void{};
        public removeFromStage():void{};
        
        public setSize(width:number, height:number):void{
            this._width = width;
            this._height = height;
			this.invalidate();
        }
        
        protected invalidateFuncs:Function[] = [];

        protected invalidate(func:Function = null):void{
			ROOT.addEventListener(EngineEvent.ENTER_FRAME, this.onInvalidate,this);
			if(null == func){
				func = this.doResize;
			}
			
			if(this.invalidateFuncs.indexOf(func) == -1){
				this.invalidateFuncs.push(func);
			}
        }

        protected invalidateRemove(func:Function = null):void{
			if(null == func){
				func = this.doResize;
			}
			var i:number = this.invalidateFuncs.indexOf(func);
			if(i != -1){
                this.invalidateFuncs.splice(i,1);
				if(!this.invalidateFuncs.length){
					ROOT.removeEventListener(EngineEvent.ENTER_FRAME, this.onInvalidate);
				}
			}
		}
        
        protected onInvalidate(event:EventX):void{
            event.currentTarget.removeEventListener(EngineEvent.ENTER_FRAME, this.onInvalidate);
			var arr:Function[] = this.invalidateFuncs.concat();
            this.invalidateFuncs.length = 0;
			for(var func of arr){
				func();
			}
        }

        protected doResize():void{}
    }
}