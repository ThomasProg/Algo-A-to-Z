+++
title = "Is Inside"
date = 2022-12-11T17:14:18+01:00
weight = 10
chapter = false
pre = "<b>7. </b>"
+++

## Properties of the projections

If shape1 is colliding with shape2, then :
- their respective projections will overlap on every axis

\
If shape1 is not colliding with shape2, then :
- their respective projections will not overlap on atleast 1 axis

\
If shape1 is inside shape2, then :
- the projection of shape1 will be included in the projection of shape2 on every axis

\
If shape1 is not inside shape2, then :
- the projection of shape1 will not be included in the projection of shape2 on atleast 1 axis

## Examples 

{{< align >}}
{{% box %}}
![Spidertocat](inside1.png?width=500px "Shape1 is inside shape2.")
{{% /box %}}
{{% box %}}
![DrOctocat](inside2.png?width=500px "The projection of shape1 is always included in the projection of shape2")
{{% /box %}}    
{{% box %}}
![DrOctocat](notinside1.png?width=500px "Shape1 is not inside shape2.")
{{% /box %}}    
{{% box %}}
![DrOctocat](notinside2.png?width=500px "The projection of shape1 is not always included in the projection of shape2")
{{% /box %}}    
{{< /align >}}

## The algorithm 

{{< tabs >}}
{{% tab name="Python" %}}
```python
def IsShape1InsideShape2(shape1: Shape, shape2: Shape) -> bool
    axes = GetAxes(shape1, shape2)

    for axis in axes:
        projection1 = shape1.ProjectOnAxis(axis)
        projection2 = shape2.ProjectOnAxis(axis)

        if not IsProj1InsideProj2(projection1, projection2):
            return False

    return True
```
{{% /tab %}}
{{< /tabs >}}