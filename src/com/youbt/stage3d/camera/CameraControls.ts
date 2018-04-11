module rf{
    export class TrackballControls{
        object:DisplayObject;
        target:Vector3D;
        mouseSitivity:number = 0.5;
        distance:number;
        // quaternion:Quaternion;
        // axis:Vector3D;
        // _eye:Vector3D;
        // eyeDirection:Vector3D;
        // objectUpDirection:Vector3D;
        // moveDirection:Vector3D;
        // objectSidewaysDirection:Vector3D;
        // rotateSpeed:number = 1.0
        constructor(object:DisplayObject){
            this.object = object;
            this.target = new Vector3D();
            // this.quaternion = new Quaternion();
            // this.axis = new Vector3D();
            // this._eye = new Vector3D();
            // this.eyeDirection = new Vector3D();
            // this.objectUpDirection = new Vector3D();
            // this.moveDirection = new Vector3D();
            // this.objectSidewaysDirection = new Vector3D();
            ROOT.on(MouseEventX.MouseDown,this.mouseDownHandler,this);
            
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
            // const{_eye,object,target,eyeDirection,objectUpDirection,moveDirection,objectSidewaysDirection,quaternion,axis,rotateSpeed}=this;
            let event = e.data;
            let dx:number = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            let dy:number = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            dx *= pixelRatio;
            dy *= pixelRatio;

            // dx = 1.0;
            // dy = 0.0;
            // let angle = Math.sqrt(dx * dx + dy * dy);
            // if ( angle ) {
            //     _eye.copyFrom(object.pos).subtract(target);
            //     eyeDirection.copyFrom( _eye ).normalize();
            //     objectUpDirection.copyFrom( object.up ).normalize();
            //     objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();
            //     objectUpDirection.setLength( dy );
            //     objectSidewaysDirection.setLength( dx );
            //     moveDirection.copyFrom( objectUpDirection.add( objectSidewaysDirection ) );
            //     axis.crossVectors( moveDirection, _eye ).normalize();
            //     angle *= rotateSpeed;
            //     quaternion.fromAxisAngle( axis, angle );
            //     _eye.applyQuaternion( quaternion );
            //     object.up.applyQuaternion( quaternion );
            // }

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
