fn main() {
   let mut name = String::from("Pranab");

    name.push_str(" Kumar");
    println!("Full name: {}", name);

    name.replace_range(6..name.len(), "");
    println!("First name: {}", name);
}
