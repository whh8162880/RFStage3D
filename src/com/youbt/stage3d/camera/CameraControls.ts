module rf{
    export class TrackballControls{
        object:DisplayObject;
        target:Vector3D;
        mouseSitivity:number = 0.5;
        distance:number;
        constructor(object:DisplayObject){
            this.object = object;
            this.target = new Vector3D();
           
            ROOT.on(MouseEventX.MouseDown,this.mouseDownHandler,this);
            ROOT.on(MouseEventX.MouseWheel,this.mouseWheelHandler,this);
            
        }

        mouseWheelHandler(event:EventX):void{
            let e =event.data;
			this.object.forwardPos(-e.deltaY);
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
            let event = e.data;
            let dx:number = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            let dy:number = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            dx *= pixelRatio;
            dy *= pixelRatio;

            let rx = dy*mouseSitivity + object.rotationX;
            let ry = dx*mouseSitivity + object.rotationY;
            
            if(target){
				var transform:Matrix3D = CALCULATION_MATRIX;
				transform.identity();
				transform.appendTranslation(0, 0, -distance);
				transform.appendRotation(rx, Vector3D.X_AXIS);
				transform.appendRotation(-ry, Vector3D.Y_AXIS);
				transform.appendTranslation(target.x, target.y, target.z);
				let raw = transform.rawData;
                object.setPos(raw[12],-raw[13],raw[14]);
            }
            object.rotationX = rx;
			object.rotationY = ry;
        }
    }
}
