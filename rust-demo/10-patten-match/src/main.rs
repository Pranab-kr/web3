// Define an enum called Shape
enum Shape {
    Circle(f64),  // Variant with associated data (radius)
    Square(f64),  // Variant with associated data (side length)
    Rectangle(f64, f64),  // Variant with associated data (width, height)
}

// Function to calculate area based on the shape
fn calculate_area(shape: Shape) -> f64 {

  let ans: f64 = match shape {
    Shape::Circle(r) => 3.14 * r * r,
    Shape::Square(side) => side * side,
    Shape::Rectangle(width , height) => width * height,
  };

  return ans;
}

fn main() {
    // Create instances of different shapes
    let circle = Shape::Circle(5.0);
    let square = Shape::Square(4.0);
    let rectangle = Shape::Rectangle(3.0, 6.0);

    let ans1 = calculate_area(circle);
    let ans2 = calculate_area(square);
    let ans3 = calculate_area(rectangle);

    println!(" {} ", ans1);
    println!(" {} ", ans2);
    println!(" {} ", ans3);
}
