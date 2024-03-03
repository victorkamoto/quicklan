package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/binary"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"path/filepath"
	"strings"

	wr "github.com/wailsapp/wails/v2/pkg/runtime"
)

type Client struct {
	ctx  context.Context
	port int
	log  *log.Logger
}

func (client *Client) sendFile(jobId string, host string, path string) error {
	conn, err := net.Dial("tcp", fmt.Sprint(host, ":", client.port))
	if err != nil {
		fmt.Println("Error dialing:", err)
		return err
	}

	root := filepath.Dir(path)
	target := filepath.Base(path)

	fileInfo, err := client.walkDir(root, target)
	if err != nil {
		client.log.Println("Error:", err)
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

	binary.Write(conn, binary.LittleEndian, int64(len(target)))

	data, err := io.CopyN(conn, bytes.NewReader([]byte(target)), int64(len(target)))
	if err != nil {
		return err
	}
	client.log.Printf("sent title as %d bytes \n", data)

	reader := bufio.NewReader(file)
	buffer := make([]byte, 1024*1024*10) // 10MB

	var bytesSent int64

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

		bytesSent += int64(data)
		client.log.Printf("sent %d bytes \n", data)
		entry := map[string]interface{}{
			"jobId":      jobId,
			"sent":       bytesSent,
			"total":      fileInfo.Size(),
			"percentage": (bytesSent / fileInfo.Size()) * 100,
		}
		wr.EventsEmit(client.ctx, "file:progress", entry)
	}

	return nil
}

func (client *Client) walkDir(root string, target string) (os.FileInfo, error) {
	var fileInfo os.FileInfo
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && strings.Contains(info.Name(), target) {
			fmt.Println("Found file:", path)
			fileInfo = info
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return fileInfo, nil
}
