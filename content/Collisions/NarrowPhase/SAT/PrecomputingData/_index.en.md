+++
title = "Precomputing data"
date = 2022-12-11T17:14:18+01:00
weight = 6
chapter = false
pre = "<b>6. </b>"
+++

## Testing the same shape multiple times 

Let's supposed we test 1 shape with 10 other shapes. \
Every time we will test a collision, we will project the 1st shape onto the axes. \
However, half of the axes will stay the same, because half of the axes will be computed from that 1st shape. \
That means we can precompute both the axes, but also the projections of the shape on half of the axes between the broadphase and the narrow phase.

{{% notice warning %}}
The previous algorithm would have returned as soon as it detects there are no collisions.
This means less data could have been computed.
By precomputing this data, we asssume shapes most likely collide to be efficient. 
This is one of the reasons the broadphase is so important. Otherwise, it could end up taking more performance instead.
{{% /notice %}}

## Static Objects 

When objects are moving, we have to compute axes in world space again every frame.\
However, when objects are not moving (i.e. static), their world position do not change.\
That means the following won't change:
- half of the axes
- the projections of the shape on these axes 

We can cache that data.

{{% notice warning %}}
We have no idea when a collision would occur.
Precomputing everything would cost a lot of memory, for collisions that might never happen. 
{{% /notice %}}
{{% notice tip %}}
To optimize that, we could use world partitioning and only load / compute this data when getting close to the associated object. 
{{% /notice %}}

## Caching the separating axis

You can save the separating axis for a pair for the next frame.\
That way, at the next frame, you can test if that separating axis is still valid, and potentially have O(1) complexity.

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
bool TestCollisionsWithSATOnAxis(const Shape& shape1, const Shape& shape2, const Axis& axis)
{
    Range projection1 = shape1.ProjectOnAxis(axis);
    Range projection2 = shape2.ProjectOnAxis(axis);

    return DoRangesOverlap(projection1, projection2);
}

void NarrowPhaseBetween2Shapes(CollisionPair& collisionPair)
{
    if (collisionPair.lastSeparatingAxis != nullptr && !TestCollisionsWithSATOnAxis(collisionPair.shape1, collisionPair.shape2, lastSeparatingAxis))
    {
        return false;
    }

    TestCollisionsWithSAT(collisionPair.shape1, collisionPair.shape2, collisionPair.output)
}
```
{{% /tab %}}
{{< /tabs >}}