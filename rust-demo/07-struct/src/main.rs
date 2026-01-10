struct User {
  name: String,
  age: u32,
  active: bool,
}

fn main() {
  let name = String::from("Pranab");

  let user1 = User{
    name,
    age: 21,
    active: true,
  };

  println!("{} is {} years old and active: {}", user1.name , user1.age, user1.active );

}

// struct User {
//     active: bool,
//     sign_in_count: u64,
// }

// fn main() {
//     let mut user1 = User {
//         active: true,
//         sign_in_count: 1,
//     };

//     print_name(user1);
//     print!("User 1 username: {}", user1.active); // Error - can not use borrowed value
// }

// fn print_name(user1: User) {
//     print!("User 1 username: {}", user1.active);
// }
