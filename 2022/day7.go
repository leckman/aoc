package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const ROOT = ""

func getPathKey(pathParts []string) string {
	return strings.Join(pathParts, "/")
}

func part1(sizePerDirectory map[string]int) {
	fmt.Println("Part 1:")
	total := 0
	for path := range sizePerDirectory {
		size := sizePerDirectory[path]
		if size <= 100000 {
			total += size
		}
	}
	fmt.Println(total)
}

func part2(sizePerDirectory map[string]int) {
	fmt.Println("Part 2:")
	spaceNeeded := 30000000 - (70000000 - sizePerDirectory[ROOT])
	currSmallestSize := sizePerDirectory[ROOT]
	currBestPath := ROOT
	for path := range sizePerDirectory {
		size := sizePerDirectory[path]
		if size >= spaceNeeded && size < currSmallestSize {
			currSmallestSize = size
			currBestPath = path
		}
	}
	fmt.Println(currBestPath, currSmallestSize)
}

func performLineUpdate(l string, currPath []string, sizePerDirectory map[string]int) ([]string, map[string]int) {
	switch {
	case l == "$ cd ..":
		currPath = currPath[:len(currPath)-1]
	case l == "$ cd /":
		currPath = []string{ROOT}
	case strings.HasPrefix(l, "$ cd "):
		currPath = append(currPath, l[5:])
		pathString := getPathKey(currPath)
		_, exists := sizePerDirectory[pathString]
		if !exists {
			sizePerDirectory[pathString] = 0
		}
	case l != "$ ls" && !strings.HasPrefix(l, "dir"):
		parts := strings.Split(l, " ")
		size, err := strconv.Atoi(parts[0])
		if err != nil {
			fmt.Println(l, parts)
			panic("Couldn't parse file size")
		}
		for i := len(currPath); i > 0; i-- {
			pathString := getPathKey(currPath[:i])
			sizePerDirectory[pathString] += size
		}
	}
	return currPath, sizePerDirectory
}

func getData() (map[string]int, error) {
	var currPath []string
	sizePerDirectory := map[string]int{
		ROOT: 0,
	}

	file, err := os.Open("day7.txt")
	if err != nil {
		return sizePerDirectory, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		currPath, sizePerDirectory = performLineUpdate(line, currPath, sizePerDirectory)
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading file:", err)
		return sizePerDirectory, err
	}

	return sizePerDirectory, nil
}

func main() {
	data, err := getData()
	if err != nil {
		fmt.Println(err)
		return
	}
	part1(data)
	part2(data)
}
