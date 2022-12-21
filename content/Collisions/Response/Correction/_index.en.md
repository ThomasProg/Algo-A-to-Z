+++
title = "Correction"
date = 2022-12-11T17:14:18+01:00
weight = 4
chapter = false
pre = "<b>4. </b>"
+++

## The problem

As we are simulating physics, and not actually doing it, there is an imprecision coming with the program.\
For example, the collision point is not going to be exactly on the intersection of the two shapes.\
After the collision has been detected, the two shapes would already be overlapping.\
The imprecision can be "corrected in a few ways.\
The goal of this page is to show you different ways of doing it.

## Reset the shapes transform

The easy way is just to reset the shapes back at the previous frame.

```cpp

void RunCorrection(const Shape* shape1, const Shape* shape2, const CollisionInfo& collisionInfo)
{
    shape1->position = shape1->lastPosition;
    shape1->rotation = shape1->lastRotation;

    shape2->position = shape2->lastPosition;
    shape2->rotation = shape2->lastRotation;

}

```

Pros:
- This gives stable results

Cons:
- This is not how real physics work

## Move the shapes back at the collision point

void RunCorrection(const Shape& shape1, const Shape& shape2, const CollisionInfo& collisionInfo)
{
    float t = 1 - collisionInfo.mvt / Distance(shape1.lastPosition,shape1.position);

    shape1.position = lerp(shape1.position, shape1.lastPosition, t);
    shape2.position = lerp(shape2.position, shape2.lastPosition, t);
    shape1.rotation = lerp(shape1.rotation, shape1.lastRotation, t);
    shape2.rotation = lerp(shape2.rotation, shape2.lastRotation, t);

}

This is the equivalent to [The first part of NarrowPhase/SAT/ContinuousCollision]( {{< ref "../../NarrowPhase/SAT/ContinuousCollision/_index.en.md#Continuous-collision-for-non-rotating-shapes" >}} ) 