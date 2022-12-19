+++
title = "Getting output data"
date = 2022-12-11T17:14:18+01:00
weight = 5
chapter = false
pre = "<b>5. </b>"
+++

## Getting the collision normal 

Getting the collision normal is pretty straightforward.\
Indeed, the normal is the same as the separating axis.

## Getting the MVT (Minimum Translation Vector) 

The MVT is equal to the overlapping interval of the projections between the two shapes.

## Getting the collision point for 2D

Let's suppose we only have collisions between an edge and a point.\
Every time, we project the shapes one the normal of an edge.\
If we keep reference of which normal belongs to what shape, then we can find the edge that got collided.\
Since we compute the MVT, we also compute the projection of that point on the axis.\
It means we can retrieve it.

## Code 

```cpp

// to explicit out values
#define out 

// This function can be optimized, but it shows how it works
void ProjectShapeOnAxis(const Shape& shape, const Vector& axis, out float& min, out float& max, out Vector& minPoint, out Vector& maxPoint) const
{
    points = shape.GetAllVertices();

    min = Vector::DotProduct(points[0], axis);
    max = min;
    minPoint = points[0];
    maxPoint = minPoint;

    for (const Vector& point : points)
    {
        float proj = Vec2::DotProduct(point, axis);
        if (proj < min)
        {
            min = proj;
            minPoint = point;
        }
        if (proj > max)
        {
            max = proj;
            maxPoint = point;
        }
    }
}

bool CheckCollision(const Shape& shape1, const Shape& shape2, Vector& colPoint, Vector& colNormal, float& mvt) 
{
    std::vector<Vector> projectingAxes = GetProjectingAxes(shape1, shape2);
    
    float smallestOverlap = std::numeric_limits<float>::max();
    Vector axisWithSmallestOverlap;

    for (const Vector& axis : projectingAxes)
    {
        Vector minPoint1;
        Vector maxPoint1;
        float minp1, maxp1;
        ProjectPolygonOnAxis(poly1, axis, minp1, maxp1, minPoint1, maxPoint1);

        Vector minPoint2;
        Vector maxPoint2;
        float minp2, maxp2;
        ProjectPolygonOnAxis(poly2, axis, minp2, maxp2, minPoint2, maxPoint2);

        if (!(maxp1 > minp2 && maxp2 > minp1))
        {
            return false;
        }
        else 
        {
            float minMaxProj = Min(maxp1, maxp2);
            float maxMinProj = Max(minp1, minp2);
            float overlap = minMaxProj - maxMinProj;
            if (overlap < smallestOverlap)
            {
                Vector collisionPoint;
                if (axis.IsFromShape2())
                {
                    collisionPoint = maxPoint1;
                }
                else
                {
                    collisionPoint = minPoint2;
                }

                // To prevent bugs when multiple edges with the same normal axis exist.
                // Indeed, the projection of the collision point should be included in the overlap;
                // or rather, be equal to one of the extremity.
                // We can add a small delta to be sure it works.
                float projCollisionPoint = Vector::DotProduct(collisionPoint, axis);
                if (projCollisionPoint <= minMaxProj && projCollisionPoint >= maxMinProj)
                {
                    smallestOverlap = overlap;
                    axisWithSmallestOverlap = axis;
                    colPoint = collisionPoint;
                }
            }
        }
    }

    mvt = smallestOverlap;
    colNormal = axisWithSmallestOverlap.Normalized();
    // colPoint is already set

    return true;
}
```