fn main() {
let v1 = vec![1, 2, 3];

  let v1_iter = v1.into_iter();

  for val in v1_iter {
    println!("Got: {}", val);
  }

  // println!("{:?}", v1); //error for v1 is moved

}
