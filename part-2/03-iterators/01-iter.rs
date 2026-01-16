fn main() {
  let v1 = vec![1, 2, 3];

  let v1_iter = v1.iter();

  for val in v1_iter {
    println!("Got: {}", val);
  }

  println!("{:?}", v1); //no error

  // for val in v1 { //use same iterator but takes ownership of v1
  //   println!("Got: {}", val);
  // }

  // println!("{:?}", v1); //error

}
