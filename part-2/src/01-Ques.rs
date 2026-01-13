// Q: Write a function that takes a vector
// as an input and returns a vector with
// even values

fn main(){
  // let vec2: Vec<i32> = vec![2,3,4,5];

  let mut vec = Vec::new();
  vec.push(2);
  vec.push(3);
  vec.push(4);

  println!("{:?}", even_val_vec(&vec)); // ref pass

  println!("{:?}", vec); //no err
}

fn even_val_vec(vec: &Vec<i32>) -> Vec<i32> {
    // vec.into_iter().filter(|x| x % 2 == 0).collect()

    //another way of itterating
    let mut new_vec = Vec::new();
    for val in vec {
      if val % 2 == 0 {
        new_vec.push(*val); // cause of ref val
      }
    }
    return new_vec;
}
