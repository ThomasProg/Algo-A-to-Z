+++
title = "Collisions"
date = 2022-12-11T17:14:18+01:00
weight = 5
chapter = false
pre = "<b>> </b>"
+++

## Why: 
Whether it is for **2D or 3D** games, **collisions** are used **a lot**.

Even the oldest games, like Tetris and Pacman, have some sort of collisions.

After all this time, developers have found ways to simulate even more **complex collisions** :
- **Box2D** is opensource and was made by Erin Catto, but is not 3D
- **PhysX** was made by NVidia, but was discontinued
- **Bullet**, a 3D opensource collision library
- **Chaos**, recently developed by Unreal Engine
- **Havok**, used by Nintendo, Ubisoft, and others, but being premium
- **Jolt Physics**, a new 3D opensource used Horizon Forbidden West
- **And more...**

However, since the old days, new ways to represent shapes are being used:
- **2D boxes**, moving freely (example : Mario)
- **2D Sprite pixels**, for pixel to pixel collisions
- **Complex 2D shapes**, with multiple points
- **3D triangles**, the mainstream way to represent 3D models
- **Sign Distance Functions**, being mathematical expressions of a shape
- **And even more...**

The way to handle collisions is still **evolving**. \
Some games also require **custom collisions** to be optimal. 

*Example : Minecraft only requires collisions between boxes and cylinders. 
The collision between chunks don't even have to be tested.*

## How:

The collisions will be implemented that way (unless if specified otherwise):

```cpp

struct ShapePair
{
    Shape* shape1;
    Shape* shape2;
};

class CollisionDetector
{
    std::vector<Shape> registeredShapes;
    BroadPhase broadPhase;
    NarrowPhase narrowPhase;

    void Register(const Shape& shape)
    {
        broadPhase.Register(shape);
    }

    void Unregister(const Shape& shape)
    {
        broadPhase.Unregister(shape);
    }

    void SimulateCollisions()
    {
        // A container of potentially colliding pairs
        // Could return a std::vector, std::list, etc
        auto& pairs = broadPhase.GetPotentiallyCollidingPairs();

        for (ShapePair& pair : pairs)
        {
            CollisionInfo collisionInfo;
            if (narrowPhase.AreShapesColliding(pair.shape1, pair.shape2, collisionInfo))
            {
                RunPhysicalResponse(pair.shape1, pair.shape2, collisionInfo);
            }
        }
    }


};
```

## References : 

https://dyn4j.org/2010/01/sat/