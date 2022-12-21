+++
title = "Response"
date = 2022-12-11T17:14:18+01:00
weight = 5
chapter = true
pre = "<b>> </b>"
+++

# Response

## Summary: 
After detecting a collision, we need to move the shapes appropriately.\
If we're using reality based physics, then we have to apply physics laws.\
In the following chapters, we will see how to update things appropriately.

For the following chapters, we consider the narrow phase is returning a CollisionInfo:

```cpp

struct CollisionInfo
{
    float mtv; // Minimum Translation Vector
    Vec3 collisionPoint;
    Vec3 normal;
};

```

```cpp
void RunPhysicalResponse(Shape* shape1, Shape* shape2, const CollisionInfo& collisionInfo)
{
    RunCorrection(shape1, shape2, collisionInfo);
    UpdateVelocity(shape1, shape2, collisionInfo);
    UpdateAngularVelocity(shape1, shape2, collisionInfo);
}
```

## Index: 

{{% children  %}} 