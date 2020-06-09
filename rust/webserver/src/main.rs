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
    let b = BufReader::new(&stream);

    for line in b.lines() {
        let val = line.expect("Bad line");
        if val == "" {
            break;
        }
        request.push_str(&val);
    }

    println!("{}", request);
    let response = format!("HTTP/1.1 200 OK\r\n\r\n{}", html);

    println!("WRITING RESPONSE");
    stream.write_all(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
