+++
title = "In practice"
date = 2022-12-11T17:14:18+01:00
weight = 2
chapter = false
pre = "<b>2. </b>"
+++

## The brute force way

We can project these shapes on every axis imaginable. \
If on one axis, the projections do not overlap, then there are no collisions. \
Otherwise, there is a collision.

{{< tabs >}}
{{% tab name="C++" %}}
```cpp
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
{{% tab name="Python" %}}
```python
def TestCollisionsWithSAT(shape1: Shape, shape2: Shape) -> bool
    axes = GetEveryAxisInTheWholeWorld()

    for axis in axes:
        projection1 = shape1.ProjectOnAxis(axis)
        projection2 = shape2.ProjectOnAxis(axis)

        # if there is a separating hyperplane
        if not DoRangesOverlap(projection1, projection2):
            # then there is no collision
            return False

    return True
```
{{% /tab %}}
{{< /tabs >}}

*Vector* can be a 2D vector or a 3D vector depending on the dimension you are implementing the algorithm in. 

<code>ProjectOnAxis()</code> can vary and be optimized depending on the implentation of Shape. 

<code>GetEveryAxisInTheWholeWorld()</code> returns a list of every axis possibly existing (which will, of course, be a bottleneck).

The implementation of <code>Range</code> and <code>DoRangesOverlap</code> is pretty straight forward:

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
```
{{% /tab %}}
{{% tab name="Python" %}}
```python
class Range():
    min = 0
    max = 0

def DoRangesOverlap(range1: Range, range2: Range) -> bool:
    return range1.max > range2.min and range2.max > range1.min
```
{{% /tab %}}
{{% tab name="C#" %}}
```cs
public struct Range
{
    public float min;
    public float max;

    public static bool DoRangesOverlap(Range range1, Range range2)
    {
        return range1.max > range2.min && range2.max > range1.min;
    }
};
```
{{% /tab %}}
{{% tab name="Java" %}}
```java
public class Range
{
    public float min;
    public float max;

    public static bool DoRangesOverlap(Range range1, Range range2)
    {
        return range1.max > range2.min && range2.max > range1.min;
    }
};
```
{{% /tab %}}
{{< /tabs >}}

## The smarter way 

*GetEveryAxisInTheWholeWorld()* will, of course, make the algorithm too slow to be used. \
However, we actually don't have to check **every** axis.\
*ProjectOnAxis()* can also be optimized.\
More informations on that in the next chapters.