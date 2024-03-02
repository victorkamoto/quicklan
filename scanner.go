package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os/exec"
	"runtime"
	"strings"
	"sync"
	"time"

	wr "github.com/wailsapp/wails/v2/pkg/runtime"
)

type Scanner struct {
	ctx        context.Context
	port       int
	cidr       string
	jobsBuffer int
	timeout    time.Duration
	log        *log.Logger
}

func (scanner *Scanner) scan() {
	wg := sync.WaitGroup{}

	host, cidr := scanner.getLocalIpAndCIDR()
	scanner.log.Println("Local IP: ", host)
	scanner.log.Println("CIDR: ", cidr)
	scanner.cidr = cidr

	wr.EventsEmit(scanner.ctx, "local:ip", host.String())

	ipRange := scanner.generateIPRange()
	scanner.log.Println("IP Range: ", len(ipRange))

	jobs := make(chan string, scanner.jobsBuffer)
	cores := runtime.NumCPU()

	for range cores {
		wg.Add(1)
		go func() {
			defer wg.Done()
			scanner.worker(jobs)
		}()
	}

	for _, ip := range ipRange {
		jobs <- ip
	}
	close(jobs)

	wg.Wait()

	wr.EventsEmit(scanner.ctx, "scan:done")
}

func (scanner *Scanner) worker(jobs <-chan string) {
	for ip := range jobs {
		go func(ip string) {
			up := scanner.isQuickLanUp(ip)
			if up {
				wr.EventsEmit(scanner.ctx, "host:up", ip)
			}
		}(ip)
	}
}

func (scanner *Scanner) isQuickLanUp(ip string) bool {
	conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", ip, 80), scanner.timeout)
	if err != nil {
		return false
	}
	defer conn.Close()
	return true
}

func (scanner *Scanner) getLocalIpAndCIDR() (net.IP, string) {
	var ip net.IP
	var cidr string

	activeInterface := scanner.getActiveInterface()
	if activeInterface == "" {
		scanner.log.Fatal("No active network interface")
	}

	iface, _ := net.InterfaceByName(activeInterface)

	addresses, _ := iface.Addrs()

	for _, addr := range addresses {
		if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ip = ipnet.IP
				sub := strings.Split(ipnet.String(), "/")[1]
				mask := ip.Mask(ipnet.Mask).String()
				cidr = strings.Join([]string{mask, sub}, "/")
			}
		}
	}

	return ip, cidr

}

func (scanner *Scanner) getActiveInterface() string {
	out, err := exec.Command("sh", "-c", "ip route | awk '/default/ { print $5 }'").Output()
	// TODO: Better error handling
	if err != nil {
		scanner.log.Println("Error:", err)
		return ""
	}

	activeInterface := strings.TrimSpace(string(out))
	return activeInterface
}

func (scanner *Scanner) generateIPRange() []string {
	ips := make([]string, 0)

	ip, ipNet, _ := net.ParseCIDR(scanner.cidr)

	for ip := ip.Mask(ipNet.Mask); ipNet.Contains(ip); scanner.incIP(ip) {
		ips = append(ips, ip.String())
	}

	return ips
}

func (scanner *Scanner) incIP(ip net.IP) {
	for j := len(ip) - 1; j >= 0; j-- {
		ip[j]++
		if ip[j] > 0 {
			break
		}
	}
}
