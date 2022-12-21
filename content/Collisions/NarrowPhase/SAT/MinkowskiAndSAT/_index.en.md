+++
title = "Minkowski And SAT"
date = 2022-12-20T17:14:18+01:00
weight = 8
chapter = false
pre = "<b>8. </b>"
mathJaxInitialize = "{ \"chtml\": { \"displayAlign\": \"left\" } }"
+++

## The basic SAT algorithm

Let's get back at the original SAT implementation.\
Note that the following works for every dimension.

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
struct Range
{
    float min, max;
};

bool DoRangesOverlap(const Range& range1, const Range& range2)
{
    return range1.max > range2.min && range2.max > range1.min;
}

bool TestCollisionsWithSAT(const Shape& shape1, const Shape& shape2)
{
    std::vector<Vector> axes = GetEveryAxisInTheWholeWorld();

    for (const Vector& axis : axes)
    {
        Range projection1 = shape1.ProjectOnAxis(axis);
        Range projection2 = shape2.ProjectOnAxis(axis);

        // if there is a separating hyperplane
        if (!DoRangesOverlap(projection1, projection2))
        {
            // then there is no collision
            return false; 
        }
    }

    return true;
}
```
{{% /tab %}}
{{< /tabs >}}

## Modifying the SAT

From now on, we will start to changing parts of the code.\
However, even with modifications, the code will always be working the same as before.

First, we will explicit ProjectOnAxis() : 
```cpp
projection = shape.Project(axis);
```

becomes 

```cpp
float maxProj = shape.GetMaxProj(axis);
float minProj = shape.GetMinProj(axis);
```

Obviously, GetMinProj(axis) is equivalent to GetMaxProj(- axis).\
This is just the range, but explicited. Nothing unusual.\
For the sake of explanation, we can even get the point out of the functions.

```cpp
// The point with the max projection on axis
Vector ptMaxProj = shape.GetPtMaxProj(axis);

// The point with the min projection on axis
Vector ptMinProj = shape.GetPtMinProj(axis); 

// projecting the points back one the axis, so we have the same values than before
float maxProj = DotProduct(ptMaxProj, axis); 
float minProj = DotProduct(ptMinProj, axis); 
```

Now, we can:
- explicit DoRangesOverlap(), change the inequality and applying boolean logic
- replace the code

And we get:

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
Vector ptMaxProj1 = shape.GetPtMaxProj(axis);
Vector ptMinProj1 = shape.GetPtMinProj(axis); 
float maxProjShape1 = DotProduct(ptMaxProj1, axis); 
float minProjShape1 = DotProduct(ptMinProj1, axis); 

Vector ptMaxProj2 = shape.GetPtMaxProj(axis);
Vector ptMinProj2 = shape.GetPtMinProj(axis); 
float maxProjShape2 = DotProduct(ptMaxProj2, axis); 
float minProjShape2 = DotProduct(ptMinProj2, axis); 

// if there is a separating hyperplane
if (maxProjShape1 - minProjShape2 < 0 || minProjShape1 - maxProjShape2 > 0)
{
    // then there is no collision
    return false; 
}
```
{{% /tab %}}
{{< /tabs >}}

Now, let's replace:
```cpp
maxProjShape1 - minProjShape2
```
by: 
```cpp
DotProduct(shape1.GetPtMaxProj(axis), axis) - DotProduct(shape2.GetPtMinProj(axis), axis)
```

Now, let's do a bit of simple maths:\
Let u, v and p be vectors of N dimension.\
We have:

```math
$$u \cdot p - v \cdot p$$
$$= \sum (u_{i} * p_{i}) - \sum (v_{i} * p_{i})$$
$$= \sum (u_{i} * p_{i} - v_{i} * p_{i})$$
$$= \sum ((u_{i} - v_{i}) * p_{i})$$
```

It means that we can replace our the last code part by:
```cpp
Vector minkowskiPtWithMaxProj = shape1.GetPtMaxProj(axis) - shape2.GetPtMinProj(axis);
float minkowskiSumMaxProj = DotProduct(minkowskiPtWithMaxProj, axis);
```

we just computed a point from the minkowskiSum!!!!!!\
Or rather, if A and B are our shapes, the expression we have is A - B.

We can now show the final code:

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
bool TestCollisionsWithSAT(const Shape& shape1, const Shape& shape2)
{
    std::vector<Vector> axes = GetEveryAxisInTheWholeWorld();

    for (const Vector& axis : axes)
    {
        Vector minkowskiPtWithMaxProj = shape1.GetPtMaxProj(axis) - shape2.GetPtMinProj(axis);
        float minkowskiSumMaxProj = DotProduct(minkowskiPtWithMaxProj, axis);

        // Note that this is the minimum projection instead of the maximum we just computed above
        Vector minkowskiPtWithMinProj = shape1.GetPtMinProj(axis) - shape2.GetMaxProj(axis);
        float minkowskiSumMinProj = DotProduct(minkowskiPtWithMinProj, axis);

        // If 0 is outside the projection
        if (minkowskiSumMaxProj < 0 || minkowskiSumMinProj > 0)
        {
            return false; 
        }
    }

    return true;
}
```
{{% /tab %}}
{{< /tabs >}}

REVELATION!!!!!\
There was an imposter among us!\
And it was Minkowski!!!

Let's explain that.

## A different point of view

We're doing the Minkowski sum A - B.\
If the shapes are overlapping, it means that there is atleast 1 point both shapes are sharing.\
In that case, for that point, A - B would return the origin, since the point from A and B would negate each other.\
So if there is a collision, the origin should be inside the Minkowski shape!\
However, that just delays the problem...

\
The Minkowski shape is convex since both A and B are convex.\
A point is, in itself, convex.\
Is there an algorithm capable of determining if there is a collision between 2 convex shapes?\
Yes!!\
The Separating Axis Theorem is!!!

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
bool TestCollisionsWithSAT(const Shape& shape1, const Shape& shape2)
{
    std::vector<Vector> axes = GetEveryAxisInTheWholeWorld();

    Shape minkowskiSum = shape1 - shape2;

    for (const Vector& axis : axes)
    {
        // The projection of the origin is 0 on any axis
        // So if the projection of the origin is not in projection of the Minkowski shape:
        if (minkowskiSum.GetPtMaxProj(axis) < 0 || minkowskiSum.GetPtMinProj(axis) > 0)
        {
            return false; 
        }
    }

    return true;
}
```
{{% /tab %}}
{{< /tabs >}}

Note that this code is still doing the same thing as what we had before.\
Here, the Minkowski shape is just computed before the loop, and then projecting it, instead of getting the projections on the fly.\
The condition also became very straightforward.

## Conclusion

Let A and B be two closed convex shapes.

We just proved that:\
**"If two convex shapes do not collide, then, a hyperplane can separate them."**\
Is strictly equivalent to:\
**"If the shapes are not colliding, then, the origin is inside the Minkowski sum A - B."**

\
And a convex shape is defined by its tangent hyperplanes.\
So we can just verify if the origin is "inside" the hyperplanes.

\
That proof works for **any euclidean space**!!!

