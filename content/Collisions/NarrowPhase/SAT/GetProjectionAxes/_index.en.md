+++
title = "Get Projection Axes"
date = 2022-12-11T17:14:18+01:00
weight = 3
chapter = false
pre = "<b>3. </b>"
+++

## Non unit axes optimization

On the previous examples, for the projection to be accurate, the axes had to be unit vectors.\
Let's asssume an axis is not unit vectors.\
That would mean all projections on that axis would be multiplied by the length of that axis.\
However, the length of that axis is constant.\
This means that the order of the projections are still preserved.\
Since we're only using that order, and not the values in themselves, we can take advantage of that.

## Brute force way

### For 2D : 

{{< tabs >}}
{{% tab name="Python" %}}
```python
def GetEveryAxisInTheWholeWorld(precision)
    axes = []
    mult = 2 * Math.PI / precision
    for i in range(precision):
        angle = i * mult
        axes.append(Vector2D(cos(angle), sin(angle))
    return axes
```
{{% /tab %}}
{{< /tabs >}}

### For other dimensions :

We just have to get axes at a regular interval in a hypersphere.

## The smart way

Let's take the shortest path between the two shapes.\
If the shapes are colliding, then the length of that path should be 0.\
Else, it is not 0.

That means the separating axis will always be linear to that shortest path.

We can also extend the features: 
- 2D+ : we can extend an edge to a line, since the shortest distance between a point and that line wouldn't change
- 3D+ : we can extend an face to a plane, since the shortest distance between a point and that plane wouldn't change
- etc

### For 2D :

In 2D, we have to compute the axis of the shortest path between: 
- a point and another point
- a line and another line
- a point and a line

#### 2D : A point and a point

Let v1, v2 be two points.
The axis of the shortest path between v1 and v2 is v2-v1.

However, since points are infinitesimal, we assume this collision never happens.\
Even if it ends up happening, the algorithm will detect a collision between a line and a line.\
It is an imprecision that can be discarded.

We can discard this case.

#### 2D : A line and a line

If the two edges weren't parallel, the shortest path would be between a vertex and an edge instead.\
So we can assume that the lines are parallel.\
If that is the case, then the axis of their shortest path is just the normal of that line.

#### 2D : a point and a line

The shortest path between a line and a line is a straight line orthogonal to the line.\
So the separating axis is just the normal of the line.

#### Code

{{< tabs >}}
{{% tab name="Python" %}}
```python
def GetNormal(vector: Vector2) -> Vector2:
    return Vector2(- vector.y, vector.x)

def GetPotentialSeparatingAxesFor1Shape(shape):
    axes = []
    nbVertices = len(shape.vertices)
    for i in range(nbVertices - 1):
        side = shape.vertices[i] - shape.vertices[i+1] 
        axes.append(GetNormal(side))

    lastSide = shape.vertices[nbVertices - 1] - shape.vertices[0] 
    axes.append(GetNormal(lastSide)) 
    
    return axes

def GetPotentialSeparatingAxes(shape1, shape2):
    axes = []

    axes.append(GetPotentialSeparatingAxesFor1Shape(shape1))
    axes.append(GetPotentialSeparatingAxesFor1Shape(shape2))
    
    return axes
```
{{% /tab %}}
{{< /tabs >}}

### For 3D :

In 3D, we have to compute the axis of the shortest path between: 
- a point and a point (infinitesimal, discarded)
- a point and a line (infinitesimal, discarded)
- a plane and a plane 
- a plane and a point
- a plane and a line 
- a line and a line 

#### 3D : A plane and a plane

Same logic as for the lines in 2D.\
They must be parallel.
Otherwise, we would test with another feature.\
If they are, then the axis would be the normal of either of the planes.

#### 3D : A plane and a point

We can just use the normal of the plane.

#### 3D : A plane and a line

The line is parallel to the plane.\
Otherwise, we would test the collision between a line and a line.\
If they are, then the axis would be the normal of the plane.

#### 3D : A line and a line

If the lines are parallel, we can assume their collision is infinitesimal and discard it.

So we will assume they are not.\
If that is the case, then the axis of their shortest path would be the crossproduct between their two directions.

#### Code

{{< tabs >}}
{{% tab name="Python" %}}
```python
def CrossProduct(vector1: Vector3, vector2: Vector3) -> Vector3:
    result = Vector3()
    result.x = vector1.y * vector2.z - vector1.z * vector2.y
    result.y = vector1.z * vector2.x - vector1.x * vector2.z
    result.x = vector1.x * vector2.y - vector1.y * vector2.x
    return result

def GetNormal(vector1: Vector3, vector2: Vector3) -> Vector3:
    return CrossProduct(vector1, vector2)

def GetPotentialSeparatingAxesFor1Shape(shape):
    axes = []
    triangles = shape.GetAllTriangles()
    for triangle in triangles:
        axes.append(GetNormal(triangle.edge1, triangle.edge2))

    return axes

def GetPotentialSeparatingAxes(shape1, shape2):
    axes = []

    # Plane/Plane and Line/Plane cases
    axes.append(GetPotentialSeparatingAxesFor1Shape(shape1))
    axes.append(GetPotentialSeparatingAxesFor1Shape(shape2))

    # Line/Line case
    edgesShape1 = shape1.GetAllEdges()
    edgesShape2 = shape1.GetAllEdges()
    for edgeShape1 in edgesShape1:
        for edgeShape2 in edgesShape2:
            axes.append(CrossProduct(edgeShape1, edgeShape2))

    return axes
```
{{% /tab %}}
{{< /tabs >}}

### Generalization :

Let's define hyperplanes dimensions:
- A line is a 2D hyperplane
- A plane is a 3D hyperplane
- etc

For simplicity, let H(N) be a N dimensional hyperplane.

Instead of hyperplanes, we could say that H(N) is a subspace of dimension N - 1

Let D be the dimension of the space.\
We have to test:
- H(D) / H(i), i <= D
- H(D-1) / H(D) 
- H(D-1) / H(D-1) 
- etc

#### H(D) / H(i), i <= D

We can just take the normal of H(D).

#### H(i) / H(j)

As long as the direct sum of H(i) and H(j) is equal to H(N), we probably can't discard that case.\
Same as before, we need to compute the axis of the shortest path between the two hyperplanes.

## Parallel axes optimization

If two axes are parallel, then we only need to test with one of those.\  
It is important for symetric shapes, such as rectangles, circles, spheres, etc.