fn main() {
  // if/else condition
  // let is_even = true;

  // if is_even {
  //   print!("This is a even number");
  // } else if !is_even {
  //   print!("Not a even nunber");
  // } else {
  //   print!("Not a valid Number ");
  // }

  // loops
  // for i in 1..11 {
  //     print!("{} " , i);
  // }

  // string itter
  // let sen: String = String::from("Hello , My name is Pranab");
  // let first_word: String = get_first(sen);

  // println!("frist wors - {} ", first_word);


  //func in rust
  let a: i32  = 10;
  let b: i32  = 15;

  println!("sum - {}" , sum(a, b));

}

// func for get the first word
// fn get_first(sen: String) -> String {
//   let mut ans = String::from("");

//   for char in sen.chars() {
//       ans.push_str(char.to_string().as_str());

//       if char == ' ' {
//           break ;
//       }
//   }

//   return ans;
// }


// func for sun of number
fn sum(a: i32, b: i32) -> i32 {
  return a+b;
}
