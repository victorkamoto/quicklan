package main

import (
	"log"
)

type application struct {
	config  config
	state   *State
	client  *Client
	server  *Server
	scanner *Scanner
	log     *log.Logger
}

type config struct {
	port Port
	env  string
}

type Port struct {
	client int
	server int
}

type State struct {
	Hosts []string
}

func (app *application) runScanner() {
	openHosts := make(chan string, app.scanner.jobsBuffer)

	go func() {
		defer close(openHosts)
		app.scanner.scan(openHosts)
	}()

	for ip := range openHosts {
		app.log.Println("Host reachable:", ip)
		app.state.Hosts = append(app.state.Hosts, ip)
	}
}
