// Write the logic to first filter all odd values then double each value and create a new
// vector

fn main() {
    let v1 = vec![1, 2, 3, 4, 5];

    let result: Vec<i32> = v1.iter().filter(|&x| x % 2 != 0).map(|x| x * 2).collect(); // Collect into a new vector

    println!("{:?}", result); // Should print: [2, 6, 10]
}
