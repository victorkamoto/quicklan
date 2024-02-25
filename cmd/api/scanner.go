package main

import (
	"fmt"
	"log"
	"net"
	"os/exec"
	"strings"
	"sync"
	"time"
)

type Scanner struct {
	port       int
	cidr       string
	jobsBuffer int
	timeout    time.Duration
	log        *log.Logger
}

func (scanner *Scanner) scan(openHosts chan<- string) {
	wg := sync.WaitGroup{}

	host, cidr := scanner.getLocalIpAndCIDR()
	scanner.log.Println("Local IP: ", host)
	scanner.log.Println("CIDR: ", cidr)
	scanner.cidr = cidr

	ipRange := scanner.generateIPRange()
	scanner.log.Println("IP Range: ", len(ipRange))

	jobs := make(chan string, scanner.jobsBuffer)

	for range ipRange {
		wg.Add(1)
		go func() {
			defer wg.Done()
			scanner.worker(jobs, openHosts)
		}()
	}

	for _, ip := range ipRange {
		jobs <- ip
	}
	close(jobs)

	wg.Wait()
}

func (scanner *Scanner) worker(jobs <-chan string, results chan<- string) {
	wg := sync.WaitGroup{}

	for ip := range jobs {
		wg.Add(1)
		go func(ip string) {
			defer wg.Done()
			scanner.isQuickLanUp(ip, 80, results)
		}(ip)
	}

	wg.Wait()
}

func (scanner *Scanner) isQuickLanUp(ip string, port int, results chan<- string) {
	conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", ip, port), scanner.timeout)
	if err != nil {
		return
	}
	defer conn.Close()
	results <- ip
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
