package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"io"
	"log"
	"net"
	"os"
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

	var extLen int64
	binary.Read(conn, binary.LittleEndian, &extLen)

	extBuf := make([]byte, extLen)
	_, err := io.ReadFull(conn, extBuf)
	if err != nil {
		log.Fatal(err)
	}

	ext := string(extBuf)
	server.log.Printf("received ext: %s \n", ext)

	var titleLen int64
	binary.Read(conn, binary.LittleEndian, &titleLen)

	titleBuf := make([]byte, titleLen)
	_, err = io.ReadFull(conn, titleBuf)
	if err != nil {
		log.Fatal(err)
	}

	title := string(titleBuf)
	server.log.Printf("received title: %s \n", title)

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

	fileName := fmt.Sprintf("%s%s", title, ext)
	file, err := os.Create(fileName)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	_, err = file.Write(buf.Bytes())
	if err != nil {
		log.Fatal(err)
	}

	server.log.Println("server done")
}
