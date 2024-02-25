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
	state   *State
	client  *Client
	server  *Server
	scanner *Scanner
	log     *log.Logger
	wg      *sync.WaitGroup
}

type State struct {
	Hosts []string
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port.server, "port", 5555, "TCP port")
	flag.IntVar(&cfg.port.client, "client", 5555, "TCP client port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)

	wg := sync.WaitGroup{}

	app := &application{
		state:   &State{},
		config:  cfg,
		log:     infoLog,
		client:  &Client{port: cfg.port.client},
		server:  &Server{port: cfg.port.server},
		scanner: &Scanner{port: cfg.port.server, timeout: 1 * time.Second, wg: &wg, log: infoLog, jobsBuffer: 1000},
		wg:      &wg,
	}

	openHosts := make(chan string, app.scanner.jobsBuffer)

	app.wg.Add(1)
	go func() {
		defer app.wg.Done()
		defer close(openHosts)
		app.scanner.scan(openHosts)
	}()

	for ip := range openHosts {
		app.log.Println("Host reachable:", ip)
		app.state.Hosts = append(app.state.Hosts, ip)
	}

	app.wg.Wait()

	for _, ip := range app.state.Hosts {
		app.log.Println("Saved host:", ip)
	}

}
