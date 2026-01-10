use std::fs;

//own implementation , Rust has it's own
// enum Result<A , B > {
//   Ok(A),
//   Err(B),
// }

fn main() {

  let res = fs::read_to_string("example.txt");

  match res {
    Ok(contant) => println!("File contant {} ", contant),
    Err(err) => println!("Error - {} ", err),
  }

  println!("Hello , there");

}
