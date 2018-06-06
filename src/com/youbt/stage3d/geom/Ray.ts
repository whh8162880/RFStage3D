///<reference path="Matrix3D.ts"/>
module rf{
    export class Ray{
        origin:IVector3D;
        direction:IVector3D;

        constructor(origion?:IVector3D, direction?:IVector3D){
            this.origin = newVector3D(origion);
            this.direction = newVector3D(direction);
        }

        copyFrom(ray:Ray):Ray{
            this.origin.set(ray.origin);
            this.direction.set(ray.direction);
            return this;
        }

        at(t:number, target?:IVector3D){
            if(target == undefined){
                target = newVector3D()
            }
            target.set(this.direction);
            target.v3_scale(t);
            target.v3_add(this.origin, target);
            return target;
        }

        applyMatrix4(matrix:IMatrix3D):Ray{
            matrix.m3_transformVector(this.origin,this.origin);
            matrix.m3_transformRotation(this.direction, this.direction);
            return this;
        }

        intersectsSphere(sphere:Sphere):boolean{
            return this.distanceSqToPoint( sphere.center ) <= sphere.radius;
        }

        distanceSqToPoint( point:IVector3D ):number{
            let v1 = rf.TEMP_VECTOR3D;
            v1.set(point);
            v1.v3_sub(this.origin, v1);
            
			let directionDistance = v1.v3_dotProduct( this.direction );

			if ( directionDistance < 0 ) {
                v1.set(this.origin);
                v1.v3_sub(point, v1);
				return v1.v3_length;
			}
            v1.set(this.direction);
            v1.v3_scale(directionDistance);
            v1.v3_add(this.origin, v1);
			v1.v3_sub(point, v1);
            return v1.v3_length;

		}

        intersectBox( box: IBox, target?:IVector3D):IVector3D {

            let tmin, tmax, tymin, tymax, tzmin, tzmax;
    
            let invdirx = 1 / this.direction.x,
                invdiry = 1 / this.direction.y,
                invdirz = 1 / this.direction.z;
    
            var origin = this.origin;
    
            if ( invdirx >= 0 ) {
    
                tmin = ( box.minx - origin.x ) * invdirx;
                tmax = ( box.maxx - origin.x ) * invdirx;
    
            } else {
    
                tmin = ( box.maxx - origin.x ) * invdirx;
                tmax = ( box.minx - origin.x ) * invdirx;
    
            }
    
            if ( invdiry >= 0 ) {
    
                tymin = ( box.miny - origin.y ) * invdiry;
                tymax = ( box.maxy - origin.y ) * invdiry;
    
            } else {
    
                tymin = ( box.maxy - origin.y ) * invdiry;
                tymax = ( box.miny - origin.y ) * invdiry;
    
            }
    
            if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;
    
            if ( tymin > tmin || tmin !== tmin ) tmin = tymin;
    
            if ( tymax < tmax || tmax !== tmax ) tmax = tymax;
    
            if ( invdirz >= 0 ) {
    
                tzmin = ( box.minz - origin.z ) * invdirz;
                tzmax = ( box.maxz - origin.z ) * invdirz;
    
            } else {
    
                tzmin = ( box.maxz - origin.z ) * invdirz;
                tzmax = ( box.minz - origin.z ) * invdirz;
    
            }
    
            if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;
    
            if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;
    
            if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;
    
            if ( tmax < 0 ) return null;
    
            return this.at( tmin >= 0 ? tmin : tmax, target );
    
        }



        static diff:IVector3D = newVector3D();
        static edge1:IVector3D = newVector3D();
        static edge2:IVector3D = newVector3D();
        static normal:IVector3D = newVector3D();
		
        intersectTriangle( a:IVector3D, b:IVector3D, c:IVector3D, backfaceCulling:boolean, target:IVector3D ):IVector3D{

            // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
            let{diff, edge1, edge2, normal} = Ray;

            edge1.set(b);
            edge1.v3_sub(a, edge1);
            edge2.set(c);
            edge2.v3_sub(a, edge2);
            normal.set(edge1)
			normal.v3_crossProduct( edge2, normal);

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			let DdN = this.direction.v3_dotProduct( normal );
			let sign;
			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}
            diff.set(this.origin);
            diff.v3_sub(a, diff);

            diff.v3_crossProduct(edge2,edge2);
			let DdQxE2 = sign * this.direction.v3_dotProduct(edge2 );

			if ( DdQxE2 < 0 ) {
				return null;
			}
            edge1.v3_crossProduct(diff, edge1)
			let DdE1xQ = sign * this.direction.v3_dotProduct(edge1);

			if ( DdE1xQ < 0 ) {
				return null;
			}

			if ( DdQxE2 + DdE1xQ > DdN ) {
				return null;
			}

			var QdN = - sign * diff.v3_dotProduct( normal );

			if ( QdN < 0 ) {
				return null;
			}

			return this.at( QdN / DdN, target );

        }
        


    }


    export interface IBox{
        minx:number;
        maxx:number;
        miny:number;
        maxy:number;
        minz:number;
        maxz:number;
    }
        
}