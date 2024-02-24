package main

import (
	"flag"
	"log"
	"os"
	"sync"
	"time"
)

const version = "1.0.0"

type config struct {
	port Port
	env  string
}

type Port struct {
	client int
	server int
}

type application struct {
	config  config
	client  *Client
	server  *Server
	scanner *Scanner
	log     *log.Logger
	wg      sync.WaitGroup
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port.server, "port", 5555, "TCP port")
	flag.IntVar(&cfg.port.client, "client", 5555, "TCP client port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)

	app := &application{
		config:  cfg,
		log:     infoLog,
		client:  &Client{port: cfg.port.client},
		server:  &Server{port: cfg.port.server},
		scanner: &Scanner{port: cfg.port.server, timeout: 1 * time.Second, wg: &sync.WaitGroup{}, log: infoLog},
		wg:      sync.WaitGroup{},
	}

	openHosts := make(chan string, buffer)

	start := time.Now()
	app.wg.Add(1)
	go func() {
		defer app.wg.Done()
		app.scanner.scan(openHosts, start)
	}()

	for ip := range openHosts {
		app.log.Println("Host reachable:", ip)

		app.log.Println("Host found in:", time.Since(start))
	}

	app.wg.Wait()
	close(openHosts)

}
