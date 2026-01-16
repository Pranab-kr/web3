fn main() {
  let v1 = vec![1, 2, 3, 4, 5];

  let v1_iter = v1.iter();

  let total : i32 = v1_iter.sum(); // consumes the iterator

  println!("Total: {}", total);

  // let total2: i32 = v1_iter.sum(); // error because v1_iter is already consumed
}
