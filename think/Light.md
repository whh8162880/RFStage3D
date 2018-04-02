Matrix3D ?

    Matrix3D是由16个float每4个位一组组成的[缩放 角度 位置]信息。
    简单来说 每个DisplayObject在屏幕中 【缩放 角度 位置】靠这个Matrix3D数据 就可以很好表达。
    在不懂原理的情况下很难看懂这段话，但是这不重要，会用就行。就想象Matrix3D是把图像变成数字的工具吧。

    在我们DisplayObject中有2个Matrix3D 分别为 transform 和 sceneTransform。
    transform 表示我们对象相对自身的【缩放 角度 位置】信息
    sceneTransform 表示我们对象相对这个世界的【缩放 角度 位置】

Quaternion？

    四元数：四元数记录的是三维角度方向。我们经常见到的欧拉角(0~360)在说明三维角度方向上 并不出色 而且容易出现万向节死锁。四元数对三维角度运算非常由优势！

MVP ?

    M:model相对于世界的Matrix3D 在DisplayObject中属性为 sceneTransform;
    V:camra的Matrix3D信息。
    P:把点投射到显示器的Matrix3D信息。

    为什么要这么分?
        Model在我们设计的相对空间中摆放 成为第一逻辑层 M , 
        然后我们的然后Camera是在这空间中自由运动的 ，所以通过Camera看到的对象成为了第二层逻辑 MV。
        通过Camera看到的三维信息，需要投射到我们2D的屏幕上才能真正的看到，就有了第三层的逻辑 MVP。
    
    还是不懂？ 没关系 会用就行。 勤加练习。熟了就能知道其中道理。

NORMAL?
    
    我们的面由三个顶点构成 法线Normal是垂直于三角面的一条线  这条线能区分面的方向。大量用于光照的计算


光照知识:

    平行光(DirectionLight):平行光源出的光线从无限远的距离平行射向于整个三维空间。所以他的角度非常重要。

```typescript
    attribute vec3 position;    //顶点坐标
    attribute vec3 normal;      //法线信息  
    attribute vec4 color;       //顶点颜色
    uniform   mat4 mvpMatrix;   //世界矩阵
    uniform   mat4 invMatrix;   //模型在世界中的逆矩阵
    uniform   vec3 lightDirection;  //平行光源的方向
    varying   vec4 vColor;          // 顶点着色器 给 片段着色器的桥梁变量
    void main(void){
        vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;  <-----这句
        float diffuse  = clamp(dot(normal, invLight), 0.0, 1.0);                <-----这句
        vColor         = color * vec4(vec3(diffuse), 1.0);                      <-----这句
        gl_Position    = mvpMatrix * vec4(position, 1.0);
    }
```

    环境光(ambientColor):环境光是模拟现实世界中自然光不规则反射的概念
```ts
        ambientColor = [0.1,0.1,0.1,0]
        vColor = color * vec4(vec3(diffuse), 1.0) + ambientColor;
```

    反射光(reflection):光在照射到物体身上时会发生反射现象 我们可以在金属上看到很耀眼的亮斑就是这样来的
```glsl
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec4 color;
    uniform   mat4 mvpMatrix;
    uniform   mat4 invMatrix;
    uniform   vec3 lightDirection;
    uniform   vec3 eyeDirection;        //摄像机位置
    uniform   vec4 ambientColor;
    varying   vec4 vColor;

    void main(void){
        vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
        vec3  invEye   = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
        vec3  halfLE   = normalize(invLight + invEye);
        float diffuse  = clamp(dot(normal, invLight), 0.0, 1.0);
        float specular = pow(clamp(dot(normal, halfLE), 0.0, 1.0), 50.0);                   <----反射光的简单计算
        vec4  light    = color * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);
        vColor         = light + ambientColor;
        gl_Position    = mvpMatrix * vec4(position, 1.0);
    }
```

    颜色=顶点颜色*散射光+反射光+环境光


    点光源(PointLight)



    