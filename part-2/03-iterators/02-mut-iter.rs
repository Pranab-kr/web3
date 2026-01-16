fn main() {
  let mut v1 = vec![1, 2, 3];

  let v1_iter = v1.iter_mut();

  for val in v1_iter {
    // *val = *val + 1;

    *val+=1;
  }

  // need to do let mut v1_iter
  // while let Some(val) = v1_iter.next() {
  //   println!{"{}" , val}
  // };

  println!("{:?}", v1); //no error

}
