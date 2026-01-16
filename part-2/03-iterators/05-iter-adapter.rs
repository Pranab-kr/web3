fn main() {

  let v1 = vec![1, 2, 3];

  let v1_iter = v1.iter();

  let v1_iter2 = v1_iter.map(|x| x + 1);  // return new set of values iterator

  // for val in v1_iter2 {
  //   println!("Got: {}", val);
  // }

  let v1_iter3 = v1_iter2.filter(|x| *x % 2 == 0); // return new set of values iterator


  for val in v1_iter3 {
    println!("even Got: {}", val);
  }

}
