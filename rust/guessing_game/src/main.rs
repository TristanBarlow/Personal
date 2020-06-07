use rand;
use std::io;

fn try_guess(correct: &str, tries: i8) -> i8 {
    let mut guess = String::from("");
    println!("Please input your guess.");
    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");
    println!("You guessed: {}", guess);

    let new_tries = tries + 1;
    if guess.trim() != correct {
        println!("The guess was wrong");
        return try_guess(correct, new_tries);
    }
    return new_tries;
}

fn main() {
    let words: Vec<&str> = vec!["foo", "bar", "char", "shit"];

    let mut rng = rand::thread_rng();

    for a in &words {
        println!("{}", a);
    }

    let x = rand::Rng::gen_range(&mut rng, 0, words.len());
    let right_word = words[x];

    let i: i8 = 0;
    let guesses = try_guess(right_word, i);
    println!("CORRECT!");
    println!("IT TOOK YOU {} GUEESES", guesses);
}
