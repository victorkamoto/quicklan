package main

import (
	"flag"
	"log"
	"os"
	"runtime"
	"testing"
	"time"

	_ "net/http/pprof"
	"runtime/pprof"
)

func BenchmarkScanner(b *testing.B) {
	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	app := &application{
		state:   &State{},
		log:     infoLog,
		scanner: &Scanner{port: 5555, timeout: 1 * time.Second, log: infoLog, jobsBuffer: 1000},
	}
	for n := 0; n < b.N; n++ {
		app.runScanner()
	}
}

func TestMain(m *testing.M) {
	cpuprofile := flag.String("cpuprofile", "", "write cpu profile to `file`")
	memprofile := flag.String("memprofile", "", "write memory profile to `file`")
	flag.Parse()

	if *cpuprofile != "" {
		f, err := os.Create(*cpuprofile)
		if err != nil {
			log.Fatal(err)
		}
		defer f.Close()

		if err := pprof.StartCPUProfile(f); err != nil {
			log.Fatal(err)
		}
		defer pprof.StopCPUProfile()
	}

	main()

	if *memprofile != "" {
		f, err := os.Create(*memprofile)
		if err != nil {
			log.Fatal("could not create memory profile: ", err)
		}
		defer f.Close()
		runtime.GC()
		if err := pprof.WriteHeapProfile(f); err != nil {
			log.Fatal("could not write memory profile: ", err)
		}
	}

	os.Exit(m.Run())
}
