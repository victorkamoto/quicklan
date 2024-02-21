package main

import (
	"fmt"
	"net"
	"strings"
	"time"
)

func (app *application) getLocalIps() ([]net.IP, error) {
	var ips []net.IP
	addresses, err := net.InterfaceAddrs()
	if err != nil {
		return nil, err
	}

	for _, addr := range addresses {
		if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ips = append(ips, ipnet.IP)
			}
		}
	}
	return ips, nil
}

func (app *application) isPortOpen(ip string, port int, timeout time.Duration) bool {
	target := fmt.Sprintf("%s:%d", ip, port)
	conn, err := net.DialTimeout("tcp", target, timeout)

	if err != nil {
		if strings.Contains(err.Error(), "too many open files") {
			time.Sleep(timeout)
			app.isPortOpen(ip, port, timeout)
		} else {
			fmt.Println(port, "closed")
		}
		return false
	}

	conn.Close()
	fmt.Println(port, "open")
	return true
}
