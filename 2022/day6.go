package main

import (
	"fmt"
	"io"
	"os"
)

func part1(text string) {
	fmt.Println("Part 1:")
	fmt.Println(findStartOfPacket(text, 4))
}

func part2(text string) {
	fmt.Println("Part 2:")
	fmt.Println(findStartOfPacket(text, 14))

}

func findStartOfPacket(input string, numChar int) int {
	for i := 0; i < len(input)-(numChar+1); i++ {
    // Inefficient but whatevs
		set := make(map[byte]struct{})
		for j := 0; j < numChar; j++ {
			set[input[i+j]] = struct{}{}
		}
		if len(set) == numChar {
			return i + numChar
		}
	}
	panic("Didn't find the start")
}

func getData() (string, error) {
	file, err := os.Open("day6.txt")
	if err != nil {
		return "", err
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

func main() {
	text, err := getData()
	if err != nil {
		fmt.Println(err)
		return
	}
	part1(text)
	part2(text)
}
