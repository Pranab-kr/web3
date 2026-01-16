// Q: Write a function that takes a string as an input
// And returns the first word from it

fn main() {
  let input = String::from("Hello, welcome to Rust programming!");
  let first_word = get_first_word(&input);

  println!(" {}", input); // part of the original string (slice) &str
  println!(" {}", first_word);
}


fn get_first_word(s: &str) -> &str {

    for (i, item) in s.chars().enumerate() {
        if item == ' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
