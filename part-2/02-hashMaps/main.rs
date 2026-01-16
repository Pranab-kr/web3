use std::collections::HashMap;

// fn main() {
//   let mut my_hash: HashMap<String , i32> = HashMap::new();

//   my_hash.insert(String::from("pranab"), 777);
//   my_hash.insert(String::from("age"), 21);

//   let res = my_hash.get("pranab");

//    match res {
//      Some(pkm) => println!("number {}" , pkm),
//      None => println!("404 err"),
//  }

// }

// Q: Write a function that takes a vector of tuples (each tuple containing a key and a
// value) and returns a Hashmap where the keys are the unique keys from the input tuples
// and the values are vectors of all corresponding values associated with each key

fn main() {
  let vec = vec![(String::from("pranab"), 21), (String::from("ram"), 20) ];

  println!("Tuple of Vectors - {:?}", vec);

  let hm = get_key_val(vec);

  println!("  HashMap - {:?}", hm);
}


fn get_key_val(vec: Vec<(String, i32)>) -> HashMap<String, i32> {
   let mut hm =  HashMap::new();

   for (key , val) in vec {
       hm.insert(key, val);
   }

   return hm;
}
