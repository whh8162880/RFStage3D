module rf{
    export class TrackballControls{
        object:DisplayObject;
        target:Vector3D;
        mouseSitivity:number = 0.3;
        distance:number;
        constructor(object:DisplayObject){
            this.object = object;
            this.target = new Vector3D();
            ROOT.on(MouseEventX.MouseDown,this.mouseDownHandler,this);
            ROOT.on(MouseEventX.MouseWheel,this.mouseWheelHandler,this);
        }

        mouseWheelHandler(event:EventX):void{
           
            const{distance} = this;
            const{wheel}=event.data;
            let step = 1;
            if(wheel < 0 && distance<500){
                step = distance / 500;
            }

           
            this.object.forwardPos(-wheel*step);
            // this.object.z += e.deltaY > 0 ? 1: -1
            this.distance = this.object.pos.subtract(this.target).length;
        }

        mouseDownHandler(event:EventX):void{
            ROOT.on(MouseEventX.MouseMove,this.mouseMoveHandler,this);
            ROOT.on(MouseEventX.MouseUp,this.mouseUpHandler,this);
            this.distance = this.object.pos.subtract(this.target).length;
        }

        mouseUpHandler(e:EventX){
            ROOT.off(MouseEventX.MouseMove,this.mouseMoveHandler);
            ROOT.off(MouseEventX.MouseUp,this.mouseUpHandler);
        }

        mouseMoveHandler(e:EventX):void{
            const{object,target,mouseSitivity,distance}=this;
            const{dx,dy}=e.data
            // let dx:number = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            // let dy:number = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            // dx *= pixelRatio;
            // dy *= pixelRatio;

            let speed = (distance > 1000) ? mouseSitivity : mouseSitivity * distance / 1000;
            speed = Math.max(speed,0.015);

            let rx = dy*speed + object.rotationX;
            let ry = -dx*speed + object.rotationY;
            
            if(target){
				var transform:Matrix3D = CALCULATION_MATRIX;
				transform.identity();
				transform.appendTranslation(0, 0, -distance);
				transform.appendRotation(rx, Vector3D.X_AXIS);
				transform.appendRotation(ry, Vector3D.Y_AXIS);
				transform.appendTranslation(target.x, target.y, target.z);
				let raw = transform.rawData;
                object.setPos(raw[12],raw[13],raw[14]);
            }
            object.rotationX = rx;
			object.rotationY = ry;
        }
    }
}
