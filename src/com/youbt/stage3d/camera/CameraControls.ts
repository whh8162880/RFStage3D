module rf{
    export class TrackballControls{
        object:Camera;
        target:IVector3D;
        mouseSitivity:number = 0.3;
        distance:number;
        constructor(object:Camera){
            this.object = object;
            this.target = newVector3D();
            this.distance = this.object.pos.v3_sub(this.target).v3_length;
            ROOT.on(MouseEventX.MouseDown,this.mouseDownHandler,this);
            ROOT.on(MouseEventX.MouseWheel,this.mouseWheelHandler,this);
            ROOT.on(MouseEventX.MouseRightDown,this.mouseRightDownHandler,this);

            this.updateSun();
        }

        updateSun(){
            // const{object,target}=this;
            // let sun = scene.sun;
            // sun.x = object._x - target.x;
            // sun.y = object._y - target.y;
            // sun.z = object._z - target.z;
        }

        set tdistance(value:number){
            // console.log(value);
            this.distance = value;
            this.object.forwardPos(value,this.target);
        }

        get tdistance():number{
            return this.distance;
        }


        tweener:ITweener;

        mouseWheelHandler(event:EventX):void{
           
            // const{distance} = this;

            let distance = this.object.pos.v3_sub(this.target).v3_length;
            this.distance = distance;

            let{wheel}=event.data;
            let step = 1;
            if(wheel < 0 && distance<500){
                step = distance / 500;
            }

            wheel = wheel*step;

            let{tweener}=this;
            if(tweener){
                tweenStop(tweener);
            }
            this.tweener = tweenTo({tdistance: distance+wheel*2},Math.abs(wheel)*2,defaultTimeMixer,this);
            
            
            // this.object.z += e.deltaY > 0 ? 1: -1
            // this.distance = this.object.pos.subtract(this.target).length;
        }

        mouseDownHandler(event:EventX):void{
            ROOT.on(MouseEventX.MouseMove,this.mouseMoveHandler,this);
            ROOT.on(MouseEventX.MouseUp,this.mouseUpHandler,this);
            this.distance = this.object.pos.v3_sub(this.target).v3_length;
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
            speed = Math.max(speed,0.1);

            let rx = dy*speed + object.rotationX;
            let ry = -dx*speed + object.rotationY;
            
            if(target){
                var transform:IMatrix3D = TEMP_MATRIX;
				transform.m3_identity();
				transform.m3_translation(0, 0, -distance);
				transform.m3_rotation(rx * DEGREES_TO_RADIANS,X_AXIS);
				transform.m3_rotation(ry * DEGREES_TO_RADIANS, Y_AXIS);
				transform.m3_translation(target.x, target.y, target.z);
                object.setPos(transform[12],transform[13],transform[14]);
            }
            object.rotationX = rx;
            object.rotationY = ry;
            
            this.updateSun();
        }



        mouseRightDownHandler(event:EventX):void{
            ROOT.on(MouseEventX.MouseMove,this.mouseRightMoveHandler,this);
            ROOT.on(MouseEventX.MouseRightUp,this.mouseRightUpHandler,this);
        }


        mouseRightMoveHandler(event:EventX):void{
            let{dx,dy}=event.data;
            const{object,target}=this;
            dy *= (this.distance / object.originFar);
            target.y += dy;
            object.setPos(object._x,object._y += dy ,object._z);

            this.updateSun();
            

        }

        mouseRightUpHandler(event:EventX):void{
            ROOT.off(MouseEventX.MouseMove,this.mouseRightMoveHandler);
            ROOT.off(MouseEventX.MouseRightUp,this.mouseRightUpHandler);
        }
    }
}
