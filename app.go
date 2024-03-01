package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"time"
)

// App struct
type App struct {
	ctx context.Context

	config  config
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

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) startup(ctx context.Context) {
	app.ctx = ctx

	go app.appSetup()
}

func (app *App) appSetup() {
	var cfg config
	flag.IntVar(&cfg.port.server, "port", 5555, "TCP port")
	flag.IntVar(&cfg.port.client, "client", 5555, "TCP client port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)

	app.config = cfg
	app.log = infoLog
	app.client = &Client{port: cfg.port.client, log: infoLog}
	app.server = &Server{port: cfg.port.server, log: infoLog}
	app.scanner = &Scanner{ctx: app.ctx, port: cfg.port.server, timeout: 1 * time.Second, log: infoLog, jobsBuffer: 1024}
}

// Greet returns a greeting for the given name
func (app *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (app *App) RunScanner() {

	go func() {
		app.scanner.scan()
	}()

}
