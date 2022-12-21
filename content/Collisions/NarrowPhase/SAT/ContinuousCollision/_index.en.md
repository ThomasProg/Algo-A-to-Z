+++
title = "Continuous collision"
date = 2022-12-20T17:14:18+01:00
weight = 10
chapter = false
pre = "<b>10. </b>"
mathJaxInitialize = "{ \"chtml\": { \"displayAlign\": \"left\" } }"
+++

## Continuous collision for non rotating shapes

If the shapes don't have any angular velocity, we can consider their separating axis never change.\
We have both shapes projected on an axis; we just have to take time into account, and find the moment their ranges intersect.\
This means we have a continuous collision... but only when the shapes are not rotating.\
The lower the rotation is, the more precise the collision is. 

```cpp
bool SimulatePhysics(Shape& shape1, Shape& shape2, CollisionInfo& collisionInfo)
{
    CollisionInfo satCollisionInfo;
    if (AreCollidingWithSAT(shape1, shape2, satCollisionInfo))
    {
        float speed1 = DotProduct(shape1.velocity, satCollisionInfo.normal);
        float speed2 = DotProduct(shape2.velocity, satCollisionInfo.normal);

        // We test if there is a collision with :  
        //
        // if (!(maxp1 > minp2 && maxp2 > minp1))

        // It becomes the following once we take the time into account, 
        // and since we consider the shape isn't rotating:
        //
        // if (!(maxp1 - speed1 * t > minp2 - speed2 * t && maxp2 - speed2 * t > minp1 - speed1 * t))

        // We don't care about the inequality, we just want t for when there is a collision, so:
        //
        // maxp1 - speed1 * t = minp2 - speed2 * t
        // maxp1 - minp2 = speed1 * t - speed2 * t
        // maxp1 - minp2 = (speed1 - speed2) * t
        // maxp1 - minp2 = (speed1 - speed2) * t
        // t1 = (maxp1 - minp2) / (speed1 - speed2) 
        //
        // And for the other:
        //
        // maxp2 - speed2 * t > minp1 - speed1 * t)
        // t2 = (maxp2 - minp1) / (speed2 - speed1)

        float t1 = (satCollisionInfo.maxp1 - satCollisionInfo.minp2) / (speed1 - speed2);
        float t2 = (satCollisionInfo.maxp2 - satCollisionInfo.minp1) / (speed2 - speed1);

        // one of the t is negative, the other positive
        // we want the positive value, since the negative value would be for the future        
        float t = (t1 > 0) ? t1 : t2;

        shape1.position -= t * shape1.velocity;
        shape2.position -= t * shape2.velocity; 

        // We know get:
        collisionInfo.hitNormal = satCollisionInfo.hitNormal;
        collisionInfo.mtv = 0; // the collision is exact, continuous
        collisionInfo.impactMagnitude = satCollisionInfo.mtv;
        collisionInfo.collisionPoint = satCollisionInfo.collisionPoint - t * satCollisionInfo.hitNormal;
        return true;
    }
    return false;
}
```

## Expansive Continuous collision 

Let's take a look into 2D.\
Let's superpose the frame before, and the frame after collision.\
If we draw a line between the vertices, then we get 3D shapes, that are still convex.\
Let's call the new axis we got T.\
This axis represents the time.\
If we follow this axis, we notice the shapes are not intersecting, then they are, and then, if we increase time, they will not anymore.\
This gives us an interval range, and we have to get the smallest value.\
At that moment, t, there is a collision.\
We can then compute the position both shapes had at that moment, keep the normal but removing the time component, and same for the collision point.

\
Since we can compute the SAT for any dimension, then that means we can compute the continuous collision.\
You might also notice that the previous part is also a special case of that continuous collision, for when the separating plane is the same.\
For both, we compute the time of the intersection and set the collision informations.







