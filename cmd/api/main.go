package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"runtime"
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
		scanner: &Scanner{timeout: 500 * time.Millisecond},
	}

	host, cidr := app.scanner.getLocalIpAndCIDR()
	fmt.Println("Local IP: ", host)
	app.scanner.cidr = cidr

	ipRange := app.scanner.generateIPRange()

	jobs := make(chan int, len(ipRange))
	results := make(chan string, len(ipRange))

	cores := runtime.NumCPU()

	for range cores {
		go app.scanner.worker(jobs, results, &ipRange)
	}

	for i := range ipRange {
		jobs <- i
	}
	close(jobs)

	for ip := range results {
		fmt.Println("Host reachable:", ip)
	}
	// app.wg.Add(1)

	// // go func() {
	// // 	defer app.wg.Done()
	// // 	app.client.connect()
	// // }()

	// go func() {
	// 	defer app.wg.Done()
	// 	app.server.connect()
	// }()

	// app.wg.Wait()

}
