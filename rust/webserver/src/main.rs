use std::fs;
use std::io::prelude::*;
use std::io::BufReader;
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

    loop {
        let mut line = String::new();
        b.read_line(&mut line).expect("Could not read line");
        if line == "\r\n" || line == "\n\r" {
            println!("Finished reading request");
            break;
        }
    }

    println!("{}", request);
    let response = format!("HTTP/1.1 200 OK\r\n\r\n{}", html);

    println!("WRITING RESPONSE");
    stream.write_all(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
