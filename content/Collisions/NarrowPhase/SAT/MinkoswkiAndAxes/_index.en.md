+++
title = "Minkowski And Axes"
date = 2022-12-20T17:14:18+01:00
weight = 9
chapter = false
pre = "<b>9. </b>"
mathJaxInitialize = "{ \"chtml\": { \"displayAlign\": \"left\" } }"
+++

## The basic SAT algorithm

We saw previously that the SAT could be explained using the Minkowski sum.

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

The algorithm isn't usable as it is, since GetEveryAxisInTheWholeWorld() is slow... and even slower for higher dimensions.\
However, do you remember how we previously got the axes the 2D case, by just taking the normals?\
It doesn't usually work in higher dimensions for two convex shapes...

\
**However**
It *does* work here.\
The same as previously, we want to know the shortest path the shape and the point.\
However, in the case, there is only one case possible: the path will *always* be a normal of the shape! 

## Code : The obvious way

To replace GetEveryAxisInTheWholeWorld(), we can just do the following:

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
bool TestCollisionsWithSAT(const Shape& shape1, const Shape& shape2)
{
    Shape minkowskiSum = shape1 - shape2;

    std::vector<Vector> axes = minkowskiSum.GetNormals();

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

However, the problem with that is that we have to compute the sum of Minkowski.

The obvious way would be to compute possible points and then to create a convex hull around them.\
A convex hull can be created for any dimension with the QuickHull algorithm.\
An implementation is available here : https://github.com/akuukka/quickhull/blob/master/QuickHull.cpp

\
It would then look like this:

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
Shape MinkowskiDiff(const Shape& shape1, const Shape& shape2)
{
    std::vector<Points> points;

    std::vector<Points>& vertices1 = shape1.GetVertices();
    std::vector<Points>& vertices2 = shape2.GetVertices();
    points.reserve(vertices1.size() + vertices2.size());

    for (const Vector& vertexPos1 : vertices1)
    {
        for (const Vector& vertexPos2 : vertices2)
        {
            points.push_back(vertexPos1 - vertexPos2);
        } 
    } 

    return Shape(QuickHull(points));
}
```
{{% /tab %}}
{{< /tabs >}}

## Optimizing 

We could try using the property of convex shapes to : 
- reduce the number of points as the source of the convex hull
- compute the convex hull even faster with a different algorithm (or maybe even directly)

\
Another thing we could do is, rather than computing the convex hull, we could try directly computing the normals.\
After all, that's what we are doing already in 2D and in 3D.

\
These possible optimizations have not been proven yet, and it's not sure it is actually possible.\
But the inverse is also true.