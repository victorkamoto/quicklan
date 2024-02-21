package main

import (
	"bufio"
	"fmt"
	"net"
	"strconv"
	"strings"
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

		go server.handleClient(conn)
		count++
	}
}

func (server *Server) handleClient(conn net.Conn) {
	fmt.Println("Connection ", count, " established")

	for {
		data, err := bufio.NewReader(conn).ReadString('\n')
		if err != nil {
			fmt.Println(err)
			return
		}

		temp := strings.TrimSpace(string(data))
		if temp == "STOP" {
			break
		}
		fmt.Println(temp)
		counter := strconv.Itoa(count) + "\n"
		conn.Write([]byte(string(counter)))
	}
	conn.Close()
}
