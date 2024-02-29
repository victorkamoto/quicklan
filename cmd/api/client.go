package main

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"fmt"
	"io"
	"log"
	"net"
	"os"
)

type Client struct {
	port int
	log  *log.Logger
}

func (client *Client) sendFile(host string, path string) error {
	conn, err := net.Dial("tcp", fmt.Sprint(host, ":", client.port))
	if err != nil {
		return err
	}

	fileInfo, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Println("File does not exist:", path)
		} else {
			fmt.Println("Error:", err)
		}
		return err
	}

	if !fileInfo.Mode().IsRegular() {
		fmt.Println("Not a regular file:", path)
		return err
	}

	file, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err = file.Close(); err != nil {
			log.Fatal(err)
		}
		if err = conn.Close(); err != nil {
			log.Fatal(err)
		}
	}()

	reader := bufio.NewReader(file)
	buffer := make([]byte, 1024*1024*10) // 10MB

	for {
		n, err := reader.Read(buffer)
		if err != nil && err != io.EOF {
			fmt.Printf("Error %s reading file", err)
			break
		}

		if n == 0 {
			client.log.Println("client done")
			break
		}

		binary.Write(conn, binary.LittleEndian, int64(n))
		data, err := io.CopyN(conn, bytes.NewReader(buffer[:n]), int64(n))
		if err != nil {
			return err
		}

		client.log.Printf("sent %d bytes \n", data)
	}

	return nil
}
