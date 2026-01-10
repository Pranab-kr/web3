//stack

// fn main() {
// 		let x = 1; // crated on stack
// 		let y = 3; // created on stack
//     println!("{}", sum(x, y));
//     println!("Hello, world!");
// }

// fn sum(a: i32, b: i32) -> i32 {
//     let c = a + b;
//     return c;
// }

// fn main() {
//     let x = 1; // crated on stack
//     {
//         let y = 3; // created on stack
//     }

//     println!("{}", y); // throws error
// }


// heep

// fn main() {
//     let s1 = String::from("hello");
//     let s2 = s1;
//     println!("{}", s1); // This line would cause a compile error because ownership has been moved.
// }

// fn main() {
//     let my_string = String::from("hello");
//     takes_ownership(my_string);
//     println!("{}", my_string); // This line would cause a compile error because ownership has been moved.
// }

// fn takes_ownership(some_string: String) {
//     println!("{}", some_string); // `some_string` now owns the data.
// }


// fix

// fn main() {
//     let s1 = String::from("hello");
//     let s2 = s1.clone();
//     println!("{}", s1); // Compiles now
// }

fn main() {
    let s1 = String::from("hello");
    let s2 = takes_ownership(s1);
    println!("{}", s2);
}

fn takes_ownership(some_string: String) -> String {
    println!("{}", some_string);
    return some_string; // return the string ownership back to the original main fn
}
