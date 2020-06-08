use std::fs;
use std::io::prelude::*;
use std::io::BufReader;
use std::io::Cursor;
use std::net::TcpListener;
use std::net::TcpStream;

fn main() {
    let listener = TcpListener::bind("localhost:7878").unwrap();

    let html = fs::read_to_string("public/index.html").unwrap();
    for stream in listener.incoming() {
        let stream = stream.unwrap();

        handle_connection(stream, &html);
        println!("Connection established!");
    }
}

fn handle_connection(mut stream: TcpStream, html: &String) {
    let mut request = String::new();
    let mut b = BufReader::new(&stream);

    while !b.read_line(&mut request).is_ok() {}
    println!("{}", request);
    let response = format!("HTTP/1.1 200 OK\r\n\r\n{}", html);

    stream.write_all(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
