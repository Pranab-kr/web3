fn main() {
    // let x: i32 = -32;
    // let y: u32 = 10;
    // let z: f32 = 3.14;

    // print!("x {}, y {}, z {}", x, y, z);

    // if/else

    // let adult: bool = true;
    // let mut is_male: bool = false;

    // is_male = true;

    // if is_male {
    //   print!("You are male.");
    // } else {
    //   print!("You are not male .");
    // }

    // if is_male && adult {
    //   print!("You are an proper male adult.");
    // }

    // String

    // let s1: String = String::from("Hello world");

    // print!("{}", s1);
    let greeting: String = String::from("Hello, How are u?");

    let char1 = greeting.chars().nth(100);

    match char1 {
        Some(c) => print!("{}", c),
        None => print!("No char found!"),
    }

    //runtime exception avoide use of unwrap() => means u telling that ur ok with the exception if happed in runtime
    // print!("char: {}" , char1.unwrap());
}
