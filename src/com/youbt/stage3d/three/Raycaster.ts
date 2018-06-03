///<reference path="../geom/Ray.ts" />
module rf {
    export class Raycaster{
        constructor(far:number, near?:number){
            this.ray = new Ray()
            this.near = near;
            this.far = far;
        }

        ray:Ray;
        near:number = 0;
        far:number = 10000;

        setFromCamera( mousex:number, mousey:number, camera: Camera ) {

            if ( ( camera && camera.isPerspectiveCamera ) ) {
    
                this.ray.origin.set([camera.pos[0], camera.pos[1], camera.pos[2]]);
    
                this.ray.direction.set( [mousex,mousey , 0.5] )
                this.ray.direction.v3_unproject( camera.sceneTransform, camera.len );
                this.ray.direction.v3_sub( this.ray.origin );
                this.ray.direction.v3_normalize();
    
            } else if ( ( camera && camera.isOrthographicCamera ) ) {
                this.ray.origin.set( [mousex, mousey, 0.0 ] )
                this.ray.origin.v3_unproject( camera.sceneTransform, camera.len  );
                this.ray.direction.set( [0, 0, 1] );
                camera.sceneTransform.m3_transformVector(this.ray.direction,this.ray.direction)
    
            } else {
    
                console.error( 'THREE.Raycaster: Unsupported camera type.' );
    
            }
    
        }


        intersectObject(object:DisplayObject,intersects:IIntersectInfo[], recursive?:boolean ):void{
            if ( object.visible === false ) return;

            if(object instanceof SceneObject){
                object.raycast(this, intersects);
            }
            

            if(recursive && object instanceof DisplayObjectContainer){
                for(let child of object.childrens){
                    if(child instanceof DisplayObject){
                        this.intersectObject(child, intersects, true);
                    }
                }
            }

        }


        intersectObjects(arr:DisplayObject[], recursive?:boolean, intersects?:IIntersectInfo[]):IIntersectInfo[]{
            let result:IIntersectInfo[] = intersects || []

            for ( let i = 0, l = arr.length; i < l; i ++ ) {
                this.intersectObject( arr[ i ],  result, recursive );
            }
            result.sort(Raycaster.disSort)
            return result;
        }

        static disSort(a:IIntersectInfo, b:IIntersectInfo):number{
            return a.distance - b.distance;
        }

    }

    export interface IIntersectInfo{
        obj:SceneObject;
        distance:number;
    }
}