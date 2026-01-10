fn main() {
  let my_string = String::from("Pranab");

  match find_first_a(my_string) {
      Some(index) => println!("a found on index : {} ", index),
      None => print!("No 'a' was found in the String"),
  }
}

fn find_first_a(my_string : String) -> Option<i32> {

  for (index , character) in my_string.chars().enumerate() {
    if character == 'a' {
        return Some(index as i32)
    }
  }

  return None;
}
