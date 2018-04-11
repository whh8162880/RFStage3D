///<reference path="../display/DisplayObject.ts" />
module rf{
    export class Camera extends DisplayObject implements IResizeable{
        len:Matrix3D;
        far :number;

        originFar:number;
        worldTranform:Matrix3D;
        constructor(far:number = 10000){
            super();
            this.far = far;
            this.originFar = far / Math.PI2;
            this.len = new Matrix3D();
            this.worldTranform = new Matrix3D();
        }

        resize(width: number, height: number): void{}

        public updateSceneTransform(sceneTransform?:Matrix3D):void{
            if( this.states | DChange.trasnform){
                this.updateTransform();
                this.sceneTransform.copyFrom(this.transform);
                this.sceneTransform.invert();
                this.worldTranform.copyFrom(this.sceneTransform);
                this.worldTranform.append(this.len);
                this.states &= ~DChange.trasnform;
            }
        }


        lookat(target:Vector3D, upAxis:Vector3D=null):void{
			let xAxis = tempAxeX;
			let yAxis = tempAxeY;
            let zAxis = tempAxeZ;
            
            const{transform,_scaleX,_scaleY,_scaleZ,_x,_y,_z,rot}=this;
			
            if(undefined == upAxis){
                upAxis = Vector3D.Y_AXIS;
            }
			
			upAxis = transform.transformVector(upAxis);
			
			zAxis.x = target.x - _x;
			zAxis.y = target.y - _y;
			zAxis.z = target.z - _z;
			zAxis.normalize();
			
			xAxis.x = upAxis.y*zAxis.z - upAxis.z*zAxis.y;
			xAxis.y = upAxis.z*zAxis.x - upAxis.x*zAxis.z;
			xAxis.z = upAxis.x*zAxis.y - upAxis.y*zAxis.x;
			xAxis.normalize();
			
			if (xAxis.length < .05) {
				xAxis.x = upAxis.y;
				xAxis.y = upAxis.x;
				xAxis.z = 0;
				xAxis.normalize();
			}
			
			yAxis.x = zAxis.y*xAxis.z - zAxis.z*xAxis.y;
			yAxis.y = zAxis.z*xAxis.x - zAxis.x*xAxis.z;
			yAxis.z = zAxis.x*xAxis.y - zAxis.y*xAxis.x;
			
			let raw = this.transform.rawData;
			
			raw[0] = _scaleX*xAxis.x;
			raw[1] = _scaleX*xAxis.y;
			raw[2] = _scaleX*xAxis.z;
			raw[3] = 0;
			
			raw[4] = _scaleY*yAxis.x;
			raw[5] = _scaleY*yAxis.y;
			raw[6] = _scaleY*yAxis.z;
			raw[7] = 0;
			
			raw[8] = _scaleZ*zAxis.x;
			raw[9] = _scaleZ*zAxis.y;
			raw[10] = _scaleZ*zAxis.z;
			raw[11] = 0;
			
			raw[12] = _x;
			raw[13] = _y;
			raw[14] = _z;
			raw[15] = 1;
			
			if (zAxis.z < 0) {
				this.rotationY = (180 - this.rotationY);
				this.rotationX -= 180;
				this.rotationZ -= 180;
			}
			
			let v = transform.decompose();
			xAxis = v[1];
			rot.x = this._rotationX = xAxis.x;
			rot.y = this._rotationY = xAxis.y;
			rot.z = this._rotationZ = xAxis.z;
			this.setChange(DChange.trasnform);
		}
    }

    export class CameraUI extends Camera{
        resize(width: number, height: number): void{
            this.w = width;
            this.h = height;

            let rawData = this.len.rawData;

            rawData[0] = 2/width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;

            rawData[4] = 0;
            rawData[5] = -2/height;
            rawData[6] = 0;
            rawData[7] = 0;

            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1/this.far;
            rawData[11] = 0;

            rawData[12] = -1;
            rawData[13] = 1;
            rawData[14] = 0;
            rawData[15] = 1;

            this.states |= DChange.trasnform;
        }
    }

    // Orthographic Projection
    export class CameraOrth extends Camera{
        
        resize(width: number, height: number): void{
            this.w = width;
            this.h = height;

            let rawData = this.len.rawData;

            rawData[0] = 2/width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;

            rawData[4] = 0;
            rawData[5] = 2/height;
            rawData[6] = 0;
            rawData[7] = 0;

            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1/this.far;
            rawData[11] = 0;

            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;

            this.states |= DChange.trasnform;
        }

        
    }

    //  Perspective Projection Matrix
    export class Camera3D extends Camera{
        resize(width: number, height: number): void{
            this.w = width;
            this.h = height;

            let rawData = this.len.rawData;

            rawData[0] = 2/width;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;

            rawData[4] = 0;
            rawData[5] = 2/height;
            rawData[6] = 0;
            rawData[7] = 0;

            rawData[8] = 0;
            rawData[9] = 0;
            rawData[10] = 1/this.far;
            rawData[11] = 1/this.originFar;

            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 0;

            this.states |= DChange.trasnform;
        }
    }
}