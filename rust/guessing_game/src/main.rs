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
    let words: Vec<&str> = vec!["foo", "bar", "char", "tar"];

    let mut rng = rand::thread_rng();

    let mut potential_words = String::from("");

    for a in &words {
        potential_words.push_str(&format!(" {} ", &a));
    }

    println!("Potential guesses are: {}", potential_words);
    let word_index = rand::Rng::gen_range(&mut rng, 0, words.len());
    let right_word = words[word_index];

    let guesses = try_guess(right_word, 0);
    println!("CORRECT!");
    let b = if guesses == 1 { "guess" } else { "guesses" };
    println!("IT TOOK YOU {} {}", guesses, b);
}
