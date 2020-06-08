use std::fs;
use std::io::prelude::*;
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
    let mut buffer = [0; 512];

    stream.read(&mut buffer).unwrap();

    let response = format!("HTTP/1.1 200 OK\r\n\r\n{}", html);

    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
