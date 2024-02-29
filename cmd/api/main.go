package main

import (
	"flag"
	"log"
	"os"
	"time"
)

const version = "1.0.0"

func main() {
	var cfg config

	flag.IntVar(&cfg.port.server, "port", 5555, "TCP port")
	flag.IntVar(&cfg.port.client, "client", 5555, "TCP client port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)

	app := &application{
		state:   &State{},
		config:  cfg,
		log:     infoLog,
		client:  &Client{port: cfg.port.client, log: infoLog},
		server:  &Server{port: cfg.port.server, log: infoLog},
		scanner: &Scanner{port: cfg.port.server, timeout: 1 * time.Second, log: infoLog, jobsBuffer: 1024},
	}

	app.runScanner()
	for _, ip := range app.state.Hosts {
		app.log.Println("Saved host:", ip)
	}

}
