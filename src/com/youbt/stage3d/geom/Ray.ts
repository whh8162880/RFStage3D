///<reference path="Matrix3D.ts"/>
module rf{
    export class Ray{
        origin:IVector3D;
        direction:IVector3D;

        constructor(origion?:IVector3D, direction?:IVector3D){
            this.origin = newVector3D(origion);
            this.direction = newVector3D(direction);
        }


        at(t:number, target?:IVector3D){
            if(target == undefined){
                target = newVector3D()
            }
            target.set(this.direction);
            target.v3_scale(t);
            target.v3_add(this.origin);
            return target;
        }



        static diff:IVector3D = newVector3D();
        static edge1:IVector3D = newVector3D();
        static edge2:IVector3D = newVector3D();
        static normal:IVector3D = newVector3D();
		
        intersectTriangle( a:IVector3D, b:IVector3D, c:IVector3D, backfaceCulling:boolean, target:IVector3D ) {

            // from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
            let{diff, edge1, edge2, normal} = Ray;

            edge1.set(b);
            edge1.v3_sub(a);
            edge2.set(c);
            edge2.v3_sub(a);
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
            diff.v3_sub(a);

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
    
}