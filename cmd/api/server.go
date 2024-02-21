package main

import (
	"bufio"
	"fmt"
	"net"
	"strings"
	"time"
)

type Server struct {
	port int
}

var count = 0

func (server *Server) connect() {
	listener, err := net.Listen("tcp", fmt.Sprint("localhost:", server.port))
	if err != nil {
		fmt.Println(err)
		return
	}
	defer listener.Close()
	fmt.Println("Listening on localhost:", server.port)

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println(err)
			continue
		}

		go server.handleConnection(conn)
		count++
	}
}

func (server *Server) handleConnection(conn net.Conn) {
	fmt.Println("Connection ", count, " established")
	defer conn.Close()

	reader := bufio.NewReader(conn)
	for {
		netData, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println(err)
			return
		}
		netData = strings.TrimSpace(netData)

		if netData == "STOP" {
			fmt.Println("Exiting TCP server!")
			return
		}

		fmt.Println("-> ", netData)
		t := time.Now()
		myTime := t.Format(time.RFC3339) + "\n"
		conn.Write([]byte(myTime))
	}
}
