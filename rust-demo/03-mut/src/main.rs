// fn main() {
//     let x: i32 = 1;
//     x = 2; // Error because x is immutable
//     println!("{}", x);
// }

//right
fn main() {
    let mut x: i32 = 1;
    x = 2; // No error
    println!("{}", x);
}
