///<reference path="../geom/Ray.ts" />
module rf {
    export class Raycaster{
        constructor(){
            this.ray = new Ray()
        }

        ray:Ray;

        setFromCamera( screenCoords:IVector3D, camera: Camera ) {

            if ( ( camera && camera.isPerspectiveCamera ) ) {
    
                // this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
                this.ray.origin.set([camera.worldTranform[12], camera.worldTranform[13], camera.worldTranform[14]]);

                this.ray.direction.set( [screenCoords.x, screenCoords.y, 0.5] ).unproject( camera ).sub( this.ray.origin ).normalize();
    
            } else if ( ( camera && camera.isOrthographicCamera ) ) {
    
                this.ray.origin.set( coords.x, coords.y, ( camera.near + camera.far ) / ( camera.near - camera.far ) ).unproject( camera ); // set origin in plane of camera
                this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );
    
            } else {
    
                console.error( 'THREE.Raycaster: Unsupported camera type.' );
    
            }
    
        }



    }
}