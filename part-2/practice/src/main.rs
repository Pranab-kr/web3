// fibonacci series using recursion

fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

fn main() {
    let n = 4;

    if n <= 0 {
        println!("Please enter a positive integer");
        return;
    };

    let mut res = 0;
    for i in 0..n {
        res = fibonacci(i);
      }

      print!("{} ", res);

      println!();
}
