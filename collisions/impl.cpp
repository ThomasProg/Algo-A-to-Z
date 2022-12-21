#include <vector>

// A 0 MUST exist
template<typename T>
void FindRoot( bool epsilon, const T& functor)
{
    while (abs(functor()) < epsilon);
};

class Shape;

struct ShapePair
{
    Shape* shape1;
    Shape* shape2;
};

class BroadPhase
{
public:
    void Register(const Shape& shape);
    void Unregister(const Shape& shape);

    std::vector<ShapePair> GetPotentiallyCollidingPairs();
    std::vector<Shape*> GetPotentiallyCollidingShapes(Shape* shape);
};

class NarrowPhase
{
public:
    bool AreShapesColliding(Shape* shape1, Shape* shape2, CollisionInfo& collisionInfo);
};

struct Vec3
{
    float x, y, z;
};

struct CollisionInfo
{
    float mtv; // Minimum Translation Vector
    Vec3 collisionPoint;
    Vec3 normal;
};

class CollisionDetector
{
    std::vector<Shape> registeredShapes;
    BroadPhase* broadPhase;
    NarrowPhase* narrowPhase;

    void Register(const Shape& shape)
    {
        broadPhase->Register(shape);
    }

    void Unregister(const Shape& shape)
    {
        broadPhase->Unregister(shape);
    }

    void SimulateCollisions()
    {
        // A container of potentially colliding pairs
        // Could return a std::vector, std::list, etc
        auto& pairs = broadPhase->GetPotentiallyCollidingPairs();

        for (ShapePair& pair : pairs)
        {
            CollisionInfo collisionInfo;
            if (narrowPhase->AreShapesColliding(pair.shape1, pair.shape2, collisionInfo))
            {
                FindRoot(0.01f, [&]()
                {

                    return narrowPhase->AreShapesColliding(pair.shape1, pair.shape2, collisionInfo);
                });
                RunPhysicalResponse(pair.shape1, pair.shape2, collisionInfo);
            }
        }
    }


};


