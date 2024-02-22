package main

import (
	"fmt"
	"net"
	"os/exec"
	"strings"
	"time"

	probing "github.com/prometheus-community/pro-bing"
)

type Scanner struct {
	cidr    string
	timeout time.Duration
}

func (scanner *Scanner) getActiveInterface() string {
	out, err := exec.Command("sh", "-c", "ip route | awk '/default/ { print $5 }'").Output()
	// TODO: Better error handling
	if err != nil {
		fmt.Println("Error:", err)
		return ""
	}

	activeInterface := strings.TrimSpace(string(out))
	return activeInterface
}

func (scanner *Scanner) getLocalIpAndCIDR() (net.IP, string) {
	var ip net.IP
	var cidr string

	activeInterface := scanner.getActiveInterface()

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

func (scanner *Scanner) generateIPRange() []string {
	ips := make([]string, 0)

	ip, ipNet, err := net.ParseCIDR(scanner.cidr)
	if err != nil {
		fmt.Println("Error parsing CIDR:", err)
		return ips
	}

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

func (scanner *Scanner) isQuickLanUp(ip string, port int) bool {
	conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", ip, port), scanner.timeout)
	if err != nil {
		return false
	}
	defer conn.Close()
	return true
}

func (scanner *Scanner) isHostReachable(ip string) bool {
	pinger, err := probing.NewPinger(ip)
	if err != nil {
		// panic(err)
		fmt.Println(err.Error())
	}

	pinger.Count = 3
	pinger.SetPrivileged(true)

	err = pinger.Run()
	if err != nil {
		// panic(err)
		fmt.Println(err.Error())
	}

	stats := pinger.Statistics()
	fmt.Printf("Stats: %+v\n", stats)
	if stats.PacketsRecv > 0 {
		return true
	} else {
		return false
	}
}

func (scanner *Scanner) worker(jobs <-chan int, results chan<- string, ipRange *[]string) {
	fmt.Println("Worker started")
	for i := range jobs {
		host := (*ipRange)[i]
		fmt.Println("Checking host:", host)
		up := scanner.isHostReachable(host)
		if up {
			results <- host
		}
	}
}
