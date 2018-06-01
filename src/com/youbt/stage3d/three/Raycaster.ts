///<reference path="../geom/Ray.ts" />
module rf {
    export class Raycaster{
        constructor(){
            this.ray = new Ray()
        }

        ray:Ray;

        setFromCamera( screenCoords:IVector3D, camera: Camera ) {

            if ( ( camera && camera.isPerspectiveCamera ) ) {
    
                this.ray.origin.set([camera.sceneTransform[12], camera.sceneTransform[13], camera.sceneTransform[14]]);
    
                this.ray.direction.set( [screenCoords.x, screenCoords.y, 0.5] )
                this.ray.direction.unproject( camera.sceneTransform, camera.len );
                this.ray.direction.v3_sub( this.ray.origin );
                this.ray.direction.v3_normalize();
    
            } else if ( ( camera && camera.isOrthographicCamera ) ) {
                this.ray.origin.set( [screenCoords.x, screenCoords.y, -1.0 ] )
                this.ray.origin.unproject( camera.sceneTransform, camera.len  ); // set origin in plane of camera
                this.ray.direction.set( [0, 0, - 1] );
                camera.sceneTransform.m3_transformVector(this.ray.direction,this.ray.direction)
    
            } else {
    
                console.error( 'THREE.Raycaster: Unsupported camera type.' );
    
            }
    
        }



    }
}