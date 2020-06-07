use rand;
use std::collections;
use std::io;

fn tryGuess(correct: &str) {
    let mut guess = String::from("");

    println!("Please input your guess.");
    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");
    println!("You guessed: {}", guess);

    if guess.trim() != correct {
        println!("The guess was wrong");
        tryGuess(correct);
    }
}

fn main() {
    let words: Vec<&str> = vec!["foo", "bar", "char", "shit"];

    let mut rng = rand::thread_rng();

    let x = rand::Rng::gen_range(&mut rng, 0, words.len());

    let right_word = words[x];

    println!("CORRECT {}", right_word);
    tryGuess(right_word);
    println!("CORRECT {}", right_word)
}
