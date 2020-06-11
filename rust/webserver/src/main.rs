use futures::executor::*;
use std::fs;
use std::io::prelude::*;
use std::io::BufReader;
use std::net::TcpListener;
use std::net::TcpStream;
use std::{thread, time};

fn main() {
    let listener = TcpListener::bind("localhost:7878").unwrap();
    let html = fs::read_to_string("public/index.html").unwrap();

    let pool = ThreadPool::new().unwrap();
    loop {
        let stream = listener.accept().unwrap();
        pool.spawn_ok(handle_connection(stream.0, html.clone()));
    }
}

async fn handle_connection(mut stream: TcpStream, html: String) {
    let request = String::new();
    let mut b = BufReader::new(&stream);

    loop {
        let mut line = String::new();
        b.read_line(&mut line).expect("Could not read line");
        println!("Line: {}", line);
        if line == "\r\n" || line == "\n\r" {
            println!("End of Request");
            break;
        }
    }

    let response = format!("HTTP/1.1 200 OK\r\n\r\n{}", html);
    stream.write_all(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
