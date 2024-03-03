package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/user"
	"runtime"
	"time"

	wr "github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx     context.Context
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
func (app *App) GetLocalDetails() map[string]string {
	hostname, err := os.Hostname()
	if err != nil {
		app.log.Println("Error getting hostname")
	}

	user, err := user.Current()
	if err != nil {
		app.log.Println("Error getting user details")
	}

	env := runtime.GOOS

	details := map[string]string{
		"hostname": hostname,
		"username": user.Username,
		"name":     user.Name,
		"homeDir":  user.HomeDir,
		"os":       env,
	}

	return details
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
	app.client = &Client{ctx: app.ctx, port: cfg.port.client, log: infoLog}
	app.server = &Server{port: cfg.port.server, log: infoLog}
	app.scanner = &Scanner{ctx: app.ctx, port: cfg.port.server, timeout: 1 * time.Second, log: infoLog, jobsBuffer: 1024}

	go app.server.listen()
}

func (app *App) RunScanner() {
	go app.scanner.scan()
}

func (app *App) OpenFilesDialog() string {
	opts := wr.OpenDialogOptions{Title: "Select File"}
	selection, err := wr.OpenFileDialog(app.ctx, opts)
	if err != nil {
		wr.LogError(app.ctx, "Error opening dialog")
	}
	wr.LogInfo(app.ctx, "File Selected:"+fmt.Sprint(selection))
	if len(selection) == 0 {
		wr.LogError(app.ctx, "No files selected")
	}
	return selection
}

func (app *App) SendFileToServer(jobId string, host string, file string) {
	// go app.client.sendFile(host, file)

	go app.client.sendFile(jobId, "localhost", file)
}
