var relearn_search_index=[{content:` Hyperplane Separation Theorem For 2D Theorem: If two convex shapes do not collide, then, a straight line can separate them.
Contrapositive: If two convex shapes collide, then, there is no straight line separating them.
For 3D Theorem: If two convex shapes do not collide, then, a plane can separate them.
Contrapositive: If two convex shapes collide, then, there is no plane separating them.
Generalization for higher dimensions Theorem: If two convex shapes do not collide, then, a hyperplane can separate them.
Contrapositive: If two convex shapes collide, then, there is no hyperplane separating them.
Examples : A straight line separates the shapes, so there are no collisions No straight line separates the shapes, so there is a collision The shape on the right is not convex, the theorem doesn't work Separating Axis Theorem Definition : Statement: The line, plane, or hyperplane described above always has a normal axis.
Theorem: If the shapes are not colliding, the projections of the shapes on this axis do not overlap.
Contrapositive: If the shapes are colliding, then, no matter the axis we take, the projections of the shapes on this axis will overlap Warning Whether there are collisions or not, there will always exist an axis for which the projections of the shapes overlap. Examples : The separating straight line has a normal axis We project the shapes on the axis Their projections do not overlap :\u003c/br\u003e there are no collisions! No straight line separates the shapes, so there is a collision There is always an axis for which projections overlap `,description:"",tags:null,title:"Theory",uri:"/collisions/narrowphase/sat/theory/index.html"},{content:` The brute force way We can project these shapes on every axis imaginable. If on one axis, the projections do not overlap, then there are no collisions. Otherwise, there is a collision.
C++ Python bool TestCollisionsWithSAT(const Shape\u0026 shape1, const Shape\u0026 shape2) { std::vector\u003cVector\u003e axes = GetEveryAxisInTheWholeWorld(); for (const Vector\u0026 axis : axes) { Range projection1 = shape1.ProjectOnAxis(axis); Range projection2 = shape2.ProjectOnAxis(axis); // if there is a separating hyperplane if (!DoRangesOverlap(projection1, projection2)) { // then there is no collision return false; } } return true; } def TestCollisionsWithSAT(shape1: Shape, shape2: Shape) -\u003e bool axes = GetEveryAxisInTheWholeWorld() for axis in axes: projection1 = shape1.ProjectOnAxis(axis) projection2 = shape2.ProjectOnAxis(axis) # if there is a separating hyperplane if not DoRangesOverlap(projection1, projection2): # then there is no collision return False return True Vector can be a 2D vector or a 3D vector depending on the dimension you are implementing the algorithm in.
ProjectOnAxis() can vary and be optimized depending on the implentation of Shape.
GetEveryAxisInTheWholeWorld() returns a list of every axis possibly existing (which will, of course, be a bottleneck).
The implementation of Range and DoRangesOverlap is pretty straight forward:
C++ Python C# Java struct Range { float min, max; }; bool DoRangesOverlap(const Range\u0026 range1, const Range\u0026 range2) { return range1.max \u003e range2.min \u0026\u0026 range2.max \u003e range1.min; } class Range(): min = 0 max = 0 def DoRangesOverlap(range1: Range, range2: Range) -\u003e bool: return range1.max \u003e range2.min and range2.max \u003e range1.min public struct Range { public float min; public float max; public static bool DoRangesOverlap(Range range1, Range range2) { return range1.max \u003e range2.min \u0026\u0026 range2.max \u003e range1.min; } }; public class Range { public float min; public float max; public static bool DoRangesOverlap(Range range1, Range range2) { return range1.max \u003e range2.min \u0026\u0026 range2.max \u003e range1.min; } }; The smarter way GetEveryAxisInTheWholeWorld() will, of course, make the algorithm too slow to be used. However, we actually don’t have to check every axis.
ProjectOnAxis() can also be optimized.
More informations on that in the next chapters.
`,description:"",tags:null,title:"In practice",uri:"/collisions/narrowphase/sat/inpractice/index.html"},{content:` Non unit axes optimization On the previous examples, for the projection to be accurate, the axes had to be unit vectors.
Let’s asssume an axis is not unit vectors.
That would mean all projections on that axis would be multiplied by the length of that axis.
However, the length of that axis is constant.
This means that the order of the projections are still preserved.
Since we’re only using that order, and not the values in themselves, we can take advantage of that.
Brute force way For 2D : Python def GetEveryAxisInTheWholeWorld(precision) axes = [] mult = 2 * Math.PI / precision for i in range(precision): angle = i * mult axes.append(Vector2D(cos(angle), sin(angle)) return axes For other dimensions : We just have to get axes at a regular interval in a hypersphere.
The smart way Let’s take the shortest path between the two shapes.
If the shapes are colliding, then the length of that path should be 0.
Else, it is not 0.
That means the separating axis will always be linear to that shortest path.
We can also extend the features:
2D+ : we can extend an edge to a line, since the shortest distance between a point and that line wouldn’t change 3D+ : we can extend an face to a plane, since the shortest distance between a point and that plane wouldn’t change etc For 2D : In 2D, we have to compute the axis of the shortest path between:
a point and another point a line and another line a point and a line 2D : A point and a point Let v1, v2 be two points. The axis of the shortest path between v1 and v2 is v2-v1.
However, since points are infinitesimal, we assume this collision never happens.
Even if it ends up happening, the algorithm will detect a collision between a line and a line.
It is an imprecision that can be discarded.
We can discard this case.
2D : A line and a line If the two edges weren’t parallel, the shortest path would be between a vertex and an edge instead.
So we can assume that the lines are parallel.
If that is the case, then the axis of their shortest path is just the normal of that line.
2D : a point and a line The shortest path between a line and a line is a straight line orthogonal to the line.
So the separating axis is just the normal of the line.
Code Python def GetNormal(vector: Vector2) -\u003e Vector2: return Vector2(- vector.y, vector.x) def GetPotentialSeparatingAxesFor1Shape(shape): axes = [] nbVertices = len(shape.vertices) for i in range(nbVertices - 1): side = shape.vertices[i] - shape.vertices[i+1] axes.append(GetNormal(side)) lastSide = shape.vertices[nbVertices - 1] - shape.vertices[0] axes.append(GetNormal(lastSide)) return axes def GetPotentialSeparatingAxes(shape1, shape2): axes = [] axes.append(GetPotentialSeparatingAxesFor1Shape(shape1)) axes.append(GetPotentialSeparatingAxesFor1Shape(shape2)) return axes For 3D : In 3D, we have to compute the axis of the shortest path between:
a point and a point (infinitesimal, discarded) a point and a line (infinitesimal, discarded) a plane and a plane a plane and a point a plane and a line a line and a line 3D : A plane and a plane Same logic as for the lines in 2D.
They must be parallel. Otherwise, we would test with another feature.
If they are, then the axis would be the normal of either of the planes.
3D : A plane and a point We can just use the normal of the plane.
3D : A plane and a line The line is parallel to the plane.
Otherwise, we would test the collision between a line and a line.
If they are, then the axis would be the normal of the plane.
3D : A line and a line If the lines are parallel, we can assume their collision is infinitesimal and discard it.
So we will assume they are not.
If that is the case, then the axis of their shortest path would be the crossproduct between their two directions.
Code Python def CrossProduct(vector1: Vector3, vector2: Vector3) -\u003e Vector3: result = Vector3() result.x = vector1.y * vector2.z - vector1.z * vector2.y result.y = vector1.z * vector2.x - vector1.x * vector2.z result.x = vector1.x * vector2.y - vector1.y * vector2.x return result def GetNormal(vector1: Vector3, vector2: Vector3) -\u003e Vector3: return CrossProduct(vector1, vector2) def GetPotentialSeparatingAxesFor1Shape(shape): axes = [] triangles = shape.GetAllTriangles() for triangle in triangles: axes.append(GetNormal(triangle.edge1, triangle.edge2)) return axes def GetPotentialSeparatingAxes(shape1, shape2): axes = [] # Plane/Plane and Line/Plane cases axes.append(GetPotentialSeparatingAxesFor1Shape(shape1)) axes.append(GetPotentialSeparatingAxesFor1Shape(shape2)) # Line/Line case edgesShape1 = shape1.GetAllEdges() edgesShape2 = shape1.GetAllEdges() for edgeShape1 in edgesShape1: for edgeShape2 in edgesShape2: axes.append(CrossProduct(edgeShape1, edgeShape2)) return axes Generalization : We just have to get the axis of the shortest path between the two shapes.
That’s easy.
Or not.
It is actually quite difficult… and for that, it is easier to see the algorithm with another perspective.
Read the MinkowskiAndSAT and then the MinkoswkiAndAxes parts.
Parallel axes optimization If two axes are parallel, then we only need to test with one of those.\\
It is important for symetric shapes, such as rectangles, circles, spheres, etc.
`,description:"",tags:null,title:"Get Projection Axes",uri:"/collisions/narrowphase/sat/getprojectionaxes/index.html"},{content:" Velocity ",description:"",tags:null,title:"Velocity",uri:"/collisions/response/velocity/index.html"},{content:" Angular Velocity ",description:"",tags:null,title:"Angular Velocity",uri:"/collisions/response/angularvelocity/index.html"},{content:` The problem As we are simulating physics, and not actually doing it, there is an imprecision coming with the program.
For example, the collision point is not going to be exactly on the intersection of the two shapes.
After the collision has been detected, the two shapes would already be overlapping.
The imprecision can be “corrected in a few ways.
The goal of this page is to show you different ways of doing it.
Reset the shapes transform The easy way is just to reset the shapes back at the previous frame.
void RunCorrection(const Shape* shape1, const Shape* shape2, const CollisionInfo\u0026 collisionInfo) { shape1-\u003eposition = shape1-\u003elastPosition; shape1-\u003erotation = shape1-\u003elastRotation; shape2-\u003eposition = shape2-\u003elastPosition; shape2-\u003erotation = shape2-\u003elastRotation; } Pros:
This gives stable results Cons:
This is not how real physics work Move the shapes back at the collision point void RunCorrection(const Shape\u0026 shape1, const Shape\u0026 shape2, const CollisionInfo\u0026 collisionInfo) { float t = 1 - collisionInfo.mvt / Distance(shape1.lastPosition,shape1.position);
shape1.position = lerp(shape1.position, shape1.lastPosition, t); shape2.position = lerp(shape2.position, shape2.lastPosition, t); shape1.rotation = lerp(shape1.rotation, shape1.lastRotation, t); shape2.rotation = lerp(shape2.rotation, shape2.lastRotation, t); }
This is the equivalent to The first part of NarrowPhase/SAT/ContinuousCollision
`,description:"",tags:null,title:"Correction",uri:"/collisions/response/correction/index.html"},{content:` Projecting a point The dot product can be used to project a point on an axis. Python def ProjectPointOnAxis(point, axis) -\u003e float: return DotProduct(point, axis); 2D Dot Product Python def DotProduct(v1, v2) -\u003e float: return v1.x * v2.x + v1.y * v2.y 3D Dot Product Python def DotProduct(v1, v2) -\u003e float: return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z Dot Product Generalization Python def DotProduct(v1, v2) -\u003e float: nbDimensions = v1.GetDimension() total = 0 for i in range(nbDimensions): total += v1.coords[i] * v2.coords[i] return total Projecting a circle, sphere, or hypersphere To simulate an hypersphere, we usually make models with a lot of triangles and vertices.
This is one of the best ways we know to render hyperspheres with other objects.
However, for collisions, we do not need this representation, since it only makes the performance worse.
Instead, we can just use the mathematical properties of the hypersphere and have O(1) performance.
Python def ProjectSphereOnAxis(hyperSphere: HyperSphere, axis: Vector) -\u003e Range: centerProj = ProjectPointOnAxis(hyperSphere.center, axis.normalized()) range = new Range() range.min = centerProj - hyperSphere.radius range.max = centerProj + hyperSphere.radius return range Projecting a polygon Mostly used shapes are models composed of vertices.
The projection of all the points of an edge is equal to the range of the projection of its two vertices.
Python def ProjectShapeOnAxis(shape: Shape, axis: Vector) -\u003e Range: range = new Range() range.min = Math.max() range.max = Math.min() for vertex in shape.vertices: proj = ProjectPointOnAxis(vertex, axis) if (proj \u003c range.min): range.min = proj if (proj \u003e range.max): range.max = proj return range Projecting a 2D convex polygon The extremum properties Definitions Let S(t) be the parametric equation of a convex shape.\\ It returns a point of the shape for a given t.
Let P(t) = DotProduct(S(t), axis).
P(t) is the projection of the points of that shape on a given axis.
Example : S(t) = r * cos(t) * i + r * sin(t) * j S(t) represents a circle with a radius of r, centered around the origin.
Properties of S(t) Continuous Periodic S(t) represents a closed set, so S(t) is continuous.
S(t) represents a closed set, so S(t) is periodic.
i.e. : if we choose a point and follow the line, we end up looping and coming back to that first point.
Properties of P(t) Continuous Periodic Maximum Minimum P(t) = DotProduct(S(t), axis).
S(t) is continuous. DotProduct is a continuous map.
So P(t) is continuous.
P(t) = DotProduct(S(t), axis).
S(t) is periodic, and axis is constant.
So P(t) is periodic too, with the same period as S(t).
Every local maximum of P(t) is equal to the maximum of P(t).
Every local minimum of P(t) is equal to the minimum of P(t).
Dichotomy As we saw before, once we find the extremum, we do not have to test the other vertices anymore.
The projections are also continuous, and there are only 2 extremums, so:
Python # Algorithm created by myself, and proud of it, hehe def NextIndex(shape, index): size = len(shape.vertices) return (index + 1) % size def PrevIndex(shape, index): size = len(shape.vertices) return (index - 1 + size) % size def GetMiddleIndex(shape, id1, id2): if (id1 \u003c id2): return (id1 + id2) / 2 else: size = len(shape.vertices) dist = size - (id1 - id2) return (id1 + dist / 2) % size def IsSmallerClockwise(shape, axis, index): p = ProjectPointOnAxis(shape.vertices[index], axis) pNext = ProjectPointOnAxis(shape.vertices[NextIndex(shape, index)], axis) return pNext \u003c p def IsSmallerAntiClockwise(shape, axis, index): p = ProjectPointOnAxis(shape.vertices[index], axis) pPrev = ProjectPointOnAxis(shape.vertices[PrevIndex(shape, index)], axis) return pPrev \u003c p # This function is tail recursive, so the compiler can optimize it out def SearchMinProjectionOnAxis(shape: Shape, axis: Vector, minIndex, maxIndex) -\u003e float: interval = maxIndex - minIndex i1 = minIndex i2 = GetMiddleIndex(shape, minIndex, maxIndex) # half v1 = shape.vertices[i1] v2 = shape.vertices[i2] p1 = ProjectPointOnAxis(v1, axis) p2 = ProjectPointOnAxis(v2, axis) if (p1 \u003c p2): # Go in the direction of p1 if (IsSmallerClockwise(shape, axis, i1)): return SearchMinProjectionOnAxis(shape, axis, i1, i2) # clockwise if (IsSmallerAntiClockwise(shape, axis, i1)): return SearchMinProjectionOnAxis(shape, axis, i2, i1) # anti clockwise # else, already at the end return p1 elif (p2 \u003c p1): # Go in the direction of p2 if (IsSmallerClockwise(shape, axis, i2)): return SearchMinProjectionOnAxis(shape, axis, i2, i1) # clockwise if (IsSmallerAntiClockwise(shape, axis, i2, i1)): return SearchMinProjectionOnAxis(shape, axis, i1, i2) # anti clockwise # else, already at the end return p2 # The same algorithm can be used to find the maximum projection. # Cases where projections are equal are not checked, but have to be and can be. # This program is not optimized, but has for goal to describe how the algorithm works. def ProjectShapeOnAxis(shape: Shape, axis: Vector) -\u003e Range: range = new Range() range.min = SearchMinProjectionOnAxis(shape, axis, 0, len(shape.vertices)) range.max = SearchMaxProjectionOnAxis(shape, axis, 0, len(shape.vertices)) return range Info This algorithm is very optimized for a high number of vertices. However, in practice, there are only a few games that have that many vertices in 2D. Due to the different checks, this algorithm is sure to be less optimized for a few amount of vertices.
Examples : A convex shape, with a first and a last vertex A vertex is chosen. There are as many vertices on the right as on the left We project the first vertex and the chosen vertex on the axis We select the vertex with the minimum projection, and evaluate in which direction the real minimum projection is We take the part of the circle between the first vertex and the chosen vertex that is in the direction of the minimum We repeat the algorithm, with the chosen vertex being the new last one A convex shape, that has a lot of vertices at one place We project the vertices ; the chosen vertex has the minimal projection We compute the direction of the real minimal projection We keep the part of the circle that was in that direction, and repeat Projecting an arbitrary 2D shape The brute force way An arbitrary shape can be constructed with the function S(t), described above. The brute force way of projecting the shape is just to project every point returned by that function. Of course, it is impossible to project every point. That is why we set a precision.
Info This method does not return the exact projection of the shape, but it is the best we can do without any more precisions on the shape. The performance is also horrible for what it is.
Python # shape.s(t) returns the vertices of shape # shape.s(t) is periodic with a period of 1 def ProjectShapeOnAxis(shape: Shape, axis: Vector, precision: int) -\u003e Range: range = new Range() range.min = Math.max() range.max = Math.min() step = 1 / precision for i in range(precision)) proj = ProjectPointOnAxis(shape.s(i*step), axis) if (proj \u003c range.min): range.min = proj if (proj \u003e range.max): range.max = proj return range The smarter way Being a convex shape, the same algorithm applied in the Dichotomy section can be used.
vertices[i] will be replaced by S(t).
Instead of adding 1 to the index, we will add a very small value to t.
Same for removing it.
We could also compute the derivative of P(t) to determine the direction, if possible.
Also, a maximum depth will be used instead of a precision to prevent infinite recursion.
Info This method does not return the exact projection of the shape either. However, the precision can be very accurate because of the depth we can easily increase thanks to the O(log(n)) complexity of the algorithm.
`,description:"",tags:null,title:"Projecting Shapes",uri:"/collisions/narrowphase/sat/projectshapes/index.html"},{content:` Algorithms This repository contains a list of algorithms.
Each algorithm has explainations and an associated code.
`,description:"",tags:null,title:"Projects",uri:"/index.html"},{content:" Physics Broad Phase List of broad phases : ",description:"",tags:null,title:"Broad Phase",uri:"/collisions/broadphase/index.html"},{content:` Why: Whether it is for 2D or 3D games, collisions are used a lot.
Even the oldest games, like Tetris and Pacman, have some sort of collisions.
After all this time, developers have found ways to simulate even more complex collisions :
Box2D is opensource and was made by Erin Catto, but is not 3D PhysX was made by NVidia, but was discontinued Bullet, a 3D opensource collision library Chaos, recently developed by Unreal Engine Havok, used by Nintendo, Ubisoft, and others, but being premium Jolt Physics, a new 3D opensource used Horizon Forbidden West And more… However, since the old days, new ways to represent shapes are being used:
2D boxes, moving freely (example : Mario) 2D Sprite pixels, for pixel to pixel collisions Complex 2D shapes, with multiple points 3D triangles, the mainstream way to represent 3D models Sign Distance Functions, being mathematical expressions of a shape And even more… The way to handle collisions is still evolving. Some games also require custom collisions to be optimal.
Example : Minecraft only requires collisions between boxes and cylinders. The collision between chunks don’t even have to be tested.
How: The collisions will be implemented that way (unless if specified otherwise):
struct ShapePair { Shape* shape1; Shape* shape2; }; class CollisionDetector { std::vector\u003cShape\u003e registeredShapes; BroadPhase broadPhase; NarrowPhase narrowPhase; void Register(const Shape\u0026 shape) { broadPhase.Register(shape); } void Unregister(const Shape\u0026 shape) { broadPhase.Unregister(shape); } void SimulateCollisions() { // A container of potentially colliding pairs // Could return a std::vector, std::list, etc auto\u0026 pairs = broadPhase.GetPotentiallyCollidingPairs(); for (ShapePair\u0026 pair : pairs) { CollisionInfo collisionInfo; if (narrowPhase.AreShapesColliding(pair.shape1, pair.shape2, collisionInfo)) { RunPhysicalResponse(pair.shape1, pair.shape2, collisionInfo); } } } }; References : https://dyn4j.org/2010/01/sat/
`,description:"",tags:null,title:"Collisions",uri:"/collisions/index.html"},{content:`Definition : The narrow phase is
Chapter 1 `,description:"",tags:null,title:"EPA",uri:"/collisions/narrowphase/gjk/epa/index.html"},{content:` Getting the collision normal Getting the collision normal is pretty straightforward.
Indeed, the normal is the same as the separating axis.
Getting the MVT (Minimum Translation Vector) The MVT is equal to the overlapping interval of the projections between the two shapes.
Getting the collision point for 2D Let’s suppose we only have collisions between an edge and a point.
Every time, we project the shapes one the normal of an edge.
If we keep reference of which normal belongs to what shape, then we can find the edge that got collided.
Since we compute the MVT, we also compute the projection of that point on the axis.
It means we can retrieve it.
Code // to explicit out values #define out // This function can be optimized, but it shows how it works void ProjectShapeOnAxis(const Shape\u0026 shape, const Vector\u0026 axis, out float\u0026 min, out float\u0026 max, out Vector\u0026 minPoint, out Vector\u0026 maxPoint) const { points = shape.GetAllVertices(); min = Vector::DotProduct(points[0], axis); max = min; minPoint = points[0]; maxPoint = minPoint; for (const Vector\u0026 point : points) { float proj = Vec2::DotProduct(point, axis); if (proj \u003c min) { min = proj; minPoint = point; } if (proj \u003e max) { max = proj; maxPoint = point; } } } bool CheckCollision(const Shape\u0026 shape1, const Shape\u0026 shape2, Vector\u0026 colPoint, Vector\u0026 colNormal, float\u0026 mvt) { std::vector\u003cVector\u003e projectingAxes = GetProjectingAxes(shape1, shape2); float smallestOverlap = std::numeric_limits\u003cfloat\u003e::max(); Vector axisWithSmallestOverlap; for (const Vector\u0026 axis : projectingAxes) { Vector minPoint1; Vector maxPoint1; float minp1, maxp1; ProjectPolygonOnAxis(poly1, axis, minp1, maxp1, minPoint1, maxPoint1); Vector minPoint2; Vector maxPoint2; float minp2, maxp2; ProjectPolygonOnAxis(poly2, axis, minp2, maxp2, minPoint2, maxPoint2); if (!(maxp1 \u003e minp2 \u0026\u0026 maxp2 \u003e minp1)) { return false; } else { float minMaxProj = Min(maxp1, maxp2); float maxMinProj = Max(minp1, minp2); float overlap = minMaxProj - maxMinProj; if (overlap \u003c smallestOverlap) { Vector collisionPoint; if (axis.IsFromShape2()) { collisionPoint = maxPoint1; } else { collisionPoint = minPoint2; } // To prevent bugs when multiple edges with the same normal axis exist. // Indeed, the projection of the collision point should be included in the overlap; // or rather, be equal to one of the extremity. // We can add a small delta to be sure it works. float projCollisionPoint = Vector::DotProduct(collisionPoint, axis); if (projCollisionPoint \u003c= minMaxProj \u0026\u0026 projCollisionPoint \u003e= maxMinProj) { smallestOverlap = overlap; axisWithSmallestOverlap = axis; colPoint = collisionPoint; } } } } mvt = smallestOverlap; colNormal = axisWithSmallestOverlap.Normalized(); // colPoint is already set return true; } `,description:"",tags:null,title:"Getting output data",uri:"/collisions/narrowphase/sat/gettingoutputdata/index.html"},{content:`Definition : The narrow phase is
Chapter 1 `,description:"",tags:null,title:"GJK",uri:"/collisions/narrowphase/gjk/index.html"},{content:`Definition : The narrow phase is
Chapter 1 `,description:"",tags:null,title:"GSK",uri:"/collisions/narrowphase/gjk/gsk/index.html"},{content:`Definition : The narrow phase is
Chapter 1 `,description:"",tags:null,title:"MPR",uri:"/collisions/narrowphase/mpr/index.html"},{content:` Narrow Phase Definition: The narrow phase is the part when collisions between shapes will be tested with their actual geometry.
It means these collisions are precise, but also performance heavy.
The brute way to do things would be to test every triangle against each other. However, that would be too slow.
Algorithms have been created to make it faster. Most of them use the properties of convex shapes.
Requirements: For this phase to be useful, it must return :
The point of collision The normal of the impact The penetrated distance between the two shapes Without that, we wouldn’t be able to make a proper collision response afterwards.
`,description:"",tags:null,title:"Narrow Phase",uri:"/collisions/narrowphase/index.html"},{content:` Response Summary: After detecting a collision, we need to move the shapes appropriately.
If we’re using reality based physics, then we have to apply physics laws.
In the following chapters, we will see how to update things appropriately.
For the following chapters, we consider the narrow phase is returning a CollisionInfo:
struct CollisionInfo { float mtv; // Minimum Translation Vector Vec3 collisionPoint; Vec3 normal; }; void RunPhysicalResponse(Shape* shape1, Shape* shape2, const CollisionInfo\u0026 collisionInfo) { RunCorrection(shape1, shape2, collisionInfo); UpdateVelocity(shape1, shape2, collisionInfo); UpdateAngularVelocity(shape1, shape2, collisionInfo); } Index: Velocity Angular Velocity Correction `,description:"",tags:null,title:"Response",uri:"/collisions/response/index.html"},{content:" Separating Axis Theorem Summary : Theory In practice Get Projection Axes Projecting Shapes Getting output data Precomputing data Is Inside Minkowski And SAT Minkowski And Axes Continuous collision ",description:"",tags:["Collisions","Narrow Phase","Geometry"],title:"SAT",uri:"/collisions/narrowphase/sat/index.html"},{content:` Testing the same shape multiple times Let’s supposed we test 1 shape with 10 other shapes. Every time we will test a collision, we will project the 1st shape onto the axes. However, half of the axes will stay the same, because half of the axes will be computed from that 1st shape. That means we can precompute both the axes, but also the projections of the shape on half of the axes between the broadphase and the narrow phase.
Warning The previous algorithm would have returned as soon as it detects there are no collisions. This means less data could have been computed. By precomputing this data, we asssume shapes most likely collide to be efficient. This is one of the reasons the broadphase is so important. Otherwise, it could end up taking more performance instead.
Static Objects When objects are moving, we have to compute axes in world space again every frame.
However, when objects are not moving (i.e. static), their world position do not change.
That means the following won’t change:
half of the axes the projections of the shape on these axes We can cache that data.
Warning We have no idea when a collision would occur. Precomputing everything would cost a lot of memory, for collisions that might never happen.
Tip To optimize that, we could use world partitioning and only load / compute this data when getting close to the associated object.
Caching the separating axis You can save the separating axis for a pair for the next frame.
That way, at the next frame, you can test if that separating axis is still valid, and potentially have O(1) complexity.
C++ bool TestCollisionsWithSATOnAxis(const Shape\u0026 shape1, const Shape\u0026 shape2, const Axis\u0026 axis) { Range projection1 = shape1.ProjectOnAxis(axis); Range projection2 = shape2.ProjectOnAxis(axis); return DoRangesOverlap(projection1, projection2); } void NarrowPhaseBetween2Shapes(CollisionPair\u0026 collisionPair) { if (collisionPair.lastSeparatingAxis != nullptr \u0026\u0026 !TestCollisionsWithSATOnAxis(collisionPair.shape1, collisionPair.shape2, lastSeparatingAxis)) { return false; } TestCollisionsWithSAT(collisionPair.shape1, collisionPair.shape2, collisionPair.output) } `,description:"",tags:null,title:"Precomputing data",uri:"/collisions/narrowphase/sat/precomputingdata/index.html"},{content:` Properties of the projections If shape1 is colliding with shape2, then :
their respective projections will overlap on every axis If shape1 is not colliding with shape2, then :
their respective projections will not overlap on atleast 1 axis If shape1 is inside shape2, then :
the projection of shape1 will be included in the projection of shape2 on every axis If shape1 is not inside shape2, then :
the projection of shape1 will not be included in the projection of shape2 on atleast 1 axis Examples Shape1 is inside shape2. The projection of shape1 is always included in the projection of shape2 Shape1 is not inside shape2. The projection of shape1 is not always included in the projection of shape2 The algorithm Python def IsShape1InsideShape2(shape1: Shape, shape2: Shape) -\u003e bool axes = GetAxes(shape1, shape2) for axis in axes: projection1 = shape1.ProjectOnAxis(axis) projection2 = shape2.ProjectOnAxis(axis) if not IsProj1InsideProj2(projection1, projection2): return False return True `,description:"",tags:null,title:"Is Inside",uri:"/collisions/narrowphase/sat/isinside/index.html"},{content:` The basic SAT algorithm Let’s get back at the original SAT implementation.
Note that the following works for every dimension.
C++ struct Range { float min, max; }; bool DoRangesOverlap(const Range\u0026 range1, const Range\u0026 range2) { return range1.max \u003e range2.min \u0026\u0026 range2.max \u003e range1.min; } bool TestCollisionsWithSAT(const Shape\u0026 shape1, const Shape\u0026 shape2) { std::vector\u003cVector\u003e axes = GetEveryAxisInTheWholeWorld(); for (const Vector\u0026 axis : axes) { Range projection1 = shape1.ProjectOnAxis(axis); Range projection2 = shape2.ProjectOnAxis(axis); // if there is a separating hyperplane if (!DoRangesOverlap(projection1, projection2)) { // then there is no collision return false; } } return true; } Modifying the SAT From now on, we will start to changing parts of the code.
However, even with modifications, the code will always be working the same as before.
First, we will explicit ProjectOnAxis() :
projection = shape.Project(axis); becomes
float maxProj = shape.GetMaxProj(axis); float minProj = shape.GetMinProj(axis); Obviously, GetMinProj(axis) is equivalent to GetMaxProj(- axis).
This is just the range, but explicited. Nothing unusual.
For the sake of explanation, we can even get the point out of the functions.
// The point with the max projection on axis Vector ptMaxProj = shape.GetPtMaxProj(axis); // The point with the min projection on axis Vector ptMinProj = shape.GetPtMinProj(axis); // projecting the points back one the axis, so we have the same values than before float maxProj = DotProduct(ptMaxProj, axis); float minProj = DotProduct(ptMinProj, axis); Now, we can:
explicit DoRangesOverlap(), change the inequality and applying boolean logic replace the code And we get:
C++ Vector ptMaxProj1 = shape.GetPtMaxProj(axis); Vector ptMinProj1 = shape.GetPtMinProj(axis); float maxProjShape1 = DotProduct(ptMaxProj1, axis); float minProjShape1 = DotProduct(ptMinProj1, axis); Vector ptMaxProj2 = shape.GetPtMaxProj(axis); Vector ptMinProj2 = shape.GetPtMinProj(axis); float maxProjShape2 = DotProduct(ptMaxProj2, axis); float minProjShape2 = DotProduct(ptMinProj2, axis); // if there is a separating hyperplane if (maxProjShape1 - minProjShape2 \u003c 0 || minProjShape1 - maxProjShape2 \u003e 0) { // then there is no collision return false; } Now, let’s replace:
maxProjShape1 - minProjShape2 by:
DotProduct(shape1.GetPtMaxProj(axis), axis) - DotProduct(shape2.GetPtMinProj(axis), axis) Now, let’s do a bit of simple maths:
Let u, v and p be vectors of N dimension.
We have:
$$u \\cdot p - v \\cdot p$$ $$= \\sum (u_{i} * p_{i}) - \\sum (v_{i} * p_{i})$$ $$= \\sum (u_{i} * p_{i} - v_{i} * p_{i})$$ $$= \\sum ((u_{i} - v_{i}) * p_{i})$$It means that we can replace our the last code part by:
Vector minkowskiPtWithMaxProj = shape1.GetPtMaxProj(axis) - shape2.GetPtMinProj(axis); float minkowskiSumMaxProj = DotProduct(minkowskiPtWithMaxProj, axis); we just computed a point from the minkowskiSum!!!!!!
Or rather, if A and B are our shapes, the expression we have is A - B.
We can now show the final code:
C++ bool TestCollisionsWithSAT(const Shape\u0026 shape1, const Shape\u0026 shape2) { std::vector\u003cVector\u003e axes = GetEveryAxisInTheWholeWorld(); for (const Vector\u0026 axis : axes) { Vector minkowskiPtWithMaxProj = shape1.GetPtMaxProj(axis) - shape2.GetPtMinProj(axis); float minkowskiSumMaxProj = DotProduct(minkowskiPtWithMaxProj, axis); // Note that this is the minimum projection instead of the maximum we just computed above Vector minkowskiPtWithMinProj = shape1.GetPtMinProj(axis) - shape2.GetMaxProj(axis); float minkowskiSumMinProj = DotProduct(minkowskiPtWithMinProj, axis); // If 0 is outside the projection if (minkowskiSumMaxProj \u003c 0 || minkowskiSumMinProj \u003e 0) { return false; } } return true; } REVELATION!!!!!
There was an imposter among us!
And it was Minkowski!!!
Let’s explain that.
A different point of view We’re doing the Minkowski sum A - B.
If the shapes are overlapping, it means that there is atleast 1 point both shapes are sharing.
In that case, for that point, A - B would return the origin, since the point from A and B would negate each other.
So if there is a collision, the origin should be inside the Minkowski shape!
However, that just delays the problem…
The Minkowski shape is convex since both A and B are convex.
A point is, in itself, convex.
Is there an algorithm capable of determining if there is a collision between 2 convex shapes?
Yes!!
The Separating Axis Theorem is!!!
C++ bool TestCollisionsWithSAT(const Shape\u0026 shape1, const Shape\u0026 shape2) { std::vector\u003cVector\u003e axes = GetEveryAxisInTheWholeWorld(); Shape minkowskiSum = shape1 - shape2; for (const Vector\u0026 axis : axes) { // The projection of the origin is 0 on any axis // So if the projection of the origin is not in projection of the Minkowski shape: if (minkowskiSum.GetPtMaxProj(axis) \u003c 0 || minkowskiSum.GetPtMinProj(axis) \u003e 0) { return false; } } return true; } Note that this code is still doing the same thing as what we had before.
Here, the Minkowski shape is just computed before the loop, and then projecting it, instead of getting the projections on the fly.
The condition also became very straightforward.
Conclusion Let A and B be two closed convex shapes.
We just proved that:
“If two convex shapes do not collide, then, a hyperplane can separate them.”
Is strictly equivalent to:
“If the shapes are not colliding, then, the origin is inside the Minkowski sum A - B.”
And a convex shape is defined by its tangent hyperplanes.
So we can just verify if the origin is “inside” the hyperplanes.
That proof works for any euclidean space!!!
`,description:"",tags:null,title:"Minkowski And SAT",uri:"/collisions/narrowphase/sat/minkowskiandsat/index.html"},{content:` The basic SAT algorithm We saw previously that the SAT could be explained using the Minkowski sum.
C++ bool TestCollisionsWithSAT(const Shape\u0026 shape1, const Shape\u0026 shape2) { std::vector\u003cVector\u003e axes = GetEveryAxisInTheWholeWorld(); Shape minkowskiSum = shape1 - shape2; for (const Vector\u0026 axis : axes) { // The projection of the origin is 0 on any axis // So if the projection of the origin is not in projection of the Minkowski shape: if (minkowskiSum.GetPtMaxProj(axis) \u003c 0 || minkowskiSum.GetPtMinProj(axis) \u003e 0) { return false; } } return true; } The algorithm isn’t usable as it is, since GetEveryAxisInTheWholeWorld() is slow… and even slower for higher dimensions.
However, do you remember how we previously got the axes the 2D case, by just taking the normals?
It doesn’t usually work in higher dimensions for two convex shapes…
However It does work here.
The same as previously, we want to know the shortest path the shape and the point.
However, in the case, there is only one case possible: the path will always be a normal of the shape!
Code : The obvious way To replace GetEveryAxisInTheWholeWorld(), we can just do the following:
C++ bool TestCollisionsWithSAT(const Shape\u0026 shape1, const Shape\u0026 shape2) { Shape minkowskiSum = shape1 - shape2; std::vector\u003cVector\u003e axes = minkowskiSum.GetNormals(); for (const Vector\u0026 axis : axes) { // The projection of the origin is 0 on any axis // So if the projection of the origin is not in projection of the Minkowski shape: if (minkowskiSum.GetPtMaxProj(axis) \u003c 0 || minkowskiSum.GetPtMinProj(axis) \u003e 0) { return false; } } return true; } However, the problem with that is that we have to compute the sum of Minkowski.
The obvious way would be to compute possible points and then to create a convex hull around them.
A convex hull can be created for any dimension with the QuickHull algorithm.
An implementation is available here : https://github.com/akuukka/quickhull/blob/master/QuickHull.cpp
It would then look like this:
C++ Shape MinkowskiDiff(const Shape\u0026 shape1, const Shape\u0026 shape2) { std::vector\u003cPoints\u003e points; std::vector\u003cPoints\u003e\u0026 vertices1 = shape1.GetVertices(); std::vector\u003cPoints\u003e\u0026 vertices2 = shape2.GetVertices(); points.reserve(vertices1.size() + vertices2.size()); for (const Vector\u0026 vertexPos1 : vertices1) { for (const Vector\u0026 vertexPos2 : vertices2) { points.push_back(vertexPos1 - vertexPos2); } } return Shape(QuickHull(points)); } Optimizing We could try using the property of convex shapes to :
reduce the number of points as the source of the convex hull compute the convex hull even faster with a different algorithm (or maybe even directly) Another thing we could do is, rather than computing the convex hull, we could try directly computing the normals.
After all, that’s what we are doing already in 2D and in 3D.
These possible optimizations have not been proven yet, and it’s not sure it is actually possible.
But the inverse is also true.
`,description:"",tags:null,title:"Minkowski And Axes",uri:"/collisions/narrowphase/sat/minkoswkiandaxes/index.html"},{content:` Continuous collision for non rotating shapes If the shapes don’t have any angular velocity, we can consider their separating axis never change.
We have both shapes projected on an axis; we just have to take time into account, and find the moment their ranges intersect.
This means we have a continuous collision… but only when the shapes are not rotating.
The lower the rotation is, the more precise the collision is.
bool SimulatePhysics(Shape\u0026 shape1, Shape\u0026 shape2, CollisionInfo\u0026 collisionInfo) { CollisionInfo satCollisionInfo; if (AreCollidingWithSAT(shape1, shape2, satCollisionInfo)) { float speed1 = DotProduct(shape1.velocity, satCollisionInfo.normal); float speed2 = DotProduct(shape2.velocity, satCollisionInfo.normal); // We test if there is a collision with : // // if (!(maxp1 \u003e minp2 \u0026\u0026 maxp2 \u003e minp1)) // It becomes the following once we take the time into account, // and since we consider the shape isn't rotating: // // if (!(maxp1 - speed1 * t \u003e minp2 - speed2 * t \u0026\u0026 maxp2 - speed2 * t \u003e minp1 - speed1 * t)) // We don't care about the inequality, we just want t for when there is a collision, so: // // maxp1 - speed1 * t = minp2 - speed2 * t // maxp1 - minp2 = speed1 * t - speed2 * t // maxp1 - minp2 = (speed1 - speed2) * t // maxp1 - minp2 = (speed1 - speed2) * t // t1 = (maxp1 - minp2) / (speed1 - speed2) // // And for the other: // // maxp2 - speed2 * t \u003e minp1 - speed1 * t) // t2 = (maxp2 - minp1) / (speed2 - speed1) float t1 = (satCollisionInfo.maxp1 - satCollisionInfo.minp2) / (speed1 - speed2); float t2 = (satCollisionInfo.maxp2 - satCollisionInfo.minp1) / (speed2 - speed1); // one of the t is negative, the other positive // we want the positive value, since the negative value would be for the future float t = (t1 \u003e 0) ? t1 : t2; shape1.position = lerp(shape1.position, shape1.lastPosition, t); shape2.position = lerp(shape2.position, shape2.lastPosition, t); shape1.rotation = lerp(shape1.rotation, shape1.lastRotation, t); shape2.rotation = lerp(shape2.rotation, shape2.lastRotation, t); // We know get: collisionInfo.hitNormal = satCollisionInfo.hitNormal; collisionInfo.mtv = 0; // the collision is exact, continuous collisionInfo.impactMagnitude = satCollisionInfo.mtv; collisionInfo.collisionPoint = satCollisionInfo.collisionPoint - t * satCollisionInfo.hitNormal; return true; } return false; } Expansive Continuous collision Let’s take a look into 2D.
Let’s superpose the frame before, and the frame after collision.
If we draw a line between the vertices, then we get 3D shapes, that are still convex.
Let’s call the new axis we got T.
This axis represents the time.
If we follow this axis, we notice the shapes are not intersecting, then they are, and then, if we increase time, they will not anymore.
This gives us an interval range, and we have to get the smallest value.
At that moment, t, there is a collision.
We can then compute the position both shapes had at that moment, keep the normal but removing the time component, and same for the collision point.
Since we can compute the SAT for any dimension, then that means we can compute the continuous collision.
You might also notice that the previous part is also a special case of that continuous collision, for when the separating plane is the same.
For both, we compute the time of the intersection and set the collision informations.
`,description:"",tags:null,title:"Continuous collision",uri:"/collisions/narrowphase/sat/continuouscollision/index.html"},{content:"",description:"",tags:null,title:"Collisions",uri:"/tags/collisions/index.html"},{content:"",description:"",tags:null,title:"Geometry",uri:"/tags/geometry/index.html"},{content:"",description:"",tags:null,title:"Narrow Phase",uri:"/tags/narrow-phase/index.html"},{content:"",description:"",tags:null,title:"Tags",uri:"/tags/index.html"},{content:"",description:"",tags:null,title:"Categories",uri:"/categories/index.html"}]