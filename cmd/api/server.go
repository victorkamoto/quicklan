package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"io"
	"log"
	"net"
)

type Server struct {
	port int
	log  *log.Logger
}

func (server *Server) listen() {
	ln, err := net.Listen("tcp", fmt.Sprint("localhost:", server.port))
	if err != nil {
		server.log.Fatal(err)
		return
	}
	defer ln.Close()

	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Fatal(err)
		}

		go server.handleClient(conn)
	}
}

func (server *Server) handleClient(conn net.Conn) {
	defer conn.Close()

	buf := new(bytes.Buffer)
	for {
		var size int64
		binary.Read(conn, binary.LittleEndian, &size)

		data, err := io.CopyN(buf, conn, size)
		if err != nil {
			log.Fatal(err)
		}

		if data == 0 {
			break
		}

		server.log.Printf("received %d bytes \n", data)
	}

	server.log.Println("server done")
}
