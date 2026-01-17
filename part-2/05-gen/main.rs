fn main() {
    let bigger_num = largest(1, 2);
    let bigger_char = largest('a', 'b');

    println!("{}", bigger_num);
    println!("{}", bigger_char);
}

fn largest<T: std::cmp::PartialOrd>(a: T, b: T) -> T {
    //Generice in Rust
    if a > b { a } else { b }
}
