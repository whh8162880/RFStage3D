
                precision mediump float;
                #define USE_SKINNING;
				#define MAX_BONES 50;

                attribute vec3 pos;
                attribute vec3 normal;
                attribute vec2 uv;

                #ifdef USE_SKINNING
                    attribute vec4 index;
                    attribute vec4 weight;
                #endif

                uniform mat4 mvp;
                uniform mat4 invm;

                uniform vec3 lightDirection;
                
                varying vec4 vDiffuse;
                varying vec2 vUV;


                #ifdef USE_SKINNING
                    uniform mat4 bindMatrix;
                    uniform mat4 bindMatrixInverse;
                    #ifdef BONE_TEXTURE
                        uniform sampler2D boneTexture;
                        uniform int boneTextureSize;
                        mat4 getBoneMatrix( const in float i ) {
                            float j = i * 4.0;
                            float x = mod( j, float( boneTextureSize ) );
                            float y = floor( j / float( boneTextureSize ) );
                            float dx = 1.0 / float( boneTextureSize );
                            float dy = 1.0 / float( boneTextureSize );
                            y = dy * ( y + 0.5 );
                            vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
                            vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
                            vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
                            vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
                            mat4 bone = mat4( v1, v2, v3, v4 );
                            return bone;
                        }
                    #else
                        uniform mat4 bones[ MAX_BONES ];
                        mat4 getBoneMatrix( const in float i ) {
                            mat4 bone = bones[ int(i) ];
                            return bone;
                        }
                    #endif
                #endif

                void main() {

                    vec4 t_pos = vec4(pos, 1.0);
                    vec3 t_normal = normal;

                    #ifdef USE_SKINNING
                        mat4 boneMatX = getBoneMatrix( index.x );
                        mat4 boneMatY = getBoneMatrix( index.y );
                        mat4 boneMatZ = getBoneMatrix( index.z );
                        mat4 boneMatW = getBoneMatrix( index.w );
                    #endif


                    #ifdef USE_SKINNING
                        mat4 skinMatrix = mat4( 0.0 );
                        skinMatrix += weight.x * boneMatX;
                        skinMatrix += weight.y * boneMatY;
                        skinMatrix += weight.z * boneMatZ;
                        skinMatrix += weight.w * boneMatW;
                        t_normal = vec4( skinMatrix * vec4( t_normal, 0.0 ) ).xyz;
                        t_pos = skinMatrix * t_pos;
                    #endif

                    vec3  invLight = normalize(invm * vec4(lightDirection, 0.0)).xyz;
                    float diffuse  = clamp(dot(t_normal.xyz, invLight), 0.1, 1.0);
                    vDiffuse = vec4(vec3(diffuse), 1.0);
                    vUV = uv;
                    gl_Position = mvp * t_pos;
                }
            