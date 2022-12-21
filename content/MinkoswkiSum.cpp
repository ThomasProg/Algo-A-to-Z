
#include <vector>

class Vector;

std::vector<Vector> GetMinkowskiSum(const std::vector<Vector>& shape1, const std::vector<Vector>& shape2)
{
    std::vector<Vector> newShape;
    newShape.reserve(shape1.size() + shape2.size());    

    for (const Vector& p1 : shape1)
    {
        for (const Vector& p2 : shape2)
        {
            Vector newPoint = p1 + p2; 
        }
    }

    return ConvexHull(shape1, shape2);
}


